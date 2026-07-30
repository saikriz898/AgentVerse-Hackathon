"""Unit tests for FastAPI endpoints (/health and /plan)."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Test GET /health endpoint returns HTTP 200 OK and valid health payload."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AI Planning Agent"
    assert "model" in data


def test_plan_endpoint_success():
    """Test POST /plan endpoint returns valid planning report matching exact schema."""
    payload = {
        "project_name": "Autonomous Drone Navigation",
        "objective": "Build path planning algorithm for real-time obstacle avoidance.",
        "research_summary": "Drone fleet requires low-latency path planning using visual SLAM.",
        "features": ["Obstacle avoidance", "Path planning", "Real-time telemetry"],
        "constraints": ["Latency under 20ms", "Embedded Linux deployment"],
    }
    response = client.post("/plan", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "project_summary" in data
    assert len(data["project_summary"]) > 0
    assert "tasks" in data
    assert isinstance(data["tasks"], list)
    assert len(data["tasks"]) > 0

    first_task = data["tasks"][0]
    assert "id" in first_task
    assert "title" in first_task
    assert "priority" in first_task
    assert "estimated_time" in first_task
    assert "subtasks" in first_task
    assert "dependencies" in first_task

    assert "milestones" in data
    assert "roadmap" in data
    assert "risks" in data
    assert "recommendations" in data


def test_plan_endpoint_invalid_input():
    """Test POST /plan endpoint validation failure for empty fields."""
    payload = {
        "project_name": "",  # Invalid short string
        "objective": "Short",
        "research_summary": "Too short",
        "features": [],
        "constraints": [],
    }
    response = client.post("/plan", json=payload)
    assert response.status_code == 422  # Pydantic validation error
