import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Search Module Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `searchtest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Search Test User',
    });
    token = res.body.token;

    // Seed test memory
    await request(app)
      .post('/api/v1/memory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Vector Search Indexed Entry',
        content: 'Testing hybrid Reciprocal Rank Fusion vector similarity search',
        type: 'long_term',
        importance: 0.95,
      });
  });

  it('should return 401 when unauthenticated', async () => {
    const res = await request(app).post('/api/v1/search/vector-search').send({ query: 'hybrid search' });
    expect(res.status).toBe(401);
  });

  it('should perform vector similarity search successfully', async () => {
    const res = await request(app)
      .post('/api/v1/search/vector-search')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: 'hybrid search', limit: 5 });

    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  it('should perform hybrid search successfully', async () => {
    const res = await request(app)
      .post('/api/v1/search/hybrid')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: 'hybrid search', limit: 5 });

    expect(res.status).toBe(200);
    expect(res.body.results).toBeDefined();
  });
});
