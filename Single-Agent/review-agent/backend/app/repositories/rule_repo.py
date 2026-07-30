from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.review_rule import ReviewRule
from app.schemas.rules import RuleCreate, RuleUpdate

class RuleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_rules(self) -> List[ReviewRule]:
        result = await self.db.execute(select(ReviewRule).order_by(ReviewRule.created_at.desc()))
        return list(result.scalars().all())

    async def get_by_id(self, rule_id: str) -> Optional[ReviewRule]:
        result = await self.db.execute(select(ReviewRule).where(ReviewRule.id == rule_id))
        return result.scalars().first()

    async def create_rule(self, rule_in: RuleCreate) -> ReviewRule:
        db_rule = ReviewRule(
            name=rule_in.name,
            agent_name=rule_in.agent_name,
            review_type=rule_in.review_type,
            rule_config=rule_in.rule_config,
            is_active=rule_in.is_active
        )
        self.db.add(db_rule)
        await self.db.commit()
        await self.db.refresh(db_rule)
        return db_rule

    async def update_rule(self, rule_id: str, rule_in: RuleUpdate) -> Optional[ReviewRule]:
        db_rule = await self.get_by_id(rule_id)
        if not db_rule:
            return None
        if rule_in.name is not None:
            db_rule.name = rule_in.name
        if rule_in.agent_name is not None:
            db_rule.agent_name = rule_in.agent_name
        if rule_in.review_type is not None:
            db_rule.review_type = rule_in.review_type
        if rule_in.rule_config is not None:
            db_rule.rule_config = rule_in.rule_config
        if rule_in.is_active is not None:
            db_rule.is_active = rule_in.is_active

        await self.db.commit()
        await self.db.refresh(db_rule)
        return db_rule

    async def delete_rule(self, rule_id: str) -> bool:
        db_rule = await self.get_by_id(rule_id)
        if db_rule:
            await self.db.delete(db_rule)
            await self.db.commit()
            return True
        return False
