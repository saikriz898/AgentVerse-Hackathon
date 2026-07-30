import sys
import os
import time
import pytest

# Ensure backend root is on pythonpath
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "online"]
    assert "mode" in data

def test_auth_registration_and_login(client):
    username = f"test_user_{int(time.time())}"
    # 1. Register User
    reg_payload = {
        "username": username,
        "email": f"{username}@lifeos.ai",
        "password": "SecretPassword123!",
        "role": "user"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 200
    assert reg_res.json()["username"] == username

    # 2. Login User
    login_payload = {
        "username": username,
        "password": "SecretPassword123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    tokens = login_res.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens

def test_all_communication_specific_endpoints(client):
    endpoints = [
        "/summary",
        "/report",
        "/email",
        "/markdown",
        "/html",
        "/meeting-notes",
        "/status",
        "/release-notes",
        "/documentation"
    ]
    
    payload = {
        "agent": "Planning Agent",
        "output_destination": "Stakeholders",
        "tone": "Business",
        "payload": {
            "title": "Subsystem Integration Milestone",
            "milestone": "Memory & Review Integration",
            "status": "completed"
        }
    }

    for endpoint in endpoints:
        res = client.post(f"/api/v1/communication{endpoint}", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "success"
        assert "content" in data
        assert "formatted_views" in data
