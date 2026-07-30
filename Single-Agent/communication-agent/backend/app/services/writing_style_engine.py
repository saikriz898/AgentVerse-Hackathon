from typing import Dict, Any

class WritingStyleEngine:
    """Writing Style Engine mapping audience and tone to 13 enterprise writing style guidelines."""

    STYLES: Dict[str, Dict[str, str]] = {
        "Executive": {
            "vocabulary": "Strategic, High-level, Impact-driven",
            "sentence_structure": "Concise, Active Voice, Bulleted Key Highlights",
            "tone_guideline": "Direct, authoritative, focused on business metrics and ROI."
        },
        "Business": {
            "vocabulary": "Professional, Operational, Clear",
            "sentence_structure": "Structured paragraphs with clear action items",
            "tone_guideline": "Polished, result-oriented, professional."
        },
        "Professional": {
            "vocabulary": "Standard Business Terms, Courteous",
            "sentence_structure": "Balanced sentences with clear explanations",
            "tone_guideline": "Respectful, neutral, objective."
        },
        "Technical": {
            "vocabulary": "Architecture Terms, Code Symbols, Benchmark Metrics",
            "sentence_structure": "Detailed, precise, step-by-step documentation",
            "tone_guideline": "Accurate, unembellished, analytical."
        },
        "Academic": {
            "vocabulary": "Methodological, Research Terms, Formal Citations",
            "sentence_structure": "Complex syntax, objective passive voice where applicable",
            "tone_guideline": "Scholarly, rigorous, evidence-based."
        },
        "Customer Friendly": {
            "vocabulary": "Warm, Accessible, Solution-focused",
            "sentence_structure": "Short sentences, positive phrasing",
            "tone_guideline": "Helpful, empathetic, clear."
        },
        "Marketing": {
            "vocabulary": "Engaging, Value-proposition, Action-oriented",
            "sentence_structure": "Dynamic, persuasive hooks",
            "tone_guideline": "Enthusiastic, compelling, customer-centric."
        },
        "Sales": {
            "vocabulary": "Value Driver, Benefit-oriented, Direct CTA",
            "sentence_structure": "Problem-solution-benefit flow",
            "tone_guideline": "Persuasive, confident, goal-driven."
        },
        "Legal": {
            "vocabulary": "Precise, Statutory, Explicit Terms",
            "sentence_structure": "Unambiguous, formal clause structure",
            "tone_guideline": "Rigorous, formal, risk-averse."
        },
        "HR": {
            "vocabulary": "People-first, Inclusive, Policy-compliant",
            "sentence_structure": "Clear, supportive, reassuring",
            "tone_guideline": "Empathetic, clear, compliant."
        },
        "Developer": {
            "vocabulary": "API Endpoints, CLI Commands, Log Tracebacks",
            "sentence_structure": "Markdown codeblocks, concise technical bullets",
            "tone_guideline": "Direct, technical, practical."
        },
        "Student": {
            "vocabulary": "Educational, Instructive, Clear",
            "sentence_structure": "Simple step-by-step breakdown",
            "tone_guideline": "Encouraging, clear, accessible."
        },
        "Simple English": {
            "vocabulary": "Plain English, Common Terms, Zero Jargon",
            "sentence_structure": "Short sentences (<15 words)",
            "tone_guideline": "Ultra-clear, simple, easily readable."
        }
    }

    @classmethod
    def get_style_guidelines(cls, audience: str, requested_style: str = "Professional") -> Dict[str, str]:
        aud_lower = audience.lower()

        if aud_lower in ["ceo", "executive", "investor"]:
            style_key = "Executive"
        elif aud_lower in ["developer", "administrator"]:
            style_key = "Developer"
        elif aud_lower in ["researcher", "professor"]:
            style_key = "Academic"
        elif aud_lower in ["customer", "general public"]:
            style_key = "Customer Friendly"
        else:
            style_key = requested_style if requested_style in cls.STYLES else "Professional"

        style_info = cls.STYLES.get(style_key, cls.STYLES["Professional"])
        return {
            "style_name": style_key,
            **style_info
        }

writing_style_engine = WritingStyleEngine()
