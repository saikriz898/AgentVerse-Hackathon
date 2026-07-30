from typing import Dict, Any, List, Tuple, Optional
from app.schemas.review import IssueItem

class PlanningValidator:
    """Validates Planning Agent outputs (Goals, Milestones, Subtasks, Risks, Execution steps)."""

    @staticmethod
    def validate(
        goal: str,
        plan: Any,
        milestones: Optional[List[Any]] = None
    ) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if not goal or not str(goal).strip():
            issues.append(IssueItem(
                code="MISSING_PLAN_GOAL",
                severity="critical",
                message="Plan output missing objective goal statement.",
                field="goal"
            ))
            deduction += 25.0

        if not plan:
            issues.append(IssueItem(
                code="EMPTY_PLAN_CONTENT",
                severity="critical",
                message="Plan body is empty.",
                field="plan"
            ))
            return issues, warnings, suggestions, 50.0

        # Check milestones
        if milestones is not None and len(milestones) == 0:
            warnings.append("Plan contains zero milestones.")
            suggestions.append("Break down plan into key phase milestones with target deliverables.")
            deduction += 10.0

        # Check task actionable items in plan body
        plan_str = str(plan)
        if "- [ ]" not in plan_str and "* [ ]" not in plan_str and "step" not in plan_str.lower():
            warnings.append("Plan body does not contain structured actionable checklist items.")
            suggestions.append("Format plan steps as actionable task items.")
            deduction += 10.0

        return issues, warnings, suggestions, deduction
