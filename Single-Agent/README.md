# 🤖 LifeOS Single Agents Suite

> **Production-Grade Autonomous AI Microservices Ecosystem**  
> A decoupled, high-performance suite of 6 specialized single agents designed for deep research, project planning, financial estimation, central vector memory, automated quality assurance, and executive communication.

---

## 📋 Table of Contents
- [🌟 Suite Architecture Overview](#-suite-architecture-overview)
- [🔄 Inter-Agent Data Flow & Ecosystem Pipeline](#-inter-agent-data-flow--ecosystem-pipeline)
- [📦 Single Agents Summary Catalog](#-single-agents-summary-catalog)
- [🔍 Exhaustive Agent Deep Dives & Feature Sets](#-exhaustive-agent-deep-dives--feature-sets)
  - [1. Communication Agent](#1-communication-agent-comunication-agent)
  - [2. Finance Agent](#2-finance-agent-finance-agent)
  - [3. Memory Agent](#3-memory-agent-memory-agent)
  - [4. Planning Agent](#4-planning-agent-planning-agent)
  - [5. Research Agent](#5-research-agent-research-agent)
  - [6. Review Agent](#6-review-agent-review-agent)
- [🛠️ Unified Technology Stack Matrix](#️-unified-technology-stack-matrix)
- [🌐 Unified Port Registry & Network Map](#-unified-port-registry--network-map)
- [🔌 Exhaustive API Endpoints Directory](#-exhaustive-api-endpoints-directory)
- [🔑 Environment Configuration (`.env`) Matrix](#-environment-configuration-env-matrix)
- [🚀 Comprehensive Quick Start & Installation Guide](#-comprehensive-quick-start--installation-guide)
- [🧪 Automated Testing Suite](#-automated-testing-suite)
- [📄 License & Credits](#-license--credits)

---

## 🌟 Suite Architecture Overview

```
                                  ┌────────────────────────┐
                                  │      User Prompt /     │
                                  │    Chief of Staff      │
                                  └───────────┬────────────┘
                                              │
                                              ▼
┌────────────────────────┐        ┌────────────────────────┐
│     Memory Agent       │◄───────┤     Research Agent     │
│ (Vector Search & Graph)│        │(Multi-Source Search)   │
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
              │  (QA & Verification)   │
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

## 🔄 Inter-Agent Data Flow & Ecosystem Pipeline

1. **Research Phase**: User or Chief of Staff initiates a request &rarr; **Research Agent** expands queries (Gemini 2.5 Flash), performs multi-source web/API search via Tavily (3x retry) & fallback crawlers, calculates confidence score (0-100%), and emits structured JSON.
2. **Context Persistence**: Research findings are asynchronously synced to **Memory Agent** (`/api/v1/memory`) using hybrid Reciprocal Rank Fusion (768-dim embeddings via `text-embedding-004` + BM25 keyword matching).
3. **Execution Planning**: **Planning Agent** consumes research JSON and executes a 10-stage LangGraph workflow (Task breakdown, subtasks, priority assignment, timeline estimation, dependency resolution, milestones, and risk analysis).
4. **Financial Architecture**: **Finance Agent** analyzes the project plan across 20+ cost parameters (Frontend, Backend, DB, AI APIs, DevOps, QA, Cloud, Maintenance) and computes multi-cloud price comparisons (AWS, GCP, Azure, DigitalOcean, Vercel, Supabase, Neon, Railway, Cloudflare), ROI, and 12-36 month projections.
5. **Quality Assurance Gate**: **Review Agent** validates the payloads (Code, JSON, Planning, Document) against security rules (SQLi, hardcoded credentials, unsafe `eval()`), schema integrity, and logical coherence, assigning a 0-100 Quality Score. (Approval requires Score &ge; 80).
6. **Executive Presentation**: **Communication Agent** transforms approved technical JSON into audience-adapted deliverables (Executive Summaries, Slide Presentations, Standups, API Docs, Release Notes) formatted for specific target roles (Executive, Client, Manager, Developer, Team).

---

## 📦 Single Agents Summary Catalog

The suite consists of **6 specialized, enterprise-grade AI microservices**:

| Agent | Directory Path | Primary Role | Core AI & Tech Stack | Ports |
| :--- | :--- | :--- | :--- | :--- |
| **Communication Agent** | [`/comunication-agent`](file:///d:/Agentic%20AI/single-agent/comunication-agent) | Presentation layer & document formatting (19+ formats, 9 target audiences) | Gemini 2.5 Flash, FastAPI, Python 3.11, React + Vite, Glassmorphism | Backend: `8004`<br>Frontend: `5173` |
| **Finance Agent** | [`/finance-agent`](file:///d:/Agentic%20AI/single-agent/finance-agent) | Financial architect, project cost estimator & multi-cloud price comparator | FastAPI, Python 3.11, React 19, Recharts, Tailwind CSS | Backend: `8000`<br>Frontend: `3000` |
| **Memory Agent** | [`/Memory-Agent`](file:///d:/Agentic%20AI/single-agent/Memory-Agent) | Central autonomous vector memory engine & 4-directional graph topology | Next.js 16, Express, Gemini `text-embedding-004`, Neon PG (`pgvector`) | Backend: `4000`<br>Web App: `3000` |
| **Planning Agent** | [`/planning-agent`](file:///d:/Agentic%20AI/single-agent/planning-agent) | Project manager engine & LangGraph sequential execution breakdown | Python 3.12, FastAPI, LangGraph, LangChain, OpenAI/Gemini, Jinja2 | Backend API: `8000` |
| **Research Agent** | [`/research-agent`](file:///d:/Agentic%20AI/single-agent/research-agent) | Autonomous research specialist with 3x retry Tavily search & fact checker | FastAPI, Gemini 2.5 Flash, Tavily API, React + Vite, PostgreSQL | Backend API: `8000`<br>Frontend: `3000` |
| **Review Agent** | [`/review-agent`](file:///d:/Agentic%20AI/single-agent/review-agent) | Automated Quality Assurance (QA), security scanner & score verification | FastAPI, Python 3.12, PostgreSQL, Gemini 2.5 Flash, React 18 | Backend API: `8000`<br>Frontend: `3000` |

---

## 🔍 Exhaustive Agent Deep Dives & Feature Sets

### 1. 📧 [Communication Agent](file:///d:/Agentic%20AI/single-agent/comunication-agent)
- **Primary Goal**: Converts complex, technical JSON payloads from all system agents into polished, human-friendly deliverables tailored for target audiences.
- **Complete Feature Matrix**:
  - **Gemini 2.5 Flash Transformation**: Contextual summarization, executive formatting, tone adaptation, and structural organization.
  - **9 Audience Profiles**: Tailors outputs specifically for *Executive*, *Manager*, *Client*, *Professor*, *Developer*, *Team*, *Stakeholders*, *Project Lead*, and *User*.
  - **19 Output Document Types**:
    1. Executive Summary &nbsp; 2. Project Summary &nbsp; 3. Research Summary &nbsp; 4. Planning Summary  
    5. Execution Summary &nbsp; 6. Review Summary &nbsp; 7. Meeting Notes &nbsp; 8. Professional Email  
    9. Markdown Report &nbsp; 10. HTML Report &nbsp; 11. Status Update &nbsp; 12. Progress Report  
    13. Release Notes &nbsp; 14. API Documentation &nbsp; 15. Technical Documentation  
    16. Presentation Notes &nbsp; 17. Blog Style Report &nbsp; 18. Weekly Report &nbsp; 19. Daily Standup  
  - **Zero Fabrication & Zero Hallucination Engine**: Preserves 100% technical metrics, code snippets, and verified facts without inventing data.
  - **Missing Information Flagger**: Automatically detects missing JSON keys and explicitly highlights missing context to the user.
  - **100% Offline Rule Fallback**: Deterministic template engine generates clean documents even when offline or without an API key.
  - **Glassmorphism Web Studio**: React + Vite + TypeScript interface featuring side-by-side JSON editor, live rendered Markdown, HTML iframe preview, Email view simulation, Slide presentation mode, history analytics, and exports (`.md`, `.html`, `.txt`, `.json`).

---

### 2. 💰 [Finance Agent](file:///d:/Agentic%20AI/single-agent/finance-agent)
- **Primary Goal**: Estimates software construction, cloud infrastructure, deployment, operating, AI API, QA, and maintenance costs.
- **Complete Feature Matrix**:
  - **Real-Time Executive Dashboard**: High-level KPI cards, interactive Recharts visualizations, cost distribution pie charts, and budget risk alerts.
  - **AI Project Cost Estimator**: Evaluates 20+ cost parameters (Frontend, Backend, Database, AI APIs, DevOps, QA, Cloud Infra, Security, Maintenance) with confidence scores and rationale.
  - **Multi-Cloud Price Comparison**: Evaluates and compares hosting options across AWS, Azure, GCP, DigitalOcean, Vercel, Supabase, Neon, Railway, and Cloudflare.
  - **Department Budget Planner**: Allocate department budgets, reserve emergency contingency funds, and receive threshold overspend alerts.
  - **ROI & Break-Even Calculator**: Payback period estimation, net profit calculations, and interactive revenue sensitivity sliders.
  - **Predictive 12-36 Month Forecasting**: Generates expense projections under *Conservative*, *Base*, and *Aggressive* growth scenarios.
  - **Multi-Currency Converter**: Instant toggle between USD ($), EUR (€), GBP (£), and INR (₹).
  - **Multi-Format Financial Exporter**: Export financial estimates and breakdowns in PDF, Excel (XLSX), CSV, and JSON formats.

---

### 3. 🧠 [Memory Agent](file:///d:/Agentic%20AI/single-agent/Memory-Agent)
- **Primary Goal**: Central context, vector search, persistent memory, and knowledge repository for the multi-agent system.
- **Complete Feature Matrix**:
  - **Hybrid RRF Search Engine**: Reciprocal Rank Fusion combining dense 768-dim vector similarity (Google Gemini `text-embedding-004`) with sparse BM25 keyword matching.
  - **Unified Partition Stream**: Consolidates Working Memory, Long-Term Memory, Knowledge Base Guidelines, and Project Workspace Partitions.
  - **Dedicated Filtering & Quick Actions**: Category tabs (`All`, `Working`, `Knowledge Base`, `Projects`, `Long Term`, `Short Term`, `Pinned`, `Archived`) and quick-action modals (`+ Store Memory`, `+ Add Knowledge`, `+ New Project`).
  - **4-Directional Interactive Graph Topology (`/graph`)**:
    - Canvas drag & pan in 4 directions.
    - Drag-and-drop node repositioning with real-time Bezier curved edge recalculations.
    - 5%-600% Multi-tier semantic zoom level.
    - Glassmorphism Control Dock: Layout switches (Physics, Orbits, Tree, Organic), camera fly-to, camera bookmarks.
  - **Autonomous Context Builder**: Dynamic context window assembly scored by `(recency × importance × relevance)` with token window truncation and pinned memory priority.
  - **Dual DB Architecture**: Neon PostgreSQL (`pgvector`) for cloud production and SQLite (`better-sqlite3`) for offline local mode via Drizzle ORM.
  - **0ms Optimistic TanStack Query Cache**: Instant client-side state mutation without background refetch overwrites.

---

### 4. 📅 [Planning Agent](file:///d:/Agentic%20AI/single-agent/planning-agent)
- **Primary Goal**: Converts raw research payloads into structured, milestone-based project execution plans.
- **Complete Feature Matrix**:
  - **10-Stage Sequential LangGraph Workflow**:
    1. Input Validation &nbsp; 2. Project Analysis &nbsp; 3. Task Generation &nbsp; 4. Subtask Breakdown  
    5. Priority Assignment &nbsp; 6. Timeline Estimation &nbsp; 7. Dependency Resolution  
    8. Milestone Generation &nbsp; 9. Roadmap Construction &nbsp; 10. Risk & Recommendation Analysis  
  - **Decoupled Jinja2 Dynamic Prompts**: Modular prompts (`project_analysis.jinja`, `task_generation.jinja`, `priority_assignment.jinja`, `timeline_estimation.jinja`, `dependency_detection.jinja`, `milestone_generation.jinja`, `roadmap_generation.jinja`, `risk_analysis.jinja`, `final_report.jinja`).
  - **Pydantic Validation**: Strict schemas for Project, Task, Milestone, Roadmap, and PlanningResult models.
  - **FastAPI REST Service**: Endpoints with interactive OpenAPI/Swagger documentation (`/docs`).

---

### 5. 🔬 [Research Agent](file:///d:/Agentic%20AI/single-agent/research-agent)
- **Primary Goal**: Autonomous AI researcher that gathers, fact-checks, and synthesizes multi-source web, repo, and document data.
- **Complete Feature Matrix**:
  - **Gemini 2.5 Flash Query Expansion**: Automatically expands broad user objectives into domain-targeted queries (Official Docs, GitHub Repos, Research Papers).
  - **Multi-Source Search Router**: Tavily Search API integration with 3x exponential retry backoff + fallback BeautifulSoup HTTP crawler.
  - **Cross-Source Fact Checker**: Identifies contradictions and verifies claims against independent primary sources.
  - **Multi-Factor Confidence Scoring (0-100%)**: Evaluates domain authority, recency, source consistency, and official references.
  - **Automatic Memory Agent Sync**: Pushes summary, citations, keywords, and confidence scores directly to Memory Agent REST endpoints.
  - **Glassmorphic React Dashboard**: Real-time research visualizer, filterable history archives, topic comparison tool, and Recharts analytics.
  - **JWT Authentication & RBAC**: User registration, login, and token handling.

---

### 6. 🛡️ [Review Agent](file:///d:/Agentic%20AI/single-agent/review-agent)
- **Primary Goal**: Quality Assurance (QA), security verification, and evaluation gatekeeper.
- **Complete Feature Matrix**:
  - **Multi-Domain QA Evaluation**: Validates Code (Python, JS, TS, HTML, CSS, SQL), JSON Schemas, Markdown Documents, Research Payloads, Execution Scripts, and Planning Graphs.
  - **0-100 Multi-Criteria Scoring**: 11 criteria scoring scale. Approval requires Quality Score &ge; 80 (`"status": "approved"` vs `"status": "rejected"`).
  - **Security Scanner**: Detects SQL injection risks, exposed hardcoded API keys/passwords, and unsafe `eval()` executions.
  - **7 PostgreSQL Database Tables**:
    1. `users` &nbsp; 2. `reviews` &nbsp; 3. `review_logs` &nbsp; 4. `quality_scores`  
    5. `review_rules` &nbsp; 6. `review_history` &nbsp; 7. `agent_reviews`  
  - **Customizable Rule Engine**: Manage threshold policies, custom validation rules, and agent performance tracking.
  - **Dashboard & Audit History**: Paginated evaluation records, issue breakdowns with line suggestions, and KPI quality graphs.

---

## 🛠️ Unified Technology Stack Matrix

| Layer / Tech | Communication | Finance | Memory | Planning | Research | Review |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Python 3.11/3.12** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **FastAPI** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Node.js / Express** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Next.js 16 / React 19** | React 18 | React 19 | Next.js 16 | ❌ | React 18 | React 18 |
| **Gemini 2.5 Flash** | ✅ | ❌ | Embeddings | Option | ✅ | ✅ |
| **LangChain / LangGraph**| ❌ | ❌ | LangChain | ✅ | ❌ | ❌ |
| **Database & ORM** | SQLite / PG | ❌ | Neon (`pgvector`) / Drizzle | ❌ | PostgreSQL | Async SQLAlchemy / PG |
| **Auth System** | ❌ | ❌ | JWT | ❌ | JWT | JWT (Bcrypt) |
| **Docker Compose** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |

---

## 🌐 Unified Port Registry & Network Map

| Service Name | Component | Default Port | Environment Variable Key | Local URL |
| :--- | :--- | :---: | :--- | :--- |
| **Communication Agent** | FastAPI Backend | `8004` | `PORT` | `http://localhost:8004` |
| **Communication Agent** | React Frontend | `5173` | `VITE_PORT` | `http://localhost:5173` |
| **Finance Agent** | FastAPI Backend | `8000` | `PORT` | `http://localhost:8000` |
| **Finance Agent** | React Frontend | `3000` | `PORT` | `http://localhost:3000` |
| **Memory Agent** | Express API | `4000` | `PORT` | `http://localhost:4000/api/v1` |
| **Memory Agent** | Next.js Web App | `3000` | `PORT` | `http://localhost:3000` |
| **Planning Agent** | FastAPI Service | `8000` | `PORT` | `http://localhost:8000` |
| **Research Agent** | FastAPI Service | `8000` | `PORT` | `http://localhost:8000` |
| **Research Agent** | React Dashboard | `3000` | `VITE_PORT` | `http://localhost:3000` |
| **Review Agent** | FastAPI Service | `8000` | `PORT` | `http://localhost:8000` |
| **Review Agent** | React Dashboard | `3000` | `VITE_PORT` | `http://localhost:3000` |

---

## 🔌 Exhaustive API Endpoints Directory

### 📧 Communication Agent Endpoints (`Port 8004`)
- `POST /api/v1/communication/transform` - Transform technical JSON into output document
- `GET /api/v1/communication/history` - List paginated document transformation history
- `GET /api/v1/communication/history/{id}` - Fetch single transformation record
- `POST /api/v1/communication/export` - Export document (`.md`, `.html`, `.txt`, `.json`)
- `GET /api/v1/communication/templates` - Fetch document templates
- `GET /api/v1/communication/stats` - Fetch usage & output stats analytics
- `GET /api/v1/health` - Backend health & LLM status check

### 💰 Finance Agent Endpoints (`Port 8000`)
- `POST /api/v1/finance/estimate` - Estimate software project costs
- `POST /api/v1/finance/budget` - Allocate & update budget parameters
- `GET /api/v1/finance/cloud-compare` - Fetch cloud infrastructure cost matrix
- `POST /api/v1/finance/roi` - Compute ROI and break-even timeline
- `POST /api/v1/finance/forecast` - Compute 12-36 month expense projections
- `POST /api/v1/finance/export` - Export reports (PDF, XLSX, CSV, JSON)

### 🧠 Memory Agent Endpoints (`Port 4000`)
- `GET /api/v1/memory` - Fetch vector memory stream entries
- `POST /api/v1/memory` - Store new memory record
- `POST /api/v1/knowledge` - Create knowledge base article
- `POST /api/v1/projects` - Initialize project workspace
- `GET /api/v1/graph` - Fetch 2D graph nodes and Bezier edge topology
- `POST /api/v1/search` - RRF Hybrid Search (Gemini `text-embedding-004` + BM25)
- `POST /api/v1/context` - Assemble dynamic context package
- `POST /api/v1/admin/reset` - Reset database records
- `GET /api/v1/admin/health` - Memory Agent health check

### 📅 Planning Agent Endpoints (`Port 8000`)
- `POST /plan` - Generate full 10-stage LangGraph execution plan
- `GET /health` - Microservice health check
- `GET /docs` - Interactive OpenAPI / Swagger UI

### 🔬 Research Agent Endpoints (`Port 8000`)
- `POST /api/research/start` - Execute full deep research pipeline
- `POST /api/research/search` - Fast multi-source web search
- `POST /api/research/summarize` - Summarize raw text content or URL
- `POST /api/research/compare` - Compare research topics
- `POST /api/research/fact-check` - Verify claims against web references
- `GET /api/research/history` - Fetch research audit history
- `GET /api/research/result/{id}` - Fetch research payload by UUID
- `DELETE /api/research/{id}` - Delete research entry
- `POST /api/agent/chief-of-staff/query` - Chief of Staff entrypoint
- `GET /api/analytics/dashboard` - Analytics metrics & Recharts datasets
- `POST /api/auth/register` & `POST /api/auth/login` - Auth management

### 🛡️ Review Agent Endpoints (`Port 8000`)
- `POST /api/v1/review` - Universal QA Review endpoint
- `POST /api/v1/review/code` - Code Review (Python, JS, TS, HTML, CSS, SQL)
- `POST /api/v1/review/json` - JSON Schema integrity & validation check
- `POST /api/v1/review/document` - Markdown & document structure evaluation
- `POST /api/v1/review/research` - Research citations & fact accuracy evaluation
- `POST /api/v1/review/planning` - Planning & milestone breakdown review
- `GET /api/v1/review/history` - Searchable audit history
- `GET /api/v1/review/{id}` - Detailed review score breakdown
- `GET /api/v1/analytics/dashboard` - QA KPIs & score distribution
- `GET /api/v1/rules` & `POST /api/v1/rules` - Rule policy management
- `POST /api/v1/auth/register` & `POST /api/v1/auth/login` - Auth endpoints

---

## 🔑 Environment Configuration (`.env`) Matrix

Sample environment variables for setting up services locally:

### Memory Agent `.env` Example:
```env
PORT=4000
DATABASE_PROVIDER=postgres
DATABASE_URL="postgres://user:password@localhost:5432/memory_db?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
JWT_SECRET="your-jwt-secret-key"
```

### Research / Review / Communication Agents `.env` Example:
```env
PORT=8000
DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/agent_db"
GEMINI_API_KEY="your-gemini-api-key"
TAVILY_API_KEY="your-tavily-api-key"
JWT_SECRET="your-jwt-secret"
```

### Planning Agent `.env` Example:
```env
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"
MODEL_NAME="gpt-4o"
```

---

## 🚀 Comprehensive Quick Start & Installation Guide

### Prerequisites
- **Python**: `>= 3.11` (or Python 3.12)
- **Node.js**: `>= 20.x` & **npm**: `>= 10.x`
- **Git** & **Docker / Docker Compose**

---

### Step-by-Step Local Microservice Execution

#### 1. Launching Communication Agent:
```bash
cd single-agent/comunication-agent/backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8004
```

#### 2. Launching Memory Agent:
```bash
cd single-agent/Memory-Agent
npm install
npm run migrate
npm run seed
npm run dev
```

#### 3. Launching Planning Agent:
```bash
cd single-agent/planning-agent
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 4. Launching Research Agent:
```bash
cd single-agent/research-agent/backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

#### 5. Launching Review Agent:
```bash
cd single-agent/review-agent/backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### 6. Launching Finance Agent:
```bash
cd single-agent/finance-agent/backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

### Docker Compose Zero-Configuration Launch

```bash
# Launch Research Agent
cd single-agent/research-agent && docker-compose up --build -d

# Launch Review Agent
cd single-agent/review-agent && docker-compose up --build -d

# Launch Communication Agent
cd single-agent/comunication-agent && docker-compose up --build -d
```

---

## 🧪 Automated Testing Suite

To run tests for individual microservices, create/activate a virtual environment or run via `python -m pytest`:

> **PowerShell Note**: In Windows PowerShell 5.1, use `;` instead of `&&` to chain commands, or run commands on separate lines.

### 1. Communication Agent Tests
```powershell
cd single-agent/comunication-agent/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m pytest tests/ -v
```

### 2. Planning Agent Tests
```powershell
cd single-agent/planning-agent
python -m pytest tests/ -v
```

### 3. Research Agent Tests
```powershell
cd single-agent/research-agent/backend
python -m pytest tests/ -v
```

### 4. Review Agent Tests
```powershell
cd single-agent/review-agent/backend
python -m pytest tests/ -v
```

---

## 📄 License & Credits

Part of the **LifeOS Multi-Agent Ecosystem**. Developed by Advanced Agentic Coding Engineers.