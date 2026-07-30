import { Router } from 'express';
import { knowledgeController } from './knowledge.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.post('/', (req, res, next) => knowledgeController.create(req, res, next));
router.get('/', (req, res, next) => knowledgeController.list(req, res, next));
router.get('/:id', (req, res, next) => knowledgeController.getById(req, res, next));
router.put('/:id', (req, res, next) => knowledgeController.update(req, res, next));
router.delete('/:id', (req, res, next) => knowledgeController.delete(req, res, next));

export default router;
