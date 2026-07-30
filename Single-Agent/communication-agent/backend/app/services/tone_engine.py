from app.schemas.communication import ToneEnum

class ToneEngine:
    """Tone Engine mapping audience, intent, urgency, and priority to communication style."""

    @classmethod
    def select_tone(
        cls,
        audience: str,
        urgency: str = "Normal",
        requested_tone: str = "Professional"
    ) -> ToneEnum:
        aud_lower = audience.lower()
        urg_lower = urgency.lower()

        if urg_lower == "critical":
            return ToneEnum.FORMAL
        
        if aud_lower in ["ceo", "executive", "investor"]:
            return ToneEnum.EXECUTIVE
            
        if aud_lower in ["developer", "administrator", "researcher"]:
            return ToneEnum.TECHNICAL
            
        if aud_lower in ["customer", "student", "general public"]:
            return ToneEnum.SIMPLE

        if aud_lower in ["support team", "employee"]:
            return ToneEnum.SUPPORTIVE

        # Map string enum if valid
        try:
            return ToneEnum(requested_tone)
        except ValueError:
            return ToneEnum.PROFESSIONAL

tone_engine = ToneEngine()
