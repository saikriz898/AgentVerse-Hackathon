/**
 * Central Memory Engine Contracts
 * Vector RRF Search & 2D Topology Graph Engine
 */

export interface VectorSearchResult {
  id: string;
  score: number;
  content: string;
  metadata: Record<string, unknown>;
}

export interface MemoryEngineContract {
  store(partition: string, title: string, content: string, importance: number): Promise<string>;
  searchRRF(query: string, limit?: number): Promise<VectorSearchResult[]>;
  getGraphTopology(): Promise<{ nodes: unknown[]; edges: unknown[] }>;
}
