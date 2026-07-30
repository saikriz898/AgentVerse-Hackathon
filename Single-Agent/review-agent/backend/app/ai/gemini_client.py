import json
import re
import asyncio
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
from app.core.logger import logger
from app.ai.prompts import SYSTEM_REVIEW_PROMPT, REVIEW_USER_TEMPLATE

class GeminiReviewClient:
    """Client for Gemini 2.5 Flash AI API with fallback capabilities."""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL

    def _call_genai_sdk(self, prompt: str) -> str:
        """Synchronous genai SDK call (run in thread pool)."""
        from google import genai
        client = genai.Client(api_key=self.api_key)
        response = client.models.generate_content(
            model=self.model,
            contents=prompt
        )
        return response.text

    async def review_content(
        self,
        agent_name: str,
        review_type: str,
        content: Any,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Optional[Dict[str, Any]]:
        """Call Gemini API for AI-based quality review."""
        if not self.api_key:
            logger.info("GEMINI_API_KEY not set. Using rule-based validation engine.")
            return None

        content_str = json.dumps(content) if isinstance(content, (dict, list)) else str(content)
        metadata_str = json.dumps(metadata) if metadata else "{}"

        user_prompt = REVIEW_USER_TEMPLATE.format(
            agent_name=agent_name,
            review_type=review_type,
            content=content_str,
            metadata=metadata_str
        )
        full_prompt = f"{SYSTEM_REVIEW_PROMPT}\n\n{user_prompt}"

        try:
            text_response = None

            # First try google.genai SDK (non-blocking via thread pool)
            try:
                text_response = await asyncio.to_thread(self._call_genai_sdk, full_prompt)
            except Exception as genai_err:
                logger.warning(f"google.genai SDK call failed/unavailable ({genai_err}). Using HTTP REST API.")
                # Fallback to direct HTTP REST endpoint for Gemini API
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": full_prompt}]
                    }],
                    "generationConfig": {
                        "temperature": 0.2,
                        "responseMimeType": "application/json"
                    }
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    res = await client.post(url, json=payload)
                    res.raise_for_status()
                    data = res.json()
                    text_response = data["candidates"][0]["content"]["parts"][0]["text"]

            # Parse JSON output from Gemini response
            cleaned_text = re.sub(r'^```json\s*', '', text_response.strip(), flags=re.MULTILINE)
            cleaned_text = re.sub(r'```$', '', cleaned_text.strip(), flags=re.MULTILINE)

            parsed_result = json.loads(cleaned_text)
            return parsed_result

        except Exception as err:
            logger.error(f"Gemini API review execution failed: {err}")
            return None

gemini_client = GeminiReviewClient()

