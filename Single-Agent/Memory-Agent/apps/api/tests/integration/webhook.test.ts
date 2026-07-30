import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Webhook Engine Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `webhooktest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Webhook Test User',
    });
    token = res.body.token;
  });

  it('should register a new webhook endpoint and return HMAC secret', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        url: 'https://example.com/webhook',
        events: ['memory.created', 'context.built'],
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.secret).toBeDefined();
  });

  it('should list registered workspace webhooks', async () => {
    const res = await request(app)
      .get('/api/v1/webhooks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.webhooks)).toBe(true);
    expect(res.body.webhooks.length).toBeGreaterThan(0);
  });
});
