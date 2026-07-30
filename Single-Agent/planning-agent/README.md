# 📅 Planning Agent — LangGraph 10-Stage Execution Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.12%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangChain](https://img.shields.io/badge/Orchestration-LangGraph-1C3C3C?logo=chainlink&logoColor=white)](https://langchain.com)
[![OpenAI / Gemini](https://img.shields.io/badge/AI_Core-OpenAI%20%7C%20Gemini-4285F4?logo=openai&logoColor=white)](https://openai.com)

> **LangGraph Project Manager & Task Breakdown Engine**  
> Converts research payloads and product specs into structured, milestone-based 10-stage execution plans, subtask dependency graphs, timelines, and risk assessments.

---

## 📋 Table of Contents
- [🌟 Role in the Single-Agent Ecosystem](#-role-in-the-single-agent-ecosystem)
- [🔄 Inter-Agent Integration Matrix](#-inter-agent-integration-matrix)
- [✨ Key Features & 10-Stage Workflow](#-key-features--10-stage-workflow)
- [🛠️ Technology Stack](#️-technology-stack)
- [🔌 REST API Endpoints Directory](#-rest-api-endpoints-directory)
- [🚀 Local Setup & Quick Start](#-local-setup--quick-start)
- [🧪 Automated Testing](#-automated-testing)

---

## 🌟 Role in the Single-Agent Ecosystem

The **Planning Agent** serves as the project manager and execution strategist of the LifeOS platform. It ingests research findings from the Research Agent or raw requirements from the user, and runs a 10-stage sequential LangGraph workflow to break complex goals down into actionable, prioritized, milestone-driven execution plans.

---

## 🔄 Inter-Agent Integration Matrix

| Agent Name | Interaction Direction | Integration Purpose & Data Stream |
| :--- | :---: | :--- |
| **🔬 Research Agent** | **Read** | Ingests verified research summaries, reference links, and technical recommendations to formulate task requirements. |
| **🧠 Memory Agent** | **Read** | Queries Memory Agent's `/api/v1/context` for historical project roadmaps and guidelines to prevent duplicate planning. |
| **💰 Finance Agent** | **Write** | Emits estimated task duration, team hours, and sprint breakdowns to Finance Agent for cost calculation. |
| **🛡️ Review Agent** | **Write** | Sends generated execution plan JSON to Review Agent for quality verification (Quality Score &ge; 80 approval gate). |
| **📧 Communication Agent** | **Write** | Sends approved plan JSON to Communication Agent to synthesize Gantt charts, sprint summaries, and status updates. |

---

## ✨ Key Features & 10-Stage Workflow

### 🔄 10-Stage Sequential LangGraph Workflow:
1. **Input Validation**: Validates incoming project scope, goals, and constraints.
2. **Project Analysis**: Analyzes technical architecture requirements and feasibility.
3. **Task Generation**: Generates high-level epic tasks.
4. **Subtask Breakdown**: Recursively breaks epics into granular subtasks.
5. **Priority Assignment**: Assigns `urgent`, `high`, `medium`, or `low` priority labels.
6. **Timeline Estimation**: Computes realistic developer-hour and week estimations.
7. **Dependency Resolution**: Maps task dependencies and critical paths.
8. **Milestone Generation**: Establishes target release milestones and deliverables.
9. **Roadmap Construction**: Assembles chronological project roadmaps.
10. **Risk & Recommendation Analysis**: Evaluates technical risks and mitigation steps.

- 📝 **Decoupled Jinja2 Prompts**: Cleanly decoupled LLM prompts (`project_analysis.jinja`, `task_generation.jinja`, `roadmap_generation.jinja`, etc.).
- 🛡️ **Pydantic Validation**: Strict typing for Project, Task, Milestone, Roadmap, and PlanningResult models.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend API** | Python 3.12+, FastAPI, Uvicorn |
| **Workflow Engine** | LangGraph, LangChain |
| **AI Integration** | OpenAI (GPT-4o) / Google Gemini 2.5 Flash |
| **Templating & Validation** | Jinja2, Pydantic v2 |
| **Testing** | Pytest, Pytest-Asyncio |

---

## 🔌 REST API Endpoints Directory

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/plan` | Execute full 10-stage LangGraph execution plan generation |
| `GET` | `/health` | Microservice health check & model readiness status |
| `GET` | `/docs` | Interactive OpenAPI / Swagger documentation |

---

## 🚀 Local Setup & Quick Start

### 1. Installation
```powershell
cd Single-Agent/planning-agent
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment (`.env`)
```env
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"
MODEL_NAME="gpt-4o"
```

### 3. Launch Server (Port 8000)
```powershell
uvicorn app.main:app --reload --port 8000
```
- **Backend API**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

## 🧪 Automated Testing

Run the pytest test suite:
```powershell
cd Single-Agent/planning-agent
python -m pytest tests/ -v
```

---

## 📄 License & Credits
- **Part of**: LifeOS Autonomous Agent Suite  
- **Repository**: [`https://github.com/saikriz898/AgentVerse-Hackathon.git`](https://github.com/saikriz898/AgentVerse-Hackathon.git)
