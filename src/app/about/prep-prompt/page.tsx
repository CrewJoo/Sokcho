"use client";

import { motion } from "framer-motion";
// import { HomeButton } from "@/components/common/home-button";
import { useState } from "react";
import { PromptExampleModal, PromptExampleType } from "@/components/prep/prompt-example-modal";

export default function AboutAisperPage() {
    const [activeExample, setActiveExample] = useState<PromptExampleType | null>(null);

    const concepts = [
        {
            title: "Meta Prompt",
            subtitle: "메타 프롬프트란?",
            desc: "AI에게 단순히 답을 구하는 것이 아니라, '어떻게 생각해야 하는지' 사고의 틀을 먼저 제시하는 최상위 명령어입니다. AI의 페르소나, 목표, 출력 형식을 정의하여 답변의 품질을 결정짓는 설계도와 같습니다.",
            prep: "PREP 구조는 AI에게 가장 명확한 '사고의 가드레일'을 제공합니다. 'Point(결론)'로 역할을 정의하고, 'Reason(이유)'으로 사고 방향을 설정하며, 'Example(예시)'로 출력 톤앤매너를 학습시키면 AI가 환각 없이 정확한 답변을 생성합니다.",
        },
        {
            title: "RAG",
            subtitle: "검색증강생성이란?",
            desc: "Retrieval-Augmented Generation(RAG)은 AI가 학습하지 않은 외부 데이터를 검색하여 답변에 활용하는 기술입니다. 최신 정보나 기업 내부 문서 등 구체적인 사실에 기반한 신뢰도 높은 답변을 얻을 때 필수적입니다.",
            prep: "RAG의 핵심은 '질문의 명확성'입니다. 모호하게 질문하면 AI는 엉뚱한 문서를 찾아옵니다. PREP으로 질문 의도(P)와 검색해야 하는 구체적인 이유(R), 포함해야 할 키워드 예시(E)를 구조화하면 검색 정확도가 비약적으로 상승합니다."
        },
        {
            title: "Context Engineering",
            subtitle: "컨텍스트 엔지니어링이란?",
            desc: "AI가 사용자의 상황과 의도를 정확히 이해하도록 배경 정보를 논리적으로 주입하는 기술입니다. 단순히 많은 정보를 주는 것이 아니라, AI가 이해하기 쉬운 순서와 구조로 문맥을 최적화하는 과정입니다.",
            prep: "긴 문맥을 던져줄 때 AI는 종종 핵심을 놓칩니다. PREP은 복잡한 상황을 '핵심 주장(P) - 배경 원인(R) - 구체적 정황(E)'으로 쪼개어 전달하게 해줍니다. 이 구조화된 컨텍스트는 AI가 긴 문맥 속에서도 길을 잃지 않고 모든 정보를 유기적으로 연결하여 이해하게 됩니다."
        },
        {
            title: "Slow Thinking",
            subtitle: "슬로우 씽킹이란?",
            desc: "인간의 뇌가 복잡한 문제를 풀 때 천천히 이성적으로 사고하듯(시스템2), AI에게 단계별 추론(Chain of Thought)을 유도하여 논리적 오류를 줄이는 기법입니다. '단계별로 생각해'라는 지시가 대표적입니다.",
            prep: "PREP은 그 자체로 가장 완벽한 '슬로우 씽킹' 템플릿입니다. AI에게 '결론부터 내고(P), 이유를 분석한 뒤(R), 사례를 찾아 검증하고(E), 다시 정리해(P)'라는 논리적 단계를 강제함으로써, 답변의 깊이와 논리적 완결성을 보장합니다."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 relative">
            {/* <HomeButton /> */}

            <div className="max-w-5xl w-full pt-12 pb-20">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-4"
                    >
                        Think Formula
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-black text-slate-800 mb-6"
                    >
                        PREP 프롬프트
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 font-medium max-w-2xl mx-auto break-keep"
                    >
                        AI의 잠재력을 100% 깨우는 데는 복잡한 코딩이 필요 없습니다.<br />
                        명확한 생각의 공식, <span className="text-trust-navy font-bold">PREP</span> 하나면 충분합니다.
                    </motion.p>
                </div>

                {/* Concepts Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {concepts.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-start hover:border-purple-100 transition-colors"
                        >
                            {/* Left: Concept Info */}
                            <div className="flex-1">
                                <span className="text-purple-600 font-bold tracking-wider text-sm uppercase mb-2 block">{item.title}</span>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.subtitle}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg break-keep bg-slate-50 p-6 rounded-xl border border-slate-100">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Right: PREP Application */}
                            <div className="flex-1 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-trust-navy to-purple-600 rounded-full opacity-20 md:opacity-100"></div>
                                <div className="pl-6 md:pl-8 pt-2">
                                    <h4 className="flex items-center gap-2 text-trust-navy font-black text-xl mb-4">
                                        <span className="bg-trust-navy text-white text-xs px-2 py-1 rounded">HOW</span>
                                        PREP의 적용
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed break-keep font-medium">
                                        {item.prep}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center bg-trust-navy text-white rounded-3xl p-10 sm:p-16 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 relative z-10">
                        이제 당신의 생각을 AI에게 명확하게 전달하세요.
                    </h2>
                    <p className="text-blue-100 text-lg mb-0 relative z-10">
                        PREP만 익히면 당신도 바로 프롬프트 엔지니어입니다.
                    </p>
                </motion.div>

            </div>

            <PromptExampleModal
                isOpen={!!activeExample}
                onClose={() => setActiveExample(null)}
                type={activeExample}
            />
        </div>
    );
}
