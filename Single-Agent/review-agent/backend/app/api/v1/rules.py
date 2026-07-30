from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.repositories.rule_repo import RuleRepository
from app.schemas.rules import RuleCreate, RuleUpdate, RuleResponse

router = APIRouter(prefix="/rules", tags=["Review Rules Management"])

@router.get("", response_model=List[RuleResponse])
async def list_rules(db: AsyncSession = Depends(get_db)):
    """List all configured review rules."""
    repo = RuleRepository(db)
    return await repo.get_all_rules()

@router.post("", response_model=RuleResponse, status_code=status.HTTP_201_CREATED)
async def create_rule(rule_in: RuleCreate, db: AsyncSession = Depends(get_db)):
    """Create a new custom review rule."""
    repo = RuleRepository(db)
    return await repo.create_rule(rule_in)

@router.get("/{id}", response_model=RuleResponse)
async def get_rule(id: str, db: AsyncSession = Depends(get_db)):
    """Get rule configuration by ID."""
    repo = RuleRepository(db)
    rule = await repo.get_by_id(id)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule

@router.put("/{id}", response_model=RuleResponse)
async def update_rule(id: str, rule_in: RuleUpdate, db: AsyncSession = Depends(get_db)):
    """Update rule configuration by ID."""
    repo = RuleRepository(db)
    rule = await repo.update_rule(id, rule_in)
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rule(id: str, db: AsyncSession = Depends(get_db)):
    """Delete a review rule."""
    repo = RuleRepository(db)
    deleted = await repo.delete_rule(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Rule not found")
    return None
