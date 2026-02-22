import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PrepQuestion } from './constants';

export interface PrepData {
    point1: string;
    reason: string;
    example: string;
    point2: string;
}

export type PrepMode = 'INTERVIEW' | 'WORK' | null;

interface PrepStore {
    currentStep: number;
    mode: PrepMode;
    data: PrepData;
    question: PrepQuestion | null;
    setStep: (step: number) => void;
    setMode: (mode: PrepMode) => void;
    updateData: (data: Partial<PrepData>) => void;
    setQuestion: (q: PrepQuestion | null) => void;
    reset: () => void;
}

const initialData: PrepData = {
    point1: '',
    reason: '',
    example: '',
    point2: '',
};

export const usePrepStore = create<PrepStore>()(
    persist(
        (set) => ({
            currentStep: 1,
            mode: null,
            data: initialData,
            question: null,
            setStep: (step) => set({ currentStep: step }),
            setMode: (mode) => set({ mode }),
            updateData: (newData) =>
                set((state) => ({ data: { ...state.data, ...newData } })),
            setQuestion: (q) => set({ question: q }),
            reset: () => set({ currentStep: 1, mode: null, data: initialData, question: null }),
        }),
        {
            name: 'prep-training-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
