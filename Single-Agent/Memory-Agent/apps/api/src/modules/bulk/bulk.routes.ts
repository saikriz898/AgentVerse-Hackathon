import { Router } from 'express';
import { bulkController } from './bulk.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';
import { auditLogger } from '../../middleware/audit.middleware.js';

const router = Router();

router.use(authenticateJwt);
router.use(auditLogger);

router.delete('/delete', (req, res, next) => bulkController.bulkDelete(req, res, next));
router.post('/restore', (req, res, next) => bulkController.bulkRestore(req, res, next));
router.delete('/permanent', (req, res, next) => bulkController.bulkPermanentDelete(req, res, next));

export default router;
