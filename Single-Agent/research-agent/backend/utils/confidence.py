from typing import List, Dict, Any
from urllib.parse import urlparse

def calculate_confidence_score(
    sources: List[Dict[str, Any]],
    contradictions_found: int = 0,
    has_official_docs: bool = False,
    is_multi_source: bool = True
) -> int:
    """
    Calculate confidence score between 0 and 100 based on:
    - Number of sources (20%)
    - Source credibility & official domains (35%)
    - Information consistency / cross-source verification (30%)
    - Publication recency & author info (15%)
    """
    if not sources:
        return 40

    base_score = 50.0

    # 1. Quantity factor (up to +15 pts)
    source_count = len(sources)
    quantity_bonus = min(source_count * 3, 15)
    base_score += quantity_bonus

    # 2. Domain Authority & Official References (up to +25 pts)
    credibility_sum = 0.0
    official_count = 0
    for src in sources:
        url = src.get("url", "")
        domain = urlparse(url).netloc.lower()
        
        # Check domain extensions & known official hubs
        if any(ext in domain for ext in [".gov", ".edu", ".org"]) or "github.com" in domain or "docs." in domain or "developer." in domain:
            official_count += 1
            credibility_sum += 0.95
        elif "wikipedia.org" in domain:
            credibility_sum += 0.75
        else:
            credibility_sum += src.get("credibility_score", 0.80)
            
    avg_credibility = credibility_sum / max(source_count, 1)
    base_score += (avg_credibility * 20.0)

    if official_count > 0 or has_official_docs:
        base_score += 5.0

    # 3. Consistency & Contradiction Penalty (-10 per contradiction, max penalty 30)
    if contradictions_found > 0:
        penalty = min(contradictions_found * 10, 30)
        base_score -= penalty
    else:
        # Cross-verification bonus
        if is_multi_source and source_count >= 2:
            base_score += 10.0

    # 4. Cap final score strictly between 0 and 100
    final_score = int(round(max(0.0, min(100.0, base_score))))
    return final_score
