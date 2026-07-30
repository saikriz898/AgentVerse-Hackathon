import pytest
from backend.services.research_engine.search.fallback_search import FallbackSearchClient
from backend.services.research_engine.search.multi_source_search import MultiSourceSearcher

@pytest.mark.asyncio
async def test_fallback_search():
    client = FallbackSearchClient()
    results = await client.search("FastAPI Python performance", max_results=3)
    assert isinstance(results, list)
    assert len(results) > 0
    assert "title" in results[0]
    assert "url" in results[0]

@pytest.mark.asyncio
async def test_multi_source_searcher():
    searcher = MultiSourceSearcher()
    results = await searcher.execute_multi_search(["Multi Agent AI Research"], max_results_per_query=3)
    assert isinstance(results, list)
    assert len(results) > 0
