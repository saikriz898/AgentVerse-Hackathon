try:
    import httpx
except ImportError:
    httpx = None
import asyncio
from typing import Optional, Dict, Any
from backend.services.research_engine.scrapers.article_extractor import ArticleExtractor
from backend.config.settings import settings
from backend.utils.logger import logger

class WebScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LifeOS/1.0"
        }

    async def fetch_and_parse(self, url: str) -> Optional[Dict[str, Any]]:
        # Skip internal synthetic fallback domains that don't exist on public web
        if not url or "lifeos.ai" in url or "direct-input.local" in url or "example.com" in url:
            return None

        # 1. Fast async HTTP fetch via httpx (max 3.0s timeout to keep execution snappy)
        if httpx:
            try:
                async with httpx.AsyncClient(timeout=3.0, follow_redirects=True) as client:
                    response = await client.get(url, headers=self.headers)
                    if response.status_code == 200 and len(response.text) > 200:
                        parsed = ArticleExtractor.extract_clean_article(response.text, url)
                        if parsed and len(parsed.get("content", "")) > 100:
                            return parsed
            except Exception:
                pass

        return None

    async def batch_fetch(self, urls: list[str]) -> list[Dict[str, Any]]:
        tasks = [self.fetch_and_parse(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        valid_articles = [r for r in results if isinstance(r, dict) and r is not None]
        return valid_articles
