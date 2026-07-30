import { Router } from 'express';
import { conversationController } from './conversation.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();
router.use(authenticateJwt);

router.post('/', (req, res, next) => conversationController.create(req, res, next));
router.get('/', (req, res, next) => conversationController.list(req, res, next));
router.post('/:id/messages', (req, res, next) => conversationController.addMessage(req, res, next));
router.post('/:id/archive', (req, res, next) => conversationController.archive(req, res, next));

export default router;
