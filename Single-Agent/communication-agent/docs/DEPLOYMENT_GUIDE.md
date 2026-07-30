# LifeOS Communication Agent - Multi-Cloud Deployment Guide

This guide details step-by-step instructions for deploying the **LifeOS Communication Agent** across major cloud platforms and container runtimes.

---

## 🐋 1. Docker Compose Local & Production Deployment

### Prerequisites
- Docker Engine v24.0+ & Docker Compose v2.20+

### Deployment Command
```bash
cd comunication-agent
docker-compose up --build -d
```

---

## 🚂 2. Railway & Render Deployment

### Railway (Backend + PostgreSQL)
1. Provision a new PostgreSQL instance on Railway.
2. Set environment variables:
   - `DATABASE_URL`: `postgresql+asyncpg://<user>:<password>@<host>:<port>/railway`
   - `GEMINI_API_KEY`: Your Gemini 2.5 Flash API Key
   - `SECRET_KEY`: Production random secret string
3. Deploy root directory using `backend/Dockerfile`.

### Render
1. Create a Web Service pointing to `comunication-agent/backend`.
2. Environment: `Python 3.10`.
3. Build Command: `pip install -r requirements.txt`.
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`.

---

## ☁️ 3. AWS (ECS Fargate + RDS PostgreSQL)

1. Provision Amazon RDS for PostgreSQL instance.
2. Build and push container images to Amazon Elastic Container Registry (ECR):
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login ...
   docker build -t communication-backend ./backend
   docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/communication-backend:latest
   ```
3. Create Amazon ECS Task Definition with Container Port `8004`.

---

## 🟦 4. Google Cloud Run

```bash
gcloud auth login
gcloud builds submit --tag gcr.io/<PROJECT_ID>/communication-agent-backend ./backend
gcloud run deploy communication-agent \
  --image gcr.io/<PROJECT_ID>/communication-agent-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=postgresql+asyncpg://...
```
