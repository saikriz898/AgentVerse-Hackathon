import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from app.models.communication import Communication
from app.models.report import Report
from app.models.email import EmailRecord
from app.models.summary import SummaryRecord
from app.models.document import DocumentRecord

class CommunicationRepository:
    """Repository handling Database operations for Communications, Reports, Emails, Summaries, Documents."""

    @staticmethod
    async def create_communication(
        db: AsyncSession,
        document_type: str,
        title: str,
        summary: str,
        content: str,
        markdown: str,
        html: str,
        email_subject: str,
        email_body: str,
        source_agent: str,
        generated_by: str = "Communication Agent",
        status: str = "completed",
        language: str = "English",
        confidence: float = 0.98
    ) -> Communication:
        comm_id = str(uuid.uuid4())
        record = Communication(
            id=comm_id,
            document_type=document_type,
            title=title,
            summary=summary,
            content=content,
            markdown=markdown,
            html=html,
            email_subject=email_subject,
            email_body=email_body,
            source_agent=source_agent,
            generated_by=generated_by,
            status=status,
            language=language,
            confidence=confidence
        )
        db.add(record)
        
        # Also store related records based on document type
        if "report" in document_type.lower():
            db.add(Report(communication_id=comm_id, report_type=document_type, title=title, content=content))
        if email_body:
            db.add(EmailRecord(communication_id=comm_id, subject=email_subject or title, body=email_body))
        if summary:
            db.add(SummaryRecord(communication_id=comm_id, summary_type=document_type, content=summary))

        await db.commit()
        await db.refresh(record)
        return record

    @staticmethod
    async def get_by_id(db: AsyncSession, record_id: str) -> Optional[Communication]:
        res = await db.execute(select(Communication).where(Communication.id == record_id))
        return res.scalar_one_or_none()

    @staticmethod
    async def list_communications(
        db: AsyncSession,
        source_agent: Optional[str] = None,
        document_type: Optional[str] = None,
        language: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[Communication]:
        stmt = select(Communication).order_by(Communication.created_at.desc())
        if source_agent:
            stmt = stmt.where(Communication.source_agent == source_agent)
        if document_type:
            stmt = stmt.where(Communication.document_type == document_type)
        if language:
            stmt = stmt.where(Communication.language == language)
            
        stmt = stmt.offset(offset).limit(limit)
        res = await db.execute(stmt)
        return res.scalars().all()

    @staticmethod
    async def delete_by_id(db: AsyncSession, record_id: str) -> bool:
        res = await db.execute(select(Communication).where(Communication.id == record_id))
        record = res.scalar_one_or_none()
        if not record:
            return False
        await db.delete(record)
        await db.commit()
        return True

communication_repository = CommunicationRepository()
