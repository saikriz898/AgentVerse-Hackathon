import { Router } from 'express';
import { contextController } from './context.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/build', (req, res, next) => contextController.build(req, res, next));
router.post('/assemble-prompt', (req, res, next) => contextController.assemblePrompt(req, res, next));
router.get('/analytics', (req, res, next) => contextController.getAnalytics(req, res, next));

export default router;
