import { Router } from 'express';
import { memoryController } from './memory.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';
import { auditLogger } from '../../middleware/audit.middleware.js';

const router = Router();

router.use(authenticateJwt);
router.use(auditLogger);

router.post('/', (req, res, next) => memoryController.create(req, res, next));
router.get('/', (req, res, next) => memoryController.list(req, res, next));
router.get('/:id', (req, res, next) => memoryController.getOne(req, res, next));
router.patch('/:id', (req, res, next) => memoryController.update(req, res, next));
router.delete('/:id', (req, res, next) => memoryController.delete(req, res, next));
router.post('/:id/restore', (req, res, next) => memoryController.restore(req, res, next));
router.delete('/:id/permanent', (req, res, next) => memoryController.permanentDelete(req, res, next));

export default router;
