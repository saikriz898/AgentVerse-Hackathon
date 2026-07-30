import { z } from 'zod';

export const memoryTypeEnum = z.enum([
  'short_term',
  'long_term',
  'working',
  'conversation',
  'project',
  'knowledge',
  'semantic',
  'vector',
  'session',
  'archived',
]);

const typeTransformer = z.preprocess((val) => {
  if (typeof val === 'string') {
    return val.replace('-', '_');
  }
  return val;
}, memoryTypeEnum);

export const createMemorySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: typeTransformer.default('working'),
  importance: z.number().min(0).max(1).optional().default(0.85),
  importanceScore: z.number().min(0).max(1).optional(),
  pinned: z.boolean().optional().default(false),
  ttlSeconds: z.number().optional(),
  metadataJson: z.string().optional(),
});

export const updateMemorySchema = createMemorySchema.partial();

export type CreateMemoryDto = z.infer<typeof createMemorySchema>;
export type UpdateMemoryDto = z.infer<typeof updateMemorySchema>;
