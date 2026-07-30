import { Router } from 'express';
import { versionController } from './version.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.get('/:memoryId', (req, res, next) => versionController.getVersions(req, res, next));

export default router;
