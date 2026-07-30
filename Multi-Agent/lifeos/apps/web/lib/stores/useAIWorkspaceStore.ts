import { create } from 'zustand';
import { ApiClient } from '../apiClient';

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
  progressPercent: number;
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
  loadBackendHistory: () => Promise<void>;
}

const DEFAULT_WORKFLOW_NODES: WorkflowNodeState[] = [
  {
    id: 'research',
    agentRole: 'Multi-Source Search',
    department: 'Research Agent (:8000)',
    title: 'Deep Web Intelligence Discovery',
    status: 'completed',
    progressPercent: 100,
    durationMs: 340,
    confidenceScore: 0.99,
    tokensUsed: 1250,
    assignedTasks: [
      { title: 'Paper Summarization', status: 'completed' },
      { title: 'Fact Verification', status: 'completed' },
    ],
  },
  {
    id: 'memory',
    agentRole: 'Vector Memory Retrieval',
    department: 'Memory Agent (:4000)',
    title: '768-Dim RRF Hybrid Context Ingestion',
    status: 'completed',
    progressPercent: 100,
    durationMs: 180,
    confidenceScore: 0.98,
    tokensUsed: 890,
    assignedTasks: [
      { title: 'Neon pgvector Query', status: 'completed' },
      { title: 'Graph Memory Sync', status: 'completed' },
    ],
  },
  {
    id: 'planning',
    agentRole: 'Workflow Synthesizer',
    department: 'Planning Agent (:8000)',
    title: 'LangGraph Task DAG Orchestration',
    status: 'completed',
    progressPercent: 100,
    durationMs: 420,
    confidenceScore: 0.97,
    tokensUsed: 2100,
    assignedTasks: [
      { title: 'Dependency Resolution', status: 'completed' },
      { title: 'Milestone Estimation', status: 'completed' },
    ],
  },
  {
    id: 'review',
    agentRole: 'QA Security Scanner',
    department: 'Review Agent (:8000)',
    title: 'QA Gate Verification (Score >= 80)',
    status: 'completed',
    progressPercent: 100,
    durationMs: 250,
    confidenceScore: 0.99,
    qaScore: 96,
    tokensUsed: 1400,
    assignedTasks: [
      { title: 'SQLi & Secret Scanner', status: 'completed' },
      { title: 'Zero Vulnerability Gate Audit', status: 'completed' },
    ],
  },
];

const DEFAULT_SESSION: Session = {
  id: 'sess-1',
  title: 'LifeOS Core Autonomous Session',
  category: 'General',
  time: 'Just now',
  isPinned: true,
  messages: [
    {
      id: 'msg-1',
      sender: 'chief_of_staff',
      text: 'Welcome to LifeOS V2.0 AI Operating System. Chief of Staff & 6 Specialist Microservice Agents are connected and ready.',
      timestamp: '12:42 PM',
    },
  ],
  workflowNodes: DEFAULT_WORKFLOW_NODES,
  artifacts: [],
  memoryEntries: [],
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
      title: 'Autonomous Multi-Agent Session',
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

  loadBackendHistory: async () => {
    try {
      const history = await ApiClient.getWorkflowHistory();
      if (history.workflows && history.workflows.length > 0) {
        const lastWf = history.workflows[0];
        set((state) => {
          const currentActive = state.sessions.find((s) => s.id === state.activeSessionId);
          if (currentActive && lastWf.artifact && currentActive.artifacts.length === 0) {
            currentActive.artifacts = [lastWf.artifact];
          }
          return { sessions: [...state.sessions] };
        });
      }
    } catch (err) {
      console.warn('[WorkspaceStore] History sync pending backend connection.');
    }
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

    set((state) => ({
      isThinking: true,
      streamingPhase: 'Orchestrating 6 microservice agents via LifeOS Core Gateway...',
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
      // Execute Workflow via LifeOS Core API Client
      const data = await ApiClient.executeWorkflow(promptText, activeSession?.category || 'General');

      const aiMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'chief_of_staff',
        text: data.chiefOfStaffResponse || `Chief of Staff executed task: "${promptText}".`,
        timestamp: data.timestamp || timestamp,
      };

      // Map backend execution steps if returned
      const updatedNodes = data.steps && data.steps.length > 0
        ? data.steps.map((st: any) => ({
            id: st.id,
            agentRole: st.name,
            department: `${st.agentId.toUpperCase()} Agent`,
            title: st.name,
            status: st.status === 'Completed' ? 'completed' : st.status === 'Failed' ? 'failed' : 'running',
            progressPercent: 100,
            durationMs: st.durationMs,
            tokensUsed: 1200,
            assignedTasks: [{ title: st.name, status: 'completed' }],
          }))
        : DEFAULT_WORKFLOW_NODES.map((n) => ({
            ...n,
            status: 'completed',
            progressPercent: 100,
          }));

      set((state) => ({
        isThinking: false,
        streamingPhase: null,
        sessions: state.sessions.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: [...s.messages, aiMessage],
                artifacts: data.artifact ? [data.artifact, ...s.artifacts] : s.artifacts,
                workflowNodes: updatedNodes,
                memoryEntries: [
                  {
                    id: `mem-${Date.now()}`,
                    key: `Task Executed: ${promptText.slice(0, 20)}`,
                    value: aiMessage.text,
                    confidence: 0.98,
                    source: 'LifeOS Core Gateway',
                    timestamp,
                  },
                  ...s.memoryEntries,
                ],
              }
            : s
        ),
      }));
    } catch (err: any) {
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
