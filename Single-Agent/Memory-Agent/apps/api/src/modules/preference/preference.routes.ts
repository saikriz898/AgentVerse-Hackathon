import { Router } from 'express';
import { preferenceController } from './preference.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.get('/', (req, res, next) => preferenceController.get(req, res, next));
router.post('/', (req, res, next) => preferenceController.set(req, res, next));

export default router;
