from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem, QualityScoreBreakdown, StandardReviewOutput

class QualityScorer:
    """Calculates granular multi-criteria quality score (0-100) and applies approval rules."""

    @staticmethod
    def calculate_score(
        issues: List[IssueItem],
        warnings: List[str],
        base_deductions: float = 0.0
    ) -> Tuple[float, float, str, QualityScoreBreakdown]:
        """
        Calculates final quality_score, confidence, status ('approved'|'rejected'), and score breakdown.
        """
        # Calculate issue deductions
        critical_issues = sum(1 for i in issues if i.severity == "critical")
        high_issues = sum(1 for i in issues if i.severity == "high")
        medium_issues = sum(1 for i in issues if i.severity == "medium")
        low_issues = sum(1 for i in issues if i.severity == "low")

        issue_deduction = (critical_issues * 30.0) + (high_issues * 15.0) + (medium_issues * 8.0) + (low_issues * 3.0)
        warning_deduction = len(warnings) * 2.0

        total_deduction = issue_deduction + warning_deduction + base_deductions
        quality_score = max(0.0, min(100.0, 100.0 - total_deduction))

        # Confidence calculation
        confidence = 0.98 if not issues else max(0.60, 0.98 - (len(issues) * 0.05))

        # Approval Rule: Quality >= 80 => approved, else rejected
        status = "approved" if quality_score >= 80.0 else "rejected"

        # Calculate sub-criteria scores for QualityScoreBreakdown
        accuracy = max(0.0, 100.0 - (critical_issues * 20.0 + high_issues * 10.0))
        completeness = max(0.0, 100.0 - (high_issues * 10.0 + base_deductions))
        correctness = max(0.0, 100.0 - (issue_deduction * 0.6))
        security = max(0.0, 100.0 - (sum(25.0 for i in issues if i.field == "security")))
        formatting = max(0.0, 100.0 - (sum(10.0 for i in issues if i.field in ["formatting", "syntax"]) + warning_deduction))
        grammar = max(0.0, 100.0 - (sum(5.0 for w in warnings if "grammar" in w.lower())))
        structure = max(0.0, 100.0 - (sum(10.0 for i in issues if i.field in ["structure", "root"])))
        consistency = max(0.0, 100.0 - (sum(15.0 for i in issues if i.code == "LOGICAL_CONTRADICTION")))
        performance = max(0.0, 100.0 - (sum(10.0 for i in issues if "PERFORMANCE" in i.code)))
        maintainability = max(0.0, 100.0 - (low_issues * 5.0 + warning_deduction))
        compliance = max(0.0, 100.0 - (total_deduction * 0.5))

        breakdown = QualityScoreBreakdown(
            accuracy=accuracy,
            completeness=completeness,
            consistency=consistency,
            correctness=correctness,
            formatting=formatting,
            grammar=grammar,
            structure=structure,
            security=security,
            performance=performance,
            maintainability=maintainability,
            compliance=compliance,
            overall_score=quality_score
        )

        return round(quality_score, 2), round(confidence, 2), status, breakdown

    @staticmethod
    def get_tier(score: float) -> str:
        """Get quality score rating tier."""
        if score >= 90.0:
            return "Excellent"
        elif score >= 80.0:
            return "Good"
        elif score >= 70.0:
            return "Acceptable"
        elif score >= 50.0:
            return "Needs Improvement"
        else:
            return "Rejected"
