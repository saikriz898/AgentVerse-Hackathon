import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  setWorkspace: (ws: Workspace) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  setWorkspace: (ws) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workspaceId', ws.id);
    }
    set({ currentWorkspace: ws });
  },
}));
