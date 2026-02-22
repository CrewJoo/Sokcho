"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import {
    useHistoryStore,
    LEVEL_EMOJI,
    type PracticeType,
    type PracticeRecord,
} from "@/lib/history-store";
import { useWordDancingStore, getNextTierInfo } from "@/lib/word-dancing-store";
import {
    TrendingUp,
    Calendar,
    Flame,
    Trophy,
    ChevronRight,
    Trash2,
    BookOpen,
    Sparkles,
    ArrowRight,
    X,
    Leaf,
    Sprout,
    TreeDeciduous,
    TreePine,
    Mountain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillDashboard, ThemeColor } from "@/components/prep/skill-dashboard";
import { GrowthLevel } from "@/lib/history-store";
import { ThreeLeavesIcon } from "@/components/icons/three-leaves-icon";

// ──────────────────────────────────────────────
// Type label & color helpers
// ──────────────────────────────────────────────

const GROWTH_ICONS: Record<GrowthLevel, React.ComponentType<any>> = {
    '씨앗': Leaf,
    '새싹': Sprout,
    '나무': TreeDeciduous,
    '숲': TreePine,
    '산': Mountain,
};

const TYPE_CONFIG: Pick<Record<PracticeType, { label: string; color: string; icon: string }>, PracticeType> = {
    "prep-training": { label: "PREP 트레이닝", color: "#3B82F6", icon: "📝" }, // blue-500
    "prep-transform": { label: "PREP 변환", color: "#F59E0B", icon: "🔄" }, // amber-500
    "prep-interview": { label: "5D 모의면접", color: "#9333EA", icon: "🎤" }, // purple-600
    elenchus: { label: "5D 산파술", color: "#F59E0B", icon: "🏛️" }, // amber-500
    "prep-word-dancing": { label: "PREP 워드댄싱", color: "#10B981", icon: "🎵" }, // green/emerald-500
};

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────

