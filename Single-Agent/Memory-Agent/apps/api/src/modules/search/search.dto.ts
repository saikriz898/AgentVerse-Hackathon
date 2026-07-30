import { z } from 'zod';

export const vectorSearchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().optional().default(10),
});

export const hybridSearchSchema = z.object({
  query: z.string().min(1),
  limit: z.number().optional().default(10),
  k: z.number().optional().default(60),
});

export type VectorSearchDto = z.infer<typeof vectorSearchSchema>;
export type HybridSearchDto = z.infer<typeof hybridSearchSchema>;
