import pytest
from backend.services.research_engine.search.tavily_search import TavilySearchClient

@pytest.mark.asyncio
async def test_tavily_search_resilience():
    client = TavilySearchClient()
    # Even if API key is omitted, it should return a clean list without throwing an uncaught exception
    results = await client.search("PostgreSQL UUID performance", max_results=2)
    assert isinstance(results, list)
