import { Router } from 'express';
import { eventBus } from '../../agents/core/EventBus.js';
import { eventStore } from '../../agents/core/EventStore.js';

const router = Router();

// Server-Sent Events (SSE) realtime execution stream endpoint
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Autonomous Multi-Agent Stream Connected', timestamp: new Date().toISOString() })}\n\n`);

  const unsubscribe = eventBus.subscribeStream((eventData) => {
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
    res.end();
  });
});

// GET /events/history - Audit trail of recent events
router.get('/history', (req, res) => {
  const events = eventStore.getRecentEvents(50);
  res.json({ data: events });
});

// GET /events/stats - Realtime queue & listener metrics
router.get('/stats', (req, res) => {
  const stats = eventBus.getQueueStats();
  res.json(stats);
});

export default router;
