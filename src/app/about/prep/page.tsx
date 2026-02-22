"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
// import { HomeButton } from "@/components/common/home-button";

export default function AboutPrepPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
            {/* <HomeButton /> */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl w-full pt-52 pb-20 px-6"
            >
                {/* Header */}
                <div className="text-center mb-24 space-y-6">
                    {/* <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-sm mb-4">
                        Logical Framework
                    </span> */}
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-trust-navy drop-shadow-sm flex items-center justify-center gap-4">
                        <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                            <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <span><span className="text-emerald-600">PREP</span>이란?</span>
                    </h1>
                    <p className="text-xl text-slate-600 mt-8 md:mt-10 max-w-3xl mx-auto break-keep leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                        <span className="text-emerald-600 font-bold">PREP</span>(프렙)은 단순한 말하기 기법이 아닌, <br className="hidden sm:block" />복잡한 머릿속을 가장 명료하게 정렬하는 강력한<span className="text-emerald-600 font-bold">'생각의 공식'</span>입니다.<br className="hidden sm:block" />
                        <span className="text-emerald-600 font-bold">Point-Reason-Example-Point</span>로 이어지는 4단계 완벽한 논리 구조를 통해, <br className="hidden sm:block" />당신의 직관을 확신으로 바꾸고 상대를 매혹하는 커뮤니케이션의 정수를 경험하세요.
                    </p>
                </div>

                {/* PREP Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        {
                            step: "P",
                            name: "Point",
                            desc: "핵심 결론",
                            detail: "청중이 가장 궁금해하는 핵심 주장이나 결론을 두괄식으로 간결하게 제시합니다.",
                            color: "bg-red-400 text-white",
                            bar: "bg-red-400"
                        },
                        {
                            step: "R",
                            name: "Reason",
                            desc: "이유 및 근거",
                            detail: "왜 그런 결론이 나왔는지 논리적이고 타당한 이유를 설명하여주장의 신뢰를 얻습니다.",
                            color: "bg-blue-100 text-trust-navy",
                            bar: "bg-blue-400"
                        },
                        {
                            step: "E",
                            name: "Example",
                            desc: "구체적 사례",
                            detail: "데이터, 경험담, 예시 등을 통해 추상적인 이유를 구체화하고 설득력을 극대화합니다.",
                            color: "bg-green-100 text-green-800",
                            bar: "bg-emerald-500"
                        },
                        {
                            step: "P",
                            name: "Point",
                            desc: "요약 및 재강조",
                            detail: "앞선 내용을 요약하고 핵심 메시지를 다시 한번 강조하여 청중의 기억에 각인시킵니다.",
                            color: "bg-orange-400 text-white",
                            bar: "bg-orange-400"
                        },
                    ].map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 + 0.3 }}
                            className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 h-full"
                        >
                            <div className={`absolute top-0 left-0 w-full h-3 ${step.bar}`} />
                            <span className={`flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-black mb-6 shadow-md ${step.color}`}>
                                {step.step}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.name}</h3>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{step.desc}</span>
                            <p className="text-slate-600 leading-relaxed font-medium break-keep">
                                {step.detail}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Description Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white rounded-3xl p-10 sm:p-14 shadow-2xl border border-trust-navy/10 max-w-4xl mx-auto relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-slate-50/50 -z-10" />
                    <h3 className="text-2xl font-bold text-trust-navy mb-6">왜 PREP인가?</h3>
                    <div className="space-y-6 text-lg text-slate-700 leading-relaxed break-keep text-left">
                        <p>
                            <div className="text-amber-600 font-bold">더 정교하게, 더 명확하게, 1% 차이가 경쟁력입니다</div>
                            ChatGPT, Gemini, Claude — 인공지능이 모든 분야에 스며든 지금,
                            커뮤니케이션의 승패를 가르는 것은 <strong className="text-trust-navy bg-blue-50 px-1 rounded">"얼마나 명확하게 전달하느냐"</strong>입니다.
                            AI에게 모호한 지시를 내리면 엉뚱한 답이 돌아오고, 사람에게 두서없이 말하면 신뢰를 잃습니다.
                        </p>
                        <p>
                            PREP은 인간과 AI 모두에게 통하는 <strong className="text-trust-navy">커뮤니케이션의 보편 공식</strong>입니다.
                            <strong className="text-trust-navy">결론(Point)</strong>으로 핵심을 먼저 제시하고,
                            <strong className="text-trust-navy">근거(Reason)</strong>로 논리적 기반을 세우며,
                            <strong className="text-trust-navy">사례(Example)</strong>로 구체적 증거를 더하고,
                            마지막 <strong className="text-trust-navy">강조(Point)</strong>로 메시지를 각인시킵니다.
                        </p>
                        <p>
                            면접, 발표, 보고서, AI 프롬프트, 이메일까지 —
                            PREP은 어떤 상황에서든 당신의 생각을 가장 설득력 있게 전달하는
                            <strong className="text-trust-navy">AI 시대의 커뮤니케이션 표준</strong>입니다.
                        </p>
                    </div>
                </motion.div>

                {/* PREP과 면접 Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="bg-emerald-50 rounded-3xl p-10 sm:p-14 shadow-2xl border border-emerald-100 max-w-4xl mx-auto mt-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-emerald-50/50 -z-10" />
                    <h3 className="text-2xl font-bold text-trust-navy mb-6">PREP은 왜 면접에 강한가?</h3>
                    <div className="space-y-6 text-lg text-slate-700 leading-relaxed break-keep text-left">
                        <p>
                            <div className="text-amber-600 font-bold">말하기 전에 먼저 판단하라! PREP은 판단이 태어나는 ‘생각의 공식’입니다.</div>
                            입학사정관은 평균 <strong className="text-trust-navy bg-blue-50 px-1 rounded">30초 이내</strong>에 지원자의 답변 구조를 판단합니다.
                            두서없는 답변은 "준비가 부족하다"는 인상을, PREP으로 짜인 답변은 <strong className="text-trust-navy bg-blue-50 px-1 rounded">"논리적이고 신뢰할 수 있다"</strong>는 인상을 줍니다.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                            <div className="bg-white rounded-xl p-5 border border-red-200 shadow-sm">
                                <p className="font-bold text-red-500 mb-2">❌ PREP 없이</p>
                                <p className="text-sm text-slate-600">"음... 제가 그 프로젝트에서... 여러 가지를 했는데... 팀원들이랑 같이... 그래서 결과가 좋았어요."</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-emerald-200 shadow-sm">
                                <p className="font-bold text-emerald-600 mb-2">✅ PREP으로</p>
                                <p className="text-sm text-slate-600">"팀 리더십이 제 강점입니다(P). 5명의 팀을 이끌며 갈등을 조율한 경험이 있기 때문입니다(R). 구체적으로...(E). 이처럼 저는...(P)"</p>
                            </div>
                        </div>
                        <p>
                            PREP은 <strong className="text-trust-navy">결론 → 근거 → 사례 → 재강조</strong>의 흐름으로
                            입학사정관이 가장 듣고 싶은 정보를 가장 먼저 전달합니다.
                            입학사정관이 가장 듣고 싶은 정보를 가장 먼저 전달합니다.
                            이 구조는 공채 면접, 경력직 이직, 승진 심사 등 모든 비즈니스 커뮤니케이션에서 통하는 <strong className="text-trust-navy">범용 프레임워크</strong>입니다.
                        </p>
                    </div>
                </motion.div>

                {/* PREP 프롬프팅 Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-purple-50 rounded-3xl p-10 sm:p-14 shadow-2xl border border-purple-100 max-w-4xl mx-auto mt-10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-purple-50/50 -z-10" />
                    <h3 className="text-2xl font-bold text-trust-navy mb-6">PREP 프롬프팅이란?</h3>
                    <div className="space-y-6 text-lg text-slate-700 leading-relaxed break-keep text-left">
                        <p>
                            <div className="text-amber-600 font-bold">PREP 프롬프트는 ‘AI에게 더 명확한 생각을 지시하고, 더 정교한 결과물을 이끌어냅니다</div>
                            AI의 잠재력을 100% 이끌어내기 위해 복잡한 프롬프트는 필요 없습니다.
                            <br />명확한 생각의 공식, <strong className="text-trust-navy bg-purple-100 px-1 rounded">PREP 프롬프팅</strong> 하나면 충분합니다.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm transition-transform hover:-translate-y-1">
                                <p className="font-bold text-purple-700 mb-3 text-lg">🧠 Meta Prompt (메타 프롬프트)</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    AI의 <span className="font-bold text-trust-navy">역할/목적(P)</span>을 부여하고, 그 <span className="font-bold text-trust-navy">배경과 이유(R)</span>를 설명하며, 참고할 <span className="font-bold text-trust-navy">예시/톤앤매너(E)</span>를 제공한 뒤, 마지막에 제약사항과 <span className="font-bold text-trust-navy">출력 형식(P)</span>을 강제하여 완벽한 가이드라인을 제시합니다.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm transition-transform hover:-translate-y-1">
                                <p className="font-bold text-purple-700 mb-3 text-lg">🔍 RAG (검색증강생성)</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    질문의 <span className="font-bold text-trust-navy">핵심 의도(P)</span>를 밝히고, 검색해야 하는 <span className="font-bold text-trust-navy">문맥적 이유(R)</span>와 포함해야 할 <span className="font-bold text-trust-navy">데이터 예시(E)</span>를 준 후, 최종적으로 <span className="font-bold text-trust-navy">원하는 형태의 답변(P)</span>을 명확히 지시하여 정확성을 높입니다.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm transition-transform hover:-translate-y-1">
                                <p className="font-bold text-purple-700 mb-3 text-lg">🏗️ Context Engineering</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    복잡한 상황을 설명할 때 <span className="font-bold text-trust-navy">핵심 주장(P)</span>, <span className="font-bold text-trust-navy">배경 원인(R)</span>, <span className="font-bold text-trust-navy">구체적 정황(E)</span> 순으로 문맥을 주입하고, 마지막으로 AI가 수행할 <span className="font-bold text-trust-navy">핵심 요구사항(P)</span>을 재확인시켜 맥락 이탈을 막습니다.
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm transition-transform hover:-translate-y-1">
                                <p className="font-bold text-purple-700 mb-3 text-lg">⏳ Slow Thinking</p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    AI가 복잡한 문제를 풀 때 <span className="font-bold text-trust-navy">결론부터 내고(P)</span>, <span className="font-bold text-trust-navy">이유를 분석(R)</span>한 뒤, <span className="font-bold text-trust-navy">사례 검증(E)</span>을 거쳐, <span className="font-bold text-trust-navy">도출된 최종 결론을 정리(P)</span>하는 구체적인 논리 단계를 강제합니다.
                                </p>
                            </div>
                        </div>
                        <p className="text-center mt-6 font-medium text-purple-800 bg-white/50 py-3 rounded-lg border border-purple-100">
                            이제 당신의 생각을 명확하게 전달하세요. PREP만 익히면 당신도 바로 프롬프트 엔지니어입니다.
                        </p>
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
}
