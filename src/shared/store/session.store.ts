import { create } from 'zustand';

interface SessionState {
  userId: string | null;
  setUserId: (userId: string | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
}));
