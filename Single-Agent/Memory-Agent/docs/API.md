# Memory Agent API Reference

## Authentication
All requests (except public auth routes) require a `Bearer <JWT_TOKEN>` header.

### Endpoints Overview

#### 1. Auth Module
- `POST /api/v1/auth/register` - Create account & default workspace.
- `POST /api/v1/auth/login` - Authenticate & receive tokens.
- `POST /api/v1/auth/refresh` - Refresh access token.

#### 2. Memory Module
- `POST /api/v1/memory` - Create memory entry.
- `GET /api/v1/memory` - List memory entries (with pagination & type filtering).
- `GET /api/v1/memory/:id` - Fetch single memory entry.
- `PATCH /api/v1/memory/:id` - Update entry (creates `memory_versions` record).
- `DELETE /api/v1/memory/:id` - Soft delete memory entry.

#### 3. Search Module
- `POST /api/v1/search/vector` - Perform vector similarity search.
- `POST /api/v1/search/hybrid` - Perform Reciprocal Rank Fusion (hybrid FTS + vector) search.

#### 4. Context Builder Module
- `POST /api/v1/context/build` - Assemble dynamic context package for an agent prompt.

#### 5. Graph Module
- `GET /api/v1/graph` - Fetch node & edge relationship graph.
- `POST /api/v1/graph/link` - Connect two memory entries.

#### 6. Admin & Health
- `GET /api/v1/admin/health` - Check API, database, and Redis health.
- `GET /api/v1/admin/audit` - Inspect audit trail logs.