export default function MyProgressPage() {
    // Hydration guard for SSR
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const store = useHistoryStore();
    const wordDancing = useWordDancingStore();

    const [selectedRecord, setSelectedRecord] = useState<PracticeRecord | null>(null);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-slate-400 text-xl font-medium">로딩 중...</div>
            </div>
        );
    }

    const totalCount = store.getTotalCount();
    const weekCount = store.getThisWeekCount();
    const levelInfo = store.getLevelProgress();
    const recentRecords = store.getRecentRecords(10);

    const wordDancingTier = wordDancing.getTier();
    const wordDancingNextTier = getNextTierInfo(wordDancing.totalScore);
    const trainingInfo = store.getPracticeTierInfo('prep-training');
    const transformInfo = store.getPracticeTierInfo('prep-transform');

    const getDynamicIcon = (type: PracticeType, sizeClass: string = "w-6 h-6") => {
        if (type === 'prep-word-dancing') {
            return <Sprout className={`${sizeClass} text-green-500`} />;
        }
        if (type === 'prep-training') {
            return <ThreeLeavesIcon className={`${sizeClass} text-blue-500`} />;
        }
        if (type === 'prep-transform') {
            return <TreePine className={`${sizeClass} text-amber-500`} />;
        }
        const config = TYPE_CONFIG[type];
        return <span className="text-2xl">{config.icon}</span>;
    };

    // ── Empty State ──
    if (totalCount === 0) {
        return (
            <div className="min-h-screen bg-slate-50 pb-20">
                <div className="max-w-4xl mx-auto px-6 pt-52">
                    <div className="text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-8xl"
                        >
                            🌰
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black text-trust-navy"
                        >
                            아직 연습 기록이 없어요
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-500 max-w-lg mx-auto"
                        >
                            PREP 트레이닝이나 AI 면접을 시작하면
                            <br />
                            여기에 성장 기록이 쌓입니다.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-4 justify-center flex-wrap"
                        >
                            <Link href="/prep-training">
                                <Button
                                    size="lg"
                                    className="h-14 px-8 text-lg bg-success-green hover:bg-success-green/90 text-white rounded-full font-bold shadow-lg"
                                >
                                    PREP 트레이닝 시작
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/5d-interview">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-8 text-lg border-2 border-trust-navy text-trust-navy rounded-full font-bold"
                                >
                                    AI 면접 시작
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-6 pt-52">
                {/* ─── Header ─── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight flex items-center justify-center gap-4">
                        <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                            <BarChart3 className="w-10 h-10 text-white" />
                        </div>
                        <span><span className="text-emerald-600">PREP</span> 레벨체크</span>
                    </h1>
                    <p className="text-lg font-bold text-slate-500 mt-4 bg-white px-6 py-2 rounded-full inline-block shadow-sm border border-slate-100">
                        당신의 논리 레벨을 확인해보세요! 🌱
                    </p>
                </motion.div>

                {/* ─── Summary Cards ─── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <SummaryCard
                        icon={<BookOpen className="h-6 w-6" />}
                        label="총 연습 횟수"
                        value={`${totalCount}회`}
                        color="bg-blue-50 text-blue-700"
                        delay={0}
                    />
                    <SummaryCard
                        icon={<Calendar className="h-6 w-6" />}
                        label="이번 주"
                        value={`${weekCount}회`}
                        color="bg-green-50 text-green-700"
                        delay={0.1}
                    />
                    <SummaryCard
                        icon={<Flame className="h-6 w-6" />}
                        label="연속 출석"
                        value={`${store.streakDays}일`}
                        color="bg-orange-50 text-orange-700"
                        delay={0.2}
                    />
                    <SummaryCard
                        icon={<Trophy className="h-6 w-6" />}
                        label="현재 레벨"
                        value={`${LEVEL_EMOJI[levelInfo.current]} ${levelInfo.current}`}
                        color="bg-purple-50 text-purple-700"
                        delay={0.3}
                    />
                </div>

                {/* ─── Level Progress Bar ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-10"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-trust-navy flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            성장 레벨
                        </span>
                        <span className="text-sm text-slate-500">
                            {levelInfo.next
                                ? `다음 레벨 (${LEVEL_EMOJI[levelInfo.next]} ${levelInfo.next}) 까지 ${100 - levelInfo.progress}%`
                                : "🎉 최고 레벨 달성!"}
                        </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${levelInfo.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>{LEVEL_EMOJI[levelInfo.current]} {levelInfo.current}</span>
                        {levelInfo.next && <span>{LEVEL_EMOJI[levelInfo.next]} {levelInfo.next}</span>}
                    </div>
                </motion.div>

                <div className="flex flex-col gap-6 mb-12">
                    {/* Word Dancing (gamified with score) */}
                    {(() => {
                        // Actually, WordDancing tier is Seed|Sprout|Branch|Tree|Forest.
                        const WDIconsKeys = ['Seed', 'Sprout', 'Branch', 'Tree', 'Forest'];
                        // Let's use static icons requested by the user
                        const wdIconComp = Sprout;
                        const wDIconsColor = "text-green-600";

                        let progress = 0;
                        if (!wordDancingNextTier.next) {
                            progress = 100;
                        } else {
                            progress = Math.min(100, Math.max(0, ((wordDancingNextTier.total - wordDancingNextTier.remaining) / wordDancingNextTier.total) * 100));
                        }

                        return (
                            <SkillDashboard
                                title="PREP 워드댄싱"
                                subtitle="음악처럼 즐겁게 문장을 조립하며 감각을 익혀요!"
                                tierName={<span><span className="text-green-600">PREP 워드댄싱</span> 레벨</span>}
                                tierIndex={WDIconsKeys.indexOf(wordDancingTier) + 1}
                                tierIconNode={React.createElement(wdIconComp, { className: `w-8 h-8 ${wDIconsColor}` })}
                                currentScore={wordDancing.totalScore}
                                scoreLabel="XP"
                                remainingScore={wordDancingNextTier.remaining || null}
                                progressPercent={progress}
                                theme="green"
                                href="/prep-word-dancing"
                                actionLabel="연습하기"
                            />
                        );
                    })()}

                    {/* PREP Training (Practice count based) */}
                    {(() => {
                        const IconComp = ThreeLeavesIcon;
                        const iconColor = "text-blue-500";
                        return (
                            <SkillDashboard
                                title="PREP 트레이닝"
                                subtitle="핵심 주장을 구조화하는 기본기를 다지는 훈련입니다."
                                tierName={<span><span className="text-blue-600">PREP 트레이닝</span> 레벨</span>}
                                tierIndex={trainingInfo.tierIndex}
                                tierIconNode={React.createElement(IconComp, { className: `w-8 h-8 ${iconColor}` })}
                                currentScore={trainingInfo.count}
                                scoreLabel="회"
                                remainingScore={trainingInfo.remaining}
                                progressPercent={trainingInfo.progress}
                                theme="blue"
                                href="/prep-training"
                                actionLabel="연습하기"
                            />
                        );
                    })()}

                    {/* PREP Transform (Practice count based) */}
                    {(() => {
                        const IconComp = TreePine;
                        const iconColor = "text-amber-500";
                        return (
                            <SkillDashboard
                                title="PREP 변환기"
                                subtitle="장황한 내 글을 깔끔한 PREP 구조로 세탁해 보세요!"
                                tierName={<span><span className="text-amber-600">PREP 변환기</span> 레벨</span>}
                                tierIndex={transformInfo.tierIndex}
                                tierIconNode={React.createElement(IconComp, { className: `w-8 h-8 ${iconColor}` })}
                                currentScore={transformInfo.count}
                                scoreLabel="회"
                                remainingScore={transformInfo.remaining}
                                progressPercent={transformInfo.progress}
                                theme="amber"
                                href="/prep-transform"
                                actionLabel="변환하기"
                            />
                        );
                    })()}
                </div>

                {/* ─── Recent Records ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-trust-navy flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            최근 연습 기록
                        </h3>
                        {totalCount > 0 && (
                            <button
                                onClick={() => {
                                    if (confirm("모든 연습 기록을 삭제하시겠습니까?")) {
                                        store.clearAll();
                                    }
                                }}
                                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                                <Trash2 className="h-3 w-3" /> 전체 삭제
                            </button>
                        )}
                    </div>

                    {recentRecords.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">기록이 없습니다</p>
                    ) : (
                        <div className="space-y-3">
                            {recentRecords.map((record) => {
                                const config = TYPE_CONFIG[record.type];
                                return (
                                    <button
                                        key={record.id}
                                        onClick={() => setSelectedRecord(record)}
                                        className="w-full text-left flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-center justify-center w-12 h-12 bg-slate-50 rounded-full border border-slate-100 shrink-0">
                                            {getDynamicIcon(record.type, "w-6 h-6")}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                                                    style={{ backgroundColor: config.color }}
                                                >
                                                    {config.label}
                                                </span>
                                                {record.score !== undefined && (
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {record.score}점
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium truncate">
                                                {record.question}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(record.createdAt).toLocaleDateString("ko-KR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* ─── Record Detail Modal ─── */}
            {selectedRecord && (
                <RecordDetailModal
                    record={selectedRecord}
                    onClose={() => setSelectedRecord(null)}
                    iconNode={getDynamicIcon(selectedRecord.type, "w-8 h-8")}
                />
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function SummaryCard({
    icon,
    label,
    value,
    color,
    delay,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`rounded-2xl p-5 ${color} border border-white/50 shadow-sm`}
        >
            <div className="flex items-center gap-2 mb-2 opacity-70">{icon}<span className="text-sm font-medium">{label}</span></div>
            <p className="text-2xl sm:text-3xl font-black">{value}</p>
        </motion.div>
    );
}



function RecordDetailModal({
    record,
    onClose,
    iconNode
}: {
    record: PracticeRecord;
    onClose: () => void;
    iconNode: React.ReactNode;
}) {
    const config = TYPE_CONFIG[record.type];
    const data = record.data as Record<string, string>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-14 h-14 bg-slate-50 rounded-full border border-slate-100 shrink-0">
                            {iconNode}
                        </div>
                        <div>
                            <span
                                className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: config.color }}
                            >
                                {config.label}
                            </span>
                            <p className="text-sm text-slate-400 mt-1">
                                {new Date(record.createdAt).toLocaleDateString("ko-KR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-slate-400" />
                    </button>
                </div>

                <h3 className="text-xl font-bold text-trust-navy mb-4">{record.question}</h3>

                {/* PREP Data */}
                {(data.point1 || data.reason || data.example || data.point2) && (
                    <div className="space-y-3 mb-6">
                        {data.point1 && (
                            <div className="flex gap-2">
                                <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">P</span>
                                <p className="text-sm text-slate-700">{String(data.point1)}</p>
                            </div>
                        )}
                        {data.reason && (
                            <div className="flex gap-2">
                                <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs shrink-0">R</span>
                                <p className="text-sm text-slate-700">{String(data.reason)}</p>
                            </div>
                        )}
                        {data.example && (
                            <div className="flex gap-2">
                                <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-bold flex items-center justify-center text-xs shrink-0">E</span>
                                <p className="text-sm text-slate-700">{String(data.example)}</p>
                            </div>
                        )}
                        {data.point2 && (
                            <div className="flex gap-2">
                                <span className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">P</span>
                                <p className="text-sm text-slate-700">{String(data.point2)}</p>
                            </div>
                        )}
                    </div>
                )}

                {record.score !== undefined && (
                    <div className="bg-slate-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-slate-500 font-medium mb-1">점수</p>
                        <p className="text-3xl font-black text-trust-navy">{record.score}점</p>
                    </div>
                )}

                {record.feedback && (
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                        <p className="text-sm text-amber-700 font-bold mb-2">💡 AI 피드백</p>
                        <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">{record.feedback}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
