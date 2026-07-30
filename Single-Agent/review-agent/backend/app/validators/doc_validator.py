import re
from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem

class DocumentValidator:
    """Validates document structure, markdown syntax, heading hierarchy, grammar indicators, and formatting."""

    @staticmethod
    def validate(
        content: str,
        document_type: str = "markdown"
    ) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if not content or not content.strip():
            issues.append(IssueItem(
                code="EMPTY_DOCUMENT",
                severity="critical",
                message="Document content is completely empty.",
                field="content"
            ))
            return issues, warnings, suggestions, 50.0

        doc_type = document_type.lower().strip()

        # 1. Unclosed Code Blocks check
        fence_count = len(re.findall(r'^```', content, re.MULTILINE))
        if fence_count % 2 != 0:
            issues.append(IssueItem(
                code="UNCLOSED_CODE_BLOCK",
                severity="high",
                message="Unclosed markdown code block (odd number of ``` triple backticks).",
                field="markdown_formatting",
                suggestion="Close all opening ``` code fences."
            ))
            deduction += 15.0

        # 2. Heading Hierarchy & Structure Check (for Markdown)
        if doc_type in ["markdown", "md", "report", "research"]:
            headings = re.findall(r'^(#{1,6})\s+(.+)$', content, re.MULTILINE)
            if not headings:
                warnings.append("Document lacks structural Markdown headings (e.g. # Title, ## Section).")
                suggestions.append("Add structured headings to organize document content.")
                deduction += 10.0
            else:
                h1_count = sum(1 for h, _ in headings if len(h) == 1)
                if h1_count > 1:
                    warnings.append(f"Multiple top-level # (H1) headings found ({h1_count}). Best practice recommends a single H1 per document.")
                    suggestions.append("Use a single H1 heading for document title and H2/H3 for subsections.")
                    deduction += 5.0

                # Heading level jump check (e.g., # H1 directly to ### H3)
                prev_level = 0
                for h_hashes, h_title in headings:
                    curr_level = len(h_hashes)
                    if prev_level > 0 and curr_level > prev_level + 1:
                        warnings.append(f"Heading hierarchy jump from H{prev_level} directly to H{curr_level} ('{h_title}').")
                        deduction += 3.0
                    prev_level = curr_level

        # 3. Empty Markdown Links Check
        empty_links = re.findall(r'\[([^\]]+)\]\(\s*\)', content)
        if empty_links:
            issues.append(IssueItem(
                code="EMPTY_MARKDOWN_LINK",
                severity="medium",
                message=f"Markdown contains empty link URLs: {', '.join(empty_links[:3])}",
                field="references",
                suggestion="Provide target URL or file path for all markdown links."
            ))
            deduction += 10.0

        # 4. Grammar & Formatting heuristics
        lines = content.splitlines()
        lowercase_start_lines = 0
        for l in lines:
            s = l.strip()
            if s and not s.startswith(('-', '*', '#', '>', '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '|')):
                if s[0].isalpha() and s[0].islower():
                    lowercase_start_lines += 1

        if lowercase_start_lines > 5:
            warnings.append("Multiple prose lines start with uncapitalized letters.")
            suggestions.append("Ensure proper sentence capitalization.")
            deduction += 5.0

        # Word count & depth check
        words = content.split()
        if len(words) < 20:
            warnings.append("Document is very short (< 20 words). Ensure full coverage.")
            deduction += 5.0

        return issues, warnings, suggestions, deduction
