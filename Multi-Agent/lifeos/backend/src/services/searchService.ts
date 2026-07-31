/**
 * LifeOS Core - Universal Search Service V3.0
 * High-performance hybrid search across Projects, Tasks, Artifacts, Vector RRF Memory,
 * Automations, and System Audit Logs with pre-indexed demo search items.
 */

import { projectManager } from './projectManager';
import { artifactManager } from './artifactManager';
import { memoryManager } from './memoryManager';
import { automationService } from './automationService';
import { auditService } from './auditService';

export interface SearchResultItem {
  id: string;
  type: 'Project' | 'Task' | 'Artifact' | 'Memory' | 'Automation' | 'Audit';
  title: string;
  snippet: string;
  score: number;
  category?: string;
  timestamp?: string;
}

class SearchService {
  private demoIndexItems: SearchResultItem[] = [
    {
      id: 'demo-search-1',
      type: 'Artifact',
      title: 'School ERP Management Portal Architecture Specification',
      snippet: 'Full 10-stage PRD specification for School ERP with attendance, grading ledger, parent SMS notifications, and role-based access control.',
      score: 0.99,
      category: 'PRD Document',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-search-2',
      type: 'Project',
      title: '18-Stage AIDLC Multi-Agent Autonomous Execution Engine',
      snippet: 'Enterprise AI Development Life Cycle engine running 18 stages from Goal Identification to Completion Verification.',
      score: 0.98,
      category: 'Active Engine',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-search-3',
      type: 'Memory',
      title: 'Neon pgvector 768-Dim RRF Hybrid Vector Memory',
      snippet: 'Reciprocal Rank Fusion memory store combining dense OpenAI/Gemini 768-dim embeddings with BM25 sparse keyword indices.',
      score: 0.97,
      category: 'Vector RRF',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-search-4',
      type: 'Automation',
      title: 'Daily Executive PRD & Budget Summary Dispatch',
      snippet: 'Cron automation running every morning at 09:00 AM to calculate project velocity, token burn rate, and PRD progress.',
      score: 0.96,
      category: 'Cron Schedule',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-search-5',
      type: 'Audit',
      title: 'OWASP Security Vulnerability Audit Gate (Score: 98/100)',
      snippet: 'Automated review agent scan confirming zero SQL injection, secret leakage, or unauthorized API access risks.',
      score: 0.95,
      category: 'SECURITY',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'demo-search-6',
      type: 'Task',
      title: 'Calculate Project Finance & ROI Payback Period ($3,420 Budget)',
      snippet: 'Assigned Agent: Finance Agent • Status: Completed • Estimated ROI: 180% payback in 4.2 months.',
      score: 0.94,
      category: 'Completed',
      timestamp: new Date().toISOString(),
    },
  ];

  public async universalSearch(query: string): Promise<SearchResultItem[]> {
    const results: SearchResultItem[] = [];
    const lower = (query || '').toLowerCase().trim();

    // 0. Include Demo Pre-Indexed Items
    for (const demo of this.demoIndexItems) {
      const match = !lower || demo.title.toLowerCase().includes(lower) || demo.snippet.toLowerCase().includes(lower) || demo.category?.toLowerCase().includes(lower);
      if (match) {
        results.push(demo);
      }
    }

    // 1. Search Artifacts
    const artifacts = artifactManager.getArtifacts();
    for (const art of artifacts) {
      const match = !lower || art.title.toLowerCase().includes(lower) || art.content.toLowerCase().includes(lower);
      if (match) {
        results.push({
          id: art.id,
          type: 'Artifact',
          title: art.title,
          snippet: art.content.substring(0, 140) + '...',
          score: lower ? (art.title.toLowerCase().includes(lower) ? 0.98 : 0.88) : 0.90,
          category: 'Markdown Artifact',
          timestamp: art.createdAt,
        });
      }
    }

    // 2. Search Memory Entries
    const memories = await memoryManager.getMemoryEntries();
    for (const mem of memories) {
      const match = !lower || mem.key.toLowerCase().includes(lower) || mem.content.toLowerCase().includes(lower);
      if (match) {
        results.push({
          id: mem.id,
          type: 'Memory',
          title: mem.key,
          snippet: mem.content,
          score: mem.vectorScore || 0.95,
          category: 'Vector RRF',
        });
      }
    }

    // 3. Search Workspace Projects & Tasks
    const projects = projectManager.getProjects();
    const tasks = projectManager.getTasks();

    for (const proj of projects) {
      const match = !lower || proj.name.toLowerCase().includes(lower) || proj.description.toLowerCase().includes(lower);
      if (match) {
        results.push({
          id: proj.id,
          type: 'Project',
          title: proj.name,
          snippet: proj.description,
          score: lower ? (proj.name.toLowerCase().includes(lower) ? 0.96 : 0.85) : 0.90,
          category: proj.status,
        });
      }
    }

    for (const task of tasks) {
      const match = !lower || task.title.toLowerCase().includes(lower);
      if (match) {
        results.push({
          id: task.id,
          type: 'Task',
          title: task.title,
          snippet: `Assigned Agent: ${task.assignedAgent} • Status: ${task.status} • Priority: ${task.priority}`,
          score: lower ? (task.title.toLowerCase().includes(lower) ? 0.95 : 0.82) : 0.88,
          category: task.status,
        });
      }
    }

    // 4. Search Automations
    const automations = automationService.getAutomations();
    for (const auto of automations) {
      const match = !lower || auto.name.toLowerCase().includes(lower) || auto.prompt.toLowerCase().includes(lower);
      if (match) {
        results.push({
          id: auto.id,
          type: 'Automation',
          title: auto.name,
          snippet: `Prompt: "${auto.prompt}" • Trigger: ${auto.triggerRule}`,
          score: 0.92,
          category: auto.status,
          timestamp: auto.lastExecuted,
        });
      }
    }

    // 5. Search Audit Logs
    const auditLogs = auditService.getAuditLogs().slice(0, 30);
    for (const log of auditLogs) {
      const match = !lower || log.action.toLowerCase().includes(lower) || log.category.toLowerCase().includes(lower);
      if (match) {
        results.push({
          id: log.id,
          type: 'Audit',
          title: `${log.category}: ${log.action}`,
          snippet: `Actor: ${log.actor} • Target: ${log.target || 'N/A'} • Outcome: ${log.status}`,
          score: 0.80,
          category: log.category,
          timestamp: log.timestamp,
        });
      }
    }

    // Sort by relevance score descending
    return results.sort((a, b) => b.score - a.score);
  }
}

export const searchService = new SearchService();
