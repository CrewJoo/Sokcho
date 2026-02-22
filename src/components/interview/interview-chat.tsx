"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Using Textarea for better input exp
import { Send, User as UserIcon, Bot, Loader2 } from "lucide-react";
import { useInterviewStore } from "@/lib/interview-store";
import { motion, AnimatePresence } from "framer-motion";

export function InterviewChat() {
    const { mode, messages: storedMessages, addMessage: saveToStore, setAnalyzing, setAnalysisResult } = useInterviewStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isFinished, setIsFinished] = useState(false);

    // Initialize messages from store or generated greeting
    const [initialMessages] = useState(() => {
        if (storedMessages && storedMessages.length > 0) return storedMessages;

        const initialGreeting = mode === 'SCHOOL'
            ? "안녕하세요! 입학사정관입니다. 학생부만으로는 알 수 없는 지원자님의 진짜 학업 이야기를 듣고 싶어서 모셨습니다. 긴장하지 마시고 편하게 대화해요. 우선, 희망하는 전공이나 진로 목표가 무엇인가요?"
            : "반갑습니다. 오늘 면접을 진행하게 된 대입 입학사정관입니다. 생기부에 적힌 활동 내역보다는, 지원자님이 어떤 학업적 열정을 가진 학생인지 깊이 알고 싶습니다. 먼저, 우리 학과에 지원하게 된 솔직한 계기가 궁금합니다.";

        const greetingMsg = { id: 'init-1', role: 'assistant' as const, content: initialGreeting };
        saveToStore(greetingMsg); // Save to store immediately
        return [greetingMsg];
    });

    const [input, setInput] = useState("");
    const chatHelpers = useChat({
        api: "/api/interview/chat",
        initialMessages: initialMessages,
        body: { mode },
        onFinish: (message: any) => {
            saveToStore({ role: 'assistant', content: message.content });

            if (message.content.includes("분석 결과") || message.content.includes("마무리")) {
                setIsFinished(true);
                // Trigger analysis directly via state change
            }
        },
    } as any) as any;

    const { messages, append, isLoading } = chatHelpers;

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Cleanup: Analysis triggering is handled by isFinished state effect below

    const handleAnalysis = async () => {
        setAnalyzing(true);
        try {
            const response = await fetch("/api/interview/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: storedMessages }), // Use storedMessages or messages
            });

            if (!response.ok) throw new Error("Analysis failed");

        } catch (error) {
            console.error(error);
            alert("분석 중 오류가 발생했습니다.");
        }
    };

    // Helper to trigger analysis view transition
    // We don't fetch here; we just flip the state so UI switches to Analysis View.
    // The Analysis View will fetch data on mount using the messages in Store.
    const triggerAnalysis = () => {
        setAnalyzing(true);
    };

    useEffect(() => {
        if (isFinished) {
            triggerAnalysis();
        }
    }, [isFinished]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isLoading || !input.trim() || isFinished) return;

        const userMsg = input;
        setInput(""); // Clear input immediately
        saveToStore({ role: 'user', content: userMsg });

        await append({ role: 'user', content: userMsg });
    };

    return (
        <div className="flex flex-col h-[700px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((m: any, idx: number) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-100' : 'bg-trust-navy'}`}>
                            {m.role === 'user' ? <UserIcon className="w-6 h-6 text-indigo-600" /> : <Bot className="w-6 h-6 text-white" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl p-4 text-lg leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-lg'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-lg'
                            }`}>
                            {m.content}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-trust-navy flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLoading ? "사정관이 말하고 있습니다..." : "답변을 입력하세요..."}
                        className="min-h-[60px] max-h-[150px] resize-none pr-12 text-lg py-3 rounded-xl border-gray-300 focus:ring-trust-navy/20 focus:border-trust-navy"
                        disabled={isLoading || isFinished}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input?.trim() || isFinished}
                        className="absolute right-3 bottom-3 h-10 w-10 rounded-lg bg-trust-navy hover:bg-trust-navy/90 text-white transition-all transform active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <span className="text-xs text-slate-400">Shift + Enter로 줄바꿈</span>
                </div>
            </div>
        </div>
    );
}
