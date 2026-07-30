# LifeOS Research Agent 🔬🤖

**Version:** 1.0.0  
**Role:** AI Research Specialist  
**System:** LifeOS Multi-Agent AI Architecture  
**Owner:** Member 1  

The **LifeOS Research Agent** is a production-ready, autonomous AI Research Specialist module designed to gather, verify, summarize, and cross-reference information across multiple web, documentation, GitHub, and academic sources.

---

## 🏗 System Architecture

```mermaid
graph TD
    User([User / Chief of Staff]) -->|HTTP / REST JSON| API[FastAPI Server]
    
    subgraph FastAPI Backend
        API --> Auth[JWT Auth Middleware]
        API --> Router[Research Engine Controller]
        
        Router --> Planner[Gemini 2.5 Flash Query Planner]
        Planner -->|Generated Queries| MultiSearch[Multi-Source Search Router]
        
        MultiSearch --> Tavily[Tavily Search API (3x Retry)]
        MultiSearch -->|Fallback| HTTPCrawler[BeautifulSoup / HTTP Scraper]
        
        Tavily --> Scraper[Article Extractor & Scraper]
        HTTPCrawler --> Scraper
        
        Scraper --> FactChecker[Cross-Source Fact Checker]
        FactChecker --> Confidence[Multi-Factor Confidence Scoring (0-100%)]
        Confidence --> Synthesizer[Gemini 2.5 Synthesis Engine]
        Synthesizer --> Citations[Citation & Reference Generator]
    end
    
    subgraph Data & Storage
        Router --> PostgreSQL[(PostgreSQL: lifeos_research)]
        Router --> Redis[(Redis Cache)]
    end
    
    subgraph Inter-Agent Sync
        Router -->|Async HTTP| MemoryAgent[LifeOS Memory Agent]
    end
    
    subgraph React Frontend
        Dashboard[React + Vite + Tailwind Dashboard] -->|REST API| API
    end
```

---

## ⚡ Main Features

1. **Intelligent Query Expansion:** Uses Gemini 2.5 Flash to expand user objectives into targeted domain queries (Official Docs, GitHub Repos, Research Papers).
2. **Multi-Source Web Search:** Queries Tavily Search API with exponential 3x retry backoff and automatically falls back to HTTP web crawlers.
3. **Cross-Source Fact Verification:** Detects contradictions and verifies factual claims across independent references.
4. **Multi-Factor Confidence Scoring:** Computes an empirical confidence score (0-100%) based on domain authority, recency, consistency, and official references.
5. **Standardized LifeOS JSON Output:** Exposes structured JSON payloads for seamless multi-agent interop.
6. **Automatic Memory Sync:** Pushes summary, references, confidence, and keywords directly to the LifeOS Memory Agent.
7. **Premium Glassmorphic Dashboard:** Includes real-time research visualizers, filterable history archives, bookmark collections, and Recharts analytics.

---

## 📊 Standard LifeOS JSON Output Spec

```json
{
  "status": "success",
  "agent": "Research",
  "request_id": "8f3b2d10-3c2a-4a5f-9e12-897b6c5d4e3f",
  "timestamp": "2026-07-28T12:00:00Z",
  "confidence": 95,
  "summary": "Synthesized multi-source research report...",
  "executive_summary": "Concise 2-sentence executive summary.",
  "keywords": ["Multi-Agent AI", "FastAPI", "Gemini 2.5 Flash"],
  "references": [
    {
      "website_name": "Google Developer Docs",
      "article_title": "Gemini 2.5 Flash Architecture",
      "url": "https://ai.google.dev/docs/gemini_2_5",
      "published_date": "2026-02-15",
      "author": "Google DeepMind",
      "credibility_score": 0.95
    }
  ],
  "recommendations": [
    "Integrate verified findings into Memory Agent store.",
    "Monitor primary sources for ongoing framework updates."
  ],
  "execution_time": "2.42s"
}
```

---

## 🔗 REST API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/research/start` | Executes full deep multi-source research pipeline |
| `POST` | `/api/research/search` | Fast multi-source search query |
| `POST` | `/api/research/summarize` | Summarizes raw text content or URL |
| `POST` | `/api/research/compare` | Compares two or more research topics |
| `POST` | `/api/research/fact-check` | Verifies specific claims against live web sources |
| `GET` | `/api/research/history` | Fetches paginated research history |
| `GET` | `/api/research/result/{id}` | Fetches full research payload by UUID |
| `DELETE` | `/api/research/{id}` | Deletes research record |
| `POST` | `/api/agent/chief-of-staff/query` | Chief of Staff Agent research entrypoint |
| `GET` | `/api/analytics/dashboard` | Dashboard metrics & chart dataset |
| `POST` | `/api/auth/register` | Registers new user specialist |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT token |

---

## 🚀 Quickstart & Local Setup

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone repository & copy environment configuration
cp .env.example .env

# 2. Build and launch containers
docker-compose up --build -d

# 3. Access Services:
# Frontend Dashboard: http://localhost:3000
# FastAPI Swagger Docs: http://localhost:8000/docs
```

### Option 2: Local Python & Node Setup

#### Backend Setup:
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Linux/macOS: source venv/bin/activate
pip install -r requirements.txt

# Run migrations and start server
python -m backend.database.init_db
uvicorn backend.main:app --reload --port 8000
```

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Automated Tests

```bash
cd backend
pytest tests/ -v
```

Tests cover:
- Authentication & JWT handler (`test_auth.py`)
- Research engine pipeline & fallback crawlers (`test_search.py`)
- Gemini 2.5 Flash query planner & summarizer (`test_gemini.py`)
- Tavily 3x retry mechanism (`test_tavily.py`)
- Inter-Agent REST interfaces (`test_agent_interop.py`)
