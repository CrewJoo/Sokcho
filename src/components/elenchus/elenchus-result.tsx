"use client";

import { motion } from "framer-motion";
import { useElenchusStore } from "@/lib/elenchus-store";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Copy, Check } from "lucide-react";
import { useState } from "react";

export function ElenchusResult() {
    const { history, category, reset } = useElenchusStore();
    const [copied, setCopied] = useState(false);

    // The last item in history should be the Synthesis
    // But actually, we might want to have the API return a structured "Final PREP" object.
    // For now, let's assume the last "answer" from the user or the last "question" from AI was the summary.
    // Wait, the flow is: Q1 -> A1 -> Q2 -> A2 -> Q3 -> A3 -> Q4 (Synthesis) -> A4 (Confirmation) -> Result
    // Let's just display the conversation history beautifully for now.

    const handleCopy = () => {
        const text = history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join("\n\n");
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
            >
                <div className="bg-trust-navy p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="relative z-10">
                        <div className="text-6xl mb-4">💎</div>
                        <h2 className="text-3xl font-black mb-2">당신의 잠재력(5D)이 발견되었습니다.</h2>
                        <p className="text-blue-200 text-lg">소크라테스와의 대화를 통해 다듬어진 당신만의 강점입니다.</p>
                    </div>
                </div>

                <div className="p-8 sm:p-12 space-y-8 bg-slate-50">
                    {/* Final PREP Section */}
                    {useElenchusStore.getState().finalPrep && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-md border-2 border-trust-navy/10 ring-1 ring-trust-navy/5"
                        >
                            <h3 className="text-xl font-black text-trust-navy mb-4 flex items-center gap-2">
                                📜 소크라테스의 헌정 (The Tribute)
                            </h3>
                            <div className="text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                                {useElenchusStore.getState().finalPrep}
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        {history.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                            >
                                <div className="flex gap-3 mb-3 text-trust-navy font-bold text-sm uppercase tracking-wider items-center">
                                    <span className="w-2 h-2 rounded-full bg-trust-navy"></span>
                                    {idx === 0 ? "Definition (정의)" : idx === 1 ? "Elenchus (반박)" : idx === 2 ? "Maieutics (산파)" : "Synthesis (통합)"}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-3">{item.question}</h3>
                                <div className="bg-slate-50 rounded-xl p-4 text-slate-600 leading-relaxed border border-slate-200">
                                    {item.answer}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 pt-8">
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="rounded-xl px-8 py-6 gap-2 text-lg border-2 hover:bg-slate-50"
                        >
                            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            {copied ? "복사완료" : "대화 내용 복사"}
                        </Button>
                        <Button
                            onClick={reset}
                            className="bg-trust-navy hover:bg-trust-navy/90 text-white rounded-xl px-8 py-6 gap-2 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            다른 5D 찾기
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
