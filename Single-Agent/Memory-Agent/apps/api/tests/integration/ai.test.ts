import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('AI Intelligence Module Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `aitest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'AI Test User',
    });
    token = res.body.token;
  });

  it('should auto-classify memory text', async () => {
    const res = await request(app)
      .post('/api/v1/ai/classify')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fix bug in Postgres driver', content: 'Database timeout bug error fix required' });

    expect(res.status).toBe(200);
    expect(res.body.category).toBe('bug');
    expect(res.body.confidence).toBeGreaterThan(0.5);
  });

  it('should extract tech entities and tasks', async () => {
    const res = await request(app)
      .post('/api/v1/ai/extract')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Integrated PostgreSQL, Redis, and Next.js. TODO: add unit tests.' });

    expect(res.status).toBe(200);
    expect(res.body.technologies).toContain('PostgreSQL');
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });
});
