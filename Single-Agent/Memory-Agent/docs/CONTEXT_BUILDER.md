# Context Builder & Memory Orchestration Engine

## Overview
The Context Builder & Memory Orchestration Engine compiles, ranks, deduplicates, and truncates relevant workspace memories into an optimized context package for LLM inference requests across multi-agent workflows.

---

## Context Pipeline Flow

```mermaid
sequenceDiagram
    autonumber
    participant Agent as Antigravity Agent
    participant Builder as Context Builder Service
    participant Search as Hybrid RRF Search Engine
    participant DB as Neon PostgreSQL
    participant Assembler as Multi-LLM Prompt Assembler

    Agent->>Builder: POST /api/v1/context/build (query, maxTokens)
    Builder->>DB: Fetch pinned & high-importance working memories
    Builder->>Search: Execute hybrid vector & text search
    Search-->>Builder: Ranked candidate memories
    Builder->>Builder: Deduplicate & rank via Composite Score
    Builder->>Builder: Truncate context string to maxTokens budget
    Builder->>Assembler: Format system & user prompt for target provider
    Builder-->>Agent: Return Context Package & Token Count
```

---

## Composite Context Scoring Formula

$$\text{ContextScore} = 0.5 \times \text{Relevance} + 0.3 \times \text{Importance} + 0.2 \times \text{Recency} + \text{PinnedBoost}$$

---

## Endpoints

- `POST /api/v1/context/build`: Dynamic context compilation with token budget enforcement.
- `POST /api/v1/context/assemble-prompt`: Construct provider-specific prompts (Gemini, OpenAI, Claude, Ollama).
- `GET /api/v1/context/analytics`: Context build performance, average token counts, and latency statistics.
