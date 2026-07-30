import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { searchService } from './search.service.js';
import { autocompleteService } from './autocomplete.service.js';
import { searchAnalyticsService } from './search.analytics.service.js';
import { savedSearchService } from './saved-search.service.js';
import { vectorSearchSchema, hybridSearchSchema } from './search.dto.js';

export class SearchController {
  async globalSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const q = String(req.query.q || req.query.query || '');
      const moduleFilter = String(req.query.module || 'all');
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await searchService.globalSearch(req.workspaceId!, q, moduleFilter, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async vectorSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const startTime = Date.now();
      const dto = vectorSearchSchema.parse(req.body);
      const results = await searchService.vectorSearch(req.workspaceId!, dto.query, dto.limit);
      searchAnalyticsService.logSearch(req.workspaceId!, dto.query, results.length, Date.now() - startTime);
      res.json({ results });
    } catch (err) {
      next(err);
    }
  }

  async hybridSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const startTime = Date.now();
      const dto = hybridSearchSchema.parse(req.body);
      const results = await searchService.hybridSearch(req.workspaceId!, dto.query, dto.limit, dto.k);
      searchAnalyticsService.logSearch(req.workspaceId!, dto.query, results.length, Date.now() - startTime);
      res.json({ results });
    } catch (err) {
      next(err);
    }
  }

  async autocomplete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const query = String(req.query.q || '');
      const suggestions = await autocompleteService.getSuggestions(req.workspaceId!, query);
      res.json({ suggestions });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const history = searchAnalyticsService.getWorkspaceHistory(req.workspaceId!);
      res.json({ history });
    } catch (err) {
      next(err);
    }
  }

  async getAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const analytics = searchAnalyticsService.getWorkspaceAnalytics(req.workspaceId!);
      res.json(analytics);
    } catch (err) {
      next(err);
    }
  }

  async saveSearch(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, query, filters } = req.body;
      const saved = await savedSearchService.saveSearch(req.workspaceId!, name, query, filters);
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  }

  async getSavedSearches(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const searches = await savedSearchService.getSavedSearches(req.workspaceId!);
      res.json({ searches });
    } catch (err) {
      next(err);
    }
  }
}

export const searchController = new SearchController();
