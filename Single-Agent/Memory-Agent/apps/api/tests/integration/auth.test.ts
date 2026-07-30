import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await runMigrations();
  });

  it('should register a new user and create default workspace', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `test-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Test User',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.workspace).toBeDefined();
  });

  it('should return 400 validation error for weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'invalid@antigravity.ai',
      password: '123',
      fullName: 'A',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });
});
