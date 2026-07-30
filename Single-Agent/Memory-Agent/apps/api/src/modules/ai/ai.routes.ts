import { Router } from 'express';
import { aiController } from './ai.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();

router.post('/classify', authenticateJwt, (req, res) => aiController.classify(req, res));
router.post('/extract', authenticateJwt, (req, res) => aiController.extract(req, res));
router.get('/insights', authenticateJwt, (req, res) => aiController.getInsights(req, res));

export default router;
