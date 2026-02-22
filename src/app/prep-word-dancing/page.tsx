"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Music, CheckCircle2, ListOrdered, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SkillDashboard } from "@/components/prep/skill-dashboard";
import { useWordDancingStore, getNextTierInfo } from "@/lib/word-dancing-store";
import { WORD_DANCING_DATA } from "@/lib/word-dancing-data";
import { useEffect, useState } from "react";
import React from "react";
import { Shuffle, Leaf, Sprout, TreeDeciduous, TreePine, Mountain } from "lucide-react";

export default function WordDancingPage() {
    const wordDancing = useWordDancingStore();
    const { completedBunches } = wordDancing;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const steps = [
        {
            id: 1,
            levelLabel: "Level 1",
            title: "P와 R 구분하기",
            desc: "직관적으로 결론(Point)과 이유(Reason)를 구분하는 감각을 익힙니다.",
            icon: <CheckCircle2 className="h-8 w-8 text-emerald-600" />,
            link: "/prep-training/step1",
            active: true
        },
        {
            id: 2,
            levelLabel: "Level 2",
            title: "P, R, E 연결하기",
            desc: "핵심 요소를 3가지 덩어리로 분류하는 기초 훈련입니다.",
            icon: <ListOrdered className="h-8 w-8 text-emerald-600" />,
            link: "/prep-training/step2",
            active: true
        },
        {
            id: 3,
            levelLabel: "Level 3",
            title: "논리(P-R-E) 확장하기",
            desc: "복잡한 문장에서 P-R-E 구조를 찾아내는 심화 훈련입니다.",
            icon: <Sparkles className="h-8 w-8 text-emerald-600" />,
            link: "/prep-training/step3",
            active: true
        },
        {
            id: 4,
            levelLabel: "Level 4",
            title: "완벽한 논리(PREP) 완성하기",
            desc: "완벽한 4단 논법으로 당신의 생각을 구조화해보세요.",
            icon: <Music className="h-8 w-8 text-emerald-600" />,
            link: "/prep-training/step4",
            active: true
        }
    ].map(step => {
        if (!mounted) return { ...step, progress: 0 };
        const levelData = WORD_DANCING_DATA.find(d => d.level === step.id);
        const total = levelData?.bunches.length || 1;
        const completed = completedBunches[step.id]?.length || 0;
        return {
            ...step,
            progress: Math.min(100, Math.round((completed / total) * 100))
        };
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 relative">

            <div className="max-w-6xl w-full pt-52 pb-20 px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-trust-navy drop-shadow-sm flex items-center justify-center gap-4">
                            <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                                <Shuffle className="w-10 h-10 text-white" />
                            </div>
                            <span><span className="text-emerald-600">PREP</span> 워드댄싱</span>
                        </h1>
                        <p className="text-xl text-slate-600 mt-8 md:mt-10 max-w-3xl mx-auto break-keep leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-xl">
                            <span className="text-emerald-600 font-bold">워드 댄싱</span>은 흩어진 문장 조각들을 조립하며 <br className="hidden sm:block" />PREP(논리의 흐름)을 감각적으로 익히는 게임형 훈련입니다.
                            <br className="hidden sm:block" />Level 1의 단순 구분부터 Level 4의 완성형 구조까지, <br className="hidden sm:block" />단계별 미션을 클리어하며 <span className="text-emerald-600 font-bold">PREP 구조</span>가 몸에 배도록 연습해보세요.
                        </p>
                    </motion.div>
                </div>
                {(() => {
                    const wordDancingTier = wordDancing.getTier();
                    const wordDancingNextTier = getNextTierInfo(wordDancing.totalScore);
                    const WDIcons: Record<string, React.ComponentType<any>> = { Seed: Leaf, Sprout: Sprout, Branch: TreeDeciduous, Tree: TreePine, Forest: Mountain };
                    const wdIconComp = WDIcons[wordDancingTier] || Leaf;
                    const wDIconsColor = { Seed: "text-green-500", Sprout: "text-green-600", Branch: "text-green-700", Tree: "text-green-800", Forest: "text-green-900" }[wordDancingTier] || "text-green-500";

                    let progress = 0;
                    if (!wordDancingNextTier.next) {
                        progress = 100;
                    } else {
                        progress = Math.min(100, Math.max(0, ((wordDancingNextTier.total - wordDancingNextTier.remaining) / wordDancingNextTier.total) * 100));
                    }

                    return (
                        <SkillDashboard
                            title="PREP 워드댄싱"
                            subtitle="레고처럼 즐겁게 문장을 조립하며 PREP의 감각을 익혀요!"
                            tierName={<span><span className="text-emerald-600">PREP 워드댄싱</span> 레벨</span>}
                            tierIndex={Object.keys(WDIcons).indexOf(wordDancingTier) + 1}
                            tierIconNode={React.createElement(wdIconComp, { className: `w-8 h-8 ${wDIconsColor}` })}
                            currentScore={wordDancing.totalScore}
                            scoreLabel="XP"
                            remainingScore={wordDancingNextTier.remaining || null}
                            progressPercent={progress}
                            theme="green"
                            href="#levels"
                            actionLabel="도전하기"
                        />
                    );
                })()}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={step.active ? step.link : "#"} className={!step.active ? "cursor-not-allowed" : ""}>
                                <div className={`bg-white p-8 h-full flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-2 rounded-2xl ${step.active ? "border-transparent hover:border-emerald-200 cursor-pointer shadow-lg shadow-slate-200/50" : "opacity-40 border-slate-100 bg-slate-50"}`}>
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl">
                                            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100/50">
                                                {step.icon}
                                            </div>
                                            <span className="text-xl font-bold text-slate-400 mr-2">{step.levelLabel}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className={`text-2xl font-bold mb-3 ${step.active ? "text-slate-800" : "text-slate-400"}`}>
                                            <span>{step.title}</span>
                                        </h3>
                                        <p className="text-slate-500 font-medium leading-relaxed mb-4">
                                            {step.desc}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                                <span>진행률</span>
                                                <span className={step.active ? "text-slate-700" : ""}>
                                                    {Math.round(step.progress)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        step.id === 1 && "bg-emerald-500",
                                                        step.id === 2 && "bg-emerald-600",
                                                        step.id === 3 && "bg-teal-600",
                                                        step.id === 4 && "bg-teal-700"
                                                    )}
                                                    style={{ width: `${step.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <div className={`p-2 rounded-full ${step.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                                            <ArrowRight className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
