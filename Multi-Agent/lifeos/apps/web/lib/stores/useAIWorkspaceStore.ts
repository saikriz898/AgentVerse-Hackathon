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

const DEFAULT_WORKFLOW_NODES: WorkflowNodeState[] = [
  {
    id: 'intent',
    agentRole: 'Intent Understanding',
    department: 'Chief of Staff Core',
    title: 'User Prompt Intent Analysis',
    status: 'completed',
    progressPercent: 100,
    durationMs: 140,
    confidenceScore: 0.99,
    tokensUsed: 850,
    assignedTasks: [
      { title: 'Intent Classification', status: 'completed' },
      { title: 'Dynamic Workflow Construction', status: 'completed' },
    ],
  },
  {
    id: 'memory',
    agentRole: 'Context Memory Retrieval',
    department: 'Vector Memory Store',
    title: '768-Dim RRF Hybrid Context Sync',
    status: 'completed',
    progressPercent: 100,
    durationMs: 220,
    confidenceScore: 0.98,
    tokensUsed: 1420,
    assignedTasks: [
      { title: 'Neon pgvector Query', status: 'completed' },
      { title: 'Pinned Document Retrieval', status: 'completed' },
    ],
  },
  {
    id: 'delivery',
    agentRole: 'Executive Delivery',
    department: 'Chief of Staff Core',
    title: 'Deliverable Synthesis & Artifact Generation',
    status: 'completed',
    progressPercent: 100,
    durationMs: 480,
    tokensUsed: 2100,
    assignedTasks: [
      { title: 'Executive Response Formatting', status: 'completed' },
      { title: 'Artifact Connection', status: 'completed' },
    ],
  },
];

