import re
from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem

class CommunicationValidator:
    """Validates Communication Agent outputs (Emails, Executive Summaries, Meeting Notes, Reports)."""

    @staticmethod
    def validate(content: str, comm_type: str = "email") -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if not content or not content.strip():
            issues.append(IssueItem(
                code="EMPTY_COMMUNICATION",
                severity="critical",
                message="Communication text payload is empty.",
                field="content"
            ))
            return issues, warnings, suggestions, 50.0

        ctype = comm_type.lower()

        if ctype == "email":
            if not re.search(r'(?i)\bSubject:\s*', content):
                warnings.append("Email communication lacks an explicit 'Subject:' line.")
                suggestions.append("Include a clear 'Subject: ...' at the top of the email draft.")
                deduction += 10.0

            if not re.search(r'(?i)\b(Best regards|Sincerely|Thanks|Cheers|Kind regards)\b', content):
                warnings.append("Email communication lacks standard sign-off closing.")
                suggestions.append("Add a professional sign-off (e.g., 'Best regards,').")
                deduction += 5.0

        elif ctype in ["meeting_notes", "meeting"]:
            if not re.search(r'(?i)\b(action items|key takeaways|attendees|decisions)\b', content):
                warnings.append("Meeting notes lack clear 'Action Items' or 'Key Takeaways' section.")
                suggestions.append("Add explicit Action Items with assignees and due dates.")
                deduction += 10.0

        elif ctype == "executive_summary":
            words = content.split()
            if len(words) > 500:
                warnings.append(f"Executive summary is lengthy ({len(words)} words). Aim for concise clarity (< 300 words).")
                deduction += 5.0

        return issues, warnings, suggestions, deduction
