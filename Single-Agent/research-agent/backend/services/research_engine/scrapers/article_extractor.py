import re
from typing import Dict, Any, Optional
from urllib.parse import urlparse

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

class ArticleExtractor:
    @staticmethod
    def extract_clean_article(html_content: str, url: str) -> Dict[str, Any]:
        soup = BeautifulSoup(html_content, "lxml" if "lxml" in str(BeautifulSoup) else "html.parser")

        # Remove scripts, styles, navs, footers, header elements
        for element in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
            element.decompose()

        # Title
        title = ""
        if soup.title and soup.title.string:
            title = soup.title.string.strip()
        elif soup.find("h1"):
            title = soup.find("h1").get_text(strip=True)

        domain = urlparse(url).netloc.replace("www.", "")
        if not title:
            title = f"Document from {domain}"

        # Text extraction
        paragraphs = [p.get_text(strip=True) for p in soup.find_all(["p", "article", "section"])]
        full_text = " ".join([p for p in paragraphs if len(p) > 25])

        if len(full_text) < 100:
            full_text = soup.get_text(separator=" ", strip=True)

        # Truncate text if excessively long (e.g. max 5000 chars per article)
        clean_text = re.sub(r'\s+', ' ', full_text)[:5000]

        # Author & Date heuristic extraction
        author = "N/A"
        author_meta = soup.find("meta", attrs={"name": re.compile(r'author', re.I)})
        if author_meta and author_meta.get("content"):
            author = author_meta["content"]

        date_published = "N/A"
        date_meta = (
            soup.find("meta", attrs={"property": re.compile(r'published_time|date', re.I)}) or
            soup.find("meta", attrs={"name": re.compile(r'date|created', re.I)})
        )
        if date_meta and date_meta.get("content"):
            date_published = date_meta["content"][:10]

        # Credibility scoring by domain authority
        credibility = 0.80
        if any(ext in domain for ext in [".gov", ".edu", ".org"]):
            credibility = 0.95
        elif "github.com" in domain or "docs." in domain:
            credibility = 0.90
        elif "wikipedia.org" in domain:
            credibility = 0.75

        return {
            "title": title,
            "website_name": domain.capitalize(),
            "url": url,
            "content": clean_text,
            "author": author,
            "published_date": date_published,
            "credibility_score": credibility
        }
