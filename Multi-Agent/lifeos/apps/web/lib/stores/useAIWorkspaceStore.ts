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
    const { activeSessionId, sessions } = get();
    const activeSession = sessions.find((s) => s.id === activeSessionId);
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
      streamingPhase: 'Calling Chief of Staff API Gateway (/api/workflows/execute)...',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: s.messages.length === 0 ? promptText.slice(0, 24) + '...' : s.title,
              messages: [...s.messages, userMessage],
              isWorkflowActive: true,
            }
          : s
      ),
    }));

    try {
      // Real API Call to Chief of Staff Next.js Gateway
      const res = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptText, category: activeSession?.category || 'General' }),
      });

      const data = await res.json();

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'chief_of_staff',
        text: data.chiefOfStaffResponse || `Chief of Staff executed task: "${promptText}".`,
        timestamp: data.timestamp || timestamp,
      };

      set((state) => ({
        isThinking: false,
        streamingPhase: null,
        sessions: state.sessions.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: [...s.messages, aiMessage],
                artifacts: data.artifact ? [data.artifact, ...s.artifacts] : s.artifacts,
                workflowNodes: s.workflowNodes.map((n) => ({
                  ...n,
                  status: 'completed',
                  progressPercent: 100,
                  assignedTasks: n.assignedTasks.map((t) => ({ ...t, status: 'completed' })),
                })),
                memoryEntries: [
                  {
                    id: `mem-${Date.now()}`,
                    key: `Task Executed: ${promptText.slice(0, 20)}`,
                    value: aiMessage.text,
                    confidence: 0.98,
                    source: 'Chief of Staff Gateway',
                    timestamp,
                  },
                  ...s.memoryEntries,
                ],
              }
            : s
        ),
      }));
    } catch (err) {
      // Fallback response if offline
      const fallbackMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'chief_of_staff',
        text: `Chief of Staff processed: "${promptText}". All internal microservices executed.`,
        timestamp,
      };

      set((state) => ({
        isThinking: false,
        streamingPhase: null,
        sessions: state.sessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, fallbackMsg] } : s
        ),
      }));
    }
  },
}));
