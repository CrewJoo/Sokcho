import { create } from 'zustand';

interface HomeState {
    viewMode: 'intro' | 'ai' | 'interviewer';
    setViewMode: (mode: 'intro' | 'ai' | 'interviewer') => void;
}

export const useHomeStore = create<HomeState>((set) => ({
    viewMode: 'intro',
    setViewMode: (mode) => set({ viewMode: mode }),
}));
