# 💰 Finance Agent — Project Cost Architect & Multi-Cloud Price Comparator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20TypeScript-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Recharts](https://img.shields.io/badge/Visualization-Recharts-22B5BF?logo=chartdotjs&logoColor=white)](https://recharts.org)

> **Financial Architect & Cloud Infrastructure Estimator Engine**  
> Estimates software building costs across 20+ parameters, computes multi-cloud hosting price matrix (AWS, GCP, Azure, DigitalOcean, Vercel, Supabase, Neon), plans department budgets, and calculates ROI payback timelines.

---

## 📋 Table of Contents
- [🌟 Role in the Single-Agent Ecosystem](#-role-in-the-single-agent-ecosystem)
- [🔄 Inter-Agent Integration Matrix](#-inter-agent-integration-matrix)
- [✨ Key Features & Capabilities](#-key-features--capabilities)
- [🛠️ Technology Stack](#️-technology-stack)
- [🔌 REST API Endpoints Directory](#-rest-api-endpoints-directory)
- [🚀 Local Setup & Quick Start](#-local-setup--quick-start)
- [🧪 Automated Testing](#-automated-testing)

---

## 🌟 Role in the Single-Agent Ecosystem

The **Finance Agent** operates as the financial architect and CFO engine of the LifeOS platform. Before a company or startup builds a software product based on research or project plans, the Finance Agent evaluates the project scope, computes detailed engineering cost estimates, analyzes cloud hosting options, and delivers financial feasibility reports.

---

## 🔄 Inter-Agent Integration Matrix

| Agent Name | Interaction Direction | Integration Purpose & Data Stream |
| :--- | :---: | :--- |
| **🔬 Research Agent** | **Read** | Reads technical requirements and API dependencies identified during research to determine third-party service costs. |
| **📅 Planning Agent** | **Read** | Reads estimated task duration, team hours, and sprint breakdown to compute labor & development cost estimates. |
| **🧠 Memory Agent** | **Read & Write** | Fetches historical project baselines from Memory Agent and writes final financial budget allocations to `/api/v1/projects`. |
| **🛡️ Review Agent** | **Read** | Validates financial reports for schema compliance and cost budget threshold verification. |
| **📧 Communication Agent** | **Write** | Passes itemized financial JSON to Communication Agent to synthesize pitch decks, budget summaries, and investor reports. |

---

## ✨ Key Features & Capabilities

- 📊 **Executive Financial Dashboard**: Real-time KPI cards, interactive Recharts visualizations, cost distribution pie charts, and risk alerts.
- 🧮 **AI Project Cost Estimator**: Evaluates 20+ cost parameters (Frontend, Backend, DB, AI APIs, DevOps, QA, Cloud Infra, Security, Maintenance) with confidence scores and reasoning.
- ☁️ **Multi-Cloud Price Comparator**: Compares hosting prices across 9 providers: AWS, Azure, GCP, DigitalOcean, Vercel, Supabase, Neon, Railway, and Cloudflare.
- 💼 **Department Budget Planner**: Allocate department budgets, set aside emergency contingency funds, and receive threshold overspend warnings.
- 📈 **ROI & Break-Even Calculator**: Payback period estimation, net profit calculations, and interactive revenue sensitivity sliders.
- 🔮 **Predictive 12-36 Month Forecasting**: Generates expense projections under *Conservative*, *Base*, and *Aggressive* growth models.
- 🌐 **Multi-Currency Converter**: Instant toggle between USD ($), EUR (€), GBP (£), and INR (₹).
- 📄 **Multi-Format Financial Exporter**: Export financial estimates and breakdowns in PDF, Excel (XLSX), CSV, and JSON formats.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend API** | Python 3.11/3.12, FastAPI, Uvicorn, Pydantic v2 |
| **Frontend Dashboard** | React 19, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons |
| **Testing** | Pytest, Pytest-Asyncio |
| **Containerization** | Docker, Docker Compose |

---

## 🔌 REST API Endpoints Directory

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/finance/estimate` | Estimate software project building & operating costs |
| `POST` | `/api/v1/finance/budget` | Allocate and update department budget parameters |
| `GET` | `/api/v1/finance/cloud-compare` | Fetch cloud infrastructure price matrix (AWS, GCP, Azure, Vercel, etc.) |
| `POST` | `/api/v1/finance/roi` | Compute ROI, payback period, and net profit timeline |
| `POST` | `/api/v1/finance/forecast` | Compute 12-36 month expense projections |
| `POST` | `/api/v1/finance/export` | Export financial reports (PDF, XLSX, CSV, JSON) |
| `GET` | `/api/v1/health` | Service health & status check |

---

## 🚀 Local Setup & Quick Start

### 1. Launch Backend Server (Port 8000)
```powershell
cd Single-Agent/finance-agent/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Launch Frontend Dashboard (Port 3000)
```powershell
cd Single-Agent/finance-agent/frontend
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
cd Single-Agent/finance-agent/backend
python -m pytest tests/ -v
```

---

## 📄 License & Credits
- **Part of**: LifeOS Autonomous Agent Suite  
- **Repository**: [`https://github.com/saikriz898/AgentVerse-Hackathon.git`](https://github.com/saikriz898/AgentVerse-Hackathon.git)
