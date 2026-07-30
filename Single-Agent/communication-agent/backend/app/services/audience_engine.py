from typing import Dict, Any
from app.schemas.communication import OutputDestinationEnum

class AudienceEngine:
    """Audience Classification Engine determining technical depth, complexity, and communication style."""

    AUDIENCE_PROFILES: Dict[str, Dict[str, Any]] = {
        "CEO": {
            "category": "C-Suite Executive",
            "complexity": "Low",
            "technical_level": "Executive Summary Only",
            "preferred_tone": "Executive",
            "preferred_format": "Executive Summary / Single Page Brief",
            "preferred_channel": "Email / PDF"
        },
        "Executive": {
            "category": "Leadership",
            "complexity": "Low-Medium",
            "technical_level": "High Level Metrics",
            "preferred_tone": "Executive",
            "preferred_format": "Executive Summary",
            "preferred_channel": "Email / PDF"
        },
        "Manager": {
            "category": "Management",
            "complexity": "Medium",
            "technical_level": "Operational Metrics",
            "preferred_tone": "Professional",
            "preferred_format": "Status Report",
            "preferred_channel": "Email / Slack"
        },
        "Developer": {
            "category": "Engineering",
            "complexity": "High",
            "technical_level": "Full Code & Log Detail",
            "preferred_tone": "Technical",
            "preferred_format": "Markdown / Technical Documentation",
            "preferred_channel": "Slack / Microsoft Teams"
        },
        "Designer": {
            "category": "Product Design",
            "complexity": "Medium",
            "technical_level": "UI/UX & Workflow Context",
            "preferred_tone": "Friendly",
            "preferred_format": "Project Update",
            "preferred_channel": "Slack"
        },
        "Researcher": {
            "category": "R&D",
            "complexity": "High",
            "technical_level": "Academic & Benchmark Metrics",
            "preferred_tone": "Academic",
            "preferred_format": "Research Report",
            "preferred_channel": "Google Docs / PDF"
        },
        "Client": {
            "category": "External Stakeholder",
            "complexity": "Medium",
            "technical_level": "Business Value & Results",
            "preferred_tone": "Formal",
            "preferred_format": "Professional Email / PDF Report",
            "preferred_channel": "Email"
        },
        "Customer": {
            "category": "End User",
            "complexity": "Low",
            "technical_level": "Simple Steps",
            "preferred_tone": "Simple",
            "preferred_format": "Notification / Release Notes",
            "preferred_channel": "Email / Push Notification"
        },
        "Investor": {
            "category": "Financial Stakeholder",
            "complexity": "Low-Medium",
            "technical_level": "ROI & Strategic Milestones",
            "preferred_tone": "Executive",
            "preferred_format": "Stakeholder Update",
            "preferred_channel": "Email / PDF"
        },
        "Student": {
            "category": "Educational",
            "complexity": "Low-Medium",
            "technical_level": "Educational Guidance",
            "preferred_tone": "Educational",
            "preferred_format": "Daily Brief",
            "preferred_channel": "Google Docs"
        },
        "Professor": {
            "category": "Academic Reviewer",
            "complexity": "High",
            "technical_level": "Academic & Methodological",
            "preferred_tone": "Academic",
            "preferred_format": "Research Summary",
            "preferred_channel": "Email / PDF"
        },
        "Vendor": {
            "category": "External Partner",
            "complexity": "Medium",
            "technical_level": "Requirements & Deadlines",
            "preferred_tone": "Formal",
            "preferred_format": "Professional Email",
            "preferred_channel": "Email"
        },
        "Administrator": {
            "category": "System Admin",
            "complexity": "High",
            "technical_level": "Infrastructure & Permissions",
            "preferred_tone": "Technical",
            "preferred_format": "Incident Report",
            "preferred_channel": "Slack / Microsoft Teams"
        },
        "Support Team": {
            "category": "Operations",
            "complexity": "Medium",
            "technical_level": "Resolution Steps",
            "preferred_tone": "Supportive",
            "preferred_format": "Incident Report / Chat Message",
            "preferred_channel": "Slack"
        },
        "General Public": {
            "category": "Broad Audience",
            "complexity": "Low",
            "technical_level": "Non-Technical",
            "preferred_tone": "Simple",
            "preferred_format": "Announcement",
            "preferred_channel": "Dashboard Notification / Email"
        }
    }

    @classmethod
    def analyze_audience(cls, audience_name: str) -> Dict[str, Any]:
        """Return audience profile rules and complexity guidelines."""
        return cls.AUDIENCE_PROFILES.get(audience_name, {
            "category": "General",
            "complexity": "Medium",
            "technical_level": "Balanced",
            "preferred_tone": "Professional",
            "preferred_format": "Executive Summary",
            "preferred_channel": "Email"
        })

audience_engine = AudienceEngine()
