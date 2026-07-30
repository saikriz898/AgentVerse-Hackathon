import { Router } from 'express';
import { promptController } from './prompt.controller.js';

const router = Router();

router.get('/', (req, res, next) => promptController.listTemplates(req, res, next));
router.get('/:id', (req, res, next) => promptController.getTemplate(req, res, next));
router.post('/evaluate', (req, res, next) => promptController.evaluate(req, res, next));
router.post('/test', (req, res, next) => promptController.testExecution(req, res, next));

export default router;
