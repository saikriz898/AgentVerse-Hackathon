import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

@pytest.mark.asyncio
async def test_auth_flow(client: AsyncClient):
    # Register
    reg_res = await client.post("/api/v1/auth/register", json={
        "email": "testreviewer@lifeos.ai",
        "password": "securepassword123",
        "full_name": "Test Reviewer"
    })
    assert reg_res.status_code == 201
    assert reg_res.json()["email"] == "testreviewer@lifeos.ai"

    # Login
    login_res = await client.post("/api/v1/auth/login", json={
        "email": "testreviewer@lifeos.ai",
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    assert token is not None

@pytest.mark.asyncio
async def test_code_review_endpoint(client: AsyncClient):
    payload = {
        "agent_name": "Execution Agent",
        "language": "python",
        "code": "def hello(): print('Hello World')"
    }
    res = await client.post("/api/v1/review/code", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "quality_score" in data
    assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_json_review_endpoint(client: AsyncClient):
    payload = {
        "agent_name": "Execution Agent",
        "json_data": {"id": 1, "name": "Task"},
        "required_keys": ["id", "name"]
    }
    res = await client.post("/api/v1/review/json", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_memory_review_endpoint(client: AsyncClient):
    payload = {
        "agent_name": "Memory Agent",
        "category": "User Preference",
        "tags": ["theme", "settings"],
        "importance_score": 0.85,
        "summary": "User prefers dark mode UI styling across dashboard"
    }
    res = await client.post("/api/v1/review/memory", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_communication_review_endpoint(client: AsyncClient):
    payload = {
        "agent_name": "Communication Agent",
        "comm_type": "email",
        "subject": "Weekly Progress Briefing",
        "content": "Subject: Weekly Progress Briefing\n\nDear Team,\nAll tasks completed.\n\nBest regards,\nLifeOS Bot"
    }
    res = await client.post("/api/v1/review/communication", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_chief_of_staff_review_endpoint(client: AsyncClient):
    payload = {
        "agent_name": "Chief of Staff",
        "task_summary": "System Optimization Directive",
        "delegated_agents": ["Execution Agent", "Planning Agent"],
        "content": "Executive Directive: High Priority optimization task assigned to Execution Agent."
    }
    res = await client.post("/api/v1/review/chief-of-staff", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "approved"

@pytest.mark.asyncio
async def test_review_history_endpoint(client: AsyncClient):
    # Run a review first
    await client.post("/api/v1/review/code", json={
        "agent_name": "Research Agent",
        "language": "python",
        "code": "print('Test Audit')"
    })

    res = await client.get("/api/v1/review/history")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert len(data["items"]) >= 1

@pytest.mark.asyncio
async def test_analytics_dashboard_endpoint(client: AsyncClient):
    res = await client.get("/api/v1/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "total_reviews" in data
    assert "avg_quality_score" in data
