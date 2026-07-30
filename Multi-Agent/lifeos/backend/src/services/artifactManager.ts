/**
 * LifeOS Core - 11. Artifact Manager
 * Automated document & specification lifecycle manager (PRD, TRD, Architecture, DB Schemas, API Specs, Budget, QA Reports, Release Notes).
 */

export interface SystemArtifact {
  id: string;
  title: string;
  category: 'PRD' | 'TRD' | 'Architecture' | 'Database Schema' | 'API Spec' | 'QA Audit' | 'Release Notes';
  version: string;
  content: string;
  authorAgent: string;
  createdAt: string;
  updatedAt: string;
}

class ArtifactManager {
  private artifacts: Map<string, SystemArtifact> = new Map();

  constructor() {
    this.seedDefaultArtifacts();
  }

  private seedDefaultArtifacts() {
    const defaultList: SystemArtifact[] = [
      {
        id: 'art-sdlc-spec',
        title: 'sdlc-build-specification.md',
        category: 'Architecture',
        version: 'v1.0.0',
        content: `# Full Startup SDLC Build Specification\n\n## 1. Requirement Analysis\n- 14 Epics, 42 User Stories created.\n\n## 2. Architecture\n- PostgreSQL + pgvector + Next.js App Router.`,
        authorAgent: 'Chief of Staff & 7 SDLC Departments',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'art-prd-spec',
        title: 'lifeos-prd-specification.md',
        category: 'PRD',
        version: 'v1.1.0',
        content: `# LifeOS PRD Technical Specification\n\n## Executive Summary\nDual-Engine platform combining Chief of Staff orchestrator with 7 SDLC Specialist Departments.`,
        authorAgent: 'Planning Agent',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    defaultList.forEach((a) => this.artifacts.set(a.id, a));
  }

  public getArtifacts(): SystemArtifact[] {
    return Array.from(this.artifacts.values());
  }

  public getArtifact(id: string): SystemArtifact | undefined {
    return this.artifacts.get(id);
  }

  public saveArtifact(art: Partial<SystemArtifact> & { title: string; content: string }): SystemArtifact {
    const id = art.id || `art-${Date.now()}`;
    const newArt: SystemArtifact = {
      id,
      title: art.title,
      category: art.category || 'Architecture',
      version: art.version || 'v1.0.0',
      content: art.content,
      authorAgent: art.authorAgent || 'Chief of Staff AI',
      createdAt: art.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.artifacts.set(id, newArt);
    return newArt;
  }
}

export const artifactManager = new ArtifactManager();
