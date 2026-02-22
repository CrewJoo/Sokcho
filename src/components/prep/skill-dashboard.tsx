"use client";

import { motion } from "framer-motion";
import { Leaf, Sprout, TreeDeciduous, TreePine, Mountain, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ThemeColor = 'green' | 'blue' | 'purple' | 'amber' | 'pink' | 'indigo';

const ThemeClasses: Record<ThemeColor, {
    bgFrom: string; bgTo: string;
    iconBg: string; // The tier badge
    textHighlight: string;
    progressBar: string;
    glowBg1: string; glowBg2: string;
}> = {
    green: {
        bgFrom: "from-emerald-400", bgTo: "to-green-500",
        iconBg: "bg-green-600",
        textHighlight: "text-green-600",
        progressBar: "from-emerald-400 to-green-500",
        glowBg1: "bg-green-50 group-hover:bg-green-100", glowBg2: "bg-emerald-50"
    },
    blue: {
        bgFrom: "from-blue-400", bgTo: "to-indigo-500",
        iconBg: "bg-blue-600",
        textHighlight: "text-blue-600",
        progressBar: "from-blue-400 to-indigo-500",
        glowBg1: "bg-blue-50 group-hover:bg-blue-100", glowBg2: "bg-indigo-50"
    },
    purple: {
        bgFrom: "from-purple-400", bgTo: "to-violet-500",
        iconBg: "bg-purple-600",
        textHighlight: "text-purple-600",
        progressBar: "from-purple-400 to-violet-500",
        glowBg1: "bg-purple-50 group-hover:bg-purple-100", glowBg2: "bg-violet-50"
    },
    amber: {
        bgFrom: "from-amber-400", bgTo: "to-orange-500",
        iconBg: "bg-amber-600",
        textHighlight: "text-amber-600",
        progressBar: "from-amber-400 to-orange-500",
        glowBg1: "bg-amber-50 group-hover:bg-amber-100", glowBg2: "bg-orange-50"
    },
    pink: {
        bgFrom: "from-pink-400", bgTo: "to-rose-500",
        iconBg: "bg-pink-600",
        textHighlight: "text-pink-600",
        progressBar: "from-pink-400 to-rose-500",
        glowBg1: "bg-pink-50 group-hover:bg-pink-100", glowBg2: "bg-rose-50"
    },
    indigo: {
        bgFrom: "from-indigo-400", bgTo: "to-blue-500",
        iconBg: "bg-indigo-600",
        textHighlight: "text-indigo-600",
        progressBar: "from-indigo-400 to-blue-500",
        glowBg1: "bg-indigo-50 group-hover:bg-indigo-100", glowBg2: "bg-blue-50"
    }
};

interface SkillDashboardProps {
    title: string;
    subtitle: string;
    tierIconNode: React.ReactNode;
    tierName: React.ReactNode;
    tierIndex: number;
    currentScore: number;
    scoreLabel?: string;
    remainingScore: number | null; // null if max level
    progressPercent: number;
    theme: ThemeColor;
    href: string;
    actionLabel: string;
}

export function SkillDashboard({
    title,
    subtitle,
    tierIconNode,
    tierName,
    tierIndex,
    currentScore,
    scoreLabel = "XP",
    remainingScore,
    progressPercent,
    theme,
    href,
    actionLabel
}: SkillDashboardProps) {
    const t = ThemeClasses[theme];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-white rounded-2xl p-6 sm:p-8 mb-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-slate-200 shadow-md"
        >
            {/* Background Decoration */}
            <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10 transition-all duration-500", t.glowBg1)} />
            <div className={cn("absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl -z-10", t.glowBg2)} />

            {/* Tier Icon */}
            <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-slate-100 shadow-sm shrink-0">
                    {tierIconNode}
                </div>
                <div className={cn("text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md", t.iconBg)}>
                    Tier {tierIndex}
                </div>
            </div>

            {/* Stats Area */}
            <div className="flex-1 w-full text-center md:text-left space-y-3">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center md:justify-start gap-2">
                        {tierName}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm md:text-base mt-1">
                        {subtitle}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-sm font-bold text-slate-500">
                        <span>현재 {scoreLabel}: <span className="text-slate-900">{currentScore}</span></span>
                        {remainingScore !== null ? (
                            <span>다음 티어까지 {remainingScore} {scoreLabel}</span>
                        ) : (
                            <span className="text-amber-500">최고 레벨 도달!</span>
                        )}
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                        <motion.div
                            className={cn("h-full rounded-full bg-gradient-to-r", t.progressBar)}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progressPercent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col items-center justify-center w-full md:w-auto mt-2 md:mt-0 gap-3">
                <div className="bg-slate-50 px-6 py-3 rounded-xl text-center border border-slate-100 w-full md:w-32 hover:bg-white transition-colors">
                    <div className="text-2xl font-black text-slate-800">{currentScore}</div>
                    <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">TOTAL {scoreLabel}</div>
                </div>
                <Link href={href} className="w-full">
                    <button className={cn(
                        "w-full px-4 py-2 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1",
                        t.iconBg
                    )}>
                        {actionLabel} <ChevronRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </motion.div>
    );
}
