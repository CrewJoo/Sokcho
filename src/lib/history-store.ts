import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type PracticeType = 'prep-training' | 'prep-transform' | 'prep-interview' | 'elenchus' | 'prep-word-dancing';

export interface PracticeRecord {
    id: string;
    type: PracticeType;
    createdAt: string;       // ISO date string
    question: string;
    data: Record<string, unknown>;
    feedback?: string;
    score?: number;          // 0-100
}

export type GrowthLevel = '씨앗' | '새싹' | '나무' | '숲' | '산';

const LEVEL_THRESHOLDS: Record<GrowthLevel, number> = {
    '씨앗': 0,
    '새싹': 5,
    '나무': 15,
    '숲': 30,
    '산': 60,
};

const MAX_RECORDS = 100;

// ──────────────────────────────────────────────
// Store Interface
// ──────────────────────────────────────────────

interface HistoryState {
    records: PracticeRecord[];
    lastPracticeDate: string | null;
    streakDays: number;

    // Actions
    addRecord: (record: Omit<PracticeRecord, 'id'>) => void;
    removeRecord: (id: string) => void;
    clearAll: () => void;

    // Computed helpers (via get)
    getRecordsByType: (type: PracticeType) => PracticeRecord[];
    getRecentRecords: (limit: number) => PracticeRecord[];
    getTotalCount: () => number;
    getThisWeekCount: () => number;
    getLevel: () => GrowthLevel;
    getLevelProgress: () => { current: GrowthLevel; next: GrowthLevel | null; progress: number };
    getDailyCountsForWeeks: (weeks: number) => Record<string, number>;
    getTypeDistribution: () => { type: PracticeType; label: string; count: number; color: string }[];
    getPracticeTierInfo: (type: PracticeType) => { current: GrowthLevel; next: GrowthLevel | null; progress: number; count: number; remaining: number | null; tierIndex: number };
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getDateString(date: Date = new Date()): string {
    return date.toISOString().split('T')[0]!;
}

function calculateStreak(lastDate: string | null, currentStreak: number): number {
    if (!lastDate) return 1;

    const today = getDateString();
    const yesterday = getDateString(new Date(Date.now() - 86400000));

    if (lastDate === today) return currentStreak; // Already practiced today
    if (lastDate === yesterday) return currentStreak + 1; // Continue streak
    return 1; // Streak broken
}

function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// ──────────────────────────────────────────────
// Store
// ──────────────────────────────────────────────

export const useHistoryStore = create<HistoryState>()(
    persist(
        (set, get) => ({
            records: [],
            lastPracticeDate: null,
            streakDays: 0,

            addRecord: (recordData) => {
                const today = getDateString();
                const newRecord: PracticeRecord = {
                    ...recordData,
                    id: generateId(),
                };

                set((state) => {
                    const newStreak = calculateStreak(state.lastPracticeDate, state.streakDays);
                    let newRecords = [newRecord, ...state.records];

                    // Enforce max records (FIFO)
                    if (newRecords.length > MAX_RECORDS) {
                        newRecords = newRecords.slice(0, MAX_RECORDS);
                    }

                    return {
                        records: newRecords,
                        lastPracticeDate: today,
                        streakDays: newStreak,
                    };
                });
            },

            removeRecord: (id) => {
                set((state) => ({
                    records: state.records.filter((r) => r.id !== id),
                }));
            },

            clearAll: () => {
                set({ records: [], lastPracticeDate: null, streakDays: 0 });
            },

            getRecordsByType: (type) => {
                return get().records.filter((r) => r.type === type);
            },

            getRecentRecords: (limit) => {
                return get().records.slice(0, limit);
            },

            getTotalCount: () => {
                return get().records.length;
            },

            getThisWeekCount: () => {
                const weekStart = getStartOfWeek(new Date());
                return get().records.filter((r) => new Date(r.createdAt) >= weekStart).length;
            },

            getLevel: () => {
                const count = get().records.length;
                if (count >= LEVEL_THRESHOLDS['산']) return '산';
                if (count >= LEVEL_THRESHOLDS['숲']) return '숲';
                if (count >= LEVEL_THRESHOLDS['나무']) return '나무';
                if (count >= LEVEL_THRESHOLDS['새싹']) return '새싹';
                return '씨앗';
            },

            getLevelProgress: () => {
                const count = get().records.length;
                const levels: GrowthLevel[] = ['씨앗', '새싹', '나무', '숲', '산'];
                let currentIdx = 0;

                for (let i = levels.length - 1; i >= 0; i--) {
                    if (count >= LEVEL_THRESHOLDS[levels[i]!]) {
                        currentIdx = i;
                        break;
                    }
                }

                const current = levels[currentIdx]!;
                const next = currentIdx < levels.length - 1 ? levels[currentIdx + 1]! : null;

                if (!next) return { current, next: null, progress: 100 };

                const currentThreshold = LEVEL_THRESHOLDS[current];
                const nextThreshold = LEVEL_THRESHOLDS[next];
                const progress = Math.round(((count - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

                return { current, next, progress: Math.min(progress, 100) };
            },

            getPracticeTierInfo: (type) => {
                const count = get().records.filter(r => r.type === type).length;
                const levels: GrowthLevel[] = ['씨앗', '새싹', '나무', '숲', '산'];
                let currentIdx = 0;

                for (let i = levels.length - 1; i >= 0; i--) {
                    if (count >= LEVEL_THRESHOLDS[levels[i]!]) {
                        currentIdx = i;
                        break;
                    }
                }

                const current = levels[currentIdx]!;
                const next = currentIdx < levels.length - 1 ? levels[currentIdx + 1]! : null;
                const tierIndex = currentIdx + 1; // 1 to 5

                if (!next) return { current, next: null, progress: 100, count, remaining: null, tierIndex };

                const currentThreshold = LEVEL_THRESHOLDS[current];
                const nextThreshold = LEVEL_THRESHOLDS[next];
                const progress = Math.round(((count - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
                const remaining = nextThreshold - count;

                return { current, next, progress: Math.min(progress, 100), count, remaining, tierIndex };
            },

            getDailyCountsForWeeks: (weeks) => {
                const counts: Record<string, number> = {};
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - weeks * 7);

                // Init all dates to 0
                for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
                    counts[getDateString(d)] = 0;
                }

                // Count records
                get().records.forEach((r) => {
                    const dateStr = r.createdAt.split('T')[0]!;
                    if (dateStr in counts) {
                        counts[dateStr]!++;
                    }
                });

                return counts;
            },

            getTypeDistribution: () => {
                const records = get().records;
                const typeConfig: { type: PracticeType; label: string; color: string }[] = [
                    { type: 'prep-training', label: 'PREP 트레이닝', color: '#10B981' },
                    { type: 'prep-transform', label: 'PREP 변환', color: '#8B5CF6' },
                    { type: 'prep-interview', label: 'AI 면접', color: '#1E3A8A' },
                    { type: 'elenchus', label: '엘렌코스', color: '#F59E0B' },
                    { type: 'prep-word-dancing', label: 'PREP 워드댄싱', color: '#f59e0b' },
                ];

                return typeConfig.map((tc) => ({
                    ...tc,
                    count: records.filter((r) => r.type === tc.type).length,
                }));
            },
        }),
        {
            name: 'prep-history-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Level emoji helper
export const LEVEL_EMOJI: Record<GrowthLevel, string> = {
    '씨앗': '🌰',
    '새싹': '🌱',
    '나무': '🌳',
    '숲': '🌲',
    '산': '🏔️',
};
