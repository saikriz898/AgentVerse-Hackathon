# 🧠 Memory Agent — Central Context & Vector Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express&logoColor=white)](https://expressjs.com)
[![Neon PostgreSQL](https://img.shields.io/badge/Vector_DB-Neon%20pgvector-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)
[![Gemini Embeddings](https://img.shields.io/badge/Embeddings-Gemini%20text--embedding--004-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

> **Central Autonomous Vector Memory & Knowledge Engine for the Single Agent Ecosystem**  
> Serving as the persistent context backbone, vector search index, and 2D graph topology engine for all 6 specialized single agents (*Research*, *Planning*, *Finance*, *Review*, *Communication*, and *Memory*).

---

## 📋 Table of Contents
- [🌟 Role in the Single-Agent Ecosystem](#-role-in-the-single-agent-ecosystem)
- [🔄 Inter-Agent Context Integration Matrix](#-inter-agent-context-integration-matrix)
- [✨ Core Capabilities & Architecture](#-core-capabilities--architecture)
- [🌐 4-Directional Graph Topology Engine (`/graph`)](#-4-directional-graph-topology-engine-graph)
- [🔍 Hybrid RRF Search Engine (`/search` & `/context`)](#-hybrid-rrf-search-engine-search--context)
- [🛠️ Technology Stack](#️-technology-stack)
- [🔌 REST API Endpoints Directory](#-rest-api-endpoints-directory)
- [🚀 Local Setup & Quick Start](#-local-setup--quick-start)

---

## 🌟 Role in the Single-Agent Ecosystem

In the LifeOS platform, **Memory Agent** acts as the central persistent memory and knowledge repository. Without Memory Agent, single agents operate statelessly, losing context between execution cycles. Memory Agent bridges this gap by offering:

1. **Persistent Vector Storage**: Stores 768-dimensional embeddings generated via Google Gemini `text-embedding-004`.
2. **Context Window Assembly**: Assembles dynamic prompt context packages scored by `(recency × importance × relevance)`.
3. **Knowledge Graph Visualization**: Renders node relationships across memories, agents, projects, and tasks in an interactive 2D graph.

---

## 🔄 Inter-Agent Context Integration Matrix

Memory Agent directly interfaces with all **5 other Single Agents** in the ecosystem:

| Agent Name | Interaction Direction | Integration Mechanism & Payload |
| :--- | :---: | :--- |
| **🔬 Research Agent** | **Write & Read** | Pushes research summaries, citations, keywords, and confidence scores directly to `/api/v1/memory`. Queries Memory Agent for historical research to prevent redundant web crawling. |
| **📅 Planning Agent** | **Read** | Queries Memory Agent via `/api/v1/context` for past project roadmaps, task breakdowns, and risk logs to generate accurate 10-stage execution plans. |
| **💰 Finance Agent** | **Read & Write** | Fetches baseline project scope from Memory Agent to calculate 20+ cost parameters, and saves final budget allocations to `/api/v1/projects`. |
| **🛡️ Review Agent** | **Read & Write** | Verifies generated outputs against compliance rules stored in Memory Agent's `knowledge_base` partition, and logs QA scores (Score &ge; 80 approval gate). |
| **📧 Communication Agent** | **Read** | Pulls consolidated context package from Memory Agent to format executive summaries, meeting notes, release notes, and standups. |

---

## ✨ Core Capabilities & Architecture

### ⚡ Unified Memory Engine (`/memory`)
- **Central Partition Stream**: Consolidates entries across 4 partitions: `Working Memory`, `Long-Term Memory`, `Knowledge Base`, and `Project Workspace`.
- **Category Tabs**: Filter by `All Entries`, `Working`, `Knowledge Base`, `Projects`, `Long Term`, `Short Term`, `Pinned`, and `Archived`.
- **0ms Optimistic TanStack Query Cache**: Client-side instant mutation without screen flicker or auto-closing modals.
- **Cascade Deletion**: Hard deletion of records and foreign-key dependencies from Neon PostgreSQL (`pgvector`).

---

## 🌐 4-Directional Graph Topology Engine (`/graph`)

- **4-Directional Viewport Panning**: Smooth drag-and-pan canvas navigation.
- **Dynamic Node Repositioning**: Drag-and-drop node movement with real-time Bezier curved edge recalculations.
- **5%-600% Multi-Tier Semantic Zoom**: Adaptive rendering from high-level clusters down to raw metadata inspection.
- **Glassmorphism Control Dock**: Preset algorithm switches (*Physics*, *Orbits*, *Tree*, *Organic*), camera fly-to, and bookmark management.

---

## 🔍 Hybrid RRF Search Engine (`/search` & `/context`)

- **Reciprocal Rank Fusion (RRF)**: Merges dense vector similarity (`text-embedding-004` 768-dim) with sparse BM25 keyword matching for maximum recall precision.
- **Autonomous Context Builder**: Dynamic context package assembly scored by:
  $$\text{Score} = \text{Recency} \times \text{Importance} \times \text{Relevance}$$
- **Token Truncation**: Automatically fits retrieved context into LLM token windows with pinned memory priority.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Dashboard** | Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion, Lucide Icons |
| **State & Caching** | TanStack Query v5 (React Query), Zustand |
| **Backend API** | Node.js, Express, TypeScript |
| **Database & ORM** | Neon PostgreSQL (`pgvector`), SQLite (`better-sqlite3`), Drizzle ORM |
| **AI Embeddings** | Google Gemini API (`text-embedding-004`), LangChain |

---

## 🔌 REST API Endpoints Directory

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/memory?limit=200` | Fetch memory stream entries |
| `POST` | `/api/v1/memory` | Store new vector memory entry |
| `POST` | `/api/v1/knowledge` | Add knowledge base guideline |
| `POST` | `/api/v1/projects` | Initialize project workspace partition |
| `POST` | `/api/v1/search` | Execute RRF Hybrid Search (Vector + BM25) |
| `POST` | `/api/v1/context` | Assemble dynamic context window payload |
| `GET` | `/api/v1/graph` | Fetch 2D graph topology nodes and Bezier edge relationships |
| `POST` | `/api/v1/admin/reset` | Reset database records |
| `GET` | `/api/v1/admin/health` | Service health & database status check |

---

## 🚀 Local Setup & Quick Start

### 1. Prerequisites
- Node.js `>= 20.x`
- npm `>= 10.x`

### 2. Navigate to Memory Agent Directory
```bash
cd Single-Agent/Memory-Agent
npm install
```

### 3. Configure Environment Variables (`.env`)
```env
PORT=4000
DATABASE_PROVIDER=postgres
DATABASE_URL="postgres://[user]:[password]@[host]/[dbname]?sslmode=require"
GEMINI_API_KEY="your-google-gemini-api-key"
JWT_SECRET="your-jwt-secret-key"
```

### 4. Database Migration & Seeding
```bash
npm run migrate
npm run seed
```

### 5. Launch Development Servers
```bash
npm run dev
```
- **Web Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api/v1`
- **API Health Check**: `http://localhost:4000/api/v1/admin/health`

---

## 📄 License & Credits
- **Part of**: LifeOS Autonomous Agent Suite  
- **Repository**: [`https://github.com/saikriz898/AgentVerse-Hackathon.git`](https://github.com/saikriz898/AgentVerse-Hackathon.git)
