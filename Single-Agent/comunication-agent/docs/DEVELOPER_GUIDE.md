# LifeOS Communication Agent - Developer Guide & Standards

This guide outlines setup, environment configuration, coding standards (PEP8, SOLID, Clean Architecture), and testing procedures for developers contributing to the Communication Agent.

---

## ⚙️ Environment Variables Reference (`.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PROJECT_NAME` | `string` | `"LifeOS Communication Agent"` | Service identifier |
| `DATABASE_URL` | `string` | `"sqlite+aiosqlite:///./communication_agent.db"` | PostgreSQL or SQLite async connection URL |
| `GEMINI_API_KEY` | `string` | `""` | Gemini 2.5 Flash API Key |
| `GEMINI_MODEL` | `string` | `"gemini-2.5-flash"` | Selected LLM Model |
| `SECRET_KEY` | `string` | `"supersecretkey_change_in_production"` | JWT Secret Key |
| `ALGORITHM` | `string` | `"HS256"` | JWT Algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `int` | `60` | JWT Access Token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `int` | `7` | JWT Refresh Token TTL |
| `HOST` | `string` | `"0.0.0.0"` | FastAPI binding host |
| `PORT` | `int` | `8004` | FastAPI binding port |
| `LOG_LEVEL` | `string` | `"INFO"` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |

---

## 🛠️ Local Development Setup

### 1. Backend Setup
```bash
cd comunication-agent/backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --port 8004 --reload
```

### 2. Run Tests & Linting
```bash
pytest -v
```

### 3. Frontend Setup
```bash
cd comunication-agent/frontend
npm install
npm run dev
```

---

## 📐 Coding Standards & Guidelines

1. **Clean Architecture & SOLID Principles**:
   - Keep controllers thin; place all payload parsing, AI fallback, and export formatting in `app/services/`.
   - All database access MUST pass through repositories in `app/repositories/`.
2. **Zero Hallucination Directive**:
   - Never fabricate metrics or dates not supplied in the input JSON payload.
   - If payload lacks required information, flag `has_missing_info: true` and populate `missing_info_details`.
3. **Type Safety & Validation**:
   - Use Pydantic schemas for request & response contracts.
   - Use TypeScript strict mode on the frontend.
