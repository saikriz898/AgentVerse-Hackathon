from typing import List, Dict, Any
from urllib.parse import urlparse
from backend.schemas.research import ReferenceSchema

class CitationGenerator:
    @staticmethod
    def generate_references(sources: List[Dict[str, Any]]) -> List[ReferenceSchema]:
        references = []
        seen_urls = set()

        for src in sources:
            url = src.get("url", "")
            if not url or url in seen_urls:
                continue
            seen_urls.add(url)

            domain = urlparse(url).netloc.replace("www.", "")
            website_name = src.get("website_name") or domain.capitalize()
            title = src.get("title") or f"Article on {website_name}"
            published_date = src.get("published_date") or "2026"
            author = src.get("author") or "N/A"
            credibility_score = src.get("credibility_score", 0.85)

            ref = ReferenceSchema(
                website_name=website_name,
                article_title=title,
                url=url,
                published_date=published_date,
                author=author,
                credibility_score=credibility_score
            )
            references.append(ref)

        return references
