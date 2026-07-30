import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["agent"] == "LifeOS Research Agent"

def test_inter_agent_query_endpoint():
    payload = {
        "sender_agent": "ChiefOfStaff",
        "target_agent": "Research",
        "action": "search",
        "payload": {
            "objective": "Test inter-agent protocol communication"
        }
    }
    response = client.post("/api/agent/interop/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["agent"] == "Research"
    assert "confidence" in data
    assert "summary" in data
