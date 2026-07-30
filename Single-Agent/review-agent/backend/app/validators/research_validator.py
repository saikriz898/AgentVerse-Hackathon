import re
from typing import Dict, Any, List, Tuple, Optional
from app.schemas.review import IssueItem

class ResearchValidator:
    """Validates Research Agent outputs (Facts, Sources, References, Citations, Completeness)."""

    @staticmethod
    def validate(
        findings: str,
        sources: Optional[List[str]] = None
    ) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if not findings or not findings.strip():
            issues.append(IssueItem(
                code="EMPTY_RESEARCH_FINDINGS",
                severity="critical",
                message="Research report findings are empty.",
                field="findings"
            ))
            return issues, warnings, suggestions, 50.0

        # Check source count
        if not sources or len(sources) == 0:
            warnings.append("No explicit research sources or references provided.")
            suggestions.append("Provide verified web URLs or citations in the sources list.")
            deduction += 15.0

        # Check inline citation references in findings
        citations = re.findall(r'\[\d+\]|https?://[^\s]+', findings)
        if not citations and not sources:
            issues.append(IssueItem(
                code="MISSING_RESEARCH_CITATIONS",
                severity="high",
                message="Research report contains zero citations or source references.",
                field="citations",
                suggestion="Include citation markers or source links for research assertions."
            ))
            deduction += 15.0

        # Check structure
        if not re.search(r'(?i)\b(executive summary|summary|key findings|conclusion|references)\b', findings):
            warnings.append("Research report lacks standard sections (Key Findings, Conclusion, References).")
            suggestions.append("Structure research with clear Executive Summary, Key Findings, and References sections.")
            deduction += 10.0

        return issues, warnings, suggestions, deduction
