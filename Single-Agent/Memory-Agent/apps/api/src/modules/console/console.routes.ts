import { Router } from 'express';
import { consoleController } from './console.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.post('/exec', (req, res, next) => consoleController.execute(req, res, next));

export default router;
