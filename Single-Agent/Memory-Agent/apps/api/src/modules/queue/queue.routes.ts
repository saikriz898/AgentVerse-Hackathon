import { Router } from 'express';
import { queueController } from './queue.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/status', (req, res, next) => queueController.getStatus(req, res, next));
router.post('/action', (req, res, next) => queueController.performAction(req, res, next));
router.get('/jobs', (req, res, next) => queueController.getJobs(req, res, next));
router.post('/trigger-workflow', (req, res, next) => queueController.triggerWorkflow(req, res, next));

export default router;
