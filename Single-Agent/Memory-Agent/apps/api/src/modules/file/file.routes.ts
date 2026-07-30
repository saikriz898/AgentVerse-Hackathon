import { Router } from 'express';
import { fileController } from './file.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.post('/', (req, res, next) => fileController.record(req, res, next));
router.get('/', (req, res, next) => fileController.list(req, res, next));

export default router;
