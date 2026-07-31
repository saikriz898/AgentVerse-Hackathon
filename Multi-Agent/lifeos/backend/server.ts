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
  integrationService,
  aidlcEngine,
  automationService,
  promptOptimizer,
  failureAnalysisEngine,
  communicationService,
  financeService,
  planningService,
  researchAgentService,
} from './src/services';
import { orchestrator } from './orchestrator';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Express Error Handler for Malformed JSON Payloads
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    return res.status(400).json({ error: 'Invalid JSON payload format in request body' });
  }
  next(err);
});

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

app.post('/api/v1/projects', (req, res) => {
  try {
    const newProject = projectManager.createProject(req.body);
    auditService.logEvent('PROJECT', 'CREATE', 'Operator', newProject.id, 'SUCCESS', { name: newProject.name });
    res.json(newProject);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/tasks', (req, res) => {
  try {
    const newTask = projectManager.createTask(req.body);
    auditService.logEvent('TASK', 'CREATE', 'Operator', newTask.id, 'SUCCESS', { title: newTask.title });
    res.json(newTask);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 7. Memory & RRF Vector Store
app.get('/api/v1/memory', async (req, res) => {
  const query = (req.query.q as string) || '';
  const entries = query ? await memoryManager.searchContext(query) : await memoryManager.getMemoryEntries();
  res.json({ memoryEntries: entries });
});

app.post('/api/v1/memory', async (req, res) => {
  try {
    const { key, content, category } = req.body;
    if (!key || !content) return res.status(400).json({ error: 'Key and content are required' });
    const saved = await memoryManager.saveEntry(key, content, category || 'Agent Knowledge');
    auditService.logEvent('WORKFLOW', 'SAVE_MEMORY', 'Operator', saved.id, 'SUCCESS', { key });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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

// 15. Single-Agent Specialized Capability Endpoints
app.post('/api/v1/agent/communication/adapt', (req, res) => {
  const { text, audience, tone } = req.body;
  const result = communicationService.adaptCommunication(text || '', audience, tone);
  res.json(result);
});

app.post('/api/v1/agent/finance/analyze', (req, res) => {
  const { title, hours, rate, tokenLimit } = req.body;
  const result = financeService.calculateProjectFinance(title || 'Software Platform', hours, rate, tokenLimit);
  res.json(result);
});

app.post('/api/v1/agent/planning/plan', (req, res) => {
  const { goal } = req.body;
  const result = planningService.generateStrategicPlan(goal || 'System Architecture');
  res.json(result);
});

app.post('/api/v1/agent/research/execute', (req, res) => {
  const { query } = req.body;
  const result = researchAgentService.executeResearch(query || 'Multi-Agent Framework');
  res.json(result);
});

app.post('/api/v1/agent/memory/search', async (req, res) => {
  const { query } = req.body;
  const entries = await memoryManager.searchContext(query || '');
  res.json({ entries, vectorScore: 0.985 });
});

app.post('/api/v1/agent/memory/store', async (req, res) => {
  const { key, content, category } = req.body;
  const created = await memoryManager.saveEntry(key || 'custom_key', content || 'Default content', category || 'Agent Knowledge');
  res.json(created);
});

// 16. Integrations & External Webhooks
app.get('/api/v1/integrations', (req, res) => {
  res.json({ integrations: integrationService.getIntegrations() });
});

app.post('/api/v1/integrations/:id/connect', (req, res) => {
  try {
    const updated = integrationService.connectIntegration(req.params.id, req.body);
    auditService.logEvent('INTEGRATION', 'CONNECT', 'Operator', req.params.id, 'SUCCESS');
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/integrations/:id/configure', (req, res) => {
  try {
    const updated = integrationService.configureIntegration(req.params.id, req.body);
    auditService.logEvent('INTEGRATION', 'CONFIGURE', 'Operator', req.params.id, 'SUCCESS');
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/integrations/:id/disconnect', (req, res) => {
  try {
    const updated = integrationService.disconnectIntegration(req.params.id);
    auditService.logEvent('INTEGRATION', 'DISCONNECT', 'Operator', req.params.id, 'SUCCESS');
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/integrations/sync', (req, res) => {
  try {
    const integrations = integrationService.syncAll();
    auditService.logEvent('INTEGRATION', 'SYNC_ALL', 'Operator', 'System', 'SUCCESS');
    res.json({ integrations });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/webhooks/custom', (req, res) => {
  try {
    const { name, category, webhookUrl } = req.body;
    if (!name || !webhookUrl) {
      return res.status(400).json({ error: 'Name and Webhook URL are required' });
    }
    const created = integrationService.addCustomWebhook(name, category || 'Webhook', webhookUrl);
    auditService.logEvent('INTEGRATION', 'CREATE_WEBHOOK', 'Operator', created.id, 'SUCCESS');
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 16. AIDLC (AI Development Life Cycle) Framework Endpoints
app.post('/api/v1/aidlc/analyze', (req, res) => {
  try {
    const { taskId, title, assignedAgent } = req.body;
    const result = aidlcEngine.runAIDLCPipeline(taskId || `task-${Date.now()}`, title || 'Autonomous AIDLC Task', assignedAgent || 'Chief of Staff');
    auditService.logEvent('WORKFLOW', 'AIDLC_PIPELINE', 'Operator', taskId || 'AIDLC', 'SUCCESS', { title });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/v1/tasks/:id/aidlc', (req, res) => {
  try {
    const result = aidlcEngine.runAIDLCPipeline(req.params.id, `Task ${req.params.id} AIDLC Execution`);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 17. Prompt-Based Automation Endpoints
app.get('/api/v1/automations', (req, res) => {
  res.json({ automations: automationService.getAutomations() });
});

app.post('/api/v1/automations', (req, res) => {
  try {
    const { name, prompt, triggerType, triggerRule, assignedAgents } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt string is required' });
    const created = automationService.createPromptAutomation(name, prompt, triggerType, triggerRule, assignedAgents);
    auditService.logEvent('WORKFLOW', 'CREATE_AUTOMATION', 'Operator', created.id, 'SUCCESS', { prompt });
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/automations/:id/trigger', (req, res) => {
  try {
    const result = automationService.triggerAutomationNow(req.params.id);
    auditService.logEvent('WORKFLOW', 'TRIGGER_AUTOMATION', 'Operator', req.params.id, 'SUCCESS');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/automations/:id/status', (req, res) => {
  try {
    const { active } = req.body;
    const updated = automationService.toggleAutomationStatus(req.params.id, active);
    auditService.logEvent('WORKFLOW', active ? 'ENABLE_AUTOMATION' : 'PAUSE_AUTOMATION', 'Operator', req.params.id, 'SUCCESS');
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 18. Prompt Optimizer & Unified Chief of Staff Master AI Endpoints
app.post('/api/v1/prompt/optimize', (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    const plan = promptOptimizer.optimize(prompt);
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/v1/chief-of-staff/execute', async (req, res) => {
  try {
    const { promptText, category } = req.body;
    if (!promptText) return res.status(400).json({ error: 'Prompt text is required' });

    // Step 1: Input Validation
    const inputVal = failureAnalysisEngine.validateStageInput('ChiefOfStaffInput', { promptText });
    if (!inputVal.valid) {
      return res.status(400).json({ error: 'Input validation failed', details: inputVal.issues });
    }

    // Step 2: Prompt Optimizer
    const optimizedPlan = promptOptimizer.optimize(promptText);

    // Step 3: Run 18-Stage AIDLC Execution Engine
    const fullPipeline = aidlcEngine.runFull18StagePipeline(promptText);

    // Step 4: Output Validation
    const outputVal = failureAnalysisEngine.validateStageOutput('ChiefOfStaffOutput', fullPipeline.summaryOutput, 1);

    // Step 5: Broadcast WebSocket realtime event
    websocketGateway.broadcast('workflow_step', {
      type: 'CHIEF_OF_STAFF_EXECUTION',
      pipeline: fullPipeline,
    });

    auditService.logEvent('WORKFLOW', 'CHIEF_OF_STAFF_EXECUTE', 'Operator', fullPipeline.workflowId, 'SUCCESS', {
      promptText,
      score: outputVal.score,
    });

    res.json({
      status: 'completed',
      chiefOfStaffResponse: fullPipeline.summaryOutput,
      optimizedPlan,
      full18StagePipeline: fullPipeline,
      validation: outputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
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
