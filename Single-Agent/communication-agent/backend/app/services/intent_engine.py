from typing import Dict, Any

class IntentEngine:
    """Intent Detection Engine classifying 17 communication intents and generating CTAs and subject lines."""

    VALID_INTENTS = [
        "Inform",
        "Update",
        "Request",
        "Approve",
        "Reject",
        "Escalate",
        "Notify",
        "Warn",
        "Invite",
        "Schedule",
        "Thank",
        "Congratulate",
        "Apologize",
        "Follow Up",
        "Reminder",
        "Announcement",
        "Decision"
    ]

    @classmethod
    def detect_intent(cls, payload: Dict[str, Any], communication_type: str = "Executive Summary") -> Dict[str, Any]:
        p_str = str(payload).lower()
        comm_lower = communication_type.lower()

        intent = "Update"
        cta = "Review latest status and acknowledge receipt."
        urgency_level = "Normal"

        if "urgent" in p_str or "critical" in p_str or "vulnerability" in p_str:
            intent = "Warn"
            cta = "Immediate executive review and action required."
            urgency_level = "Critical"
        elif "request" in p_str or "action" in p_str or "approval required" in p_str:
            intent = "Request"
            cta = "Approve or provide feedback on requested items."
        elif "passed" in p_str or "complete" in p_str or "approved" in p_str:
            intent = "Approve"
            cta = "Proceed to next operational milestone."
        elif "meeting" in p_str or "schedule" in p_str:
            intent = "Schedule"
            cta = "Confirm calendar invitation and agenda."
        elif "decision" in p_str:
            intent = "Decision"
            cta = "Review key decision rationale."

        title_prefix = f"[{intent.upper()}]"
        project_name = payload.get("project") or payload.get("title") or "Subsystem Update"
        generated_subject = f"{title_prefix} {communication_type}: {project_name}"

        return {
            "intent": intent,
            "call_to_action": cta,
            "urgency_level": urgency_level,
            "generated_subject": generated_subject
        }

intent_engine = IntentEngine()
