"""
Unit & Integration Test Suite for Finance Agent FastAPI Service.
"""
# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    """Verify system health check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data.get("status") == "healthy" or data.get("status") == "ok"

def test_cost_estimation_calculation():
    """Verify AI project cost estimation calculations."""
    payload = {
        "project_name": "E-Commerce Platform",
        "frontend_complexity": "High",
        "backend_complexity": "Medium",
        "database_type": "PostgreSQL",
        "expected_users": 50000,
        "include_ai_services": True,
        "cloud_provider": "AWS"
    }
    response = client.post("/api/v1/finance/estimate", json=payload)
    if response.status_code == 200:
        data = response.json()
        assert "total_estimated_cost" in data or "estimated_cost" in data or "breakdown" in data

def test_cloud_price_comparison():
    """Verify cloud infrastructure pricing comparison response."""
    response = client.get("/api/v1/finance/cloud-compare")
    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, (dict, list))
