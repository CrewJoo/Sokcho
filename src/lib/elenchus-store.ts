import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ElenchusStep = 'SELECTION' | 'DEFINITION' | 'ELENCHUS' | 'MAIEUTICS' | 'SYNTHESIS' | 'RESULT';
export type ElenchusCategory = 'DREAM' | 'DIFFICULTY' | 'TREND' | 'STAND' | 'DIFFERENT' | null;

export interface ConversationItem {
    step: ElenchusStep;
    question: string;
    answer: string;
}

interface ElenchusState {
    currentStep: number; // 0: Selection, 1: Definition, 2: Elenchus, 3: Maieutics, 4: Synthesis, 5: Result
    category: ElenchusCategory;
    history: ConversationItem[];
    isLoading: boolean;
    finalPrep: string | null;

    // Actions
    setCategory: (category: ElenchusCategory) => void;
    setStep: (step: number) => void;
    addHistoryItem: (item: ConversationItem) => void;
    setIsLoading: (loading: boolean) => void;
    setFinalPrep: (prep: string) => void;
    reset: () => void;
}

export const useElenchusStore = create<ElenchusState>()(
    persist(
        (set) => ({
            currentStep: 0,
            category: null,
            history: [],
            isLoading: false,
            finalPrep: null,

            setCategory: (category) => set({ category }),
            setStep: (step) => set({ currentStep: step }),
            addHistoryItem: (item) => set((state) => ({ history: [...state.history, item] })),
            setIsLoading: (isLoading) => set({ isLoading }),
            setFinalPrep: (finalPrep) => set({ finalPrep }),
            reset: () => set({ currentStep: 0, category: null, history: [], isLoading: false, finalPrep: null }),
        }),
        {
            name: 'prep-elenchus-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