const DEFAULT_SESSION: Session = {
  id: 'sess-1',
  title: 'LifeOS System Overview',
  category: 'General',
  time: 'Just now',
  isPinned: true,
  messages: [
    {
      id: 'msg-1',
      sender: 'chief_of_staff',
      text: 'Good afternoon. I am your Chief of Staff AI. All internal capabilities and vector memory partitions are online. How can I assist you with your projects today?',
      timestamp: '12:42 PM',
    },
  ],
  workflowNodes: DEFAULT_WORKFLOW_NODES,
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
  "capabilities": [
    "Requirement Analysis",
    "Product Planning",
    "System Architecture",
    "Project Management",
    "Software Engineering",
    "Quality Assurance",
    "DevOps & Documentation"
  ],
  "qa_approval_threshold": 80,
  "vector_search": "Reciprocal Rank Fusion (768-dim + BM25)"
}`,
    },
  ],
  memoryEntries: [
    {
      id: 'mem-1',
      key: 'System Architecture',
      value: 'Unified Chief of Staff AI orchestrating internal specialist capabilities dynamically',
      confidence: 0.99,
      source: 'System Manifest',
      timestamp: '12:40 PM',
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
      title: 'New Autonomous Session',
      category,
      time: 'Just now',
      isPinned: false,
      messages: [],
      workflowNodes: DEFAULT_WORKFLOW_NODES.map((n) => ({
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
    const lower = promptText.toLowerCase();

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp,
    };

    // Construct Dynamic Intent-Driven Workflow Nodes based on prompt complexity
    let dynamicNodes: WorkflowNodeState[] = DEFAULT_WORKFLOW_NODES;

    if (lower.includes('/build') || lower.includes('build')) {
      dynamicNodes = [
        {
          id: 'ba',
          agentRole: 'Business Analysis',
          department: 'Requirement Gathering',
          title: 'BRD & Scope Analysis',
          status: 'running',
          progressPercent: 60,
          durationMs: 420,
          assignedTasks: [
            { title: 'Product Vision & Scope', status: 'completed' },
            { title: 'User Personas', status: 'completed' },
            { title: 'Acceptance Criteria', status: 'in_progress' },
          ],
        },
        {
          id: 'prd',
          agentRole: 'Product Planning',
          department: 'Product Strategy',
          title: 'PRD & Feature Roadmap',
          status: 'queued',
          progressPercent: 0,
          assignedTasks: [
            { title: '10-Stage PRD Specification', status: 'queued' },
            { title: 'Release Milestones', status: 'queued' },
          ],
        },
        {
          id: 'arch',
          agentRole: 'Architecture',
          department: 'System Design',
          title: 'Database Schema & OpenAPI',
          status: 'queued',
          progressPercent: 0,
          assignedTasks: [
            { title: 'Neon pgvector Schema', status: 'queued' },
            { title: 'OpenAPI REST Contracts', status: 'queued' },
          ],
        },
        {
          id: 'qa',
          agentRole: 'Quality Assurance',
          department: 'Security & QA Gate',
          title: 'QA Score >= 80 Gate Verification',
          status: 'queued',
          progressPercent: 0,
          qaScore: 96,
          assignedTasks: [
            { title: 'SQLi & Secret Scanner', status: 'queued' },
            { title: '11-Criteria QA Gate', status: 'queued' },
          ],
        },
      ];
    } else if (lower.includes('/research') || lower.includes('research')) {
      dynamicNodes = [
        {
          id: 'parse',
          agentRole: 'Query Parsing',
          department: 'Intent Processor',
          title: 'Deep Research Query Extraction',
          status: 'running',
          progressPercent: 80,
          durationMs: 180,
          assignedTasks: [{ title: 'Extract Target Domains & Topics', status: 'completed' }],
        },
        {
          id: 'search',
          agentRole: 'Deep Web Search',
          department: 'Research Engine',
          title: 'Tavily Search API (14 Sources)',
          status: 'queued',
          progressPercent: 0,
          confidenceScore: 0.96,
          assignedTasks: [{ title: 'Cross-Source Fact Checker', status: 'queued' }],
        },
      ];
    }

    // 1. Instantly append user message & activate dynamic workflow
    set((state) => ({
      isThinking: true,
      streamingPhase: 'Chief of Staff Analyzing Intent & Building Workflow...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.messages.length === 0 ? promptText.slice(0, 24) + '...' : s.title,
              messages: [...s.messages, userMessage],
              isWorkflowActive: true,
              workflowNodes: dynamicNodes,
            }
          : s
      ),
    }));

    // Step 2: Intermediate execution step
    await new Promise((r) => setTimeout(r, 700));
    set((state) => ({
      streamingPhase: 'Executing Internal Capabilities & Synthesizing Deliverables...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              workflowNodes: s.workflowNodes.map((n) => ({
                ...n,
                status: 'completed',
                progressPercent: 100,
                assignedTasks: n.assignedTasks.map((t) => ({ ...t, status: 'completed' })),
              })),
            }
          : s
      ),
    }));

    // Step 3: Finalize Chief of Staff Response & Artifact Generation
    await new Promise((r) => setTimeout(r, 600));

    let aiText = `Understood. Chief of Staff processed your request: "${promptText}". All internal capabilities executed dynamically and deliverables synthesized.`;
    let newArtifact: ArtifactData | null = null;

    if (lower.includes('/build') || lower.includes('build')) {
      aiText = `Chief of Staff synthesized the complete SDLC specification for "${promptText}". Requirements, System Topology, Database Schema, and QA Audit report generated.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'sdlc-build-specification.md',
        type: 'markdown',
        version: 'v1.0.0',
        createdAt: timestamp,
        content: `# Full Startup SDLC Build Specification\n\n## 1. Requirement Discovery\n- **Scope**: Core MVP features, user management, vector search interop, dashboard canvas.\n- **User Stories**: 14 Epics, 42 User Stories created.\n\n## 2. Product Architecture\n- **Database**: Neon PostgreSQL + pgvector (768-dim RRF Search)\n- **Backend**: FastAPI Microservices + Python LangGraph\n- **Frontend**: Next.js 16 App Router + Tailwind CSS\n\n## 3. QA Audit Report\n- **Score**: 96/100 (Passed Gate >= 80)\n- **Vulnerabilities**: 0 High Severity`,
      };
    } else if (lower.includes('/prd') || lower.includes('prd')) {
      aiText = `Chief of Staff generated 10-stage PRD technical specification. Feature Matrix & Release Roadmap synced.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'lifeos-prd-specification.md',
        type: 'markdown',
        version: 'v1.1.0',
        createdAt: timestamp,
        content: `# LifeOS PRD Technical Specification\n\n## 1. Executive Summary\nUnified Chief of Staff platform orchestrating internal specialist capabilities dynamically.\n\n## 2. Capability Contracts\n- Business Analysis: BRD + Acceptance Criteria\n- Product Planning: 10-Stage PRD & Roadmap\n- Architecture: System Design & DB Schemas\n- Engineering: Next.js + FastAPI Microservices\n- QA: Score >= 80 Gate Audit`,
      };
    } else if (lower.includes('/arch') || lower.includes('arch')) {
      aiText = `Chief of Staff generated system architecture topology and OpenAPI v3 REST contracts.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'openapi-rest-contracts.yaml',
        type: 'code',
        version: 'v3.0.0',
        createdAt: timestamp,
        content: `openapi: 3.0.0\ninfo:\n  title: LifeOS Unified Chief of Staff API\n  version: 1.0.0\npaths:\n  /api/v1/execute:\n    post:\n      summary: Execute Chief of Staff Workflow\n      responses:\n        '200':\n          description: Workflow Executed Successfully`,
      };
    } else if (lower.includes('/cost') || lower.includes('cost')) {
      aiText = `Chief of Staff computed cloud infrastructure pricing matrix. Estimated monthly AWS spot cost: $124/mo (+24% ROI savings).`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'cloud-infrastructure-cost-matrix.json',
        type: 'json',
        version: 'v2.0.0',
        createdAt: timestamp,
        content: `{\n  "monthly_estimate": "$124.00",\n  "roi_savings": "+24%",\n  "cloud_providers": [\n    { "name": "AWS EC2 Spot", "cost": "$124/mo" },\n    { "name": "GCP Cloud Run", "cost": "$148/mo" },\n    { "name": "Azure App Service", "cost": "$165/mo" }\n  ]\n}`,
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
              memoryEntries: [
                {
                  id: `mem-${Date.now()}`,
                  key: `Task Executed: ${promptText.slice(0, 20)}`,
                  value: aiText,
                  confidence: 0.98,
                  source: 'Chief of Staff AI',
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
