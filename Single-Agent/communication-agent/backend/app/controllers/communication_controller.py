from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from app.models.communication import Communication
from app.schemas.communication import (
    TransformationRequest,
    TransformationResponse,
    InputAgentEnum,
    OutputDestinationEnum,
    OutputTypeEnum,
    ToneEnum,
    DocumentLengthEnum,
    LanguageEnum
)
from app.services.transformation_service import transformation_service
from app.services.email_service import email_service

class CommunicationController:
    """Controller orchestrating Communication business operations and persistence."""

    @classmethod
    async def _handle_specific_transform(
        cls,
        db: AsyncSession,
        payload_data: Dict[str, Any],
        output_type: OutputTypeEnum
    ) -> TransformationResponse:
        agent_val = payload_data.get("agent") or payload_data.get("input_agent") or payload_data.get("source_agent") or "Review Agent"
        dest_val = payload_data.get("output_destination") or payload_data.get("audience") or "Manager"
        tone_val = payload_data.get("tone") or "Professional"
        length_val = payload_data.get("length") or "Medium Report font"
        lang_val = payload_data.get("language") or "English"
        raw_payload = payload_data.get("payload") or payload_data

        default_agent = InputAgentEnum.REVIEW_AGENT
        default_destination = OutputDestinationEnum.MANAGER

        req = TransformationRequest(
            input_agent=InputAgentEnum(agent_val) if agent_val in [a.value for a in InputAgentEnum] else default_agent,
            output_destination=OutputDestinationEnum(dest_val) if dest_val in [d.value for d in OutputDestinationEnum] else default_destination,
            output_type=output_type,
            tone=ToneEnum(tone_val) if tone_val in [t.value for t in ToneEnum] else ToneEnum.PROFESSIONAL,
            length=DocumentLengthEnum(length_val) if length_val in [l.value for l in DocumentLengthEnum] else DocumentLengthEnum.MEDIUM_REPORT,
            language=LanguageEnum(lang_val) if lang_val in [lg.value for lg in LanguageEnum] else LanguageEnum.ENGLISH,
            payload=raw_payload
        )
        return await transformation_service.process_transformation(req, db)

    @classmethod
    async def generate_summary(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.EXECUTIVE_SUMMARY)

    @classmethod
    async def generate_report(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.PROJECT_UPDATE)

    @classmethod
    async def generate_email(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.PROFESSIONAL_EMAIL)

    @classmethod
    async def generate_markdown(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.STATUS_REPORT)

    @classmethod
    async def generate_html(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.STAKEHOLDER_UPDATE)

    @classmethod
    async def generate_meeting_notes(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.MEETING_NOTES)

    @classmethod
    async def generate_status(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.STATUS_REPORT)

    @classmethod
    async def generate_release_notes(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.RELEASE_NOTES)

    @classmethod
    async def generate_documentation(cls, db: AsyncSession, payload_data: Dict[str, Any]) -> TransformationResponse:
        return await cls._handle_specific_transform(db, payload_data, OutputTypeEnum.PROJECT_UPDATE)

    @classmethod
    async def get_history(
        cls,
        db: AsyncSession,
        source_agent: Optional[str] = None,
        document_type: Optional[str] = None,
        language: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[TransformationResponse]:
        query = select(Communication)
        if source_agent:
            query = query.where(Communication.source_agent == source_agent)
        if document_type:
            query = query.where(Communication.document_type == document_type)
        if language:
            query = query.where(Communication.language == language)

        query = query.order_by(Communication.created_at.desc()).offset(offset).limit(limit)
        res = await db.execute(query)
        records = res.scalars().all()

        results = []
        for r in records:
            results.append(TransformationResponse(
                status="success",
                id=r.id,
                communication_id=r.communication_id or r.id,
                document_type=r.document_type,
                title=r.title,
                summary=r.summary or r.content[:200],
                content=r.content,
                markdown=r.markdown,
                email_subject=r.email_subject or r.title,
                email_body=r.email_body or r.content,
                confidence=r.confidence,
                generated_at=r.created_at.isoformat() + "Z",
                input_agent=r.source_agent,
                output_destination=r.audience,
                priority=r.priority,
                tone=r.tone,
                length="Medium Report",
                language=r.language,
                recommended_channel=ChannelEnum.EMAIL,
                channel_rationale="Default channel for historical logs",
                requires_user_confirmation=False,
                delivery_status=r.delivery_status,
                chief_of_staff_notified=True,
                has_missing_info=False,
                missing_info_details=[],
                formatted_views={"html": r.html or ""}
            ))
        return results

    @classmethod
    async def get_by_id(cls, db: AsyncSession, record_id: str) -> TransformationResponse:
        stmt = select(Communication).where(Communication.id == record_id)
        res = await db.execute(stmt)
        record = res.scalar_one_or_none()
        if not record:
            raise HTTPException(status_code=404, detail="Communication record not found.")

        return TransformationResponse(
            status="success",
            id=record.id,
            communication_id=record.communication_id or record.id,
            document_type=record.document_type,
            title=record.title,
            summary=record.summary or record.content[:200],
            content=record.content,
            markdown=record.markdown,
            email_subject=record.email_subject or record.title,
            email_body=record.email_body or record.content,
            confidence=record.confidence,
            generated_at=record.created_at.isoformat() + "Z",
            input_agent=record.source_agent,
            output_destination=record.audience,
            priority=record.priority,
            tone=record.tone,
            length="Medium Report",
            language=record.language,
            recommended_channel=ChannelEnum.EMAIL,
            channel_rationale="Default channel",
            requires_user_confirmation=False,
            delivery_status=record.delivery_status,
            chief_of_staff_notified=True,
            has_missing_info=False,
            missing_info_details=[],
            formatted_views={"html": record.html or ""}
        )

    @classmethod
    async def delete_by_id(cls, db: AsyncSession, record_id: str) -> Dict[str, Any]:
        stmt = select(Communication).where(Communication.id == record_id)
        res = await db.execute(stmt)
        record = res.scalar_one_or_none()
        if not record:
            raise HTTPException(status_code=404, detail="Communication record not found.")
        await db.delete(record)
        await db.commit()
        return {"status": "success", "message": f"Communication record {record_id} deleted successfully."}

    @classmethod
    async def send_real_email(cls, recipient: str, subject: str, body: str, cc: Optional[str] = None) -> Dict[str, Any]:
        return await email_service.send_email(recipient, subject, body, cc)

communication_controller = CommunicationController()
