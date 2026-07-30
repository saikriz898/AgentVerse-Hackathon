# Enterprise AI Finance Agent - Architecture Documentation

## Overview
The **Finance Agent** is an intelligent Financial Architect platform engineered for startups and enterprise tech teams. It estimates software development costs, cloud infrastructure expenses, AI service usage, and operational overheads while generating automated ROI models, predictive forecasts, budget allocations, and downloadable financial reports.

```
                  +-----------------------------------+
                  |   React 19 Enterprise Dashboard   |
                  |  (Recharts, Framer Motion, Tailwind)|
                  +-----------------+-----------------+
                                    | REST API / JSON
                                    v
                  +-----------------------------------+
                  |          FastAPI Backend          |
                  |  (Routers, Services, Repositories)|
                  +-----------------+-----------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
+-----------------------+                           +-------------------+
|  AI Financial Architect|                          | SQLite/PostgreSQL |
|  Engine (LLM/Rule)    |                           | Database Storage  |
+-----------------------+                           +-------------------+
```

## System Components

### 1. Frontend Layer
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide Icons.
- **Key Modules**:
  - `Dashboard`: Executive KPI grid, interactive expense line charts, donut cost distributions, risk widgets.
  - `Project Cost Estimator`: Inputs for project scope, tech stack, cloud providers, feature complexity; calculates 20+ line items with confidence scores and reasoning.
  - `Budget Planner`: Department budget allocations (Engineering, Cloud, AI, Security, Emergency Reserve).
  - `Cost Breakdown`: Itemized financial breakdown across 7 tiers (Dev, Infra, AI, DevOps, QA, Deploy, Maintenance).
  - `Infrastructure Cost`: Multi-cloud price comparison engine (AWS, Azure, GCP, DigitalOcean, Vercel, Supabase, Neon, Railway).
  - `ROI Analysis`: Investment payback modeling, break-even visualizer, profit margin calculators.
  - `Forecasting`: 12-36 month predictive expense growth simulator under Conservative, Base, and Aggressive scenarios.
  - `Financial Reports`: Report builder with instant export to PDF, Excel (XLSX), CSV, and JSON.
  - `Analytics`: Top cost drivers, quarterly comparison matrix, and resource usage metrics.
  - `Settings`: Currency conversion ($ USD, € EUR, £ GBP, ₹ INR), hourly developer rate configuration, AI key setup.

### 2. Backend Layer
- **Tech Stack**: FastAPI, Pydantic v2, SQLAlchemy, Uvicorn.
- **AI Financial Architect Engine**:
  - Blends heuristic software cost estimation models (calibrated against SF/EU rates, cloud pricing APIs, and LLM token pricing schemas) with optional OpenAI/Gemini live LLM generation.
  - Returns detailed rationale, risk score, confidence score, and cost optimization levers.

### 3. Data Storage
- SQLite default (`finance_agent.db`) for instant local setup with seamless PostgreSQL connection strings via `.env`.
