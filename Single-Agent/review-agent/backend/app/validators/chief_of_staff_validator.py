import re
from typing import Dict, Any, List, Tuple, Optional
from app.schemas.review import IssueItem

VALID_LIFEOS_AGENTS = [
    "research agent",
    "planning agent",
    "memory agent",
    "execution agent",
    "communication agent",
    "chief of staff"
]

VALID_PRIORITIES = ["critical", "high", "medium", "low"]

class ChiefOfStaffValidator:
    """Validates Chief of Staff Agent outputs (Task Delegations, Directives, Conflict Resolutions, Priority Assignments)."""

    @staticmethod
    def validate(
        content: Any,
        delegated_agents: Optional[List[str]] = None
    ) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if content is None or (isinstance(content, (str, list, dict)) and len(content) == 0):
            issues.append(IssueItem(
                code="EMPTY_CHIEF_OF_STAFF_OUTPUT",
                severity="critical",
                message="Chief of Staff output directive is empty.",
                field="content"
            ))
            return issues, warnings, suggestions, 50.0

        content_str = str(content)

        # 1. Executive Summary & Directive Structure Check
        if not re.search(r'(?i)\b(directive|summary|overview|action items|delegation)\b', content_str):
            warnings.append("Chief of Staff output lacks clear Directive or Summary sections.")
            suggestions.append("Structure executive output with clear Executive Summary and Action Directives.")
            deduction += 10.0

        # 2. Priority Level Validation
        has_priority = any(p in content_str.lower() for p in VALID_PRIORITIES)
        if not has_priority:
            warnings.append("Chief of Staff directive does not specify clear priority level (CRITICAL, HIGH, MEDIUM, LOW).")
            suggestions.append("Assign explicit priority rating to agent task delegations.")
            deduction += 5.0

        # 3. Delegated Agent Target Validation
        if delegated_agents:
            for agent in delegated_agents:
                if agent.lower().strip() not in VALID_LIFEOS_AGENTS:
                    issues.append(IssueItem(
                        code="UNKNOWN_DELEGATED_AGENT",
                        severity="medium",
                        message=f"Delegated agent target '{agent}' is not a recognized LifeOS ecosystem agent.",
                        field="delegated_agents",
                        suggestion=f"Target one of valid agents: {', '.join([a.title() for a in VALID_LIFEOS_AGENTS])}"
                    ))
                    deduction += 10.0

        # Check for unassigned delegations in text
        if "delegate" in content_str.lower() and not any(ag in content_str.lower() for ag in VALID_LIFEOS_AGENTS):
            warnings.append("Delegation instruction found without specifying target LifeOS agent.")
            suggestions.append("Explicitly state which agent is assigned each delegated task.")
            deduction += 5.0

        return issues, warnings, suggestions, deduction
