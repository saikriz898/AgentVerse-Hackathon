import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createMemorySchema, updateMemorySchema } from '../modules/memory/memory.dto.js';
import { registerSchema, loginSchema } from '../modules/auth/auth.dto.js';
import { vectorSearchSchema, hybridSearchSchema } from '../modules/search/search.dto.js';

extendZodWithOpenApi(z);

export function getSwaggerSpec() {
  const registry = new OpenAPIRegistry();

  // Register OpenAPI Security Schemes
  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  // Auth Schemas
  registry.register('RegisterInput', registerSchema);
  registry.register('LoginInput', loginSchema);

  // Memory Schemas
  registry.register('CreateMemoryInput', createMemorySchema);
  registry.register('UpdateMemoryInput', updateMemorySchema);

  // Search Schemas
  registry.register('VectorSearchInput', vectorSearchSchema);
  registry.register('HybridSearchInput', hybridSearchSchema);

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Memory Agent API (Enterprise Memory & Context Platform)',
      version: '1.0.0',
      description: 'Production-grade central memory, context, relationship graph, and hybrid vector search platform.',
    },
    servers: [{ url: 'http://localhost:4000/api/v1', description: 'Local Development Server' }],
  });
}
