from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class TemplateCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    output_type: str
    target_destination: str
    structure_template: str

class TemplateResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    output_type: str
    target_destination: str
    structure_template: str
    is_preset: bool
    created_at: datetime
