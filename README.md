# 🤖 LifeOS AgentVerse — Autonomous AI Microservices & Multi-Agent Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Google Gemini](https://img.shields.io/badge/AI_Core-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![LangChain](https://img.shields.io/badge/Orchestration-LangGraph-1C3C3C?logo=chainlink&logoColor=white)](https://langchain.com)
[![PostgreSQL](https://img.shields.io/badge/Vector_DB-Neon%20PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)

> **Enterprise Production-Grade AI Platform for the AgentVerse Hackathon**  
> An enterprise-grade, dual-architecture AI ecosystem delivering both **Single-Agent** microservices (deep web research, project planning, cost estimation, central vector memory, automated QA review, document synthesis) and **Multi-Agent** collaborative orchestration fleets.

---

## 🎯 Enterprise & Startup Problem Statement

### The Industry Challenge
Fast-growing tech startups, enterprise engineering teams, and digital product companies face critical operational bottlenecks when building and scaling software products:
1. **High Engineering & Infrastructure Costs**: Startups struggle to accurately forecast building costs, developer hours, and multi-cloud hosting budgets (AWS, GCP, Azure, DigitalOcean, Vercel) prior to writing code.
2. **Security Vulnerabilities & Quality Risks**: Rapid development cycles frequently push unverified code into production with hidden SQL injections, hardcoded API keys, and broken JSON schemas.
3. **Context Loss Across Silos**: Product specifications, market research, architectural decisions, and meeting notes remain fragmented across team channels, degrading long-term AI context.
4. **Heavy Stakeholder Communication Overhead**: Technical JSON outputs, database schemas, and research data must be manually reformatted into executive reports, investor pitch summaries, client updates, and developer documentation.

### The LifeOS Autonomous AI Solution
The **LifeOS Ecosystem** equips startups and companies with a production-ready autonomous AI workforce designed to accelerate product development from initial market research to stakeholder presentation:
- **Research Agent**: Autonomous deep web & repository research specialist with 3x retry Tavily search and cross-source fact verification.
- **Memory Agent**: Central company knowledge engine featuring 768-dim RRF vector search and interactive 2D graph topology visualization.
- **Planning Agent**: Transforms product requirement documents (PRDs) into 10-stage LangGraph execution roadmaps, subtask trees, and risk reports.
- **Finance Agent**: Acts as an AI Chief Financial Officer (CFO) and Cloud Architect estimating 20+ cost parameters, budget allocations, and cloud pricing options.
- **Review Agent**: Automated QA & security gatekeeper enforcing a **Quality Score &ge; 80 approval gate** and scanning for security flaws prior to deployment.
- **Communication Agent**: Automatically synthesizes technical JSON payloads into 19 deliverable formats tailored for Investors, Founders, Clients, Managers, and Developers.

---

## 📁 Repository Structure & Submission Compliance

Per the **AgentVerse Hackathon** submission mandate, this repository contains both **Single-Agent** and **Multi-Agent** trees:

```
📁 AgentVerse-Hackathon/
├── 📁 Single-Agent/             <-- Single-Agent Implementations & Master Documentation
│   ├── 📁 comunication-agent/   (Presentation Layer & Format Synthesis Agent)
│   ├── 📁 finance-agent/        (Financial Architect & Multi-Cloud Cost Estimator)
│   ├── 📁 Memory-Agent/         (Central Vector Memory & 2D Graph Topology Agent)
│   ├── 📁 planning-agent/       (LangGraph 10-Stage Project Execution Agent)
│   ├── 📁 research-agent/       (Multi-Source Deep Web Research Specialist)
│   ├── 📁 review-agent/         (Automated Quality Assurance & Security Gatekeeper)
│   └── 📄 README.md             (Master Single-Agent Specification)
│
├── 📁 Multi-Agent/              <-- Multi-Agent Orchestrations & Collaborative Fleets
│   └── 📄 .gitkeep              (Placeholder ready for Multi-Agent Fleet expansion)
│
├── 📄 .gitignore
└── 📄 README.md                 (Root Master Hackathon README)
```

---

## 🏗️ End-to-End System Architecture

```
                                  ┌────────────────────────┐
                                  │      User Prompt /     │
                                  │    Chief of Staff      │
                                  └───────────┬────────────┘
                                              │
                                              ▼
┌────────────────────────┐        ┌────────────────────────┐
│     Memory Agent       │◄───────┤     Research Agent     │
│ (RRF Search & Graph)   │        │(Multi-Source Search)   │
└───────────┬────────────┘        └───────────┬────────────┘
            │                                 │
            │                             JSON Output
            │                                 │
            ▼                                 ▼
┌────────────────────────┐        ┌────────────────────────┐
│     Finance Agent      │        │     Planning Agent     │
│(Cost & Cloud Estimator)│        │ (LangGraph Workflow)   │
└───────────┬────────────┘        └───────────┬────────────┘
            │                                 │
            └────────────────┬────────────────┘
                             │
                             ▼
              ┌────────────────────────┐
              │      Review Agent      │
              │  (QA & Security Scan)  │
              └───────────┬────────────┘
                          │
                   Quality Score >= 80
                          │
                          ▼
              ┌────────────────────────┐
              │  Communication Agent   │
              │(Presentation & Format) │
              └────────────────────────┘
```

---

## ⚖️ Single-Agent vs. Multi-Agent Architectural Comparison

| Architectural Feature | Single-Agent Architecture (`/Single-Agent`) | Multi-Agent Architecture (`/Multi-Agent`) |
| :--- | :--- | :--- |
| **Execution Paradigm** | **Isolated Processing**: Dedicated microservices executing single-step tasks in isolation. | **Collaborative Fleets**: Multiple agents interacting via shared REST event channels. |
| **Orchestration** | Independent HTTP endpoints / microservice routes. | Gated workflow driven by a Chief of Staff orchestrator. |
| **State & Memory** | Ephemeral request lifecycle or localized database tables. | Centralized vector memory stream & 2D graph topology via **Memory Agent**. |
| **Verification Gate** | Single pass validation or local schema enforcement. | Automated QA scoring gate (Quality Score &ge; 80 approval gate via **Review Agent**). |
| **Resilience Model** | 100% offline fallback rule engine when LLMs are unreachable. | Dynamic retry, agent fallback, and inter-agent error recovery loops. |
| **Ideal Use Cases** | API microservices, standalone tools, embedded utilities. | Enterprise software engineering, deep research-to-code pipelines, executive workflows. |

---

## 📦 Single-Agent Suite Catalog (All 6 Microservices)

### 1. 📧 [Communication Agent](file:///d:/Agentic%20AI/Single-Agent/comunication-agent)
- **Role**: Presentation layer converting technical JSON into 19 output document types tailored for 9 audience profiles.
- **Tech Stack**: Python 3.11, FastAPI, Gemini 2.5 Flash, React, TypeScript, Glassmorphism UI.
- **Key Capabilities**: Zero-hallucination preservation rules, transparent missing info detector, 100% offline fallback engine.

### 2. 💰 [Finance Agent](file:///d:/Agentic%20AI/Single-Agent/finance-agent)
- **Role**: Financial architect estimating software build, deployment, QA, operating, and cloud infrastructure expenses.
- **Tech Stack**: Python 3.11, FastAPI, React 19, Recharts, Tailwind CSS.
- **Key Capabilities**: 20+ cost parameter estimator, 9 cloud provider price comparator (AWS, Azure, GCP, DigitalOcean, Vercel, Supabase, Neon, Railway, Cloudflare), budget planner, ROI payback & break-even sliders.

### 3. 🧠 [Memory Agent](file:///d:/Agentic%20AI/Single-Agent/Memory-Agent)
- **Role**: Central persistent vector memory engine and 2D graph topology visualizer.
- **Tech Stack**: Next.js 16, React 19, Express, TypeScript, Neon PostgreSQL (`pgvector`), Gemini `text-embedding-004`, Drizzle ORM.
- **Key Capabilities**: Hybrid RRF (Reciprocal Rank Fusion: 768-dim dense vectors + BM25 keyword matching), 4-directional interactive graph topology viewer (`/graph`), autonomous context builder.

### 4. 📅 [Planning Agent](file:///d:/Agentic%20AI/Single-Agent/planning-agent)
- **Role**: Project manager engine transforming research into structured, milestone-based project execution plans.
- **Tech Stack**: Python 3.12, FastAPI, LangGraph, LangChain, OpenAI GPT-4o / Gemini, Jinja2 prompts, Pydantic v2.
- **Key Capabilities**: 10-stage sequential LangGraph workflow (Input Validation &rarr; Analysis &rarr; Task Breakdown &rarr; Priority Scoring &rarr; Timeline Estimation &rarr; Dependencies &rarr; Milestones &rarr; Risk Analysis).

### 5. 🔬 [Research Agent](file:///d:/Agentic%20AI/Single-Agent/research-agent)
- **Role**: Autonomous AI researcher gathering, fact-checking, and synthesizing multi-source web, paper, and repo data.
- **Tech Stack**: Python 3.11, FastAPI, Gemini 2.5 Flash, Tavily API (3x retry), BeautifulSoup crawler, React, PostgreSQL.
- **Key Capabilities**: Query expansion engine, cross-source fact verification, 0-100% confidence scoring, automatic REST memory sync.

### 6. 🛡️ [Review Agent](file:///d:/Agentic%20AI/Single-Agent/review-agent)
- **Role**: Quality Assurance (QA) gatekeeper and security scanner.
- **Tech Stack**: Python 3.12, FastAPI, Async SQLAlchemy 2.0, PostgreSQL, Gemini 2.5 Flash, React 18.
- **Key Capabilities**: 0-100 quality scoring engine (Requires Quality Score &ge; 80 for approval), security scanner for SQLi / exposed API keys / unsafe `eval()`, 7 PostgreSQL database tables.

---

## 🌐 Unified Port Registry & Network Topology

| Service Name | Component | Default Port | Protocol | Local URL |
| :--- | :--- | :---: | :---: | :--- |
| **Communication Agent** | FastAPI Backend | `8004` | HTTP / REST | `http://localhost:8004` |
| **Communication Agent** | React Frontend | `5173` | HTTP | `http://localhost:5173` |
| **Finance Agent** | FastAPI Backend | `8000` | HTTP / REST | `http://localhost:8000` |
| **Finance Agent** | React Frontend | `3000` | HTTP | `http://localhost:3000` |
| **Memory Agent** | Express API | `4000` | HTTP / REST | `http://localhost:4000/api/v1` |
| **Memory Agent** | Next.js Web App | `3000` | HTTP | `http://localhost:3000` |
| **Planning Agent** | FastAPI Service | `8000` | HTTP / REST | `http://localhost:8000` |
| **Research Agent** | FastAPI Service | `8000` | HTTP / REST | `http://localhost:8000` |
| **Research Agent** | React Dashboard | `3000` | HTTP | `http://localhost:3000` |
| **Review Agent** | FastAPI Service | `8000` | HTTP / REST | `http://localhost:8000` |
| **Review Agent** | React Dashboard | `3000` | HTTP | `http://localhost:3000` |

---

## 🚀 Installation & Setup Guide

### Prerequisites
- **Python**: `>= 3.11` (or Python 3.12)
- **Node.js**: `>= 20.x` & **npm**: `>= 10.x`
- **Docker & Docker Compose**

### Running Microservices Locally

```powershell
# 1. Communication Agent Backend
cd Single-Agent/comunication-agent/backend
python -m venv venv ; .\venv\Scripts\activate ; pip install -r requirements.txt
uvicorn app.main:app --reload --port 8004

# 2. Memory Agent Monorepo
cd Single-Agent/Memory-Agent
npm install ; npm run dev

# 3. Planning Agent Backend
cd Single-Agent/planning-agent
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 4. Research Agent Backend
cd Single-Agent/research-agent/backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# 5. Review Agent Backend
cd Single-Agent/review-agent/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 6. Finance Agent Backend
cd Single-Agent/finance-agent/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Automated Testing Suite (All 6 Single Agents)

Execute automated test suites across all 6 single agents:

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

## 🏆 Repository & Platform Info

- **Repository**: [`https://github.com/saikriz898/AgentVerse-Hackathon.git`](https://github.com/saikriz898/AgentVerse-Hackathon.git)
- **Event**: AgentVerse Hackathon
- **Framework**: LifeOS Autonomous Multi-Agent Ecosystem
