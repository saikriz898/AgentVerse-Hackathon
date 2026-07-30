import express from 'express';
import cors from 'cors';
import { orchestrator } from './orchestrator';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Health Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    orchestrator: 'Chief of Staff AI Gateway',
    timestamp: new Date().toISOString(),
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

// Chief of Staff API Gateway Endpoint
app.post('/api/v1/workflows/execute', async (req, res) => {
  try {
    const { promptText, category } = req.body;
    if (!promptText) {
      return res.status(400).json({ error: 'Prompt text is required' });
    }

    const result = await orchestrator.executeWorkflow(promptText, category);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Orchestrator execution failed', details: error.message });
  }
});

// Export server application
export default app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[LifeOS Backend] Chief of Staff API Gateway running on http://localhost:${PORT}`);
  });
}
