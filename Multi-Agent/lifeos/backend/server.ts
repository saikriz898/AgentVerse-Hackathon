import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import {
  authService,
  agentManager,
  healthMonitor,
  workflowEngine,
  workflowDb,
  conversationManager,
  projectManager,
  memoryManager,
  artifactManager,
  notificationService,
  searchService,
  auditService,
  analyticsService,
  aiProviderManager,
  queueManager,
  websocketGateway,
} from './src/services';
import { orchestrator } from './orchestrator';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// 1. Health Endpoint (Gateway & All 10 Services)
app.get('/health', async (req, res) => {
  const dashboard = healthMonitor.getFullDashboardHealth();
  res.json({
    status: 'healthy',
    orchestrator: 'Chief of Staff AI Gateway (LifeOS Core V1.0)',
    timestamp: new Date().toISOString(),
    services: dashboard,
    agents: {
      researchAgent: 'http://localhost:8000',
      memoryAgent: 'http://localhost:4000',
      planningAgent: 'http://localhost:8000',
      financeAgent: 'http://localhost:8000',
      reviewAgent: 'http://localhost:8000',
      communicationAgent: 'http://localhost:8004',
    },
  });
});

// 2. Auth Service Endpoints
app.get('/api/v1/auth/sessions', async (req, res) => {
  const sessions = await authService.getSessions();
  const workspaces = await authService.getWorkspaces();
  res.json({ sessions, workspaces });
});

// 3. Agent Manager Endpoints
app.get('/api/v1/agents', async (req, res) => {
  const agents = await agentManager.discoverAgents();
  const metrics = await agentManager.getFleetMetrics();
  res.json({ agents, metrics });
});

app.post('/api/v1/agents/:id/ping', async (req, res) => {
  try {
    const result = await agentManager.pingAgent(req.params.id);
    auditService.logEvent('AGENT_CALL', 'PING', 'Operator', req.params.id, 'SUCCESS', result);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/agents/:id/status', async (req, res) => {
  try {
    const { enabled } = req.body;
    const updated = await agentManager.toggleAgentStatus(req.params.id, enabled);
    auditService.logEvent('AGENT_CALL', enabled ? 'ENABLE' : 'DISABLE', 'Operator', req.params.id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/agents/:id/restart', async (req, res) => {
  try {
    const updated = await agentManager.restartAgent(req.params.id);
    auditService.logEvent('AGENT_CALL', 'RESTART', 'Operator', req.params.id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/agents/:id/test', async (req, res) => {
  try {
    const result = await agentManager.testAgent(req.params.id, req.body.task);
    auditService.logEvent('AGENT_CALL', 'TEST', 'Operator', req.params.id, 'SUCCESS', result);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Workflow Engine Endpoints
app.post('/api/v1/workflows/execute', async (req, res) => {
  try {
    const { promptText, category } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: 'Prompt text is required' });
    }

    const workflow = await workflowEngine.createAndExecuteWorkflow({ promptText, category });
    auditService.logEvent('WORKFLOW', 'EXECUTE', 'Operator', workflow.id, 'SUCCESS', { promptText });

    return res.json({
      status: 'completed',
      chiefOfStaffResponse: workflow.chiefOfStaffResponse,
      artifact: workflow.artifact,
      workflowId: workflow.id,
      steps: workflow.steps,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (error: any) {
    auditService.logEvent('WORKFLOW', 'EXECUTE', 'Operator', 'Orchestrator', 'FAILED', { error: error.message });
    return res.status(500).json({ error: 'Orchestrator execution failed', details: error.message });
  }
});

app.get('/api/v1/workflows/history', (req, res) => {
  res.json({ workflows: workflowDb.getAllWorkflows(), logs: workflowDb.getLogs() });
});

// 5. Health Monitor Dashboard
app.get('/api/v1/health/dashboard', (req, res) => {
  res.json({ services: healthMonitor.getFullDashboardHealth() });
});

// 6. Project & Task Manager
app.get('/api/v1/projects', (req, res) => {
  res.json({ projects: projectManager.getProjects(), tasks: projectManager.getTasks() });
});

// 7. Memory & RRF Vector Store
app.get('/api/v1/memory', async (req, res) => {
  const query = (req.query.q as string) || '';
  const entries = query ? await memoryManager.searchContext(query) : await memoryManager.getMemoryEntries();
  res.json({ memoryEntries: entries });
});

// 8. Artifact Manager
app.get('/api/v1/artifacts', (req, res) => {
  res.json({ artifacts: artifactManager.getArtifacts() });
});

// 9. Notifications
app.get('/api/v1/notifications', (req, res) => {
  res.json({ notifications: notificationService.getNotifications() });
});

// 10. Universal Search
app.get('/api/v1/search', async (req, res) => {
  const results = await searchService.universalSearch(req.query.q as string);
  res.json({ results });
});

// 11. Security Audit Logs
app.get('/api/v1/audit', (req, res) => {
  res.json({ auditLogs: auditService.getAuditLogs() });
});

// 12. System Analytics Metrics
app.get('/api/v1/analytics/metrics', async (req, res) => {
  const metrics = await analyticsService.getAnalyticsMetrics();
  res.json(metrics);
});

// 13. AI Provider Gateway Manager
app.get('/api/v1/ai/providers', (req, res) => {
  res.json({ providers: aiProviderManager.getProviders() });
});

// 14. Queues Manager
app.get('/api/v1/queues', (req, res) => {
  res.json({ queues: queueManager.getQueueStatuses(), jobs: queueManager.getRecentJobs() });
});

const server = createServer(app);

// Initialize WebSocket Gateway & Background 30s Heartbeat
websocketGateway.initialize(server);
healthMonitor.start(30000);

export default app;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[LifeOS Core V1.0] Backend Platform running on http://localhost:${PORT}`);
  });
}
