import { Router } from 'express';
import { agentController } from './agent.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.post('/register', (req, res) => agentController.register(req, res));
router.post('/heartbeat', (req, res) => agentController.heartbeat(req, res));
router.get('/', (req, res) => agentController.list(req, res));
router.post('/mcp', (req, res, next) => agentController.handleMCP(req, res, next));

export default router;
