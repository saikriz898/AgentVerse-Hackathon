import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { runMigrations } from '../../src/db/migrate.js';

describe('Agent Registry & MCP Integration Tests', () => {
  let token: string;

  beforeAll(async () => {
    await runMigrations();
    const res = await request(app).post('/api/v1/auth/register').send({
      email: `agenttest-${Date.now()}@antigravity.ai`,
      password: 'Password123!',
      fullName: 'Agent Registry Test User',
    });
    token = res.body.token;
  });

  it('should register a new agent in platform registry', async () => {
    const res = await request(app)
      .post('/api/v1/agents/register')
      .set('Authorization', `Bearer ${token}`)
      .send({
        agentId: 'coding-agent-01',
        name: 'Coding Agent',
        type: 'coding',
        version: '1.0.0',
        capabilities: ['code', 'context'],
      });

    expect(res.status).toBe(201);
    expect(res.body.agentId).toBe('coding-agent-01');
    expect(res.body.status).toBe('online');
  });

  it('should list registered MCP tools via JSON-RPC endpoint', async () => {
    const res = await request(app)
      .post('/api/v1/agents/mcp')
      .set('Authorization', `Bearer ${token}`)
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
      });

    expect(res.status).toBe(200);
    expect(res.body.result.tools).toBeDefined();
    expect(Array.isArray(res.body.result.tools)).toBe(true);
  });
});
