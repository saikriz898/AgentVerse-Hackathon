# Deployment Guide

## Production Checklist

### 1. Database Provisioning (Neon Postgres)
- Create a PostgreSQL database on [Neon.tech](https://neon.tech).
- Enable `pgvector` extension in Neon query editor:
  ```sql
  CREATE EXTENSION IF NOT EXISTS vector;
  ```

### 2. Environment Configuration
Set production environment variables in your deployment environment (e.g. Render, Railway, Vercel, AWS ECS):
```env
NODE_ENV=production
DATABASE_PROVIDER=postgres
DATABASE_URL=postgres://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=<strong-random-32-byte-secret>
GEMINI_API_KEY=<google-gemini-key>
REDIS_URL=rediss://default:pass@redis-provider.upstash.io:6379
```

### 3. Build & Run Containers
```bash
docker-compose -f docker-compose.yml up --build -d
```
