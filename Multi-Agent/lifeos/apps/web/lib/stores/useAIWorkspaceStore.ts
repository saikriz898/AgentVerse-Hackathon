import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chief_of_staff';
  text: string;
  timestamp: string;
}

export interface DepartmentTask {
  title: string;
  status: 'completed' | 'in_progress' | 'queued' | 'waiting';
}

export interface WorkflowNodeState {
  id: string;
  agentRole: string;
  department: string;
  title: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progressPercent: number; // 0 - 100%
  durationMs?: number;
  confidenceScore?: number;
  tokensUsed?: number;
  costEst?: string;
  qaScore?: number;
  assignedTasks: DepartmentTask[];
}

export interface ArtifactData {
  id: string;
  title: string;
  type: 'markdown' | 'json' | 'code' | 'pdf';
  content: string;
  version: string;
  createdAt: string;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  confidence: number;
  source: string;
  timestamp: string;
}

export interface Session {
  id: string;
  title: string;
  category: 'PRD' | 'Research' | 'Planning' | 'Architecture' | 'General';
  time: string;
  isPinned: boolean;
  messages: ChatMessage[];
  workflowNodes: WorkflowNodeState[];
  artifacts: ArtifactData[];
  memoryEntries: MemoryEntry[];
  isWorkflowActive?: boolean;
}

export interface AIWorkspaceState {
  sessions: Session[];
  activeSessionId: string;
  isThinking: boolean;
  streamingPhase: string | null;
  isDeepResearch: boolean;
  isMemorySyncEnabled: boolean;

  // Actions
  setActiveSessionId: (id: string) => void;
  createNewSession: (category?: Session['category']) => string;
  deleteSession: (id: string) => void;
  togglePinSession: (id: string) => void;
  renameSession: (id: string, newTitle: string) => void;
  toggleDeepResearch: () => void;
  toggleMemorySync: () => void;
  sendPrompt: (promptText: string) => Promise<void>;
}

const INITIAL_SDLC_DEPARTMENTS: WorkflowNodeState[] = [
  {
    id: 'ba',
    agentRole: 'Business Analysis',
    department: 'Business Analysis Department',
    title: 'Requirement Gathering & BRD Scope',
    status: 'completed',
    progressPercent: 100,
    durationMs: 420,
    confidenceScore: 0.98,
    tokensUsed: 1850,
    assignedTasks: [
      { title: 'Product Vision & Stakeholders', status: 'completed' },
      { title: 'User Personas & Target Market', status: 'completed' },
      { title: 'MVP Scope & Acceptance Criteria', status: 'completed' },
    ],
  },
  {
    id: 'product',
    agentRole: 'Product Planning',
    department: 'Product Planning Department',
    title: '10-Stage PRD & Roadmap Matrix',
    status: 'completed',
    progressPercent: 100,
    durationMs: 1180,
    tokensUsed: 3200,
    assignedTasks: [
      { title: 'Feature Matrix & Priorities', status: 'completed' },
      { title: '10-Stage PRD Specification', status: 'completed' },
      { title: 'Release Milestones Roadmap', status: 'completed' },
    ],
  },
  {
    id: 'architecture',
    agentRole: 'Architecture',
    department: 'System Architecture Department',
    title: 'Database Schema & OpenAPI Specs',
    status: 'completed',
    progressPercent: 100,
    durationMs: 1420,
    confidenceScore: 0.96,
    tokensUsed: 4100,
    assignedTasks: [
      { title: 'System Topology & Security Layer', status: 'completed' },
      { title: 'Neon pgvector Database Schema', status: 'completed' },
      { title: 'OpenAPI v3 REST Contracts', status: 'completed' },
    ],
  },
  {
    id: 'pm',
    agentRole: 'Project Management',
    department: 'Project Management Department',
    title: 'Epics, Stories & Sprint Board',
    status: 'completed',
    progressPercent: 100,
    durationMs: 890,
    tokensUsed: 2400,
    assignedTasks: [
      { title: 'Epic & User Story Breakdown', status: 'completed' },
      { title: 'Sprint Board Task Assignment', status: 'completed' },
      { title: 'Dependency Tree Mapping', status: 'completed' },
    ],
  },
  {
    id: 'engineering',
    agentRole: 'Engineering',
    department: 'Software Engineering Department',
    title: 'Next.js App Router & FastAPI Microservices',
    status: 'completed',
    progressPercent: 100,
    durationMs: 2150,
    tokensUsed: 5900,
    assignedTasks: [
      { title: 'Next.js 16 App Router Frontend Shell', status: 'completed' },
      { title: 'FastAPI Agent Orchestrator Engine', status: 'completed' },
      { title: 'RRF Vector Hybrid Search Interop', status: 'completed' },
    ],
  },
  {
    id: 'qa',
    agentRole: 'Quality Assurance',
    department: 'Quality Assurance Department',
    title: 'Score >= 80 Gate & Security Audit',
    status: 'completed',
    progressPercent: 100,
    qaScore: 96,
    durationMs: 780,
    assignedTasks: [
      { title: 'SQLi & Secret Scanner (0 Exclusions)', status: 'completed' },
      { title: '11-Criteria QA Gate Score 96/100', status: 'completed' },
      { title: 'Performance & Latency Audit', status: 'completed' },
    ],
  },
  {
    id: 'deploy',
    agentRole: 'Deployment & Docs',
    department: 'DevOps & Documentation Department',
    title: 'Docker Build & Executive Summary',
    status: 'completed',
    progressPercent: 100,
    durationMs: 620,
    assignedTasks: [
      { title: 'Docker Container Build & Helm Specs', status: 'completed' },
      { title: 'API Documentation Wiki & PDF Guide', status: 'completed' },
      { title: 'Production Release Notes', status: 'completed' },
    ],
  },
];

