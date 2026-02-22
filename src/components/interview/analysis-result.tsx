"use client";

import { useEffect, useState, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useInterviewStore, AnalysisData, FeedbackData } from "@/lib/interview-store";
import { useHistoryStore } from "@/lib/history-store";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useInvestmentGameStore } from "@/store/use-investment-game-store";

// Re-define schema for client-side type inference if needed, strictly matching server
const analysisSchema = z.object({
    matrix: z.object({
        dream: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }),
        difficulty: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }),
        trend: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }),
        stand: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }),
        different: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }),
    }),
    feedback: z.object({
        dream: z.string(),
        difficulty: z.string(),
        trend: z.string(),
        stand: z.string(),
        different: z.string(),
    }),
    scores: z.object({
        dream: z.number(),
        difficulty: z.number(),
        trend: z.number(),
        stand: z.number(),
        different: z.number(),
    }),
    overallFeedback: z.string(),
});

export function AnalysisResult() {
    const { answers, mode, setAnalysisResult, analysisResult, isAnalyzing, setAnalyzing, reset } = useInterviewStore();
    const addRecord = useHistoryStore((s) => s.addRecord);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const savedRef = useRef(false);
    const router = useRouter();

    const { object, submit, isLoading, error } = useObject({
        api: "/api/interview/analyze",
        schema: analysisSchema,
    });

    useEffect(() => {
        // Trigger analysis on mount
        if (!object && !analysisResult) {
            submit({ answers, mode });
        }
    }, []);

    useEffect(() => {
        if (object) {
            // Update store with partial/final results
            // @ts-ignore - Schema matches but strict typing might complain on partials
            setAnalysisResult(object);
        }
        if (!isLoading && object) {
            setAnalyzing(false);

            // Auto-save to history when analysis is complete
            if (!savedRef.current) {
                savedRef.current = true;
                const avgScore = object.scores
                    ? Math.round(
                        ((object.scores.dream || 0) +
                            (object.scores.difficulty || 0) +
                            (object.scores.trend || 0) +
                            (object.scores.stand || 0) +
                            (object.scores.different || 0)) / 5 * 10
                    )
                    : undefined;

                addRecord({
                    type: 'prep-interview',
                    createdAt: new Date().toISOString(),
                    question: `5D 면접 분석 (${mode === 'SCHOOL' ? '신입' : '경력'})`,
                    data: { answers, scores: object.scores },
                    feedback: object.overallFeedback || undefined,
                    score: avgScore,
                });
                setShowSavedToast(true);
                setTimeout(() => setShowSavedToast(false), 3000);
            }
        }
    }, [object, isLoading, setAnalysisResult, setAnalyzing]);

    // Data for Radar Chart
    // Use object (streaming) or analysisResult (stored)
    const data = object || analysisResult;

    // Data for Radar Chart
    const chartData = data?.scores ? [
        { subject: 'DREAM', A: data.scores.dream || 0, fullMark: 10 },
        { subject: 'DIFFICULTY', A: data.scores.difficulty || 0, fullMark: 10 },
        { subject: 'TREND', A: data.scores.trend || 0, fullMark: 10 },
        { subject: 'STAND', A: data.scores.stand || 0, fullMark: 10 },
        { subject: 'DIFFERENT', A: data.scores.different || 0, fullMark: 10 },
    ] : [];

    if (isLoading || (!object && !analysisResult)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-6">
                <Loader2 className="w-16 h-16 text-trust-navy animate-spin" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">입학사정관이 기록을 분석하고 있습니다...</h2>
                    <p className="text-gray-500 mt-2">5D 역량 지표를 계산하고, PREP 보고서를 작성 중입니다.</p>
                </div>
                {/* Safety Reset Button after delay or if stuck */}
                <button
                    onClick={() => {
                        setAnalyzing(false);
                        setAnalysisResult(null);
                    }}
                    className="mt-8 text-sm text-slate-400 underline hover:text-slate-600"
                >
                    분석이 너무 오래 걸리나요? (초기화)
                </button>
            </div>
        );
    }

    const handleCopy = () => {
        const text = `
[PREP 인터뷰 - 5D 역량 분석 결과]

[종합 평가]
${data?.overallFeedback || "분석 없음"}

1. DREAM (Lv.${data?.scores?.dream || 0})
: ${data?.matrix?.dream?.p2 || ""}

2. DIFFICULTY (Lv.${data?.scores?.difficulty || 0})
: ${data?.matrix?.difficulty?.p2 || ""}

3. TREND (Lv.${data?.scores?.trend || 0})
: ${data?.matrix?.trend?.p2 || ""}

4. STAND (Lv.${data?.scores?.stand || 0})
: ${data?.matrix?.stand?.p2 || ""}

5. DIFFERENT (Lv.${data?.scores?.different || 0})
: ${data?.matrix?.different?.p2 || ""}
        `.trim();

        navigator.clipboard.writeText(text);
        alert("분석 결과가 복사되었습니다.");
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            {/* Saved Toast */}
            {showSavedToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-success-green text-white px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    면접 기록이 저장되었습니다!
                </div>
            )}
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                    onClick={() => {
                        if (!data?.matrix) return;
                        const combined = [
                            data.matrix.dream?.p2,
                            data.matrix.difficulty?.p2,
                            data.matrix.trend?.p2,
                            data.matrix.stand?.p2,
                            data.matrix.different?.p2
                        ].filter(Boolean).join('\n\n');

                        // Set the script in the store
                        useInvestmentGameStore.getState().setScript(combined);
                        useInvestmentGameStore.getState().setSelectedQuestion("직접 입력");

                        // Navigate to danbi-interview
                        router.push('/danbi-interview');
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                >
                    AI 최종분석으로 가기 <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex justify-end gap-2 mt-2 sm:mt-0">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-trust-navy transition-colors shadow-sm"
                    >
                        📋 텍스트 복사
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-trust-navy border border-transparent rounded-lg text-sm font-bold text-white hover:bg-trust-navy/90 shadow-sm"
                    >
                        🖨️ 리포트 저장
                    </button>
                </div>
            </div>

            {/* 1. Header & Radar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="space-y-6">
                    <span className="bg-trust-navy text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">Analysis Report</span>
                    <h2 className="text-4xl font-black text-gray-900 leading-tight">
                        당신의 <span className="text-trust-navy">5D 잠재력</span><br />
                        분석 결과입니다.
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        AI 사정관과의 대화를 통해 추출한 5가지 핵심 역량의 균형도입니다.
                        부족한 부분은 PREP 구조화를 통해 보완되었습니다.
                    </p>
                </div>
                <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                            <Radar
                                name="My 5D"
                                dataKey="A"
                                stroke="#0F213C"
                                strokeWidth={3}
                                fill="#0F213C"
                                fillOpacity={0.3}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* New: Overall Feedback Section */}
            <div className="bg-white text-slate-800 p-8 rounded-3xl shadow-xl border border-slate-200">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-yellow-400" />
                    입학사정관의 냉정한 평가
                </h3>
                <p className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {data?.overallFeedback || "종합 평가를 생성하는 중입니다..."}
                </p>
            </div>

            {/* 2. 5D Detail Cards */}
            <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-trust-navy pl-4">5D Detail Analysis & PREP</h3>

                {chartData.map((item, idx) => {
                    const key = item.subject.toLowerCase() as keyof AnalysisData;
                    // Safely access properties with optional chaining and defaults
                    const prepData = data?.matrix?.[key] || { p: "분석 중...", r: "...", e: "...", p2: "..." };
                    const feedback = data?.feedback?.[key] || "분석 대기 중...";

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            key={item.subject}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                        >
                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                                <h4 className="text-xl font-bold text-trust-navy">{item.subject}</h4>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.A >= 8 ? 'bg-green-100 text-green-700' : item.A >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    Lv.{item.A}
                                </span>
                            </div>
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* PREP Structure */}
                                <div className="lg:col-span-2 space-y-4">
                                    <h5 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-2">Refined PREP Script</h5>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">P</span>
                                            <p className="text-gray-800">{prepData.p}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs shrink-0">R</span>
                                            <p className="text-gray-700">{prepData.r}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs shrink-0">E</span>
                                            <p className="text-gray-700 italic border-l-2 border-gray-200 pl-3">{prepData.e}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">P</span>
                                            <p className="text-gray-800 font-medium">{prepData.p2}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* HR Feedback */}
                                <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                                    <h5 className="font-bold text-amber-700 flex items-center gap-2 mb-3">
                                        <Sparkles className="w-4 h-4" /> HR Insight
                                    </h5>
                                    <p className="text-amber-900 text-sm leading-relaxed">
                                        {feedback}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
