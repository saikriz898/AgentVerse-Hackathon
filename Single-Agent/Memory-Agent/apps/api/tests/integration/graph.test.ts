import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Graph Relationship Module Integration Tests', () => {
  let token: string;
  let sourceId: string;
  let targetId: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `graphtest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Graph Test User',
    });
    token = res.body.token;

    const m1 = await request(app)
      .post('/api/v1/memory')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Source Node', content: 'Node A content', type: 'long_term' });
    sourceId = m1.body.id;

    const m2 = await request(app)
      .post('/api/v1/memory')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Target Node', content: 'Node B content', type: 'long_term' });
    targetId = m2.body.id;
  });

  it('should link two memory nodes together in relationship graph', async () => {
    const res = await request(app)
      .post('/api/v1/graph/link')
      .set('Authorization', `Bearer ${token}`)
      .send({ sourceId, targetId, relationType: 'references', weight: 1.0 });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('should retrieve full node and edge topology graph', async () => {
    const res = await request(app)
      .get('/api/v1/graph')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.nodes)).toBe(true);
    expect(Array.isArray(res.body.edges)).toBe(true);
  });
});
