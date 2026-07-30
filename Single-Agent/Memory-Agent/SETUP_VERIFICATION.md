# Setup Verification & Acceptance Test Suite

This document contains step-by-step verification commands to validate that the entire `memory-agent` monorepo builds, runs migrations against SQLite or Neon PostgreSQL, seeds data, executes test suites, starts servers, and responds correctly to API requests.

---

## Step 1: Environment Setup
Ensure `.env` exists at the repo root.
```bash
cp .env.example .env
```
Fill in secret credentials in `.env` if deploying to live services:
- `DATABASE_PROVIDER=postgres` (or `sqlite` for zero-dependency local mode)
- `DATABASE_URL="postgresql://neondb_owner:npg_Qj4NXx5HOMhZ@ep-blue-resonance-ayc559mq-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"`
- `GOOGLE_API_KEY="<your-google-gemini-api-key>"`
- `JWT_SECRET="super-secret-antigravity-key-32-chars-long-x891"`

---

## Step 2: Install Dependencies & Run Test Suite
```bash
npm install
npm test
```
**Expected Outcome**:
- All 385+ npm dependencies across workspaces install cleanly.
- Vitest unit tests (`cosine.test.ts`, `ranking.test.ts`, `context.test.ts`) and Supertest integration tests (`auth.test.ts`, `memory.test.ts`) pass 100% (5 test files, 9 tests passed).

---

## Step 3: Run Live Database Migrations & Seeding
```bash
# Execute Drizzle schema migration (creates 21 tables & enables pgvector on Neon)
npm run migrate

# Seed initial workspace, admin user, tags, and vector memory entries
npm run seed
```

### Exact Output Expected on Live Neon DB:
```
[INFO] Checking database schema initialization for provider: postgres...
[INFO] Connected to PostgreSQL (Neon) for schema migration.
[INFO] pgvector extension enabled / verified.
[INFO] PostgreSQL (Neon) 21-table schema initialized successfully.
[INFO] Starting database seed...
[INFO] Database seeded successfully!
```

---

## Step 4: Start API Server & Fast-Fail Startup Check Validation
```bash
npm run dev
```

### Startup Output:
```
[INFO] Performing startup environment & credentials check...
[INFO] ✅ PostgreSQL DATABASE_URL verified.
[INFO] ✅ GOOGLE_API_KEY / GEMINI_API_KEY verified.
===================================================
🚀 Memory Agent API (Agent 3) running on port 4000
📚 Swagger Documentation: http://localhost:4000/docs
💾 Database Provider: postgres
===================================================
```

---

## Step 5: Test Key API Endpoints via `curl`

### 1. Authenticate & Obtain JWT Token
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@antigravity.ai", "password": "AdminPass123!"}'
```
**Expected Output (JSON)**:
```json
{
  "user": {
    "id": "...",
    "email": "admin@antigravity.ai",
    "fullName": "Antigravity Admin",
    "role": "owner"
  },
  "workspace": {
    "id": "...",
    "name": "Antigravity Core Workspace",
    "slug": "antigravity-core"
  },
  "token": "eyJhbGciOiJIUzI1NiIsIn..."
}
```

---

### 2. Create Memory Entry (`POST /api/v1/memory`)
*(Replace `<TOKEN>` with token from Step 5.1)*
```bash
curl -X POST http://localhost:4000/api/v1/memory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "title": "Agent 3 Memory Service Specification",
    "content": "Central context and vector memory repository supporting hybrid RRF search.",
    "type": "long_term",
    "importance": 0.9,
    "pinned": true
  }'
```

---

### 3. Perform Vector Similarity Search (`POST /api/v1/search/vector-search`)
```bash
curl -X POST http://localhost:4000/api/v1/search/vector-search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "query": "hybrid search memory specification",
    "limit": 5
  }'
```

---

### 4. Build Agent Context Package (`POST /api/v1/context/build`)
```bash
curl -X POST http://localhost:4000/api/v1/context/build \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "query": "vector embeddings text-embedding-004",
    "maxTokens": 1000
  }'
```

---

## Step 6: Web Dashboard Access
1. Open browser to `http://localhost:3000`.
2. Login using `admin@antigravity.ai` / `AdminPass123!`.
3. Verify navigation links: Dashboard, Memory Hub, Search Playground, Relationship Graph, System Health.
