# Troubleshooting Guide

## Common Issues & Resolutions

### 1. `pgvector extension not installed` (Postgres Mode)
**Symptom**: Error when running vector migrations or vector search queries.
**Fix**: Ensure `CREATE EXTENSION IF NOT EXISTS vector;` has been executed on your PostgreSQL instance, or switch `DATABASE_PROVIDER=sqlite` for local development.

### 2. `GEMINI_API_KEY is invalid`
**Symptom**: Embedding worker fails to generate vectors.
**Fix**: Verify your API key at [Google AI Studio](https://aistudio.google.com/). If developing offline without a key, the Embedding Engine automatically switches to deterministic synthetic fallback vectors.

### 3. Redis Connection Error
**Symptom**: `ECONNREFUSED 127.0.0.1:6379`.
**Fix**: Ensure Redis is running via `docker compose up redis -d` or set `REDIS_URL` to an Upstash instance.
