import pytest
from app.core.scoring import QualityScorer
from app.schemas.review import IssueItem

def test_scoring_approval_rules():
    # Case 1: High quality => Approved
    score, confidence, status, breakdown = QualityScorer.calculate_score(
        issues=[], warnings=[]
    )
    assert score == 100.0
    assert status == "approved"
    assert QualityScorer.get_tier(score) == "Excellent"

    # Case 2: Moderate issues bringing score to 85 => Approved
    issues_mod = [
        IssueItem(code="FORMATTING_ISSUE", severity="medium", message="Minor formatting issue")
    ]
    score_mod, _, status_mod, _ = QualityScorer.calculate_score(issues=issues_mod, warnings=[])
    assert score_mod >= 80.0
    assert status_mod == "approved"

    # Case 3: Critical issues bringing score below 80 => Rejected
    issues_crit = [
        IssueItem(code="CRITICAL_BUG", severity="critical", message="Critical flaw"),
        IssueItem(code="HIGH_BUG", severity="high", message="High flaw")
    ]
    score_crit, _, status_crit, _ = QualityScorer.calculate_score(issues=issues_crit, warnings=[])
    assert score_crit < 80.0
    assert status_crit == "rejected"
