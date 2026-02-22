"use client";

import { useState, useEffect, useRef } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useHistoryStore } from "@/lib/history-store";
// import { HomeButton } from "@/components/common/home-button";
import { QUESTIONS_INTERVIEW, QUESTIONS_STUDENT, PrepQuestion } from "@/lib/constants";
import { ModeSelection } from "@/components/prep/mode-selection";
import { usePrepStore } from "@/lib/store";
import { motion } from "framer-motion";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { ArrowRightLeft, Leaf, Sprout, TreeDeciduous, TreePine, Mountain, RotateCcw } from "lucide-react";
import { GrowthLevel } from "@/lib/history-store";
import { SkillDashboard } from "@/components/prep/skill-dashboard";

// Define the schema to match the API (for type inference if needed, though useObject handles partials)
const prepSchema = z.object({
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
});

export default function TransformPage() {
    const { mode, setMode, reset } = usePrepStore();
    const store = useHistoryStore();
    const addRecord = store.addRecord;
    const [input, setInput] = useState("");
    const [question, setQuestion] = useState<PrepQuestion | null>(null);
    const [showSavedToast, setShowSavedToast] = useState(false);
    const savedRef = useRef(false);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (mode) {
            const list = mode === 'WORK' ? QUESTIONS_STUDENT : QUESTIONS_INTERVIEW;
            setQuestion(list[Math.floor(Math.random() * list.length)] ?? null);
        }
    }, [mode]);

    const { object, submit, isLoading, error } = useObject({
        api: "/api/transform",
        schema: prepSchema,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        submit({ input, question: question?.q } as any);
    };

    // 'object' contains the partial object as it streams in
    const parsedData = object;

    // Auto-save to history when transform is complete
    useEffect(() => {
        if (parsedData && !isLoading && !savedRef.current) {
            savedRef.current = true;
            addRecord({
                type: 'prep-transform',
                createdAt: new Date().toISOString(),
                question: question?.q || 'PREP 변환',
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
    }, [parsedData, isLoading]);

    // Reset saved flag when input changes (new submission)
    useEffect(() => {
        savedRef.current = false;
    }, [input]);

    if (!mode) {
        return (
            <div className="min-h-screen bg-slate-50 relative pb-20 p-6">
                {/* <HomeButton /> */}

                <div className="max-w-6xl mx-auto px-6 pt-52">
                    {/* Header */}
                    <div className="text-center mb-24 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm flex items-center justify-center gap-4"
                        >
                            <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                                <ArrowRightLeft className="w-10 h-10 text-white" />
                            </div>
                            <span><span className="text-emerald-600">PREP</span> 변환기</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600 mt-8 md:mt-10 max-w-3xl mx-auto break-keep leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-xl"
                        >
                            <span className="text-emerald-600 font-bold">PREP 변환기</span>는 <br />당신의 파편화된 생각을 <br />논리적인 <span className="text-emerald-600 font-bold">PREP 구조</span>로 자동 재조립해줍니다.<br className="hidden sm:block" />
                            <br />복잡한 설명이나 장황한 아이디어를 입력하면, <br />AI가 핵심(Point)을 추출하고 <br />근거(Reason)와 사례(Example)를 보강하여 <br />설득력 있는 답변으로 완성합니다.
                        </motion.p>
                    </div>

                    {(() => {
                        const transformInfo = store.getPracticeTierInfo('prep-transform');
                        const IconComp = TreePine;

                        return (
                            <SkillDashboard
                                title="PREP 변환기"
                                subtitle="장황한 내 생각을 깔끔한 PREP 구조로 정리해 보세요!"
                                tierName={<span><span className="text-amber-600">PREP 변환기</span> 레벨</span>}
                                tierIndex={transformInfo.tierIndex}
                                tierIconNode={<IconComp className="w-8 h-8 text-amber-500" />}
                                currentScore={transformInfo.count}
                                scoreLabel="회"
                                remainingScore={transformInfo.remaining}
                                progressPercent={transformInfo.progress}
                                theme="amber"
                                href="#modes"
                                actionLabel="아래에서 시작"
                            />
                        );
                    })()}

                    <div id="modes" className="max-w-4xl mx-auto text-center mb-8 mt-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold mb-2 border border-emerald-100">
                            MODE SELECT
                        </span>
                    </div>

                    <ModeSelection
                        onSelect={(m) => setMode(m)}
                        title="어떤 상황을 변환하시겠습니까?"
                        theme="emerald"
                    />
                </div>
            </div>
        );
    }

    return (
        <WizardLayout
            title=""
            description=""
            pageTitle={
                <span className="flex items-center justify-center gap-4">
                    <span className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                        <ArrowRightLeft className="w-10 h-10 text-white" />
                    </span>
                    <span><span className="text-emerald-600">PREP</span> 변환기</span>
                </span>
            }
            pageDescription={
                <>
                    <span className="text-emerald-600 font-bold">PREP 변환기</span>는 <br />당신의 파편화된 생각을 <br />논리적인 <span className="text-emerald-600 font-bold">PREP 구조</span>로 자동 재조립해줍니다.<br className="hidden sm:block" />
                    <br />복잡한 설명이나 장황한 아이디어를 입력하면, <br />AI가 핵심(Point)을 추출하고 <br />근거(Reason)와 사례(Example)를 보강하여 <br />설득력 있는 답변으로 완성합니다.
                </>
            }
            theme="emerald"
        >
            {/* Saved Toast */}
            {showSavedToast && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-success-green text-white px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    변환 기록이 저장되었습니다!
                </div>
            )}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Input Section */}
                <div className="space-y-4">
                    <div className="rounded-2xl bg-white p-8 shadow-xl">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">나의 생각 (비구조화)</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`💡 두서없이 떠오르는 생각을 그대로 적어보세요. AI가 PREP 구조로 정리해드립니다.\n\n[작성 예시]\n저는 솔직히 AI가 일자리를 빼앗는다고 생각해요. 물론 새로운 일자리가 생기기도 하지만... 근데 또 생각해보면 예전에 ATM이 나왔을 때도 사람들이 은행원 일자리가 없어진다고 했는데...`}
                                className="min-h-[400px] text-lg resize-none p-6 leading-relaxed bg-white text-gray-900 border-gray-300 focus:ring-trust-navy"
                            />

                            <Button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-full bg-trust-navy py-8 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-transform active:scale-95 text-white"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-3">
                                        <Sparkles className="animate-spin h-6 w-6" /> 구조화 분석 중...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <Sparkles className="h-6 w-6" /> PREP으로 변환하기
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                    <div className="h-full min-h-[600px] rounded-2xl bg-white p-8 shadow-xl flex flex-col">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800">변환 결과 (PREP)</h2>

                        {error && (
                            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-6 text-red-600 text-lg">
                                <AlertCircle className="h-6 w-6" />
                                <p>오류가 발생했습니다. 다시 시도해주세요.</p>
                            </div>
                        )}

                        {!parsedData && !isLoading && !error && (
                            <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-xl text-gray-400">
                                왼쪽에서 내용을 입력하고 버튼을 눌러보세요.
                            </div>
                        )}

                        {isLoading && !parsedData && (
                            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-trust-navy animate-pulse">
                                <Sparkles className="h-12 w-12" />
                                <p className="text-xl font-medium">논리 구조를 잡고 있습니다...</p>
                            </div>
                        )}

                        {parsedData && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 overflow-y-auto">
                                {/* AI Direct Coaching (Moved to Top) */}
                                <div className="mb-6 border-b pb-6">
                                    <h3 className="mb-4 text-xl font-bold text-orange-600 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5" /> AI 직설 코칭 (쓴소리)
                                    </h3>
                                    <p className="text-gray-700 text-lg leading-relaxed bg-orange-50 p-6 rounded-xl border border-orange-100 shadow-sm">
                                        {parsedData.advice}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="rounded-xl bg-blue-50 p-5 shadow-sm border border-blue-100">
                                        <span className="font-bold text-trust-navy text-lg block mb-2">Point (결론)</span>
                                        <p className="text-xl text-gray-900 leading-relaxed">{parsedData.point1}</p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-5 shadow-sm border border-gray-100">
                                        <span className="font-bold text-gray-700 text-lg block mb-2">Reason (이유)</span>
                                        <p className="text-xl text-gray-900 leading-relaxed">{parsedData.reason}</p>
                                    </div>
                                    <div className="rounded-xl bg-gray-50 p-5 shadow-sm border border-gray-100">
                                        <span className="font-bold text-gray-700 text-lg block mb-2">Example (사례)</span>
                                        <p className="text-xl text-gray-900 leading-relaxed">{parsedData.example}</p>
                                    </div>
                                    <div className="rounded-xl bg-blue-50 p-5 shadow-sm border border-blue-100">
                                        <span className="font-bold text-trust-navy text-lg block mb-2">Point (요약)</span>
                                        <p className="text-xl text-gray-900 leading-relaxed">{parsedData.point2}</p>
                                    </div>
                                </div>

                                {/* Retry / New Practice Button */}
                                <div className="pt-6 border-t mt-6 flex justify-end">
                                    <Button
                                        onClick={() => {
                                            setInput("");
                                            reset();
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md text-lg px-6 py-6"
                                    >
                                        <RotateCcw className="mr-2 h-5 w-5" />
                                        새로운 내용 변환하기
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WizardLayout>
    );
}
