import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/db.js';
import { users, workspaces } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { env } from '../../config/env.js';
import { RegisterDto, LoginDto } from './auth.dto.js';

export class AuthService {
  async register(dto: RegisterDto) {
    const existing = await db.select().from(users).where(eq(users.email, dto.email));
    if (existing.length > 0) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const userId = crypto.randomUUID();
    const workspaceId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: 'owner',
    });

    const wsName = dto.workspaceName || `${dto.fullName}'s Workspace`;
    const slug = wsName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + crypto.randomUUID().slice(0, 8);

    await db.insert(workspaces).values({
      id: workspaceId,
      name: wsName,
      slug,
      ownerId: userId,
    });

    const token = jwt.sign(
      { id: userId, email: dto.email, role: 'owner', workspaceId },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
    );

    return {
      user: { id: userId, email: dto.email, fullName: dto.fullName, role: 'owner' },
      workspace: { id: workspaceId, name: wsName, slug },
      token,
    };
  }

  async login(dto: LoginDto) {
    const userRows = await db.select().from(users).where(eq(users.email, dto.email));
    if (userRows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = userRows[0];
    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new Error('Invalid email or password');
    }

    const wsRows = await db.select().from(workspaces).where(eq(workspaces.ownerId, user.id));
    const workspace = wsRows[0] || { id: crypto.randomUUID(), name: 'Default Workspace', slug: 'default' };

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, workspaceId: workspace.id },
      env.JWT_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any }
    );

    return {
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      workspace,
      token,
    };
  }
}

export const authService = new AuthService();
