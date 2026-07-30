# Folder Structure Guide

```
memory-agent/
├── package.json               # Root monorepo configuration
├── docker-compose.yml         # Container orchestration
├── docs/                      # Technical specification & architecture docs
└── apps/
    ├── api/                   # Backend Express + Drizzle ORM workspace
    │   ├── src/
    │   │   ├── config/        # Environment, DB, Redis & Gemini setup
    │   │   ├── db/            # Schema, migrations, seeders
    │   │   ├── engines/       # Embeddings, RRF ranking, summarization, compression
    │   │   ├── jobs/          # BullMQ queue & workers
    │   │   ├── middleware/    # Auth, error, rate limit, audit logging
    │   │   ├── modules/       # Clean architecture feature modules
    │   │   ├── utils/         # Math, pagination, logger helpers
    │   │   └── server.ts      # Application entrypoint
    │   └── tests/             # Unit & Supertest integration tests
    └── web/                   # Frontend Next.js 16 App Router workspace
        ├── app/               # Routes & layout definitions
        ├── components/        # Reusable UI components & navigation
        ├── lib/               # API client setup
        └── stores/            # State management (Zustand)
```
