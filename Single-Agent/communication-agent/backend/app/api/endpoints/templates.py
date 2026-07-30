import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database.session import get_db
from app.models.template import CommunicationTemplate
from app.schemas.template import TemplateCreate, TemplateResponse

router = APIRouter(prefix="/templates", tags=["Communication Templates"])

# Default Preset Templates
PRESET_TEMPLATES = [
    {
        "id": "preset-1",
        "name": "Executive Standup Brief",
        "description": "High-level summary formatted for executives and board members.",
        "output_type": "Executive Summary",
        "target_destination": "Executive",
        "structure_template": "# Executive Summary: {{project}}\n\n## TL;DR Overview\n{{summary}}\n\n## Core Highlights\n- Status: {{status}}\n\n## Strategic Recommendations\n- Next steps proceed on schedule.",
        "is_preset": True
    },
    {
        "id": "preset-2",
        "name": "Developer API Release Note",
        "description": "Technical release note detailing endpoints, methods, and schema updates.",
        "output_type": "Release Notes",
        "target_destination": "Developer",
        "structure_template": "# Release Notes: {{project}}\n\n## Version Details\n- Version: {{version}}\n\n## Endpoint Modifications\n{{endpoints}}",
        "is_preset": True
    },
    {
        "id": "preset-3",
        "name": "Client Progress Update Email",
        "description": "Polished, client-ready progress email with milestone updates.",
        "output_type": "Email",
        "target_destination": "Client",
        "structure_template": "Subject: Project Progress Update - {{project}}\n\nDear Client,\n\nWe are pleased to provide the latest progress update...",
        "is_preset": True
    }
]

@router.get("/", response_model=List[TemplateResponse])
async def list_templates(db: AsyncSession = Depends(get_db)):
    """List preset and custom templates."""
    stmt = select(CommunicationTemplate).order_by(CommunicationTemplate.created_at.desc())
    res = await db.execute(stmt)
    custom_templates = res.scalars().all()

    # Seed preset templates if empty in custom
    all_templates = []
    for p in PRESET_TEMPLATES:
        all_templates.append(TemplateResponse(
            id=p["id"],
            name=p["name"],
            description=p["description"],
            output_type=p["output_type"],
            target_destination=p["target_destination"],
            structure_template=p["structure_template"],
            is_preset=p["is_preset"],
            created_at=uuid.uuid4() # placeholder
        ))

    for c in custom_templates:
        all_templates.append(TemplateResponse(
            id=c.id,
            name=c.name,
            description=c.description,
            output_type=c.output_type,
            target_destination=c.target_destination,
            structure_template=c.structure_template,
            is_preset=c.is_preset,
            created_at=c.created_at
        ))

    return all_templates

@router.post("/", response_model=TemplateResponse)
async def create_template(
    tpl: TemplateCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new custom transformation template."""
    record = CommunicationTemplate(
        id=str(uuid.uuid4()),
        name=tpl.name,
        description=tpl.description,
        output_type=tpl.output_type,
        target_destination=tpl.target_destination,
        structure_template=tpl.structure_template,
        is_preset=False
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    return TemplateResponse(
        id=record.id,
        name=record.name,
        description=record.description,
        output_type=record.output_type,
        target_destination=record.target_destination,
        structure_template=record.structure_template,
        is_preset=record.is_preset,
        created_at=record.created_at
    )
