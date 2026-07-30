import { Router } from 'express';
import { graphController } from './graph.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', (req, res, next) => graphController.getGraph(req, res, next));
router.post('/link', (req, res, next) => graphController.linkNodes(req, res, next));

export default router;
