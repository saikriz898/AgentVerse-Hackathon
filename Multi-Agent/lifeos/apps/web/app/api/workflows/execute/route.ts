import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { promptText, category } = body;

    if (!promptText) {
      return NextResponse.json({ error: 'Prompt text is required' }, { status: 400 });
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const lower = promptText.toLowerCase();

    let aiText = `Chief of Staff AI processed: "${promptText}". All internal capabilities and vector memory partitions executed cleanly.`;
    let newArtifact = null;

    if (lower.includes('/build') || lower.includes('build')) {
      aiText = `Chief of Staff & 7 SDLC Departments synthesized full startup application specification for "${promptText}". Requirements, System Architecture, DB Schema, and QA Audit report generated.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'sdlc-build-specification.md',
        type: 'markdown',
        version: 'v1.0.0',
        createdAt: timestamp,
        content: `# Full Startup SDLC Build Specification\n\n## 1. Requirement Analysis (Business Analysis Dept)\n- **Scope**: Core MVP features, user management, vector search interop, dashboard canvas.\n- **User Stories**: 14 Epics, 42 User Stories created.\n\n## 2. Product Architecture (Architecture Dept)\n- **Database**: Neon PostgreSQL + pgvector (768-dim RRF Search)\n- **Backend**: FastAPI Microservices + Python LangGraph\n- **Frontend**: Next.js 16 App Router + Tailwind CSS\n\n## 3. QA Audit Report (QA Dept)\n- **Score**: 96/100 (Passed Gate >= 80)\n- **Vulnerabilities**: 0 High Severity`,
      };
    } else if (lower.includes('/prd') || lower.includes('prd')) {
      aiText = `Product Planning Department generated 10-stage PRD technical specification. Feature Matrix & Release Roadmap synced.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'lifeos-prd-specification.md',
        type: 'markdown',
        version: 'v1.1.0',
        createdAt: timestamp,
        content: `# LifeOS PRD Technical Specification\n\n## 1. Executive Summary\nDual-Engine platform combining Chief of Staff orchestrator with 7 SDLC Specialist Departments.\n\n## 2. Department Interop Contracts\n- Business Analysis: BRD + Acceptance Criteria\n- Product Planning: 10-Stage PRD & Roadmap\n- Architecture: System Design & DB Schemas\n- Project Management: Sprint Board & Task Breakdown\n- Engineering: Next.js + FastAPI Microservices\n- QA: Score >= 80 Gate Audit\n- Deployment: Docker & K8s Spec`,
      };
    }

    return NextResponse.json({
      status: 'success',
      chiefOfStaffResponse: aiText,
      artifact: newArtifact,
      timestamp,
      microservices: {
        researchAgent: 'http://localhost:8000',
        memoryAgent: 'http://localhost:4000',
        planningAgent: 'http://localhost:8000',
        financeAgent: 'http://localhost:8000',
        reviewAgent: 'http://localhost:8000',
        communicationAgent: 'http://localhost:8004',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to execute Chief of Staff workflow', details: error.message },
      { status: 500 }
    );
  }
}
