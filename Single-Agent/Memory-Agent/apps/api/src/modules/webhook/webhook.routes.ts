import { Router } from 'express';
import { webhookController } from './webhook.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/register', (req, res) => webhookController.register(req, res));
router.get('/', (req, res) => webhookController.list(req, res));

export default router;
