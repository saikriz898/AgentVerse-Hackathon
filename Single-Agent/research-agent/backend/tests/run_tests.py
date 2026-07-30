import sys
import os
import asyncio

# Ensure parent path is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.authentication.security import get_password_hash, verify_password
from backend.authentication.jwt_handler import create_access_token, decode_access_token
from backend.services.research_engine.search.fallback_search import FallbackSearchClient
from backend.services.research_engine.search.multi_source_search import MultiSourceSearcher
from backend.services.research_engine.summarizer.gemini_summarizer import GeminiSummarizer
from backend.services.research_engine.search.tavily_search import TavilySearchClient
from backend.services.research_engine.fact_checker.fact_checker import FactChecker
from backend.utils.confidence import calculate_confidence_score

async def run_all_checks():
    print("=== Starting LifeOS Research Agent Self-Verification ===")
    
    # 1. Auth & Security
    raw = "LifeOS2026_Secure!"
    hashed = get_password_hash(raw)
    assert verify_password(raw, hashed) is True
    print("[OK] Auth Password Hashing OK")

    token = create_access_token({"sub": "12345678-1234-1234-1234-1234567890ab", "email": "test@lifeos.ai"})
    decoded = decode_access_token(token)
    assert decoded["email"] == "test@lifeos.ai"
    print("[OK] JWT Token Generation & Verification OK")

    # 2. Confidence Score
    sources = [
        {"url": "https://docs.lifeos.ai/spec", "credibility_score": 0.95},
        {"url": "https://github.com/lifeos-ai/research", "credibility_score": 0.90}
    ]
    conf = calculate_confidence_score(sources, contradictions_found=0, has_official_docs=True, is_multi_source=True)
    assert 80 <= conf <= 100
    print(f"[OK] Confidence Score Algorithm OK (Score: {conf}%)")

    # 3. Fallback Web Search
    fallback_client = FallbackSearchClient()
    results = await fallback_client.search("FastAPI Python performance", max_results=3)
    assert len(results) > 0
    print(f"[OK] Fallback Search Engine OK ({len(results)} sources returned)")

    # 4. Multi-Source Searcher
    multi_searcher = MultiSourceSearcher()
    multi_res = await multi_searcher.execute_multi_search(["Multi Agent Systems"], max_results_per_query=2)
    assert len(multi_res) > 0
    print(f"[OK] MultiSourceSearcher Router OK ({len(multi_res)} total sources)")

    # 5. Gemini Summarizer (Heuristic & AI)
    summarizer = GeminiSummarizer()
    queries = await summarizer.generate_search_queries("RAG Benchmarks")
    assert len(queries) >= 1
    print(f"[OK] Gemini Query Planner OK (Generated queries: {queries})")

    summary, exec_summary, keywords, recs = await summarizer.synthesize_research("RAG Benchmarks", multi_res)
    assert len(summary) > 0 and len(keywords) > 0
    print("[OK] Gemini Synthesizer & Recommendation Engine OK")

    # 6. Fact Checker
    fact_res = FactChecker.verify_facts("Multi Agent Systems", multi_res)
    assert fact_res["verified"] is True
    print(f"[OK] FactChecker Verification OK ({fact_res['matching_source_count']} matching sources)")

    print("\n=== ALL RESEARCH AGENT BACKEND VERIFICATION CHECKS PASSED ===")

if __name__ == "__main__":
    asyncio.run(run_all_checks())
