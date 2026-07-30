# AI Planning Agent

A production-ready microservice built using Python 3.12+, FastAPI, LangGraph, LangChain, and OpenAI. The Planning Agent receives structured research output from a Research Agent and converts it into a detailed project execution plan like an experienced project manager.

## Features

- **Sequential LangGraph Workflow**: Input Validation → Project Analysis → Task Generation → Subtask Breakdown → Priority Assignment → Timeline Estimation → Dependency Resolution → Milestone Generation → Roadmap Construction → Risk Analysis → Strategic Recommendations → Final Structured JSON output.
- **Dynamic Jinja2 Prompts**: Cleanly decoupled LLM prompts using Jinja2 template rendering.
- **FastAPI Endpoints**: High-performance RESTful API supporting structured request/response schemas with interactive OpenAPI documentation.
- **Rich Logging & Diagnostics**: Comprehensive logging covering requests, LLM execution duration, state progression, and errors.
- **Clean Architecture & SOLID**: Fully decoupled service layers, typed Pydantic models, and unit tests using Pytest.

## Project Structure

```
planning-agent/
│
├── app/
│   ├── api/
│   │   ├── routes.py
│   │   ├── request_models.py
│   │   └── response_models.py
│   │
│   ├── agents/
│   │   ├── planning_agent.py
│   │   ├── workflow.py
│   │   ├── prompts.py
│   │   └── state.py
│   │
│   ├── services/
│   │   ├── planner.py
│   │   ├── task_generator.py
│   │   ├── priority_engine.py
│   │   ├── dependency_manager.py
│   │   ├── timeline_generator.py
│   │   ├── milestone_generator.py
│   │   ├── roadmap_builder.py
│   │   ├── risk_analyzer.py
│   │   └── recommendation_engine.py
│   │
│   ├── prompts/
│   │   ├── project_analysis.jinja
│   │   ├── task_generation.jinja
│   │   ├── priority_assignment.jinja
│   │   ├── timeline_estimation.jinja
│   │   ├── dependency_detection.jinja
│   │   ├── milestone_generation.jinja
│   │   ├── roadmap_generation.jinja
│   │   ├── risk_analysis.jinja
│   │   └── final_report.jinja
│   │
│   ├── models/
│   │   ├── project.py
│   │   ├── task.py
│   │   ├── milestone.py
│   │   ├── roadmap.py
│   │   └── planning_result.py
│   │
│   ├── utils/
│   │   ├── parser.py
│   │   ├── formatter.py
│   │   ├── validator.py
│   │   ├── helpers.py
│   │   └── logger.py
│   │
│   ├── config/
│   │   ├── settings.py
│   │   └── prompts.yaml
│   │
│   ├── main.py
│   └── __init__.py
│
├── tests/
│   ├── test_api.py
│   ├── test_agent.py
│   ├── test_services.py
│   └── test_workflow.py
│
├── .env.example
├── requirements.txt
├── pyproject.toml
├── README.md
└── .gitignore
```

## Quick Start

### 1. Installation

```bash
cd planning-agent
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and set your `OPENAI_API_KEY`:

```bash
cp .env.example .env
```

### 3. Run Application

```bash
uvicorn app.main:app --reload
```

The server will start on `http://127.0.0.1:8000`.

- **Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Health Check**: `GET http://127.0.0.1:8000/health`
- **Generate Plan**: `POST http://127.0.0.1:8000/plan`

### 4. Sample Request (`POST /plan`)

```json
{
  "project_name": "E-Commerce Recommendation System",
  "objective": "Build a scalable, real-time product recommendation microservice using hybrid collaborative filtering.",
  "research_summary": "High traffic e-commerce store needs dynamic product recommendations with latency under 50ms.",
  "features": [
    "User behavior tracking",
    "Hybrid recommendation engine",
    "RESTful API endpoint",
    "Real-time feature store cache"
  ],
  "constraints": [
    "Must run on AWS ECS",
    "Max response latency: 50ms",
    "Must handle 10,000 requests/sec"
  ]
}
```

### 5. Running Tests

```bash
pytest tests/ -v
```
