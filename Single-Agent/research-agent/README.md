# 🔬 Research Agent — Deep Multi-Source Search & Fact Verification Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Google Gemini](https://img.shields.io/badge/AI_Core-Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![Tavily](https://img.shields.io/badge/Search-Tavily%20API-FF6B6B?logo=searxng&logoColor=white)](https://tavily.com)

> **Autonomous Deep Web Research & Fact Verification Specialist**  
> Expands user queries via Gemini 2.5 Flash, performs multi-source web/repo search with 3x retry Tavily API & fallback HTTP crawlers, verifies claims across primary sources, and computes empirical 0-100% confidence scores.

---

## 📋 Table of Contents
- [🌟 Role in the Single-Agent Ecosystem](#-role-in-the-single-agent-ecosystem)
- [🔄 Inter-Agent Integration Matrix](#-inter-agent-integration-matrix)
- [✨ Key Features & Architecture](#-key-features--architecture)
- [🛠️ Technology Stack](#️-technology-stack)
- [🔌 REST API Endpoints Directory](#-rest-api-endpoints-directory)
- [🚀 Local Setup & Quick Start](#-local-setup--quick-start)
- [🧪 Automated Testing](#-automated-testing)

---

## 🌟 Role in the Single-Agent Ecosystem

The **Research Agent** serves as the intelligence discovery specialist of the LifeOS platform. When an objective or prompt is submitted, the Research Agent autonomously expands the query into domain-specific web searches, scrapes primary documentation and GitHub repos, fact-checks claims across independent sources, and syncs structured research JSON to the rest of the ecosystem.

---

## 🔄 Inter-Agent Integration Matrix

| Agent Name | Interaction Direction | Integration Purpose & Data Stream |
| :--- | :---: | :--- |
| **🧠 Memory Agent** | **Write & Read** | Automatically syncs research summaries, citations, confidence scores, and keywords to Memory Agent's `/api/v1/memory` store. Queries Memory Agent to avoid duplicate web searches. |
| **📅 Planning Agent** | **Write** | Emits verified research JSON to Planning Agent as input for 10-stage execution plan generation. |
| **💰 Finance Agent** | **Write** | Provides discovered technical stack specifications & cloud service dependencies for financial cost estimation. |
| **🛡️ Review Agent** | **Write** | Sends research report JSON to Review Agent for factual accuracy and citation verification (Score &ge; 80 gate). |
| **📧 Communication Agent** | **Write** | Passes research findings to Communication Agent to generate executive briefs, blog posts, and technical articles. |

---

## ✨ Key Features & Architecture

- 🤖 **Gemini 2.5 Flash Query Expansion**: Automatically expands broad user prompts into targeted domain queries (Official Docs, GitHub Repos, Research Papers).
- 🔍 **Multi-Source Search Router**: Queries Tavily Search API with 3x exponential retry backoff and falls back to BeautifulSoup HTTP web crawlers.
- ⚖️ **Cross-Source Fact Checker**: Identifies contradictions and verifies factual claims against independent primary references.
- 📊 **Multi-Factor Confidence Scoring (0-100%)**: Evaluates domain authority, recency, source consistency, and official documentation presence.
- 🎨 **Glassmorphic React Dashboard**: Real-time research visualizer, filterable history archives, topic comparison tool, and Recharts analytics.
- 🔒 **JWT Authentication & RBAC**: Secure endpoints with user registration, login, and token handling.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend API** | Python 3.11/3.12, FastAPI, Async SQLAlchemy, PostgreSQL |
| **AI Integration** | Google Gemini 2.5 Flash SDK & REST Client |
| **Search & Crawling** | Tavily Search API, BeautifulSoup, HTTPX |
| **Frontend UI** | React 18, Vite, TypeScript, Tailwind CSS, Recharts |
| **Testing** | Pytest, Pytest-Asyncio |

---

## 🔌 REST API Endpoints Directory

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/research/start` | Execute full autonomous deep research pipeline |
| `POST` | `/api/research/search` | Fast multi-source web search |
| `POST` | `/api/research/summarize` | Summarize raw text content or target URL |
| `POST` | `/api/research/compare` | Compare research findings across two topics |
| `POST` | `/api/research/fact-check` | Verify claims against web reference sources |
| `GET` | `/api/research/history` | Fetch paginated research audit history |
| `GET` | `/api/research/result/{id}` | Fetch single research result payload by UUID |
| `DELETE` | `/api/research/{id}` | Delete research record |
| `GET` | `/api/analytics/dashboard` | Fetch research analytics & confidence distribution metrics |
| `POST` | `/api/auth/register` & `/api/auth/login` | User authentication endpoints |

---

## 🚀 Local Setup & Quick Start

### 1. Launch Backend Server (Port 8000)
```powershell
cd Single-Agent/research-agent/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### 2. Launch Frontend Dashboard (Port 3000)
```powershell
cd Single-Agent/research-agent/frontend
npm install
npm run dev
```

- **Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Interactive OpenAPI Docs**: `http://localhost:8000/docs`

---

## 🧪 Automated Testing

Run the pytest test suite:
```powershell
cd Single-Agent/research-agent/backend
python -m pytest tests/ -v
```

---

## 📄 License & Credits
- **Part of**: LifeOS Autonomous Agent Suite  
- **Repository**: [`https://github.com/saikriz898/AgentVerse-Hackathon.git`](https://github.com/saikriz898/AgentVerse-Hackathon.git)
