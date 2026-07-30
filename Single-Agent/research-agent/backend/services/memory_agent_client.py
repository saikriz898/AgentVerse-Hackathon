try:
    import httpx
except ImportError:
    httpx = None
from typing import Dict, Any
from backend.config.settings import settings
from backend.utils.logger import logger

class MemoryAgentClient:
    def __init__(self):
        self.memory_agent_url = settings.MEMORY_AGENT_URL

    async def sync_research_memory(self, payload: Dict[str, Any]) -> bool:
        """
        Sends research summary, references, confidence, keywords, topic, and timestamp
        to the LifeOS Memory Agent.
        """
        if not httpx:
            logger.info("Memory Agent client offline (httpx omitted). Local log retained.")
            return False
        try:
            memory_payload = {
                "agent": "Research",
                "request_id": payload.get("request_id"),
                "summary": payload.get("summary"),
                "references": payload.get("references"),
                "confidence": payload.get("confidence"),
                "keywords": payload.get("keywords"),
                "topic": payload.get("keywords", ["General"])[0] if payload.get("keywords") else "General",
                "timestamp": payload.get("timestamp")
            }

            logger.info(f"Syncing research data to Memory Agent at {self.memory_agent_url}...")
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(self.memory_agent_url, json=memory_payload)
                if res.status_code in [200, 201]:
                    logger.info("Successfully synced research to Memory Agent.")
                    return True
                else:
                    logger.warning(f"Memory Agent returned HTTP {res.status_code}: {res.text}")
                    return False
        except Exception as e:
            logger.info(f"Memory Agent offline or unreachable ({e}). Local log created.")
            return False
