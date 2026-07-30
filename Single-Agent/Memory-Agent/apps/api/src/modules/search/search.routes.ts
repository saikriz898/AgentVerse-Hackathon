import { Router } from 'express';
import { searchController } from './search.controller.js';
import { authenticateJwt } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJwt);

router.get('/', (req, res, next) => searchController.globalSearch(req, res, next));
router.post('/vector-search', (req, res, next) => searchController.vectorSearch(req, res, next));
router.post('/hybrid', (req, res, next) => searchController.hybridSearch(req, res, next));
router.get('/autocomplete', (req, res, next) => searchController.autocomplete(req, res, next));
router.get('/history', (req, res, next) => searchController.getHistory(req, res, next));
router.get('/analytics', (req, res, next) => searchController.getAnalytics(req, res, next));
router.post('/saved', (req, res, next) => searchController.saveSearch(req, res, next));
router.get('/saved', (req, res, next) => searchController.getSavedSearches(req, res, next));

export default router;
