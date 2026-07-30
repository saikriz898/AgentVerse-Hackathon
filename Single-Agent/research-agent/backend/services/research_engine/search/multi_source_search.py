import asyncio
from typing import List, Dict, Any
from backend.services.research_engine.search.tavily_search import TavilySearchClient
from backend.services.research_engine.search.fallback_search import FallbackSearchClient
from backend.utils.logger import logger

class MultiSourceSearcher:
    def __init__(self):
        self.tavily = TavilySearchClient()
        self.fallback = FallbackSearchClient()

    async def execute_multi_search(
        self,
        queries: List[str],
        sources: List[str] = None,
        max_results_per_query: int = 4
    ) -> List[Dict[str, Any]]:
        if not queries:
            return []

        all_sources = []
        seen_urls = set()

        for q in queries:
            # 1. Execute Tavily Search
            tavily_results = await self.tavily.search(q, max_results=max_results_per_query)
            
            # 2. Fallback to HTTP search if Tavily returns no results
            if not tavily_results:
                logger.info(f"Tavily returned 0 results for '{q}'. Executing fallback search engine.")
                tavily_results = await self.fallback.search(q, max_results=max_results_per_query)

            for res in tavily_results:
                url = res.get("url", "")
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    all_sources.append(res)

        logger.info(f"MultiSourceSearcher retrieved {len(all_sources)} unique sources across {len(queries)} queries.")
        return all_sources
