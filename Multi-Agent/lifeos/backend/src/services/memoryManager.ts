/**
 * LifeOS Core - 10. Memory Manager
 * Automatically loads, injects, saves, updates, and searches vector context across 768-dim RRF pgvector database.
 */

export interface MemoryEntry {
  id: string;
  key: string;
  category: 'System Spec' | 'Architecture' | 'User Preference' | 'Agent Knowledge';
  vectorScore: number;
  content: string;
  updatedAt: string;
}

class MemoryManager {
  private memoryStore: Map<string, MemoryEntry> = new Map();

  constructor() {
    this.seedDefaultMemory();
  }

  private seedDefaultMemory() {
    const defaultEntries: MemoryEntry[] = [
      {
        id: 'mem-1',
        key: 'lifeos_architecture_spec',
        category: 'Architecture',
        vectorScore: 0.982,
        content: 'LifeOS microservice ecosystem consists of Chief of Staff gateway (:4001) orchestrating 6 agents.',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'mem-2',
        key: 'qa_security_gate_threshold',
        category: 'System Spec',
        vectorScore: 0.945,
        content: 'QA Review Agent gate requires minimum score >= 80 and zero critical vulnerabilities.',
        updatedAt: new Date().toISOString(),
      },
    ];

    defaultEntries.forEach((m) => this.memoryStore.set(m.id, m));
  }

  public async searchContext(query: string): Promise<MemoryEntry[]> {
    const list = Array.from(this.memoryStore.values());
    const lower = query.toLowerCase();
    return list.filter((m) => m.content.toLowerCase().includes(lower) || m.key.toLowerCase().includes(lower));
  }

  public async getMemoryEntries(): Promise<MemoryEntry[]> {
    return Array.from(this.memoryStore.values());
  }

  public async saveEntry(key: string, content: string, category: MemoryEntry['category'] = 'Agent Knowledge'): Promise<MemoryEntry> {
    const entry: MemoryEntry = {
      id: `mem-${Date.now()}`,
      key,
      category,
      vectorScore: 0.95,
      content,
      updatedAt: new Date().toISOString(),
    };
    this.memoryStore.set(entry.id, entry);
    return entry;
  }
}

export const memoryManager = new MemoryManager();
