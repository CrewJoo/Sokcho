"use client";

import { useState, useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { usePrepStore } from "@/lib/store";
import { useHistoryStore } from "@/lib/history-store";
import { Button } from "@/components/ui/button";
import { Volume2, Lock, AlertCircle, PlayCircle, GraduationCap, Sparkles, CheckCircle2, RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";

const CoachingModal = dynamic(() => import("@/components/common/coaching-modal").then(mod => mod.CoachingModal), { ssr: false });

// Schema for type inference
const feedbackSchema = z.object({
    feedback: z.string(),
    script: z.string(),
    coaching: z.string(),
    improved_prep: z.object({
        point1: z.string(),
        reason: z.string(),
        example: z.string(),
        point2: z.string(),
    }).optional(),
});

export function FeedbackView() {
    const { data, question, reset } = usePrepStore();
    const addRecord = useHistoryStore((s) => s.addRecord);
    const [showCoaching, setShowCoaching] = useState(false);
    const [showImproved, setShowImproved] = useState(false);
    const [showScript, setShowScript] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const savedRef = useRef(false);

    const { object, submit, isLoading, error } = useObject({
        api: "/api/generate",
        schema: feedbackSchema,
    });

    // Auto-save to history when feedback is complete
    useEffect(() => {
        if (object && !isLoading && !savedRef.current) {
            savedRef.current = true;
            addRecord({
                type: 'prep-training',
                createdAt: new Date().toISOString(),
                question: question?.q || 'PREP 트레이닝',
                data: { ...data },
                feedback: object.feedback || undefined,
            });
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 3000);
        }
    }, [object, isLoading]);

    const handleAnalyze = () => {
        submit(data as any);
    };

    const handleSpeak = () => {
        if (!object?.improved_prep) return;
        const text = `${object.improved_prep.point1} ${object.improved_prep.reason} ${object.improved_prep.example} ${object.improved_prep.point2}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ko-KR";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };


    return (
        <div className="flex flex-col gap-8 text-left">
            {/* Saved Toast */}
            {showSavedToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-success-green text-white px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    연습 기록이 저장되었습니다!
                </div>
            )}
            {/* User Input Summary */}
            <div className="rounded-2xl bg-gray-50 p-6 border border-gray-200">
                <h3 className="mb-4 text-xl font-bold text-trust-navy">내가 작성한 초안</h3>
                <div className="space-y-2 text-lg">
                    <p className="text-gray-700"><span className="font-bold text-trust-navy">P:</span> {data.point1}</p>
                    <p className="text-gray-700"><span className="font-bold text-trust-navy">R:</span> {data.reason}</p>
                    <p className="text-gray-700"><span className="font-bold text-trust-navy">E:</span> {data.example}</p>
                    <p className="text-gray-700"><span className="font-bold text-trust-navy">P:</span> {data.point2}</p>
                </div>
            </div>

            {/* Action Button & Status */}
            {!object && !isLoading && !error && (
                <div className="flex justify-center py-8">
                    <Button
                        onClick={handleAnalyze}
                        className="h-16 px-8 text-xl font-bold bg-trust-navy hover:bg-trust-navy/90 rounded-full shadow-xl hover:scale-105 transition-transform"
                    >
                        <PlayCircle className="mr-2 h-6 w-6" />
                        AI 사정관의 피드백 받기
                    </Button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-xl bg-red-50 p-6 ring-1 ring-red-200 text-red-600 flex items-center gap-3">
                    <AlertCircle className="h-6 w-6" />
                    <p className="text-lg">오류가 발생했습니다. 다시 시도해주세요.</p>
                </div>
            )}

            {/* Analysis Result */}
            {(object || isLoading) && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-2xl text-trust-navy">AI 사정관의 피드백 & 스크립트</h3>
                            {isLoading && <span className="animate-pulse text-lg text-success-green font-medium">분석 중...</span>}
                        </div>
                        <Button variant="ghost" onClick={handleSpeak} disabled={isLoading || !object?.script}>
                            <Volume2 className="mr-2 h-5 w-5" />
                            TTS 듣기
                        </Button>
                    </div>

                    <div className="min-h-[200px] rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
                        {!object ? (
                            <div className="flex h-full items-center justify-center text-gray-400 py-12">
                                <span className="animate-pulse">AI 사정관이 당신의 답변을 분석하고 있습니다...</span>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-bold text-lg text-red-500 mb-2">💡 독설 피드백</h4>
                                    <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">{object.feedback}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coaching Section */}
                    {object && (
                        <div className="space-y-4">
                            <Button
                                variant={showCoaching ? "secondary" : "outline"}
                                size="lg"
                                onClick={() => setShowCoaching(!showCoaching)}
                                className={`w-full justify-between h-14 text-lg border transition-all ${showCoaching ? 'bg-trust-navy border-trust-navy text-white hover:bg-trust-navy/90' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="flex items-center font-bold">
                                    <GraduationCap className={`mr-2 h-5 w-5 ${showCoaching ? 'text-blue-200' : 'text-gray-500'}`} />
                                    PREP 코칭
                                </span>
                                <span className={`text-sm ${showCoaching ? 'text-blue-200' : 'text-gray-400'}`}>{showCoaching ? '접기' : '펼치기'}</span>
                            </Button>

                            {showCoaching && object?.coaching && (
                                <div className="rounded-2xl bg-blue-50 p-6 border border-blue-100 animate-in fade-in zoom-in-95 duration-300">
                                    <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap bg-white p-6 rounded-xl shadow-sm">
                                        {object.coaching}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Improved PREP Section */}
                    {object && (
                        <div className="space-y-4">
                            <Button
                                variant={showImproved ? "secondary" : "outline"}
                                size="lg"
                                onClick={() => setShowImproved(!showImproved)}
                                className={`w-full justify-between h-14 text-lg border transition-all ${showImproved ? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="flex items-center font-bold">
                                    <Sparkles className={`mr-2 h-5 w-5 ${showImproved ? 'text-indigo-200' : 'text-gray-500'}`} />
                                    PREP 업그레이드
                                </span>
                                <span className={`text-sm ${showImproved ? 'text-indigo-200' : 'text-gray-400'}`}>{showImproved ? '접기' : '펼치기'}</span>
                            </Button>

                            {showImproved && object?.improved_prep && (
                                <div className="rounded-2xl bg-indigo-50 p-6 border border-indigo-100 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="space-y-4">
                                        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                            <span className="block font-bold text-indigo-600 mb-1">Point (결론)</span>
                                            <p className="text-gray-900 text-lg">{object.improved_prep.point1}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                            <span className="block font-bold text-gray-500 mb-1">Reason (이유)</span>
                                            <p className="text-gray-900 text-lg">{object.improved_prep.reason}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                            <span className="block font-bold text-gray-500 mb-1">Example (사례)</span>
                                            <p className="text-gray-900 text-lg">{object.improved_prep.example}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                                            <span className="block font-bold text-indigo-600 mb-1">Point (재강조)</span>
                                            <p className="text-gray-900 text-lg">{object.improved_prep.point2}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Final Success Script */}
                    {object && (
                        <div className="space-y-4">
                            <Button
                                variant={showScript ? "secondary" : "outline"}
                                size="lg"
                                onClick={() => setShowScript(!showScript)}
                                className={`w-full justify-between h-14 text-lg border transition-all ${showScript ? 'bg-success-green border-success-green text-white hover:bg-green-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                            >
                                <span className="flex items-center font-bold">
                                    <Volume2 className={`mr-2 h-5 w-5 ${showScript ? 'text-green-100' : 'text-gray-500'}`} />
                                    합격 스크립트
                                </span>
                                <span className={`text-sm ${showScript ? 'text-green-100' : 'text-gray-400'}`}>{showScript ? '접기' : '펼치기'}</span>
                            </Button>

                            {showScript && object?.improved_prep && (
                                <div className="rounded-xl bg-gradient-to-br from-success-green/10 to-emerald-50 p-8 border border-success-green/20 animate-in fade-in zoom-in-95 duration-500">
                                    <p className="text-gray-900 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                        {object.improved_prep.point1} {object.improved_prep.reason} {object.improved_prep.example} {object.improved_prep.point2}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}

            {/* Bottom Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between pt-4 border-t mt-4">
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" size="lg" onClick={() => window.print()} className="text-lg">
                        PDF 저장
                    </Button>
                    <Button
                        size="lg"
                        className="bg-gray-900 text-white hover:bg-gray-800 shadow-lg text-lg"
                        onClick={() => setShowModal(true)}
                    >
                        <Lock className="mr-2 h-5 w-5" />
                        1:1 코칭 요청
                    </Button>
                </div>

                <Button
                    size="lg"
                    className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg text-lg"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        reset();
                    }}
                >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    새로운 주제 연습하기
                </Button>
            </div>

            <CoachingModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
