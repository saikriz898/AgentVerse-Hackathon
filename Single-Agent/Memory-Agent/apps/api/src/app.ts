import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rateLimit.middleware.js';
import { getSwaggerSpec } from './docs/swagger.js';

import authRoutes from './modules/auth/auth.routes.js';
import memoryRoutes from './modules/memory/memory.routes.js';
import searchRoutes from './modules/search/search.routes.js';
import contextRoutes from './modules/context/context.routes.js';
import graphRoutes from './modules/graph/graph.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import conversationRoutes from './modules/conversation/conversation.routes.js';
import preferenceRoutes from './modules/preference/preference.routes.js';
import knowledgeRoutes from './modules/knowledge/knowledge.routes.js';
import documentRoutes from './modules/document/document.routes.js';
import fileRoutes from './modules/file/file.routes.js';
import versionRoutes from './modules/version/version.routes.js';
import tagRoutes from './modules/tag/tag.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import agentRoutes from './modules/agent/agent.routes.js';
import queueRoutes from './modules/queue/queue.routes.js';
import webhookRoutes from './modules/webhook/webhook.routes.js';
import consoleRoutes from './modules/console/console.routes.js';
import bulkRoutes from './modules/bulk/bulk.routes.js';
import promptRoutes from './modules/prompt/prompt.routes.js';
import realtimeRoutes from './modules/realtime/realtime.routes.js';
import { initializeAgentFleet } from './agents/index.js';

export function createApp() {
  const app = express();

  // Initialize Autonomous Multi-Agent Fleet
  initializeAgentFleet();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(rateLimiter);

  // Serve OpenAPI Swagger docs at /docs
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(getSwaggerSpec()));

  // API Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/events', realtimeRoutes);
  app.use('/api/v1/memory', memoryRoutes);
  app.use('/api/v1/search', searchRoutes);
  app.use('/api/v1/context', contextRoutes);
  app.use('/api/v1/prompts', promptRoutes);
  app.use('/api/v1/graph', graphRoutes);
  app.use('/api/v1/projects', projectRoutes);
  app.use('/api/v1/conversations', conversationRoutes);
  app.use('/api/v1/preferences', preferenceRoutes);
  app.use('/api/v1/knowledge', knowledgeRoutes);
  app.use('/api/v1/documents', documentRoutes);
  app.use('/api/v1/files', fileRoutes);
  app.use('/api/v1/versions', versionRoutes);
  app.use('/api/v1/tags', tagRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/agents', agentRoutes);
  app.use('/api/v1/queues', queueRoutes);
  app.use('/api/v1/webhooks', webhookRoutes);
  app.use('/api/v1/bulk', bulkRoutes);
  app.use('/api/v1/console', consoleRoutes);

  // Central error middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
