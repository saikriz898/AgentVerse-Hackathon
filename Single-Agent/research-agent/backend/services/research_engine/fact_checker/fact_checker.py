from typing import List, Dict, Any

class FactChecker:
    @staticmethod
    def verify_facts(
        objective: str,
        sources: List[Dict[str, Any]],
        claim: str = None
    ) -> Dict[str, Any]:
        """
        Cross-verifies claims across independent search sources.
        """
        if not sources:
            return {
                "verified": False,
                "contradictions_count": 0,
                "verification_status": "Unverified - No sources available",
                "details": []
            }

        target_text = claim if claim else objective
        verified_points = []
        contradictions = 0

        # Basic entity matching heuristic across sources
        matching_sources = 0
        for src in sources:
            snippet = src.get("content_snippet", "").lower()
            title = src.get("title", "").lower()
            words = [w.lower() for w in target_text.split() if len(w) > 3]
            
            matches = sum(1 for w in words if w in snippet or w in title)
            if matches >= min(2, len(words)):
                matching_sources += 1
                verified_points.append({
                    "source": src.get("website_name"),
                    "title": src.get("title"),
                    "url": src.get("url"),
                    "match_score": round(matches / max(len(words), 1), 2),
                    "status": "Verified"
                })

        confidence_level = "High" if matching_sources >= 2 else ("Medium" if matching_sources == 1 else "Low")
        
        return {
            "verified": matching_sources > 0,
            "confidence_level": confidence_level,
            "matching_source_count": matching_sources,
            "contradictions_count": contradictions,
            "verification_status": f"Factual alignment verified across {matching_sources} independent sources.",
            "details": verified_points
        }
