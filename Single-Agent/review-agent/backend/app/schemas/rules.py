from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class RuleCreate(BaseModel):
    name: str = Field(..., description="Rule name")
    agent_name: str = Field("ALL", description="Target agent name or ALL")
    review_type: str = Field("ALL", description="Target review type or ALL")
    rule_config: Dict[str, Any] = Field(..., description="Configuration dict for rule bounds/checks")
    is_active: bool = True

class RuleUpdate(BaseModel):
    name: Optional[str] = None
    agent_name: Optional[str] = None
    review_type: Optional[str] = None
    rule_config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class RuleResponse(BaseModel):
    id: str
    name: str
    agent_name: str
    review_type: str
    rule_config: Dict[str, Any]
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
