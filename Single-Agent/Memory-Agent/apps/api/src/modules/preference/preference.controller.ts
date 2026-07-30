import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { preferenceService } from './preference.service.js';
import { z } from 'zod';

const setPrefSchema = z.object({ key: z.string().min(1), value: z.string() });

export class PreferenceController {
  async get(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const prefs = await preferenceService.getPreferences(req.workspaceId!);
      res.json({ data: prefs });
    } catch (err) {
      next(err);
    }
  }

  async set(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = setPrefSchema.parse(req.body);
      const pref = await preferenceService.setPreference(req.workspaceId!, dto.key, dto.value);
      res.status(200).json(pref);
    } catch (err) {
      next(err);
    }
  }
}

export const preferenceController = new PreferenceController();
