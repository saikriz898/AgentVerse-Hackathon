import asyncio
from typing import List, Dict, Any, Optional
from backend.config.settings import settings
from backend.utils.logger import logger

class TavilySearchClient:
    def __init__(self):
        self.api_key = settings.TAVILY_API_KEY
        self.client = None
        if self.api_key:
            try:
                from tavily import TavilyClient
                self.client = TavilyClient(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize TavilyClient SDK: {e}")

    async def search(self, query: str, max_results: int = 6) -> List[Dict[str, Any]]:
        if not self.client:
            logger.info("Tavily API key not provided or SDK unavailable. Triggering search fallback.")
            return []

        retries = settings.TAVILY_MAX_RETRIES
        for attempt in range(1, retries + 1):
            try:
                logger.info(f"Executing Tavily search for query: '{query}' (Attempt {attempt}/{retries})")
                # Run sync tavily client in thread pool to prevent blocking async loop
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: self.client.search(
                        query=query,
                        search_depth="advanced",
                        max_results=max_results,
                        include_raw_content=False
                    )
                )
                
                raw_results = response.get("results", [])
                formatted = []
                for r in raw_results:
                    formatted.append({
                        "title": r.get("title", "Untitled Article"),
                        "website_name": r.get("url", "").split("/")[2].replace("www.", "") if "://" in r.get("url", "") else "Web",
                        "url": r.get("url", ""),
                        "content_snippet": r.get("content", ""),
                        "published_date": r.get("published_date", "2026"),
                        "author": "N/A",
                        "credibility_score": float(r.get("score", 0.85))
                    })
                return formatted

            except Exception as e:
                logger.warning(f"Tavily search attempt {attempt} failed: {e}")
                if attempt < retries:
                    await asyncio.sleep(1.0 * attempt)
                else:
                    logger.error(f"Tavily search failed after {retries} retries.")
                    return []
        return []
