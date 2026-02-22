import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Tier = 'Seed' | 'Sprout' | 'Branch' | 'Tree' | 'Forest';

interface WordDancingState {
    totalScore: number;
    completedBunches: Record<number, number[]>; // Level -> Array of Bunch IDs

    // Actions
    addScore: (amount: number) => void;
    completeBunch: (level: number, bunchId: number) => void;
    getTier: () => Tier;
    resetProgress: () => void;
}

const TIER_THRESHOLDS = {
    Seed: 0,
    Sprout: 100, // ~1 complete level
    Branch: 300,
    Tree: 600,
    Forest: 1000
};

export const useWordDancingStore = create<WordDancingState>()(
    persist(
        (set, get) => ({
            totalScore: 0,
            completedBunches: {},

            addScore: (amount) => set((state) => ({ totalScore: state.totalScore + amount })),

            completeBunch: (level, bunchId) => set((state) => {
                const currentLevelBunches = state.completedBunches[level] || [];
                if (currentLevelBunches.includes(bunchId)) {
                    return state; // Already completed
                }
                return {
                    completedBunches: {
                        ...state.completedBunches,
                        [level]: [...currentLevelBunches, bunchId]
                    }
                };
            }),

            getTier: () => {
                const score = get().totalScore;
                if (score >= TIER_THRESHOLDS.Forest) return 'Forest';
                if (score >= TIER_THRESHOLDS.Tree) return 'Tree';
                if (score >= TIER_THRESHOLDS.Branch) return 'Branch';
                if (score >= TIER_THRESHOLDS.Sprout) return 'Sprout';
                return 'Seed';
            },

            resetProgress: () => set({ totalScore: 0, completedBunches: {} }),
        }),
        {
            name: 'word-dancing-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export const getNextTierInfo = (currentScore: number) => {
    if (currentScore >= TIER_THRESHOLDS.Forest) return { next: null, remaining: 0, total: 0 };
    if (currentScore >= TIER_THRESHOLDS.Tree) return { next: 'Forest', remaining: TIER_THRESHOLDS.Forest - currentScore, total: TIER_THRESHOLDS.Forest };
    if (currentScore >= TIER_THRESHOLDS.Branch) return { next: 'Tree', remaining: TIER_THRESHOLDS.Tree - currentScore, total: TIER_THRESHOLDS.Tree };
    if (currentScore >= TIER_THRESHOLDS.Sprout) return { next: 'Branch', remaining: TIER_THRESHOLDS.Branch - currentScore, total: TIER_THRESHOLDS.Branch };
    return { next: 'Sprout', remaining: TIER_THRESHOLDS.Sprout - currentScore, total: TIER_THRESHOLDS.Sprout };
};
