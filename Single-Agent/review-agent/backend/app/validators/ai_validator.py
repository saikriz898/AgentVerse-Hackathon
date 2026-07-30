import re
from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem

PLACEHOLDER_PATTERNS = [
    (r'\[TODO\]', "PLACEHOLDER_TODO", "Document contains unresolved [TODO] placeholder."),
    (r'\[INSERT\s+.*?\]', "PLACEHOLDER_INSERT", "Document contains unresolved [INSERT...] placeholder."),
    (r'\bTBD\b', "PLACEHOLDER_TBD", "Document contains TBD (To Be Determined) placeholders.")
]

UNSUPPORTED_CLAIM_PATTERNS = [
    (r'(?i)\b(studies show|research proves|it is globally proven|everyone knows)\b(?!.*(?:\[|\(http|https))', "UNSUPPORTED_GENERIC_CLAIM", "Unsupported generic claim without inline citation or source link.")
]

CONTRADICTION_PATTERNS = [
    (r'(?i)(is mandatory|is required).*(is optional|is not required)', "LOGICAL_CONTRADICTION", "Contradictory statements regarding requirement status."),
    (r'(?i)(is enabled).*(is disabled)', "LOGICAL_CONTRADICTION", "Contradictory state assertions (enabled vs disabled).")
]

class AIValidator:
    """Detects hallucinations, logical contradictions, unsupported claims, repeated paragraphs, and leftover placeholders."""

    @staticmethod
    def validate(
        text_content: str
    ) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if not text_content:
            return issues, warnings, suggestions, 0.0

        # 1. Leftover Placeholders
        for pattern, code, msg in PLACEHOLDER_PATTERNS:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            if matches:
                issues.append(IssueItem(
                    code=code,
                    severity="high",
                    message=f"{msg} (Found {len(matches)} instance(s)).",
                    field="completeness",
                    suggestion="Replace placeholders with actual content or details."
                ))
                deduction += 15.0

        # 2. Contradictions
        for pattern, code, msg in CONTRADICTION_PATTERNS:
            if re.search(pattern, text_content, re.DOTALL):
                issues.append(IssueItem(
                    code=code,
                    severity="high",
                    message=msg,
                    field="logical_consistency",
                    suggestion="Harmonize contradictory statements."
                ))
                deduction += 20.0

        # 3. Unsupported Claims
        for pattern, code, msg in UNSUPPORTED_CLAIM_PATTERNS:
            if re.search(pattern, text_content):
                warnings.append(msg)
                suggestions.append("Add verified references or citations for authoritative claims.")
                deduction += 5.0

        # 4. Redundant / Repeated Paragraphs
        paragraphs = [p.strip() for p in text_content.split("\n\n") if len(p.strip()) > 30]
        seen_paragraphs = set()
        duplicates = 0
        for p in paragraphs:
            normalized = re.sub(r'\s+', ' ', p.lower())
            if normalized in seen_paragraphs:
                duplicates += 1
            else:
                seen_paragraphs.add(normalized)

        if duplicates > 0:
            issues.append(IssueItem(
                code="REPEATED_INFORMATION",
                severity="medium",
                message=f"Detected {duplicates} repeated or duplicate paragraph(s).",
                field="conciseness",
                suggestion="Remove redundant duplicated text sections."
            ))
            deduction += 10.0

        return issues, warnings, suggestions, deduction