const DEFAULT_SESSION: Session = {
  id: 'sess-1',
  title: 'LifeOS Architecture V1',
  category: 'PRD',
  time: 'Just now',
  isPinned: true,
  messages: [
    {
      id: 'msg-1',
      sender: 'chief_of_staff',
      text: 'Good afternoon. I am your Chief of Staff AI. System context and vector memory partitions have been loaded. How can we assist you today?',
      timestamp: '12:42 PM',
    },
    {
      id: 'msg-2',
      sender: 'chief_of_staff',
      text: 'Our 7 Specialist SDLC Departments (Business Analysis, Product Planning, Architecture, Project Management, Engineering, QA, Deployment) are online to execute complete startup applications.',
      timestamp: '12:43 PM',
    },
  ],
  workflowNodes: INITIAL_SDLC_DEPARTMENTS,
  artifacts: [
    {
      id: 'art-1',
      title: 'lifeos-architecture-spec.json',
      type: 'json',
      version: 'v1.0.0',
      createdAt: '12:43 PM',
      content: `{
  "system": "LifeOS Multi-Agent Platform",
  "orchestrator": "Chief of Staff AI",
  "sdlc_departments": [
    "Business Analysis Department",
    "Product Planning Department",
    "System Architecture Department",
    "Project Management Department",
    "Software Engineering Department",
    "Quality Assurance Department",
    "DevOps & Documentation Department"
  ],
  "qa_approval_threshold": 80,
  "vector_search": "Reciprocal Rank Fusion (768-dim + BM25)"
}`,
    },
  ],
  memoryEntries: [
    {
      id: 'mem-1',
      key: 'Project Identity',
      value: 'LifeOS Autonomous Multi-Agent AI Operating System',
      confidence: 0.99,
      source: 'System Manifest',
      timestamp: '12:40 PM',
    },
    {
      id: 'mem-2',
      key: 'QA Gate Rule',
      value: 'Score >= 80 required by QA Department prior to production deploy',
      confidence: 0.98,
      source: 'Quality Guidelines',
      timestamp: '12:41 PM',
    },
  ],
  isWorkflowActive: true,
};

