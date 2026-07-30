import time
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from backend.schemas.research import ResearchStartRequest, LifeOSResearchResponse
from backend.services.research_engine.summarizer.gemini_summarizer import GeminiSummarizer
from backend.services.research_engine.search.multi_source_search import MultiSourceSearcher
from backend.services.research_engine.scrapers.web_scraper import WebScraper
from backend.services.research_engine.fact_checker.fact_checker import FactChecker
from backend.services.research_engine.citation_generator.citation_generator import CitationGenerator
from backend.utils.confidence import calculate_confidence_score
from backend.services.memory_agent_client import MemoryAgentClient
from backend.models.research import ResearchRequest, ResearchResult, ResearchSource, AgentLog
from backend.utils.logger import logger

class ResearchEngine:
    def __init__(self):
        self.gemini = GeminiSummarizer()
        self.searcher = MultiSourceSearcher()
        self.scraper = WebScraper()
        self.fact_checker = FactChecker()
        self.citation_gen = CitationGenerator()
        self.memory_client = MemoryAgentClient()

    async def execute_research(
        self,
        request_data: ResearchStartRequest,
        db: AsyncSession,
        user_id: Optional[str] = None
    ) -> LifeOSResearchResponse:
        start_time = time.time()
        request_id = str(uuid.uuid4())
        timestamp_str = datetime.now(timezone.utc).isoformat()
        objective = request_data.objective

        logger.info(f"Starting research execution [ID: {request_id}] for objective: '{objective}'")

        # 1. Query generation via Gemini
        search_queries = await self.gemini.generate_search_queries(objective)
        logger.info(f"Generated search queries: {search_queries}")

        # 2. Multi-source search across web, docs, github, papers
        raw_sources = await self.searcher.execute_multi_search(
            queries=search_queries,
            max_results_per_query=request_data.max_results or 4
        )

        # 3. Read & parse top source articles if necessary
        scraped_content = []
        if raw_sources:
            urls_to_scrape = [s.get("url") for s in raw_sources[:4] if s.get("url") and "http" in s.get("url")]
            if urls_to_scrape:
                scraped_content = await self.scraper.batch_fetch(urls_to_scrape)

        # Merge scraped details back into sources if title/snippet enriched
        combined_sources = raw_sources
        for scraped in scraped_content:
            for s in combined_sources:
                if s.get("url") == scraped.get("url"):
                    if scraped.get("content"):
                        s["content_snippet"] = scraped["content"][:1200]
                    if scraped.get("title"):
                        s["title"] = scraped["title"]

        # 4. Fact checking & contradiction verification
        fact_check_res = self.fact_checker.verify_facts(objective, combined_sources)

        # 5. Summarize findings using Gemini
        summary, exec_summary, keywords, recommendations = await self.gemini.synthesize_research(
            objective, combined_sources
        )

        # 6. Citation generation & References
        references = self.citation_gen.generate_references(combined_sources)

        # 7. Confidence Score calculation (0 - 100%)
        has_official = any(".gov" in s.get("url", "") or "github.com" in s.get("url", "") or "docs." in s.get("url", "") for s in combined_sources)
        confidence_score = calculate_confidence_score(
            sources=combined_sources,
            contradictions_found=fact_check_res.get("contradictions_count", 0),
            has_official_docs=has_official,
            is_multi_source=len(combined_sources) > 1
        )

        elapsed_seconds = time.time() - start_time
        execution_time_str = f"{elapsed_seconds:.2f}s"
        execution_time_ms = int(elapsed_seconds * 1000)

        # 8. Persist to Database if DB session available
        try:
            if db and hasattr(db, "add") and hasattr(ResearchRequest, "__tablename__") and ResearchRequest.__tablename__:
                req_db = ResearchRequest(
                    id=uuid.UUID(request_id),
                    user_id=uuid.UUID(user_id) if user_id else None,
                    objective=objective,
                    filters=request_data.filters.model_dump() if request_data.filters else {},
                    status="completed",
                    execution_time_ms=execution_time_ms
                )
                db.add(req_db)

                res_db = ResearchResult(
                    id=uuid.uuid4(),
                    request_id=uuid.UUID(request_id),
                    confidence_score=confidence_score,
                    summary=summary,
                    executive_summary=exec_summary,
                    keywords=keywords,
                    recommendations=recommendations,
                    status="success"
                )
                db.add(res_db)
                await db.flush()

                for ref in references:
                    src_db = ResearchSource(
                        id=uuid.uuid4(),
                        result_id=res_db.id,
                        title=ref.article_title,
                        website_name=ref.website_name,
                        url=ref.url,
                        published_date=ref.published_date,
                        author=ref.author,
                        credibility_score=ref.credibility_score
                    )
                    db.add(src_db)

                log_db = AgentLog(
                    id=uuid.uuid4(),
                    request_id=uuid.UUID(request_id),
                    agent_name="Research",
                    log_level="INFO",
                    message=f"Completed research for '{objective}' with confidence {confidence_score}% in {execution_time_str}.",
                    metadata_json={"source_count": len(combined_sources), "confidence": confidence_score}
                )
                db.add(log_db)

                await db.commit()
        except Exception as e:
            logger.warning(f"Database save bypassed or failed: {e}")

        response_payload = LifeOSResearchResponse(
            status="success",
            agent="Research",
            request_id=request_id,
            timestamp=timestamp_str,
            confidence=confidence_score,
            summary=summary,
            executive_summary=exec_summary,
            keywords=keywords,
            references=references,
            recommendations=recommendations,
            execution_time=execution_time_str,
            fact_check_details=fact_check_res
        )

        # 9. Async sync to Memory Agent
        try:
            await self.memory_client.sync_research_memory(response_payload.model_dump())
        except Exception as mem_err:
            logger.info(f"Memory Agent sync notice: {mem_err}")

        return response_payload
