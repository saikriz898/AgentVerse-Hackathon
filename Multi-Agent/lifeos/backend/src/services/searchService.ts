/**
 * LifeOS Core - 13. Search Service
 * Universal Search across Projects, Tasks, Documents, Artifacts, Memory, Conversations, and Notifications.
 */

import { projectManager } from './projectManager';
import { artifactManager } from './artifactManager';
import { memoryManager } from './memoryManager';
import { conversationManager } from './conversationManager';

export interface SearchResultItem {
  id: string;
  type: 'Project' | 'Task' | 'Artifact' | 'Memory' | 'Conversation';
  title: string;
  snippet: string;
  url?: string;
  score: number;
}

class SearchService {
  public async universalSearch(query: string): Promise<SearchResultItem[]> {
    if (!query || query.trim().length === 0) return [];
    const lower = query.toLowerCase();
    const results: SearchResultItem[] = [];

    // 1. Search Artifacts
    const artifacts = artifactManager.getArtifacts();
    for (const art of artifacts) {
      if (art.title.toLowerCase().includes(lower) || art.content.toLowerCase().includes(lower)) {
        results.push({
          id: art.id,
          type: 'Artifact',
          title: art.title,
          snippet: art.content.substring(0, 120) + '...',
          score: 0.95,
        });
      }
    }

    // 2. Search Memory
    const memories = await memoryManager.getMemoryEntries();
    for (const mem of memories) {
      if (mem.key.toLowerCase().includes(lower) || mem.content.toLowerCase().includes(lower)) {
        results.push({
          id: mem.id,
          type: 'Memory',
          title: mem.key,
          snippet: mem.content,
          score: mem.vectorScore,
        });
      }
    }

    // 3. Search Projects
    const projects = projectManager.getProjects();
    for (const proj of projects) {
      if (proj.name.toLowerCase().includes(lower) || proj.description.toLowerCase().includes(lower)) {
        results.push({
          id: proj.id,
          type: 'Project',
          title: proj.name,
          snippet: proj.description,
          score: 0.9,
        });
      }
    }

    return results;
  }
}

export const searchService = new SearchService();
