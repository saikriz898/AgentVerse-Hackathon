import { Router } from 'express';
import { tagController } from './tag.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.post('/', (req, res, next) => tagController.create(req, res, next));
router.get('/', (req, res, next) => tagController.list(req, res, next));
router.post('/attach', (req, res, next) => tagController.attach(req, res, next));

export default router;
