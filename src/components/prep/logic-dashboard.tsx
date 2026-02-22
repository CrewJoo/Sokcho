"use client";

import { useEffect, useState } from "react";
import { useWordDancingStore, getNextTierInfo, Tier } from "@/lib/word-dancing-store";
import { motion } from "framer-motion";
import { Leaf, Sprout, TreeDeciduous, TreePine, Mountain } from "lucide-react"; // Icons for Tiers
// import { Progress } from "@/components/ui/progress";

const TierIcons: Record<Tier, React.ReactNode> = {
    Seed: <Leaf className="w-8 h-8 text-green-500" />,
    Sprout: <Sprout className="w-8 h-8 text-green-600" />,
    Branch: <TreeDeciduous className="w-8 h-8 text-green-700" />,
    Tree: <TreePine className="w-8 h-8 text-green-800" />,
    Forest: <Mountain className="w-8 h-8 text-green-900" />,
};

const TierLabels: Record<Tier, string> = {
    Seed: "논리 씨앗 (Seed)",
    Sprout: "논리 새싹 (Sprout)",
    Branch: "논리 가지 (Branch)",
    Tree: "논리 나무 (Tree)",
    Forest: "논리 숲 (Forest)",
};

export function LogicDashboard() {
    const { totalScore, getTier } = useWordDancingStore();
    const [tier, setTier] = useState<Tier>("Seed");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTier(getTier());
    }, [totalScore, getTier]);

    if (!mounted) return null;

    const nextInfo = getNextTierInfo(totalScore);

    let progressPercent = 0;
    if (!nextInfo.next) {
        progressPercent = 100;
    } else {
        const prevThreshold = nextInfo.total - (nextInfo.total - (nextInfo.remaining + (totalScore - (nextInfo.total - nextInfo.remaining))));

        let base = 0;
        let target = 100;

        if (totalScore >= 600) { base = 600; target = 1000; }
        else if (totalScore >= 300) { base = 300; target = 600; }
        else if (totalScore >= 100) { base = 100; target = 300; }
        else { base = 0; target = 100; }

        if (!nextInfo.next) {
            // Over Forest
            base = 1000; target = 2000; // Fake target for progress bar
            progressPercent = 100;
        } else {
            progressPercent = Math.min(100, Math.max(0, ((totalScore - base) / (target - base)) * 100));
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white rounded-2xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-slate-200 shadow-lg"
        >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -z-10 group-hover:bg-green-100 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -z-10" />

            {/* Tier Icon */}
            <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm">
                    {TierIcons[tier]}
                </div>
                <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Tier {Object.keys(TierLabels).indexOf(tier) + 1}
                </div>
            </div>

            {/* Stats Area */}
            <div className="flex-1 w-full text-center md:text-left space-y-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center md:justify-start gap-2">
                        {TierLabels[tier]}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        당신의 논리력이 <span className="text-green-600 font-bold">쑥쑥</span> 자라고 있어요!
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                        <span>현재 XP: <span className="text-slate-900">{totalScore}</span></span>
                        {nextInfo.next && <span>다음 티어까지 {nextInfo.remaining} XP</span>}
                        {!nextInfo.next && <span className="text-amber-500">최고 레벨 도달!</span>}
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                    <div className="text-2xl font-black text-slate-800">{totalScore}</div>
                    <div className="text-xs text-slate-500 font-bold">TOTAL SCORE</div>
                </div>
            </div>
        </motion.div>
    );
}
