# Agent Communication & MCP Integration Architecture Guide

## Overview
The Agent Communication Platform provides dynamic Agent Registration, Heartbeat Tracking, and Model Context Protocol (MCP) JSON-RPC Tool Execution for all agents in the Antigravity Multi-Agent Platform (Agent 1 to Agent N).

---

## MCP Architecture Diagram

```mermaid
sequenceDiagram
    autonumber
    participant ExternalAgent as Coding / Planning Agent
    participant MCP as MCP Router (/api/v1/agents/mcp)
    participant Registry as Agent Registry
    participant MemoryEngine as Memory Engine & Search

    ExternalAgent->>Registry: POST /api/v1/agents/register (Agent Metadata)
    Registry-->>ExternalAgent: 201 Registered
    ExternalAgent->>MCP: POST /api/v1/agents/mcp (tools/list)
    MCP-->>ExternalAgent: Available Tools (create_memory, vector_search, build_context)
    ExternalAgent->>MCP: POST /api/v1/agents/mcp (tools/call: vector_search)
    MCP->>MemoryEngine: Execute hybrid vector search
    MemoryEngine-->>MCP: Search results
    MCP-->>ExternalAgent: JSON-RPC 2.0 Response
```

---

## MCP JSON-RPC Protocol Endpoints

- `POST /api/v1/agents/register`: Dynamic agent capability registration.
- `POST /api/v1/agents/heartbeat`: Health check & heartbeat keepalive.
- `GET /api/v1/agents`: List all online platform agents in workspace.
- `POST /api/v1/agents/mcp`: Standard MCP JSON-RPC 2.0 handler (`tools/list`, `tools/call`).
