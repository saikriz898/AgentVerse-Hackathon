import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Context Builder Module Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `ctxtest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Context Test User',
    });
    token = res.body.token;

    await request(app)
      .post('/api/v1/memory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Pinned Core Architecture Context',
        content: 'System context for multi-agent platform execution',
        type: 'working',
        importance: 1.0,
        pinned: true,
      });
  });

  it('should assemble dynamic context package with token count', async () => {
    const res = await request(app)
      .post('/api/v1/context/build')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: 'multi-agent execution', maxTokens: 1000 });

    expect(res.status).toBe(200);
    expect(res.body.contextText).toBeDefined();
    expect(res.body.tokenCount).toBeGreaterThan(0);
    expect(res.body.memoryCount).toBeGreaterThan(0);
  });
});
