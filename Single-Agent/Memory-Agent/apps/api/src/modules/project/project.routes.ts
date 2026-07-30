import { Router } from 'express';
import { projectController } from './project.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.post('/', (req, res, next) => projectController.create(req, res, next));
router.get('/', (req, res, next) => projectController.list(req, res, next));
router.get('/:id', (req, res, next) => projectController.getById(req, res, next));
router.put('/:id', (req, res, next) => projectController.update(req, res, next));
router.delete('/:id', (req, res, next) => projectController.delete(req, res, next));

export default router;
