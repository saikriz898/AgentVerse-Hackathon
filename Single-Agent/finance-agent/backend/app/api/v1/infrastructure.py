from fastapi import APIRouter, Query
from typing import Dict, Any

router = APIRouter()

@router.get("/compare")
def compare_cloud_infrastructure(
    users: int = Query(25000, ge=100),
    storage_gb: int = Query(500, ge=10),
    bandwidth_gb: int = Query(2000, ge=50),
    database_tier: str = Query("Managed PostgreSQL", examples=["Managed PostgreSQL"])
) -> Dict[str, Any]:
    # Providers: AWS, Azure, Google Cloud, DigitalOcean, Vercel, Supabase, Neon, Railway
    scale_factor = users / 10000.0

    providers = [
        {
            "provider": "AWS (Amazon Web Services)",
            "tier": "Production EKS + Aurora DB",
            "monthly_cost": round(240.0 * scale_factor + storage_gb * 0.10 + bandwidth_gb * 0.08, 2),
            "compute": f"{max(2, int(scale_factor*2))}x t4g.medium nodes",
            "storage": f"{storage_gb} GB EBS gp3",
            "database": "Aurora PostgreSQL Serverless v2",
            "cdn_bandwidth": f"{bandwidth_gb} GB CloudFront",
            "pros": ["Highest reliability", "Unlimited scaling", "Broad ecosystem"],
            "cons": ["Complex billing", "Egress network fees"]
        },
        {
            "provider": "Google Cloud Platform (GCP)",
            "tier": "GKE Autopilot + Cloud SQL",
            "monthly_cost": round(225.0 * scale_factor + storage_gb * 0.09 + bandwidth_gb * 0.075, 2),
            "compute": f"{max(2, int(scale_factor*2))}x GKE pods",
            "storage": f"{storage_gb} GB Persistent Disk",
            "database": "Cloud SQL PostgreSQL",
            "cdn_bandwidth": f"{bandwidth_gb} GB Cloud CDN",
            "pros": ["Best Kubernetes integration", "Great network backbone"],
            "cons": ["Slightly higher storage rates"]
        },
        {
            "provider": "Microsoft Azure",
            "tier": "AKS + Azure Database for Postgres",
            "monthly_cost": round(235.0 * scale_factor + storage_gb * 0.095 + bandwidth_gb * 0.082, 2),
            "compute": f"{max(2, int(scale_factor*2))}x B2ms VMs",
            "storage": f"{storage_gb} GB Azure Disk",
            "database": "Flexible Server Postgres",
            "cdn_bandwidth": f"{bandwidth_gb} GB Azure Front Door",
            "pros": ["Enterprise compliance", "Active Directory native"],
            "cons": ["Portal UI latency"]
        },
        {
            "provider": "DigitalOcean",
            "tier": "Managed Kubernetes + Managed DB",
            "monthly_cost": round(140.0 * scale_factor + storage_gb * 0.06 + bandwidth_gb * 0.01, 2),
            "compute": f"{max(2, int(scale_factor*2))}x Droplets (4GB RAM)",
            "storage": f"{storage_gb} GB Block Storage",
            "database": "Managed Postgres",
            "cdn_bandwidth": f"{bandwidth_gb} GB Spaces CDN",
            "pros": ["Predictable pricing", "Zero bandwidth surprise", "Simple UX"],
            "cons": ["Fewer specialized serverless APIs"]
        },
        {
            "provider": "Vercel + Supabase Stack",
            "tier": "Enterprise Pro Plan + Supabase Pro",
            "monthly_cost": round(120.0 * scale_factor + storage_gb * 0.05 + bandwidth_gb * 0.04, 2),
            "compute": "Vercel Edge Functions (Serverless)",
            "storage": "Supabase Storage",
            "database": "Supabase Dedicated Postgres (pgvector)",
            "cdn_bandwidth": "Vercel Edge Network",
            "pros": ["Instant developer velocity", "Built-in Auth & Vector search"],
            "cons": ["Execution timeout limits"]
        },
        {
            "provider": "Neon + Railway Modern Stack",
            "tier": "Serverless Postgres + Container App",
            "monthly_cost": round(110.0 * scale_factor + storage_gb * 0.045 + bandwidth_gb * 0.035, 2),
            "compute": "Railway Auto-scale Containers",
            "storage": "Neon Serverless Storage",
            "database": "Neon Branchable Postgres",
            "cdn_bandwidth": "Cloudflare Tunnel / CDN",
            "pros": ["Auto-suspend inactive DBs", "Instant branching"],
            "cons": ["Cold start latencies on zero-scale"]
        }
    ]

    best_value = min(providers, key=lambda x: x["monthly_cost"])

    return {
        "user_params": {
            "users": users,
            "storage_gb": storage_gb,
            "bandwidth_gb": bandwidth_gb,
            "database_tier": database_tier
        },
        "providers": providers,
        "recommended_provider": best_value["provider"],
        "estimated_savings_vs_aws": round(providers[0]["monthly_cost"] - best_value["monthly_cost"], 2)
    }
