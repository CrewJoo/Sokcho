"use client";

import { useEffect } from "react";

import { useInterviewStore } from "@/lib/interview-store";
import { ModeSelection } from "@/components/prep/mode-selection";
import { InterviewWizard } from "@/components/interview/interview-wizard";
import { AnalysisResult } from "@/components/interview/analysis-result";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function PrepInterviewPage() {
    const { mode, setMode, startInterview, isAnalyzing, analysisResult, reset } = useInterviewStore();

    // Reset loop check: If analyzing but no object, reset to avoid stuck state
    // Reset state when the component unmounts (navigating away)
    useEffect(() => {
        return () => {
            useInterviewStore.getState().reset();
        };
    }, []);

    // Actually, looking at MainNav, it calls `useInterviewStore.getState().reset()`.
    // If that works, state should be clear. 
    // Maybe the Next.js Link behavior with onClick is tricky?
    // Let's force a reset effect if mode is selected but we want a fresh start? No, that kills persistence during use.

    // Better fix: Ensure `AnalysisResult` handles the "stuck" state.
    // If `isAnalyzing` is true, it renders AnalysisResult (or the loading view).
    // If `AnalysisResult` mounts and sees no `object` (from useObject) and no `analysisResult` (stored), 
    // it tries to submit. If submission fails or was already done but state is stale, it might spin forever.

    // Let's add a timeout or error state in AnalysisResult.

    if (!mode) {
        return (
            <div className="min-h-screen bg-slate-50 relative pb-20 p-6">

                <div className="max-w-6xl mx-auto px-6 pt-40">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight flex items-center justify-center gap-4">
                                <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                                    <MessageCircle className="w-10 h-10 text-white" />
                                </div>
                                <span><span className="text-purple-600">5D-say</span> 모의면접</span>
                            </h1>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-slate-600 mt-8 md:mt-10 max-w-4xl mx-auto break-keep leading-relaxed"
                            >
                                "<span className="text-purple-600 font-bold">스토리 발굴 및 코칭</span>(Discovery)"<br />
                                <br />5D 주제(<span className="text-purple-600 font-bold">Dream, trenD, Difficulty, branD, Different</span>)에 대해 <br />AI 사정관과 핑퐁 대화를 하며, <br />미처 생각하지 못한 자신만의 강점 스토리를 끄집어내는 <br /><span className="text-purple-600 font-bold">대화형 스토리 발굴(Discovery) 코칭</span>입니다.<br className="hidden sm:block" />

                            </motion.p>
                        </motion.div>
                    </div>

                    <div className="text-center mb-8">
                        <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-600 text-sm font-bold mb-2 border border-slate-200">
                            MODE SELECT
                        </span>
                        <h2 className="text-2xl font-bold text-slate-700">
                            어떤 면접/상황을 준비하시나요?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* School Mode (Advancement) */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => startInterview('SCHOOL')}
                            className="flex flex-col items-center p-12 bg-white rounded-3xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-trust-navy transition-all group"
                        >
                            <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-trust-navy transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 group-hover:text-white transition-colors">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">수시 면접</h3>
                            <p className="text-slate-500 text-center leading-relaxed">
                                AI 사정관과의 1:1 심층 면접<br />
                                전공 적합성과 잠재력을 어필하세요
                            </p>
                        </motion.button>

                        {/* Transfer Mode (Old Job) */}
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => startInterview('TRANSFER')}
                            className="flex flex-col items-center p-12 bg-white rounded-3xl shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-trust-navy transition-all group"
                        >
                            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-trust-navy transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 group-hover:text-white transition-colors">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">생기부 기반 면접</h3>
                            <p className="text-slate-500 text-center leading-relaxed">
                                학업 전문성과 진로 비전을<br />
                                논리적으로 어필하세요
                            </p>
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20 p-6">

            <div className="max-w-6xl mx-auto px-6 pt-40">
                {/* Header Area */}
                <div className="text-center mb-12 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight flex items-center justify-center gap-4"
                    >
                        <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-10 h-10 text-white" />
                        </div>
                        <span><span className="text-purple-600">5D-say</span> 모의면접</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-3xl mx-auto break-keep leading-relaxed"
                    >
                        {isAnalyzing || analysisResult
                            ? "대화 내용을 바탕으로 답변 역량을 분석했습니다."
                            : "편안하게 대화하며 당신만의 강점을 어필해주세요."}
                    </motion.p>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {isAnalyzing || analysisResult ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AnalysisResult />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <InterviewWizard />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
