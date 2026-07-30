from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/summary")
def get_analytics_summary() -> Dict[str, Any]:
    return {
        "top_cost_categories": [
            {"category": "Engineering & Development", "amount": 164000.0, "percentage": 52.4, "trend": "+4.2%"},
            {"category": "Cloud Infrastructure & DB", "amount": 62400.0, "percentage": 19.9, "trend": "-1.8%"},
            {"category": "AI LLM Token Consumption", "amount": 42000.0, "percentage": 13.4, "trend": "+12.5%"},
            {"category": "DevOps & Security Audits", "amount": 28000.0, "percentage": 8.9, "trend": "0.0%"},
            {"category": "QA & Automated Testing", "amount": 16600.0, "percentage": 5.4, "trend": "-2.1%"}
        ],
        "quarterly_comparison": [
            {"quarter": "Q1 2026", "dev_cost": 42000.0, "infra_cost": 14200.0, "ai_cost": 8500.0, "total": 64700.0},
            {"quarter": "Q2 2026", "dev_cost": 46000.0, "infra_cost": 15800.0, "ai_cost": 10200.0, "total": 72000.0},
            {"quarter": "Q3 2026", "dev_cost": 38000.0, "infra_cost": 16100.0, "ai_cost": 11800.0, "total": 65900.0},
            {"quarter": "Q4 2026 (Est)", "dev_cost": 38000.0, "infra_cost": 16300.0, "ai_cost": 11500.0, "total": 65800.0}
        ],
        "resource_utilization": {
            "cpu_compute_utilization": "68%",
            "memory_utilization": "74%",
            "database_storage_used": "320 GB / 1000 GB",
            "ai_token_quota_used": "68.4 M / 100 M Tokens",
            "active_microservices": 14
        }
    }
