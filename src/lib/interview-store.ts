
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUESTION_POOL } from './interview-questions';

export type InterviewMode = 'SCHOOL' | 'TRANSFER' | null;

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AnalysisData {
    dream: { p: string; r: string; e: string; p2: string };
    difficulty: { p: string; r: string; e: string; p2: string };
    trend: { p: string; r: string; e: string; p2: string };
    stand: { p: string; r: string; e: string; p2: string };
    different: { p: string; r: string; e: string; p2: string };
}

export interface FeedbackData {
    dream: string;
    difficulty: string;
    trend: string;
    stand: string;
    different: string;
}

export interface QuestionData {
    q: string;
    guide: string;
}

export interface InterviewStore {
    mode: InterviewMode;
    messages: Message[];
    step: number;
    answers: Record<string, string>;
    currentQuestions: Record<string, QuestionData>;
    isAnalyzing: boolean;
    analysisResult: {
        matrix: AnalysisData;
        feedback: FeedbackData;
        scores: {
            dream: number;
            difficulty: number;
            trend: number;
            stand: number;
            different: number;
        };
        overallFeedback: string; // Added
    } | null;

    setMode: (mode: InterviewMode) => void;
    startInterview: (mode: 'SCHOOL' | 'TRANSFER') => void;
    setStep: (step: number) => void;
    setAnswer: (key: string, value: string) => void;
    addMessage: (message: Message) => void;
    setAnalyzing: (isAnalyzing: boolean) => void;
    setAnalysisResult: (result: InterviewStore['analysisResult']) => void;
    reset: () => void;
}

export const useInterviewStore = create<InterviewStore>()(
    persist(
        (set) => ({
            mode: null,
            step: 0,
            answers: {},
            currentQuestions: {},
            messages: [],
            isAnalyzing: false,
            analysisResult: null,

            setMode: (mode) => set({ mode }),

            startInterview: (mode) => {
                const pool = QUESTION_POOL[mode];
                // Randomly select one question for each category
                const selectedQuestions = {
                    dream: pool.dream[Math.floor(Math.random() * pool.dream.length)]!,
                    difficulty: pool.difficulty[Math.floor(Math.random() * pool.difficulty.length)]!,
                    trend: pool.trend[Math.floor(Math.random() * pool.trend.length)]!,
                    stand: pool.stand[Math.floor(Math.random() * pool.stand.length)]!,
                    different: pool.different[Math.floor(Math.random() * pool.different.length)]!,
                };

                set({
                    mode,
                    step: 0,
                    answers: {},
                    currentQuestions: selectedQuestions,
                    isAnalyzing: false,
                    analysisResult: null,
                    messages: []
                });
            },

            setStep: (step) => set({ step }),
            setAnswer: (key, value) => set((state) => ({ answers: { ...state.answers, [key]: value } })),
            addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
            setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
            setAnalysisResult: (result) => set({ analysisResult: result }),
            reset: () => set({ mode: null, step: 0, answers: {}, currentQuestions: {}, messages: [], isAnalyzing: false, analysisResult: null }),
        }),
        {
            name: 'prep-interview-storage',
        }
    )
);
