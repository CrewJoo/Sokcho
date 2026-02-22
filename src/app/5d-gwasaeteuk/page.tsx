"use client";

import { useState, useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, AlertCircle, CheckCircle2, ArrowRightLeft, ChevronDown, ChevronUp, FileSignature, Copy, Check } from "lucide-react";
import { useHistoryStore } from "@/lib/history-store";
import { motion, AnimatePresence } from "framer-motion";
import { WizardLayout } from "@/components/wizard/wizard-layout";

// Define the schema to match the API
const gwasaeteukSchema = z.object({
    point1: z.string(),
    reason: z.string(),
    example: z.string(),
    point2: z.string(),
    advice: z.string(),
    evaluation: z.object({
        is_relevant: z.boolean(),
        is_structured: z.boolean(),
        is_sufficient: z.boolean(),
    }).optional(),
    point1_v2: z.string().optional(),
    reason_v2: z.string().optional(),
    example_v2: z.string().optional(),
    point2_v2: z.string().optional(),
    teacher_record: z.string().optional(),
});

export default function GwasaeteukPage() {
    const addRecord = useHistoryStore((s) => s.addRecord);
    const [input, setInput] = useState("");
    const [showSavedToast, setShowSavedToast] = useState(false);
    const [showCoaching, setShowCoaching] = useState(false);
    const [showV2, setShowV2] = useState(false);
    const [showRecord, setShowRecord] = useState(false);
    const [copiedV2, setCopiedV2] = useState(false);
    const [copiedRecord, setCopiedRecord] = useState(false);
    const savedRef = useRef(false);

    const { object, submit, isLoading, error } = useObject({
        api: "/api/gwasaeteuk-transform",
        schema: gwasaeteukSchema,
    });

    const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        submit({ input } as any);
    };

    // 'object' contains the partial object as it streams in
    const parsedData = object;

    // Auto-save to history when transform is complete
    useEffect(() => {
        if (parsedData && !isLoading && !savedRef.current && parsedData.point1) {
            savedRef.current = true;
            addRecord({
                type: 'prep-transform', // keeping type as transform for history consistency, or rename if needed
                createdAt: new Date().toISOString(),
                question: '과세특 5D 변환',
                data: {
                    input,
                    point1: parsedData.point1 || '',
                    reason: parsedData.reason || '',
                    example: parsedData.example || '',
                    point2: parsedData.point2 || '',
                },
                feedback: parsedData.advice || undefined,
            });
            setShowSavedToast(true);
            setTimeout(() => setShowSavedToast(false), 3000);
        }
    }, [parsedData, isLoading, addRecord, input]);

    // Reset saved flag and toggles when input changes (new submission)
    useEffect(() => {
        savedRef.current = false;
        setShowCoaching(false);
        setShowV2(false);
        setShowRecord(false);
        setCopiedV2(false);
        setCopiedRecord(false);
    }, [input]);

    const titleDescription = (
        <>
            정제되지 않은 <span className="text-violet-600 font-bold">과세특 문안</span>이나 학생의 <span className="text-violet-600 font-bold">활동 메모</span>를 입력받아, <br className="hidden sm:block" />
            입학사정관이 주목하는 <span className="text-violet-600 font-bold">5D 관점</span>을 반영하여 <br />
            설득력 높은 <span className="text-violet-600 font-bold">PREP 구조</span>로 빈틈없이 리팩토링해 드립니다.<br />
        </>
    );

    return (
        <WizardLayout
            title=""
            description=""
            pageTitle={
                <span className="flex items-center justify-center gap-4">
                    <span className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                        <ArrowRightLeft className="w-10 h-10 text-white" />
                    </span>
                    <span><span className="text-violet-600">5D-say</span> 과세특</span>
                </span>
            }
            pageDescription={titleDescription}
            theme="purple"
        >
            {/* Saved Toast */}
            {showSavedToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-success-green text-white px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    과세특 변환 기록이 저장되었습니다!
                </div>
            )}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="rounded-2xl bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">초안 입력 (과세특 메모)</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`💡 선생님께 제출할 과세특 초안이나, 본인의 활동 메모를 자유롭게 입력하세요.\n\n[작성 예시]\n생명과학 시간에 유전자 가위에 대해 발표했음. 자료 조사할 때 대학 논문도 찾아보고, 윤리적 문제점도 같이 다뤘음. 친구들이 내용이 좋다고 칭찬해줬고 나중에 이 분야 연구원이 되고 싶다는 생각이 들었음.`}
                                className="min-h-[400px] text-lg resize-none p-6 leading-relaxed bg-white text-gray-900 border-gray-300 focus:ring-violet-500"
                            />

                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-full bg-trust-navy py-8 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-transform active:scale-95 text-white"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <Sparkles className="animate-spin h-6 w-6" /> 5D 관점 구조화 중...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <Sparkles className="h-6 w-6" /> PREP 과세특으로 변환
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* 1차: 학생 관점 PREP 정리 (Moved under input) */}
                    {parsedData && (
                        <div className="rounded-2xl bg-white p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="mb-6 text-xl font-bold text-violet-600 flex items-center gap-2">
                                <span className="bg-violet-100 text-violet-700 min-w-8 h-8 px-2 rounded-full flex items-center justify-center text-sm">1차</span>
                                학생 관점 PREP 구조화
                            </h3>
                            <div className="space-y-4">
                                <div className="rounded-xl bg-red-50 p-5 shadow-sm border border-red-100">
                                    <span className="font-bold text-red-600 text-lg block mb-2">Point (입학사정관을 사로잡는 결론)</span>
                                    <p className="text-xl text-gray-900 leading-relaxed">{parsedData.point1}</p>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-5 shadow-sm border border-blue-100">
                                    <span className="font-bold text-blue-600 text-lg block mb-2">Reason (전공 적합성 및 근거)</span>
                                    <p className="text-xl text-gray-900 leading-relaxed">{parsedData.reason}</p>
                                </div>
                                <div className="rounded-xl bg-emerald-50 p-5 shadow-sm border border-emerald-100">
                                    <span className="font-bold text-emerald-600 text-lg block mb-2">Example (구체적 탐구 사례 및 극복 과정)</span>
                                    <p className="text-xl text-gray-900 leading-relaxed">{parsedData.example}</p>
                                </div>
                                <div className="rounded-xl bg-orange-50 p-5 shadow-sm border border-orange-100">
                                    <span className="font-bold text-orange-500 text-lg block mb-2">Point (성장된 역량 요약)</span>
                                    <p className="text-xl text-gray-900 leading-relaxed">{parsedData.point2}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                    <div className="h-full min-h-[600px] rounded-2xl bg-white p-8 shadow-xl flex flex-col">

                        {error && (
                            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-6 text-red-600 text-lg">
                                <AlertCircle className="h-6 w-6" />
                                <p>오류가 발생했습니다. 다시 시도해주세요.</p>
                            </div>
                        )}

                        {!parsedData && !isLoading && !error && (
                            <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-xl text-gray-400 text-center px-4 break-keep">
                                왼쪽에서 과세특 초안을 입력하고 변환 버튼을 눌러보세요.
                            </div>
                        )}

                        {isLoading && !parsedData && (
                            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-violet-600 animate-pulse">
                                <Sparkles className="h-12 w-12" />
                                <p className="text-xl font-medium">5D 역량을 추출하여 구조를 잡고 있습니다...</p>
                            </div>
                        )}

                        {parsedData && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 overflow-y-auto">

                                {/* 입학사정관 코칭 */}
                                <div className="mb-8 border-b border-slate-100 pb-8">
                                    <button
                                        onClick={() => setShowCoaching(!showCoaching)}
                                        className="w-full flex items-center justify-between mb-4 text-xl font-bold text-orange-600 hover:text-orange-700 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5" /> 입학사정관 관점 코칭
                                        </div>
                                        <div className="bg-orange-50 rounded-full p-1 group-hover:bg-orange-100 transition-colors">
                                            {showCoaching ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {showCoaching && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-gray-700 text-lg leading-relaxed bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm mt-2">
                                                    {parsedData.advice}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 2차: 학생 관점 PREP 정리 (코칭 반영) */}
                                {parsedData.point1_v2 && (
                                    <div className="mb-8 border-b border-slate-100 pb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <button
                                                onClick={() => setShowV2(!showV2)}
                                                className="flex-1 flex items-center justify-between text-xl font-bold text-violet-600 hover:text-violet-700 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2 text-left">
                                                    <span className="bg-violet-100 text-violet-700 min-w-8 h-8 px-2 rounded-full flex items-center justify-center text-sm">2차</span>
                                                    학생 관점 PREP 구조화
                                                </div>
                                                <div className="bg-violet-50 rounded-full p-1 group-hover:bg-violet-100 transition-colors mr-2">
                                                    {showV2 ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                                </div>
                                            </button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="shrink-0 text-violet-600 border-violet-200 hover:bg-violet-50 h-9"
                                                onClick={() => {
                                                    const textToCopy = `[Point] ${parsedData.point1_v2}\n\n[Reason] ${parsedData.reason_v2}\n\n[Example] ${parsedData.example_v2}\n\n[Point] ${parsedData.point2_v2}`;
                                                    copyToClipboard(textToCopy, setCopiedV2);
                                                }}
                                            >
                                                {copiedV2 ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                                                {copiedV2 ? "복사됨" : "복사"}
                                            </Button>
                                        </div>

                                        <AnimatePresence>
                                            {showV2 && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="space-y-4 mt-2">
                                                        <div className="rounded-xl bg-red-50 p-5 shadow-sm border border-red-100">
                                                            <span className="font-bold text-red-600 text-lg block mb-2">Point (입학사정관을 사로잡는 결론)</span>
                                                            <p className="text-xl text-gray-900 leading-relaxed">{parsedData.point1_v2}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-blue-50 p-5 shadow-sm border border-blue-100">
                                                            <span className="font-bold text-blue-600 text-lg block mb-2">Reason (전공 적합성 및 근거)</span>
                                                            <p className="text-xl text-gray-900 leading-relaxed">{parsedData.reason_v2}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-emerald-50 p-5 shadow-sm border border-emerald-100">
                                                            <span className="font-bold text-emerald-600 text-lg block mb-2">Example (구체적 탐구 사례 및 극복 과정)</span>
                                                            <p className="text-xl text-gray-900 leading-relaxed">{parsedData.example_v2}</p>
                                                        </div>
                                                        <div className="rounded-xl bg-orange-50 p-5 shadow-sm border border-orange-100">
                                                            <span className="font-bold text-orange-500 text-lg block mb-2">Point (성장된 역량 요약)</span>
                                                            <p className="text-xl text-gray-900 leading-relaxed">{parsedData.point2_v2}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* 3차: 선생님 관점 과세특 기록 */}
                                {parsedData.teacher_record && (
                                    <div className="pb-4">
                                        <div className="flex items-center justify-between mb-6">
                                            <button
                                                onClick={() => setShowRecord(!showRecord)}
                                                className="flex-1 flex items-center justify-between text-xl font-bold text-trust-navy hover:text-indigo-800 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2 text-left">
                                                    <div className="bg-blue-100 text-blue-700 min-w-8 h-8 px-2 rounded-full flex items-center justify-center shrink-0">
                                                        <FileSignature className="h-4 w-4" />
                                                    </div>
                                                    선생님 관점 과세특 기록
                                                </div>
                                                <div className="bg-blue-50 rounded-full p-1 group-hover:bg-blue-100 transition-colors shrink-0 mr-2">
                                                    {showRecord ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                                </div>
                                            </button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="shrink-0 text-trust-navy border-blue-200 hover:bg-blue-50 h-9"
                                                onClick={() => copyToClipboard(parsedData.teacher_record || '', setCopiedRecord)}
                                            >
                                                {copiedRecord ? <Check className="h-4 w-4 mr-1 text-green-600" /> : <Copy className="h-4 w-4 mr-1" />}
                                                {copiedRecord ? "복사됨" : "복사"}
                                            </Button>
                                        </div>

                                        <AnimatePresence>
                                            {showRecord && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="rounded-xl bg-blue-50/50 p-6 shadow-sm border border-blue-100 relative mt-2">
                                                        <div className="absolute top-0 left-0 w-1 h-full bg-trust-navy rounded-l-xl"></div>
                                                        <p className="text-xl text-gray-900 leading-relaxed font-medium pl-2">
                                                            {parsedData.teacher_record}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WizardLayout>
    );
}