export const useAIWorkspaceStore = create<AIWorkspaceState>((set, get) => ({
  sessions: [DEFAULT_SESSION],
  activeSessionId: 'sess-1',
  isThinking: false,
  streamingPhase: null,
  isDeepResearch: true,
  isMemorySyncEnabled: true,

  setActiveSessionId: (id) => set({ activeSessionId: id }),

  toggleDeepResearch: () => set((state) => ({ isDeepResearch: !state.isDeepResearch })),
  toggleMemorySync: () => set((state) => ({ isMemorySyncEnabled: !state.isMemorySyncEnabled })),

  createNewSession: (category = 'General') => {
    const newId = `sess-${Date.now()}`;
    const newSession: Session = {
      id: newId,
      title: 'New SDLC Project Session',
      category,
      time: 'Just now',
      isPinned: false,
      messages: [],
      workflowNodes: INITIAL_SDLC_DEPARTMENTS.map((n) => ({
        ...n,
        status: 'queued',
        progressPercent: 0,
        assignedTasks: n.assignedTasks.map((t) => ({ ...t, status: 'queued' })),
      })),
      artifacts: [],
      memoryEntries: [],
      isWorkflowActive: false,
    };

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newId,
    }));

    return newId;
  },

  deleteSession: (id) => {
    set((state) => {
      const filtered = state.sessions.filter((s) => s.id !== id);
      const nextActiveId = filtered.length > 0 ? filtered[0].id : state.createNewSession();
      return { sessions: filtered, activeSessionId: nextActiveId };
    });
  },

  togglePinSession: (id) => {
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s)),
    }));
  },

  renameSession: (id, newTitle) => {
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, title: newTitle } : s)),
    }));
  },

  sendPrompt: async (promptText) => {
    const { activeSessionId } = get();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp,
    };

    // 1. Instantly append user message & activate workflow
    set((state) => ({
      isThinking: true,
      streamingPhase: 'Business Analysis & Requirement Gathering...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.messages.length === 0 ? promptText.slice(0, 24) + '...' : s.title,
              messages: [...s.messages, userMessage],
              isWorkflowActive: true,
              workflowNodes: s.workflowNodes.map((node) =>
                node.id === 'ba'
                  ? {
                      ...node,
                      status: 'running',
                      progressPercent: 70,
                      assignedTasks: [
                        { title: 'Product Vision & Scope', status: 'completed' },
                        { title: 'User Personas', status: 'completed' },
                        { title: 'Acceptance Criteria', status: 'in_progress' },
                      ],
                    }
                  : { ...node, status: 'queued', progressPercent: 0 }
              ),
            }
          : s
      ),
    }));

    // Step 2: Product Planning & Architecture Department
    await new Promise((r) => setTimeout(r, 650));
    set((state) => ({
      streamingPhase: 'Product Planning & Architecture Design...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              workflowNodes: s.workflowNodes.map((node) =>
                node.id === 'ba'
                  ? { ...node, status: 'completed', progressPercent: 100 }
                  : node.id === 'product' || node.id === 'architecture'
                  ? {
                      ...node,
                      status: 'running',
                      progressPercent: 85,
                      assignedTasks: node.assignedTasks.map((t) => ({ ...t, status: 'completed' })),
                    }
                  : node
              ),
            }
          : s
      ),
    }));

    // Step 3: Project Management & Software Engineering
    await new Promise((r) => setTimeout(r, 750));
    set((state) => ({
      streamingPhase: 'Engineering & Code Build Pipeline...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              workflowNodes: s.workflowNodes.map((node) =>
                node.id === 'product' || node.id === 'architecture'
                  ? { ...node, status: 'completed', progressPercent: 100 }
                  : node.id === 'pm' || node.id === 'engineering'
                  ? {
                      ...node,
                      status: 'running',
                      progressPercent: 90,
                      assignedTasks: node.assignedTasks.map((t) => ({ ...t, status: 'completed' })),
                    }
                  : node
              ),
            }
          : s
      ),
    }));

    // Step 4: QA Gate & Deployment Verification
    await new Promise((r) => setTimeout(r, 650));

    let aiText = `Understood. Chief of Staff orchestrated 7 SDLC Departments to build: "${promptText}". Full product architecture, database schema, task breakdown, and QA audit completed.`;
    let newArtifact: ArtifactData | null = null;

    const lower = promptText.toLowerCase();

    if (lower.includes('/build') || lower.includes('build')) {
      aiText = `Chief of Staff & 7 SDLC Departments successfully built end-to-end application architecture for "${promptText}". PRD, DB Schema, and Deployment Plan generated.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'sdlc-full-build-specification.md',
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
    } else if (lower.includes('/arch') || lower.includes('arch')) {
      aiText = `Architecture Department generated system topology and OpenAPI v3 REST contracts.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'openapi-rest-contracts.yaml',
        type: 'code',
        version: 'v3.0.0',
        createdAt: timestamp,
        content: `openapi: 3.0.0\ninfo:\n  title: LifeOS SDLC Engine API\n  version: 1.0.0\npaths:\n  /api/v1/sdlc/build:\n    post:\n      summary: Execute End-to-End Startup SDLC\n      responses:\n        '200':\n          description: SDLC Build Executed Successfully`,
      };
    } else if (lower.includes('/cost') || lower.includes('cost')) {
      aiText = `Finance & DevOps Department computed cloud pricing matrix. Estimated monthly AWS spot cost: $124/mo (+24% ROI savings).`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'cloud-infrastructure-cost-matrix.json',
        type: 'json',
        version: 'v2.0.0',
        createdAt: timestamp,
        content: `{\n  "monthly_estimate": "$124.00",\n  "roi_savings": "+24%",\n  "cloud_providers": [\n    { "name": "AWS EC2 Spot", "cost": "$124/mo" },\n    { "name": "GCP Cloud Run", "cost": "$148/mo" },\n    { "name": "Azure App Service", "cost": "$165/mo" }\n  ]\n}`,
      };
    } else if (lower.includes('/qa') || lower.includes('qa') || lower.includes('security')) {
      aiText = `Quality Assurance Department completed automated audit. QA Score: 96/100 (Passed Gate >= 80, 0 High Severity Vulnerabilities).`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'security-qa-audit-report.md',
        type: 'markdown',
        version: 'v1.0.1',
        createdAt: timestamp,
        content: `# LifeOS Security & QA Audit Report\n\n- **QA Score**: 96/100 (Passed Gate >= 80)\n- **SQLi Scanner**: Passed (0 vulnerabilities)\n- **Secret Scanner**: Passed (0 exposed keys)\n- **Recommendation**: Approved for production release.`,
      };
    }

    const aiMessage: ChatMessage = {
      id: `msg-ai-${Date.now()}`,
      sender: 'chief_of_staff',
      text: aiText,
      timestamp,
    };

    set((state) => ({
      isThinking: false,
      streamingPhase: null,
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: [...s.messages, aiMessage],
              artifacts: newArtifact ? [newArtifact, ...s.artifacts] : s.artifacts,
              workflowNodes: s.workflowNodes.map((n) => ({
                ...n,
                status: 'completed',
                progressPercent: 100,
                assignedTasks: n.assignedTasks.map((t) => ({ ...t, status: 'completed' })),
              })),
              memoryEntries: [
                {
                  id: `mem-${Date.now()}`,
                  key: `SDLC Executed: ${promptText.slice(0, 20)}`,
                  value: aiText,
                  confidence: 0.98,
                  source: 'Chief of Staff SDLC Engine',
                  timestamp,
                },
                ...s.memoryEntries,
              ],
            }
          : s
      ),
    }));
  },
}));
