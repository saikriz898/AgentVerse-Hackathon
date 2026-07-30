from typing import Dict, Any, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.history import CommunicationHistory
from app.models.agent_log import AgentRequest, AgentResponse
from app.models.generation_log import GenerationLog

class HistoryRepository:
    """Repository managing logs for CommunicationHistory, AgentRequest, AgentResponse, and GenerationLog."""

    @staticmethod
    async def log_history(
        db: AsyncSession,
        agent_name: str,
        request_payload: Dict[str, Any],
        response_payload: Dict[str, Any],
        execution_time: float,
        communication_id: Optional[str] = None,
        status: str = "success"
    ) -> CommunicationHistory:
        history = CommunicationHistory(
            communication_id=communication_id,
            agent_name=agent_name,
            request=request_payload,
            response=response_payload,
            execution_time=execution_time,
            status=status
        )
        db.add(history)
        await db.commit()
        await db.refresh(history)
        return history

    @staticmethod
    async def log_agent_request_response(
        db: AsyncSession,
        request_id: str,
        agent: str,
        document_type: str,
        payload: Dict[str, Any],
        content: str,
        confidence: float = 0.98,
        status: str = "success"
    ):
        req = AgentRequest(
            request_id=request_id,
            agent=agent,
            document_type=document_type,
            payload=payload
        )
        res = AgentResponse(
            request_id=request_id,
            status=status,
            document_type=document_type,
            content=content,
            confidence=confidence
        )
        db.add(req)
        db.add(res)
        await db.commit()

    @staticmethod
    async def log_generation(
        db: AsyncSession,
        request_id: str,
        agent: str,
        model: str,
        latency: float,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        status: str = "success",
        error_message: Optional[str] = None
    ) -> GenerationLog:
        gen_log = GenerationLog(
            request_id=request_id,
            agent=agent,
            model=model,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            latency=latency,
            status=status,
            error_message=error_message
        )
        db.add(gen_log)
        await db.commit()
        return gen_log

history_repository = HistoryRepository()
