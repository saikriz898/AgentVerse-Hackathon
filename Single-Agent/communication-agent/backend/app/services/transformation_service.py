import json
import re
import uuid
import logging
from datetime import datetime
from typing import Dict, Any, Tuple, Optional
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.communication import (
    TransformationRequest,
    TransformationResponse,
    ChannelEnum,
    OutputDestinationEnum
)
from app.ai.gemini_client import gemini_client
from app.services.fallback_engine import FallbackTransformationEngine
from app.services.export_service import export_service
from app.services.intent_engine import intent_engine
from app.services.writing_style_engine import writing_style_engine
from app.services.action_item_engine import action_item_engine
from app.services.explainability_engine import explainability_engine
from app.services.quality_engine import quality_engine
from app.models.communication import Communication
from app.models.agent_log import AgentRequest, AgentResponse
from app.models.generation_log import GenerationLog

logger = logging.getLogger("communication_agent")

class TransformationService:
    """Enterprise 15-Step AI Intelligence & Communication Engine."""

    @classmethod
    def _recommend_channel(
        cls,
        audience: str,
        priority: str,
        doc_type: str
    ) -> Tuple[ChannelEnum, str]:
        aud_lower = audience.lower()
        prio_lower = priority.lower()
        type_lower = doc_type.lower()

        if prio_lower == "critical":
            if aud_lower in ["developer", "administrator", "support team"]:
                return ChannelEnum.SLACK, "Critical urgency flags instant Slack channel broadcast."
            return ChannelEnum.EMAIL, "Critical priority requires formal executive email dispatch."

        if aud_lower in ["ceo", "executive", "investor"]:
            if "summary" in type_lower or "report" in type_lower:
                return ChannelEnum.PDF, "Executive summary presented via formatted PDF document."
            return ChannelEnum.EMAIL, "Executive stakeholder communication defaults to Email."

        if aud_lower in ["developer", "designer", "administrator"]:
            return ChannelEnum.SLACK, "Engineering & Admin audience prefers real-time Slack updates."

        if aud_lower in ["customer", "student", "general public"]:
            return ChannelEnum.PUSH_NOTIFICATION, "End users and public audience default to Push Notifications."

        return ChannelEnum.EMAIL, "Default enterprise communication channel is Email."

    @classmethod
    def _detect_missing_info(cls, text: str, payload: Dict[str, Any]) -> Tuple[bool, list]:
        missing_details = []
        low_text = text.lower()

        for req_key in ["project", "status", "summary"]:
            if req_key not in payload and req_key not in [k.lower() for k in payload.keys()]:
                missing_details.append(f"Payload field '{req_key}' was absent from source object.")

        if "missing" in low_text or "not provided" in low_text or "⚠️" in low_text:
            if "Missing Information" not in missing_details:
                missing_details.append("Detected missing facts flag in AI text output.")

        return len(missing_details) > 0, missing_details

    @classmethod
    async def process_transformation(
        cls,
        req: TransformationRequest,
        db: AsyncSession
    ) -> TransformationResponse:
        input_agent_val = (req.source_agent or req.input_agent).value
        audience_val = (req.audience or req.output_destination).value
        doc_type_val = (req.communication_type or req.output_type).value
        priority_val = req.priority.value
        comm_id = req.communication_id or str(uuid.uuid4())

        logger.info(f"Processing 15-Step AI Transformation: agent '{input_agent_val}' -> audience '{audience_val}' ({doc_type_val}, Priority: {priority_val})")

        request_id = str(uuid.uuid4())
        llm_model = "gemini-2.5-flash"

        # 1. Intent Detection Step
        intent_info = intent_engine.detect_intent(req.payload, doc_type_val)
        
        # 2. Writing Style Step
        style_info = writing_style_engine.get_style_guidelines(audience_val, req.tone.value)

        # 3. Action Items Step
        action_info = action_item_engine.extract_action_items(req.payload, input_agent_val)

        # 4. Channel Recommendation Engine Step
        rec_channel, channel_rationale = cls._recommend_channel(
            audience=audience_val,
            priority=priority_val,
            doc_type=doc_type_val
        )

        # 5. Invoke Gemini LLM engine
        llm_raw_response = await gemini_client.transform_communication(
            input_agent=input_agent_val,
            output_destination=audience_val,
            output_type=doc_type_val,
            tone=req.tone.value,
            payload=req.payload,
            length=req.length.value if hasattr(req, 'length') and req.length else "Medium Report",
            language=req.language.value if hasattr(req, 'language') and req.language else "English",
            additional_instructions=f"Priority: {priority_val}\nTarget Language: {req.language.value}\nWriting Style: {style_info['style_name']}\nIntent: {intent_info['intent']}\nRecommended Channel: {rec_channel.value}\n{req.additional_instructions or ''}"
        )

        parsed_data = None
        if llm_raw_response:
            try:
                cleaned_text = re.sub(r'^```json\s*', '', llm_raw_response.strip(), flags=re.MULTILINE)
                cleaned_text = re.sub(r'```$', '', cleaned_text.strip(), flags=re.MULTILINE)
                parsed_data = json.loads(cleaned_text)
            except Exception as err:
                logger.warning(f"Could not parse raw JSON from Gemini LLM ({err}). Structuring output...")
                parsed_data = None

        # Fallback if LLM unavailable
        if not parsed_data:
            logger.info("Delegating to FallbackTransformationEngine.")
            fallback_res = FallbackTransformationEngine.transform(
                input_agent=input_agent_val,
                output_destination=audience_val,
                output_type=doc_type_val,
                tone=req.tone.value,
                length=req.length.value,
                language=req.language.value,
                payload=req.payload
            )
            parsed_data = fallback_res
            content = fallback_res["content"]
            missing_info_details = fallback_res.get("missing_info_details", [])
            has_missing = fallback_res.get("has_missing_info", False)
            llm_model = "deterministic-fallback"
        else:
            content = parsed_data.get("content") or parsed_data.get("markdown") or str(llm_raw_response)
            has_missing, missing_info_details = cls._detect_missing_info(content, req.payload)

        title = parsed_data.get("title") or f"{doc_type_val}: {req.payload.get('project', input_agent_val)}"
        summary = parsed_data.get("summary") or content[:300]
        email_subj = parsed_data.get("email_subject") or intent_info["generated_subject"]
        email_body = parsed_data.get("email_body") or export_service.to_email_text(content)
        recs = parsed_data.get("recommendations") or action_info["recommended_follow_ups"]

        confidence = 0.98 if not has_missing else 0.85
        requires_user_confirmation = confidence < 0.80 or priority_val == "Critical"
        quality_score = 0.98 if confidence >= 0.95 else 0.85

        # 6. Explainability Rationale Step
        explainability = explainability_engine.generate_explainability_rationale(
            audience=audience_val,
            tone=req.tone.value,
            channel=rec_channel.value,
            intent=intent_info["intent"],
            quality_score=round(quality_score * 100, 1),
            confidence=confidence
        )

        # Pre-format views
        html_view = export_service.to_html(content, title=title)

        # Save record to Database
        comm_record = Communication(
            id=str(uuid.uuid4()),
            communication_id=comm_id,
            title=title,
            source_agent=input_agent_val,
            document_type=doc_type_val,
            communication_type=doc_type_val,
            priority=priority_val,
            audience=audience_val,
            tone=req.tone.value,
            channel=rec_channel.value,
            language=req.language.value,
            summary=summary,
            content=content,
            markdown=content,
            html=html_view,
            email_subject=email_subj,
            email_body=email_body,
            generated_content=content,
            generated_by=f"Communication Agent ({llm_model})",
            created_by="Executive User",
            confidence=confidence,
            status="Generated",
            review_status="VALIDATED",
            approval_status="pending_approval",
            delivery_status="pending_approval"
        )
        db.add(comm_record)
        await db.commit()
        await db.refresh(comm_record)

        return TransformationResponse(
            status="success",
            id=comm_record.id,
            communication_id=comm_id,
            document_type=doc_type_val,
            title=title,
            summary=summary,
            content=content,
            markdown=content,
            email_subject=email_subj,
            email_body=email_body,
            recommendations=recs,
            confidence=confidence,
            quality_score=quality_score,
            generated_at=datetime.utcnow().isoformat() + "Z",
            input_agent=input_agent_val,
            output_destination=audience_val,
            priority=priority_val,
            tone=req.tone.value,
            length=req.length.value,
            language=req.language.value,
            intent=intent_info["intent"],
            writing_style=style_info["style_name"],
            action_items=action_info["action_items"],
            explainability_rationale=explainability,
            recommended_channel=rec_channel,
            channel_rationale=channel_rationale,
            requires_user_confirmation=requires_user_confirmation,
            delivery_status="pending_approval",
            chief_of_staff_notified=False,
            has_missing_info=has_missing,
            missing_info_details=missing_info_details,
            formatted_views={
                "html": html_view,
                "email": f"Subject: {email_subj}\n\n{email_body}",
                "slack": f"*{title}*\n{summary}\n> Action: {intent_info['call_to_action']}",
                "teams": f"### {title}\n{summary}\n**CTA:** {intent_info['call_to_action']}"
            }
        )

transformation_service = TransformationService()
