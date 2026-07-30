import { Router } from 'express';
import { documentController } from './document.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.post('/', (req, res, next) => documentController.create(req, res, next));
router.get('/', (req, res, next) => documentController.list(req, res, next));

export default router;
