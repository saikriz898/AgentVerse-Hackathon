import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Memory Route Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `memtest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Memory Test User',
    });
    token = res.body.token;
  });

  it('should return 401 Unauthorized when token is missing', async () => {
    const res = await request(app).get('/api/v1/memory');
    expect(res.status).toBe(401);
  });

  it('should create a memory entry with valid token', async () => {
    const res = await request(app)
      .post('/api/v1/memory')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Integration Test Memory',
        content: 'Testing memory creation endpoint',
        type: 'long_term',
        importance: 0.8,
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});
