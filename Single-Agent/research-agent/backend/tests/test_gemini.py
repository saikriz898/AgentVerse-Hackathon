import pytest
from backend.services.research_engine.summarizer.gemini_summarizer import GeminiSummarizer

@pytest.mark.asyncio
async def test_gemini_query_expansion():
    summarizer = GeminiSummarizer()
    queries = await summarizer.generate_search_queries("Build a RAG system with Gemini 2.5 Flash")
    assert isinstance(queries, list)
    assert len(queries) >= 1

@pytest.mark.asyncio
async def test_gemini_synthesis():
    summarizer = GeminiSummarizer()
    dummy_sources = [{
        "title": "Gemini 2.5 Flash Overview",
        "website_name": "Google Developer Docs",
        "url": "https://ai.google.dev",
        "content_snippet": "Gemini 2.5 Flash is optimized for high-speed multi-modal reasoning and lower latency agent execution."
    }]
    summary, exec_summary, keywords, recs = await summarizer.synthesize_research(
        "Evaluate Gemini 2.5 Flash performance", dummy_sources
    )
    assert len(summary) > 0
    assert len(exec_summary) > 0
    assert isinstance(keywords, list)
    assert isinstance(recs, list)
