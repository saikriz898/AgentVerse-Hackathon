# Memory Agent Architecture

## High Level Overview
Memory Agent (Agent 3 of Antigravity Platform) acts as the stateful memory backbone across agentic interactions.

```
                  +--------------------------------+
                  |  Antigravity Multi-Agent Hub   |
                  +---------------+----------------+
                                  | REST / WebSockets
                                  v
+-------------------------------------------------------------------+
|                        Memory Agent API                           |
|  +----------------+  +-----------------+  +--------------------+  |
|  | Auth & Security|  | Search Engine   |  | Context Builder    |  |
|  | (JWT + RBAC)   |  | (Hybrid / RRF)  |  | (Merge & Truncate) |  |
|  +-------+--------+  +--------+--------+  +---------+----------+  |
|          |                    |                     |             |
|  +-------v--------------------v---------------------v----------+  |
|  | Engine Layer: Embedding | Ranking | Compression | Summarize |  |
|  +----------------------------+--------------------------------+  |
|                               |                                   |
|  +----------------------------v--------------------------------+  |
|  | Drizzle ORM Schema Layer (SQLite Dev / Postgres Prod)      |  |
|  +-------------------------------------------------------------+  |
+---------------------------------+---------------------------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
| Upstash / Redis Cache |                   | Neon PostgreSQL       |
| & BullMQ Queue        |                   | (pgvector enabled)    |
+-----------------------+                   +-----------------------+
```

## Modular Components
1. **Embedding Engine**: Converts memory text into 768-dim embeddings via Google Gemini `text-embedding-004`.
2. **Ranking Engine**: Implements Reciprocal Rank Fusion (RRF):
   $$RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
   Combined with custom weights for `Recency`, `Importance`, and `Relevance`.
3. **Context Builder**: Pulls top memories, applies pinned overrides, formats prompt context windows, and truncates within token thresholds.
4. **Eviction / Sweep Worker**: Background job periodically archiving or purging expired TTL short-term & session memories.
