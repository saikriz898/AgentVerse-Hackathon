# 🤖 AgentVerse Hackathon - LifeOS Ecosystem

> **Official Hackathon Submission Repository**  
> Comprehensive implementation featuring both **Single-Agent** microservices and **Multi-Agent** collaborative orchestration patterns for the **LifeOS AI Ecosystem**.

---

## 📢 Submission Structure & Compliance

Per the **AgentVerse Hackathon** guidelines, this repository contains both **Single-Agent** and **Multi-Agent** implementations:

```
📁 AgentVerse-Hackathon/
├── 📁 Single-Agent/             <-- Single-Agent Implementations & Suite Documentation
│   ├── 📁 comunication-agent/   (Presentation & Format Synthesis Agent)
│   ├── 📁 finance-agent/        (Financial Cost & Cloud Estimator Agent)
│   ├── 📁 Memory-Agent/         (Central Vector Memory & Graph Topology Agent)
│   ├── 📁 planning-agent/       (LangGraph Sequential Project Planning Agent)
│   ├── 📁 research-agent/       (Multi-Source Deep Web Research Specialist)
│   ├── 📁 review-agent/         (Automated Quality Assurance & Security Gatekeeper)
│   └── 📄 README.md             (Master Single-Agent Architecture README)
│
├── 📁 Multi-Agent/              <-- Multi-Agent Orchestrations & Collaborative Fleets
│   └── 📄 .gitkeep              (Placeholder ready for Multi-Agent Fleet code)
│
├── 📄 .gitignore
└── 📄 README.md                 (Root Hackathon Submission README)
```

---

## ⚖️ Single-Agent vs. Multi-Agent Architectural Comparison

| Dimension | Single-Agent Architecture (`/Single-Agent`) | Multi-Agent Architecture (`/Multi-Agent`) |
| :--- | :--- | :--- |
| **Execution Pattern** | **Isolated Processing**: One specialized agent executes a single end-to-end task. | **Collaborative Fleets**: Multiple agents interact, exchange JSON payloads, and negotiate steps. |
| **Scope & Focus** | Dedicated microservice with strict domain boundary (e.g., QA Review or Research). | Orchestrated workflow driven by a Chief of Staff agent. |
| **State Management** | State managed within single request payload lifecycle or local SQLite/DB. | Centralized shared memory stream & graph topology via **Memory Agent**. |
| **Verification Gate** | Deterministic rule check or single pass review. | Automated QA scoring gate (Score &ge; 80 approval requirement via **Review Agent**). |
| **Resilience & Fallback** | 100% offline fallback rule engine when LLM APIs are unreachable. | Dynamic subagent fallback & rerouting upon execution error. |
| **Best Used For** | Microservice deployment, API integration, lightweight containerized run. | Complex multi-stage software engineering, research-to-code pipelines, executive workflows. |

---

## 📦 Single-Agent Suite Catalog

The [`/Single-Agent`](file:///d:/Agentic%20AI/Single-Agent) directory contains 6 production-grade AI microservices:

1. 📧 **[Communication Agent](file:///d:/Agentic%20AI/Single-Agent/comunication-agent)**: Presentation layer converting technical JSON into 19 output types (Executive Summaries, Slide Presentations, Standups, API Docs, Release Notes) tailored for 9 audience profiles.
2. 💰 **[Finance Agent](file:///d:/Agentic%20AI/Single-Agent/finance-agent)**: Software project cost estimator analyzing 20+ cost parameters, budget planning, 9 cloud provider price comparisons (AWS, Azure, GCP, DigitalOcean, Vercel, Supabase, Neon, Railway, Cloudflare), and ROI break-even analytics.
3. 🧠 **[Memory Agent](file:///d:/Agentic%20AI/Single-Agent/Memory-Agent)**: Central persistent memory engine featuring Reciprocal Rank Fusion (768-dim `text-embedding-004` + BM25) and a 4-directional interactive 2D graph topology engine (`/graph`).
4. 📅 **[Planning Agent](file:///d:/Agentic%20AI/Single-Agent/planning-agent)**: 10-stage sequential LangGraph project management workflow transforming research data into detailed execution plans, task trees, and timeline estimations.
5. 🔬 **[Research Agent](file:///d:/Agentic%20AI/Single-Agent/research-agent)**: Autonomous AI researcher with Tavily Search integration (3x retry backoff) + HTTP crawlers, cross-source fact checking, 0-100% confidence scoring, and automatic Memory Agent REST sync.
6. 🛡️ **[Review Agent](file:///d:/Agentic%20AI/Single-Agent/review-agent)**: Quality Assurance (QA) gatekeeper providing 0-100 multi-criteria quality scoring (Score &ge; 80 approval gate) and security scanning for SQL injection, exposed API keys, and unsafe `eval()`.

> *For exhaustive details, API routes, and feature specs, read the [Single-Agent Master README](file:///d:/Agentic%20AI/Single-Agent/README.md).*

---

## 🌐 Multi-Agent Ecosystem Overview

The [`/Multi-Agent`](file:///d:/Agentic%20AI/Multi-Agent) folder provides the container structure for the collaborative multi-agent architecture:
- **Chief of Staff Orchestrator**: Receives high-level user prompt and breaks down tasks into multi-agent sub-goals.
- **Inter-Agent Protocol**: Standardized REST / JSON event schema connecting Research &rarr; Memory &rarr; Planning &rarr; Finance &rarr; Review &rarr; Communication.
- **Automated Verification Loop**: Rejected payloads (Score < 80) trigger automatic revision loops prior to final document generation.

---

## 🚀 Quick Start Guide (Single-Agent Suite)

### Prerequisites
- **Python**: `>= 3.11`
- **Node.js**: `>= 20.x` & **npm**: `>= 10.x`
- **Git** & **Docker / Docker Compose**

### Running an Agent (Example: Communication Agent)

```powershell
# Navigate to the backend directory
cd Single-Agent/comunication-agent/backend

# Create & activate Python virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies & run server
pip install -r requirements.txt
python -m pytest tests/ -v
uvicorn app.main:app --reload --port 8004
```

### Running via Docker Compose

```powershell
# Example: Launch Research Agent via Docker
cd Single-Agent/research-agent
docker-compose up --build -d
```

---

## 🧪 Automated Testing Suite (All 6 Single Agents)

Execute automated test suites for **all 6 Single Agents**:

```powershell
# 1. Communication Agent Tests
cd Single-Agent/comunication-agent/backend ; python -m pytest tests/ -v

# 2. Finance Agent Tests
cd Single-Agent/finance-agent/backend ; python -m pytest tests/ -v

# 3. Memory Agent Tests
cd Single-Agent/Memory-Agent ; npm test

# 4. Planning Agent Tests
cd Single-Agent/planning-agent ; python -m pytest tests/ -v

# 5. Research Agent Tests
cd Single-Agent/research-agent/backend ; python -m pytest tests/ -v

# 6. Review Agent Tests
cd Single-Agent/review-agent/backend ; python -m pytest tests/ -v
```

---

## 📄 Repository License & Credits

- **Repository**: [`https://github.com/saikriz898/AgentVerse-Hackathon.git`](https://github.com/saikriz898/AgentVerse-Hackathon.git)
- **Framework**: LifeOS Autonomous Multi-Agent Ecosystem  
- **Event**: AgentVerse Hackathon
