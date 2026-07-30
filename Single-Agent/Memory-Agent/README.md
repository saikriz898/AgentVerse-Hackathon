# 🧠 Memory Agent (AgentVerse / Antigravity Platform)

Production-grade **Central Autonomous Memory & Context Engine** for Multi-Agent AI Systems. Built with Next.js 16 App Router, Node.js, Express, Drizzle ORM, Google Gemini API, and Neon PostgreSQL (`pgvector`).

---

## ✨ Key Capabilities & Highlights

### ⚡ Unified Memory Engine (`/memory`)
- **Centralized Partition Stream**: Consolidates working memories, long-term memory, knowledge base guidelines, and project workspace partitions into a single unified stream.
- **Dedicated Filtering Tabs**: Instant category switching between `All Entries`, `Working`, `Knowledge Base`, `Projects`, `Long Term`, `Short Term`, `Pinned`, and `Archived`.
- **Dedicated Quick Creation Actions**: Header quick-action buttons for `+ Store Memory`, `+ Add Knowledge`, and `+ New Project` with modal category switcher tabs.
- **0ms Optimistic TanStack Query Cache**: Instant client-side state mutation without auto-closing or background refetch overwrites.
- **Hard Auto-Delete System**: Instant, cascade deletion of records and foreign-key dependencies from Neon PostgreSQL.

### 🌐 4-Directional Graph Topology Engine (`/graph`)
- **Interactive 4-Directional Canvas Pan**: Drag anywhere on the canvas background to shift the viewport left, right, up, and down effortlessly.
- **Node Drag-and-Drop Repositioning**: Click and drag individual memory nodes anywhere on the 2D canvas with real-time Bezier curved edge recalculation.
- **5%-600% Multi-Tier Semantic Zoom**: Adaptive node details rendering from high-level clusters to full inline metadata inspectors.
- **Fixed Top-Right Glassmorphism Control Dock**: Non-blocking zoom, layout algorithms (Physics, Orbits, Tree, Organic), camera fly-to, and camera view bookmarks.

### 🔍 Hybrid RRF Search & Context Builder (`/search` & `/context`)
- **Reciprocal Rank Fusion (RRF)**: Combines dense vector similarity generated via Google Gemini `text-embedding-004` (768-dim) with sparse BM25 keyword matching.
- **Autonomous Context Builder**: Dynamic context package assembly scored by `(recency × importance × relevance)` with token window truncation and pinned memory priority.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide Icons |
| **State & Caching** | TanStack Query v5 (React Query) |
| **Backend API** | Node.js, Express, TypeScript |
| **Database & ORM** | Neon PostgreSQL (`pgvector`), SQLite (`better-sqlite3`), Drizzle ORM |
| **AI & Embeddings** | Google Gemini API (`text-embedding-004`), LangChain utilities |
| **Background Processing**| BullMQ, Redis (optional async queue) |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js >= 20.x
- npm >= 10.x

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/saikriz898/Memory-Agrent.git
cd Memory-Agrent
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

Set your environment variables in `.env`:
```env
PORT=4000
DATABASE_PROVIDER=postgres
DATABASE_URL="postgres://[user]:[password]@[host]/[dbname]?sslmode=require"
GEMINI_API_KEY="your-google-gemini-api-key"
JWT_SECRET="your-jwt-secret-key"
```

### 4. Database Migration & Seed
```bash
npm run migrate
npm run seed
```

### 5. Run Development Servers
```bash
npm run dev
```
- **Web Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api/v1`
- **API Health Check**: `http://localhost:4000/api/v1/admin/health`

---

## 🌐 Production Deployment Guide

### Deploying Backend (`apps/api`) on Render / Railway
1. Create a new Web Service pointing to `apps/api`.
2. Build Command: `npm install && npm run build`
3. Start Command: `npm start` (or `node dist/index.js`)
4. Set Environment Variables: `DATABASE_URL`, `DATABASE_PROVIDER=postgres`, `GEMINI_API_KEY`, `JWT_SECRET`.

### Deploying Frontend (`apps/web`) on Vercel
1. Import repository into Vercel and select root directory `apps/web`.
2. Framework Preset: `Next.js`.
3. Environment Variable: `NEXT_PUBLIC_API_URL` = `https://your-api-url.onrender.com/api/v1`

---

## 📚 Primary API Endpoints

- `GET /api/v1/memory?limit=200`: Fetch memory stream entries
- `POST /api/v1/memory`: Store new memory entry
- `POST /api/v1/knowledge`: Create knowledge base article
- `POST /api/v1/projects`: Initialize project workspace
- `GET /api/v1/graph`: Fetch graph topology nodes and edges
- `POST /api/v1/admin/reset`: Reset all database records

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for details.
