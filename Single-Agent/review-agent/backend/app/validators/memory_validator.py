from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem

class MemoryValidator:
    """Validates Memory Agent outputs (Categories, Tags, Importance Score bounds 0.0-1.0, Summary quality, Metadata)."""

    @staticmethod
    def validate(data: Dict[str, Any]) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        # Check required fields for memory entry
        required = ["category", "tags", "importance_score", "summary"]
        for r in required:
            if r not in data:
                issues.append(IssueItem(
                    code="MEMORY_MISSING_FIELD",
                    severity="high",
                    message=f"Memory entry missing required field '{r}'.",
                    field=r
                ))
                deduction += 15.0

        # Validate importance_score bounds
        if "importance_score" in data:
            score = data["importance_score"]
            if not isinstance(score, (int, float)) or score < 0.0 or score > 1.0:
                issues.append(IssueItem(
                    code="INVALID_IMPORTANCE_SCORE",
                    severity="high",
                    message=f"Memory importance score must be numeric between 0.0 and 1.0, got {score}.",
                    field="importance_score"
                ))
                deduction += 20.0

        # Validate tags array
        if "tags" in data:
            tags = data["tags"]
            if not isinstance(tags, list):
                issues.append(IssueItem(
                    code="INVALID_TAGS_FORMAT",
                    severity="medium",
                    message="Memory tags must be a list of strings.",
                    field="tags"
                ))
                deduction += 10.0
            elif len(tags) == 0:
                warnings.append("Memory item has no tags associated with it.")
                suggestions.append("Add relevant tags to improve memory retrieval precision.")
                deduction += 5.0

        # Validate summary
        if "summary" in data:
            summary = str(data.get("summary", "")).strip()
            if len(summary) < 10:
                warnings.append("Memory summary is very short.")
                deduction += 5.0

        return issues, warnings, suggestions, deduction
