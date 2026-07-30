import json
import re
import asyncio
from typing import Dict, Any, Optional
# pyrefly: ignore [missing-import]
import httpx
from app.core.config import settings
from app.core.logger import logger
from app.ai.prompts import SYSTEM_COMMUNICATION_PROMPT, TRANSFORMATION_USER_TEMPLATE

class GeminiCommunicationClient:
    """Client for Gemini 2.5 Flash AI API for high-fidelity communication transformations."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL

    def _call_genai_sdk(self, prompt: str) -> str:
        """Synchronous call using official google-genai SDK."""
        # pyrefly: ignore [missing-import]
        from google import genai
        client = genai.Client(api_key=self.api_key)
        response = client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        return response.text

    async def transform_communication(
        self,
        input_agent: str,
        output_destination: str,
        output_type: str,
        tone: str,
        payload: Dict[str, Any],
        additional_instructions: Optional[str] = None,
        length: str = "Medium Report",
        language: str = "English"
    ) -> Optional[str]:
        """Call Gemini LLM to transform technical payload into structured communication."""
        if not self.api_key:
            logger.info("GEMINI_API_KEY not configured. Delegating to Fallback Transformation Engine.")
            return None

        json_str = json.dumps(payload, indent=2, default=str)
        user_prompt = TRANSFORMATION_USER_TEMPLATE.format(
            input_agent=input_agent,
            output_destination=output_destination,
            output_type=output_type,
            tone=tone,
            length=length,
            language=language,
            additional_instructions=additional_instructions or "None",
            json_payload=json_str
        )
        full_prompt = f"{SYSTEM_COMMUNICATION_PROMPT}\n\n{user_prompt}"

        try:
            text_response = None

            # Attempt 1: google-genai SDK in thread pool
            try:
                text_response = await asyncio.to_thread(self._call_genai_sdk, full_prompt)
            except Exception as sdk_err:
                logger.warning(f"google.genai SDK call failed ({sdk_err}). Attempting Direct REST API fallback...")
                
                # Attempt 2: Direct REST endpoint to Gemini API
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
                payload_data = {
                    "contents": [{
                        "parts": [{"text": full_prompt}]
                    }],
                    "generationConfig": {
                        "temperature": 0.2
                    }
                }
                async with httpx.AsyncClient(timeout=35.0) as http_client:
                    res = await http_client.post(url, json=payload_data)
                    res.raise_for_status()
                    data = res.json()
                    text_response = data["candidates"][0]["content"]["parts"][0]["text"]

            if text_response:
                return text_response.strip()
            return None

        except Exception as err:
            logger.error(f"Gemini API transformation failed: {err}")
            return None

gemini_client = GeminiCommunicationClient()
