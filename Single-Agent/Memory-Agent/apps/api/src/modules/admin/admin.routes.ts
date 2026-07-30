import { Router } from 'express';
import { healthController } from './health.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/health', (req, res) => healthController.getHealth(req, res));
router.get('/metrics', (req, res) => healthController.getHealth(req, res));
router.get('/audit', authenticateJwt, (req, res) => healthController.getAuditLogs(req as any, res));
router.post('/reset', (req, res) => healthController.resetDatabase(req, res));

export default router;
