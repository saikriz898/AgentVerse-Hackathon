import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'chief_of_staff';
  text: string;
  timestamp: string;
}

export interface WorkflowNodeState {
  id: string;
  agentRole: string;
  title: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progressPercent: number; // 0 - 100%
  durationMs?: number;
  confidenceScore?: number;
  tokensUsed?: number;
  costEst?: string;
  qaScore?: number;
  details?: string[];
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
  category: 'PRD' | 'Research' | 'Planning' | 'Review' | 'General';
  time: string;
  isPinned: boolean;
  messages: ChatMessage[];
  workflowNodes: WorkflowNodeState[];
  artifacts: ArtifactData[];
  memoryEntries: MemoryEntry[];
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
  sendPrompt: (promptText: string, mode?: string) => Promise<void>;
}

const INITIAL_WORKFLOW_NODES: WorkflowNodeState[] = [
  {
    id: 'memory',
    agentRole: 'Memory Agent',
    title: 'Context Vector Loaded',
    status: 'completed',
    progressPercent: 100,
    durationMs: 140,
    confidenceScore: 0.98,
    tokensUsed: 1240,
    details: ['RRF Hybrid Search (Vector + BM25)', '768-dim Embedding Synced', '3 Pinned Documents Retrieved'],
  },
  {
    id: 'research',
    agentRole: 'Research Agent',
    title: 'Multi-Source Deep Web Search',
    status: 'completed',
    progressPercent: 100,
    durationMs: 2420,
    confidenceScore: 0.95,
    tokensUsed: 4850,
    details: ['Tavily Search API (3x Retry)', 'Cross-Source Fact Checker Passed', '14 Primary References Scraped'],
  },
  {
    id: 'planning',
    agentRole: 'Planning Agent',
    title: '10-Stage LangGraph Roadmap',
    status: 'completed',
    progressPercent: 100,
    durationMs: 1180,
    tokensUsed: 3200,
    details: ['Subtask Breakdown Completed', 'Priority Tree Assigned', 'Milestone Generation Verified'],
  },
  {
    id: 'execution',
    agentRole: 'Execution Agent',
    title: 'Task Execution & Code Build',
    status: 'completed',
    progressPercent: 100,
    durationMs: 1850,
    tokensUsed: 2900,
    details: ['FastAPI Microservice Interop Passed', 'Next.js App Router Compiled'],
  },
  {
    id: 'finance',
    agentRole: 'Finance Agent',
    title: 'Cost & Cloud Price Comparison',
    status: 'completed',
    progressPercent: 100,
    costEst: '$124/mo',
    durationMs: 920,
    details: ['AWS Spot Instance Tariffs Calculated', '+24% Monthly Savings Forecasted'],
  },
  {
    id: 'review',
    agentRole: 'Review Agent',
    title: 'QA & Security Scanner',
    status: 'completed',
    progressPercent: 100,
    qaScore: 95,
    durationMs: 650,
    details: ['Score >= 80 QA Threshold Passed', '0 High Severity Vulnerabilities'],
  },
  {
    id: 'communication',
    agentRole: 'Communication Agent',
    title: 'Executive Deliverable Synthesis',
    status: 'completed',
    progressPercent: 100,
    durationMs: 480,
    details: ['JSON transformed into executive markdown & PRD format'],
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
      text: 'Our 6 specialist agents (Research, Planning, Execution, Finance, Review, Communication) are online and ready to execute deep workflows.',
      timestamp: '12:43 PM',
    },
  ],
  workflowNodes: INITIAL_WORKFLOW_NODES,
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
  "specialist_agents": [
    "Research Agent",
    "Planning Agent",
    "Finance Agent",
    "Memory Agent",
    "Review Agent",
    "Communication Agent"
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
      value: 'Score >= 80 required by Review Agent prior to production deploy',
      confidence: 0.98,
      source: 'Quality Guidelines',
      timestamp: '12:41 PM',
    },
  ],
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
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'chief_of_staff',
          text: 'New workspace session initialized. What task or project would you like to execute?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      workflowNodes: INITIAL_WORKFLOW_NODES.map((n) => ({ ...n, status: 'queued', progressPercent: 0 })),
      artifacts: [],
      memoryEntries: [],
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

    // 1. Instantly append user message & update title
    set((state) => ({
      isThinking: true,
      streamingPhase: 'Memory Vector Loading...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.messages.length <= 1 ? promptText.slice(0, 24) + '...' : s.title,
              messages: [...s.messages, userMessage],
              workflowNodes: s.workflowNodes.map((node) =>
                node.id === 'memory'
                  ? { ...node, status: 'running', progressPercent: 65 }
                  : { ...node, status: 'queued', progressPercent: 0 }
              ),
            }
          : s
      ),
    }));

    // Step 2: Research phase
    await new Promise((r) => setTimeout(r, 600));
    set((state) => ({
      streamingPhase: 'Research Agent Searching Web...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              workflowNodes: s.workflowNodes.map((node) =>
                node.id === 'memory'
                  ? { ...node, status: 'completed', progressPercent: 100 }
                  : node.id === 'research'
                  ? { ...node, status: 'running', progressPercent: 75 }
                  : node
              ),
            }
          : s
      ),
    }));

    // Step 3: Planning & Execution phase
    await new Promise((r) => setTimeout(r, 700));
    set((state) => ({
      streamingPhase: 'Planning & Executing Workflows...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              workflowNodes: s.workflowNodes.map((node) =>
                node.id === 'research'
                  ? { ...node, status: 'completed', progressPercent: 100 }
                  : node.id === 'planning' || node.id === 'execution'
                  ? { ...node, status: 'completed', progressPercent: 100 }
                  : node
              ),
            }
          : s
      ),
    }));

    // Step 4: Finalize AI Response & Artifact Generation
    await new Promise((r) => setTimeout(r, 600));

    let aiText = `Understood. Orchestrating specialist agents to process: "${promptText}". Vector memory synced and 7-agent execution pipeline completed.`;
    let newArtifact: ArtifactData | null = null;

    const lower = promptText.toLowerCase();

    if (lower.includes('/prd') || lower.includes('prd')) {
      aiText = `Planning & Communication Agents synthesized the 10-stage PRD technical specification. Review Agent passed QA score 96/100.`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'lifeos-prd-specification.md',
        type: 'markdown',
        version: 'v1.1.0',
        createdAt: timestamp,
        content: `# LifeOS PRD Technical Specification\n\n## 1. Executive Summary\nDual-Engine platform combining Chief of Staff orchestrator with 6 specialist AI agent microservices.\n\n## 2. Agent Interop Contracts\n- Research Agent: Tavily API + 0-100% confidence scoring\n- Planning Agent: LangGraph 10-stage DAG\n- Finance Agent: Recharts multi-cloud cost matrix\n- Memory Agent: Neon pgvector RRF search\n- Review Agent: Score >= 80 QA threshold\n- Communication Agent: 19 output document formats`,
      };
    } else if (lower.includes('/research') || lower.includes('research')) {
      aiText = `Research Agent completed deep web search via Tavily API. Cross-verified 14 primary references with 96% confidence score.`;
    } else if (lower.includes('/cost') || lower.includes('cost')) {
      aiText = `Finance Agent computed multi-cloud price comparison matrix. Estimated monthly AWS spot cost: $124/mo (+24% ROI savings).`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'cloud-infrastructure-cost-matrix.json',
        type: 'json',
        version: 'v2.0.0',
        createdAt: timestamp,
        content: `{\n  "monthly_estimate": "$124.00",\n  "roi_savings": "+24%",\n  "cloud_providers": [\n    { "name": "AWS EC2 Spot", "cost": "$124/mo" },\n    { "name": "GCP Cloud Run", "cost": "$148/mo" },\n    { "name": "Azure App Service", "cost": "$165/mo" }\n  ]\n}`,
      };
    } else if (lower.includes('/qa') || lower.includes('qa') || lower.includes('security')) {
      aiText = `Review Agent completed automated security scan. QA Score: 95/100 (0 High Severity Vulnerabilities found).`;
      newArtifact = {
        id: `art-${Date.now()}`,
        title: 'security-qa-audit-report.md',
        type: 'markdown',
        version: 'v1.0.1',
        createdAt: timestamp,
        content: `# LifeOS Security & QA Audit Report\n\n- **QA Score**: 95/100 (Passed Gate >= 80)\n- **SQLi Scanner**: Passed (0 vulnerabilities)\n- **Secret Scanner**: Passed (0 exposed keys)\n- **Recommendation**: Approved for production release.`,
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
              workflowNodes: s.workflowNodes.map((n) => ({ ...n, status: 'completed', progressPercent: 100 })),
              memoryEntries: [
                {
                  id: `mem-${Date.now()}`,
                  key: `Task Executed: ${promptText.slice(0, 20)}`,
                  value: aiText,
                  confidence: 0.96,
                  source: 'Chief of Staff Orchestrator',
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
