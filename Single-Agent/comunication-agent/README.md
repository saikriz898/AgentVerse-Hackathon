# LifeOS Communication Agent 📧💬

> **Production-ready AI-powered Communication Agent** for the **LifeOS Multi-Agent Ecosystem**.

The **Communication Agent** serves as the final presentation layer of the LifeOS ecosystem. It transforms raw, technical JSON outputs from every other agent (*Chief of Staff*, *Research Agent*, *Planning Agent*, *Memory Agent*, *Execution Agent*, *Review Agent*) into clear, professional, human-readable communication tailored to specific output destinations (*Manager*, *Executive*, *Client*, *Professor*, *Developer*, *Team*, *Stakeholders*, *Project Lead*, *User*).

---

## 🌟 Primary Purpose & Capabilities

- 🤖 **Gemini 2.5 Flash Powered**: Uses Gemini AI for intelligent summarization, executive formatting, tone adaptation, and documentation structuring.
- 🛡️ **Zero Fabrication / Zero Hallucination**: Enforces strict principles to preserve 100% technical accuracy, metrics, code, and validated facts without inventing details.
- ⚠️ **Missing Information Transparency**: Automatically detects incomplete input JSON structures and flags missing fields explicitly.
- 🔄 **100% Offline Fallback Engine**: Built with a deterministic rule-based template engine so documents generate seamlessly even when offline or without an API key.
- 📊 **20 Core Responsibilities & 19 Supported Output Types**:
  - Executive Summaries, Project Summaries, Research Summaries, Planning Summaries, Execution Summaries, Review Summaries.
  - Meeting Notes, Professional Emails, Markdown Reports, HTML Reports, Status Updates, Progress Reports.
  - Release Notes, API Documentation, Technical Documentation, Presentation Notes, Blog Style Reports, Weekly Reports, Daily Standups.
- 🎨 **Modern Interactive Web Studio**: React + Vite + TypeScript dashboard featuring side-by-side JSON editor, live rendered Markdown, HTML iframe preview, simulated Email view, slide presentation mode, history analytics, and exports.

---

## 🏗️ Architecture & Structure

```
comunication-agent/
├── backend/                  # FastAPI Python server
│   ├── app/
│   │   ├── ai/               # Gemini 2.5 Flash SDK & REST client & Prompts
│   │   ├── api/              # REST Endpoints (/transform, /history, /export, /templates, /stats)
│   │   ├── core/             # Configuration & Logger
│   │   ├── database/         # Async SQLAlchemy & SQLite/PostgreSQL setup
│   │   ├── models/           # DB Schema (CommunicationRecord, CommunicationTemplate)
│   │   ├── schemas/          # Pydantic request/response validation schemas
│   │   ├── services/         # Transformation engine, Fallback engine, Export service
│   │   └── main.py
│   ├── tests/                # Pytest automated test suite
│   ├── .env.example
│   └── requirements.txt
├── frontend/                 # React + Vite + TypeScript Glassmorphism Dashboard
│   ├── src/
│   │   ├── components/       # Studio, OutputPreview, HistoryViewer, StatsOverview, PresetTemplates, Navbar
│   │   ├── services/         # Axios API Client
│   │   └── types/            # TypeScript interfaces
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Server Setup

```bash
cd comunication-agent/backend

# Create python virtual environment & install requirements
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# (Optional) Add your Gemini API key to .env
# GEMINI_API_KEY=your_key_here

# Run backend server (Port 8004)
uvicorn app.main:app --reload --port 8004
```

### 2. Frontend Dashboard Setup

```bash
cd comunication-agent/frontend

# Install dependencies
npm install

# Start Vite dev server (Port 5173)
npm run dev
```

---

## 🧪 Automated Testing

Run the backend test suite:

```bash
cd comunication-agent/backend
pytest
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/communication/transform` | Core endpoint converting technical JSON into structured documents |
| `GET` | `/api/v1/communication/history` | Paginated list of past transformation logs |
| `GET` | `/api/v1/communication/history/{id}` | Single transformation log detail |
| `POST` | `/api/v1/communication/export` | Export document to `.md`, `.html`, `.txt`, `.json` |
| `GET` | `/api/v1/communication/templates` | List pre-built and custom document templates |
| `GET` | `/api/v1/communication/stats` | Analytics summary metrics |
| `GET` | `/api/v1/health` | Health & LLM status check |

---

## 📄 License
Part of the **LifeOS Multi-Agent Ecosystem**.
