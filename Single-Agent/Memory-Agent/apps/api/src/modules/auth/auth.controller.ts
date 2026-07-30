import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';
import { registerSchema, loginSchema } from './auth.dto.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = registerSchema.parse(req.body);
      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = loginSchema.parse(req.body);
      const result = await authService.login(dto);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
