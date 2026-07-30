import { memoryService } from '../memory/memory.service.js';
import { searchService } from '../search/search.service.js';
import { contextBuilderService } from '../context/context.builder.service.js';

export interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: { code: number; message: string };
}

export class MCPServer {
  async handleRequest(workspaceId: string, req: MCPRequest): Promise<MCPResponse> {
    const { id, method, params } = req;

    try {
      switch (method) {
        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: [
                { name: 'create_memory', description: 'Store memory entry in long term context' },
                { name: 'vector_search', description: 'Perform semantic vector search' },
                { name: 'build_context', description: 'Assemble dynamic context for LLM prompt' },
              ],
            },
          };

        case 'tools/call':
          const { name, arguments: args } = params || {};
          if (name === 'create_memory') {
            const entry = await memoryService.createMemory(workspaceId, args);
            return { jsonrpc: '2.0', id, result: entry };
          }
          if (name === 'vector_search') {
            const results = await searchService.vectorSearch(workspaceId, args.query, args.limit);
            return { jsonrpc: '2.0', id, result: { results } };
          }
          if (name === 'build_context') {
            const pkg = await contextBuilderService.buildContextPackage(workspaceId, args);
            return { jsonrpc: '2.0', id, result: pkg };
          }
          return { jsonrpc: '2.0', id, error: { code: -32601, message: `Tool ${name} not found` } };

        default:
          return { jsonrpc: '2.0', id, error: { code: -32601, message: `Method ${method} not found` } };
      }
    } catch (err: any) {
      return { jsonrpc: '2.0', id, error: { code: -32603, message: err.message } };
    }
  }
}

export const mcpServer = new MCPServer();
