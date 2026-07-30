# Enterprise Frontend Platform Architecture Guide

## Overview
The Enterprise Frontend Platform is built with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS. It connects directly to the Memory Agent (Agent 3) API server via TanStack Query and Zustand.

---

## Web Portal Page Hierarchy (20 Prerendered Static Routes)

```mermaid
graph TD
    Root[/] --> Redirect[/dashboard]
    Redirect --> Dash[Dashboard]
    Dash --> MemoryHub[Memory Hub /memory]
    Dash --> SearchPlayground[Search Playground /search]
    Dash --> GraphTopology[Graph View /graph]
    Dash --> Conversations[Conversations /conversations]
    Dash --> Projects[Projects /projects]
    Dash --> Knowledge[Knowledge Base /knowledge]
    Dash --> Documents[Documents /documents]
    Dash --> Analytics[Analytics /analytics]
    Dash --> Settings[Settings /settings]
    Dash --> SystemHealth[System Health /system-health]
```

---

## Global Features & Keyboard Shortcuts

- **Command Palette (`Ctrl+K` / `Cmd+K`)**: Instant global navigation drawer.
- **Glassmorphism Dark Theme**: Modern dark aesthetic with HSL color palettes and Tailwind utility classes (`glass-card`, `backdrop-blur`).
- **TanStack Query**: Server state caching, optimistic updates, and background refetching.
