import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Background Queue & Workflow Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `queuetest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Queue Test User',
    });
    token = res.body.token;
  });

  it('should fetch background queue status and counts', async () => {
    const res = await request(app)
      .get('/api/v1/queues/status')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.queues).toBeDefined();
    expect(res.body.status).toBe('healthy');
  });

  it('should trigger sequential background workflow', async () => {
    const res = await request(app)
      .post('/api/v1/queues/trigger-workflow')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tasks: [
          { id: '1', type: 'embed', data: { memoryId: 'test-mem-1', content: 'Sample text' } },
        ],
      });

    expect(res.status).toBe(202);
    expect(res.body.workflowId).toBeDefined();
  });
});
