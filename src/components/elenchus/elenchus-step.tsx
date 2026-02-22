"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useElenchusStore } from "@/lib/elenchus-store";

export function ElenchusStep() {
    const { currentStep, category, history, addHistoryItem, setStep, isLoading, setIsLoading } = useElenchusStore();
    const [input, setInput] = useState("");
    const [question, setQuestion] = useState("");

    // Initial Question or recover from history (if we were to implement history nav)
    useEffect(() => {
        if (!category) return;

        // If it's the first step (Definition), set initial question based on category
        // In later steps, the question comes from the API response of the previous step
        if (currentStep === 1 && history.length === 0) {
            const initialQuestions: Record<string, string> = {
                'DREAM': "자네의 꿈(목표)은 무엇인가? 한 문장으로 정의해 보게나.",
                'DIFFICULTY': "자네 인생에서 가장 힘들었던 경험은 무엇이었나?",
                'TREND': "최근 자네가 가장 주목하고 있는 트렌드나 이슈는 무엇인가?",
                'STAND': "자네가 절대 포기할 수 없는 삶의 기준(가치관)은 무엇인가?",
                'DIFFERENT': "다른 사람과 구별되는 자네만의 무기(강점)는 무엇인가?"
            };
            setQuestion(initialQuestions[category] || "");
        } else {
            // For steps 2, 3, 4, the question is the last 'answer' from the AI (which we haven't stored in history yet? No, history stores user Q&A pairs)
            // Wait, history stores pairs of (Step, Question, UserAnswer). 
            // So for current step, we need the *current question*. 
            // The API logic will be: User Answer -> API Generate Next Question.
            // So we need a state for 'currentQuestion'.
        }
    }, [category, currentStep, history.length]);

    const handleNext = async () => {
        if (!input.trim()) return;

        setIsLoading(true);

        // Save current interaction
        const currentQ = question;
        const currentA = input;

        // Determine next step
        // 1 (Def) -> 2 (Elenchus)
        // 2 (Elenchus) -> 3 (Maieutics)
        // 3 (Maieutics) -> 4 (Synthesis/Result?) -> Let's say 4 is Synthesis

        // We call API to get the *Next Question* (or Final Result)
        try {
            const res = await fetch('/api/elenchus/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category,
                    currentStep,
                    history: [...history, { step: currentStep, question: currentQ, answer: currentA }],
                    currentInput: currentA
                })
            });

            const data = await res.json();

            // Add to history
            addHistoryItem({
                step: currentStep as any, // casting for now since step types match number
                question: currentQ,
                answer: currentA
            });

            if (data.nextStep === 'RESULT') {
                if (data.finalPrep) {
                    useElenchusStore.getState().setFinalPrep(data.finalPrep);
                }
                setStep(5); // Result
            } else {
                setQuestion(data.nextQuestion);
                setStep(currentStep + 1);
                setInput("");
            }

        } catch (error) {
            console.error("Error fetching next question:", error);
            // alert("오류가 발생했습니다. 다시 시도해주세요."); // Deprecated generic alert
            alert("시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n(API Key 확인 또는 네트워크 상태를 점검해주세요.)");
        } finally {
            // Only set loading false if NOT moving to result (Result component might need data?)
            // Actually, we can just set false. 
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border border-slate-100"
                >
                    {/* Mentor Profile / Question */}
                    <div className="flex gap-6 mb-8">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-trust-navy rounded-full flex items-center justify-center text-3xl shadow-lg">
                                🏛️
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-trust-navy uppercase tracking-wider">
                                Socrates AI
                            </h3>
                            <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {question || (isLoading ? "생각하는 중..." : "")}
                            </p>
                        </div>
                    </div>

                    {/* User Answer Area */}
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="내용을 입력해주세요..."
                            className="w-full min-h-[200px] p-6 rounded-2xl bg-slate-50 border border-slate-200 text-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-trust-navy focus:border-transparent transition-all resize-none shadow-inner"
                            disabled={isLoading}
                        />
                        <div className="flex justify-end mt-4">
                            <Button
                                onClick={handleNext}
                                disabled={!input.trim() || isLoading}
                                className="bg-trust-navy hover:bg-trust-navy/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        다음 단계로 <Send className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`h-2 rounded-full transition-all duration-300 ${s === currentStep ? "w-8 bg-trust-navy" : "w-2 bg-slate-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
