"use client";

import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPoint } from "@/components/wizard/step-point";
import { StepReason } from "@/components/wizard/step-reason";
import { StepExample } from "@/components/wizard/step-example";
import { StepPointRe } from "@/components/wizard/step-point-re";
import { FeedbackView } from "@/components/feedback/feedback-view";
import { ModeSelection } from "@/components/prep/mode-selection";
// import { HomeButton } from "@/components/common/home-button";
import { useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Dumbbell, Leaf, Sprout, TreeDeciduous, TreePine, Mountain } from "lucide-react";
import { useHistoryStore, GrowthLevel } from "@/lib/history-store";
import { SkillDashboard } from "@/components/prep/skill-dashboard";
import { ThreeLeavesIcon } from "@/components/icons/three-leaves-icon";

export default function PrepPage() {
    const { currentStep, mode, setMode, reset } = usePrepStore();
    const store = useHistoryStore();

    useEffect(() => {
        // Reset state on mount to force selection
        reset();
    }, [reset]);

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "결론부터 말하세요 (Point)",
                    description: "입학사정관의 뇌는 피로합니다. 두괄식으로 핵심을 꽂아주세요.",
                    component: <StepPoint />,
                };
            case 2:
                return {
                    title: "그 이유는 무엇인가요? (Reason)",
                    description: "단순한 주장이 아닌, 타당한 인과관계를 제시해야 설득됩니다.",
                    component: <StepReason />,
                };
            case 3:
                return {
                    title: "구체적인 증거는? (Example)",
                    description: "데이터·사례·전문가 의견·개인 경험 중, 주장을 가장 설득력 있게 뒷받침하는 증거를 제시하세요.",
                    component: <StepExample />,
                };
            case 4:
                return {
                    title: "마무리 제안 (Point)",
                    description: "앞선 내용을 요약하고, 희망 학과(전공)에 기여할 점을 다시 한 번 강조하세요.",
                    component: <StepPointRe />,
                };
            case 5:
                return {
                    title: "AI 입학사정관의 피드백",
                    description: "당신의 답변을 냉철하게 분석했습니다. 아래 스크립트를 확인하세요.",
                    component: <FeedbackView />
                };
            default:
                return {
                    title: "",
                    description: "",
                    component: null
                };
        }
    };

    if (!mode) {
        return (
            <div className="min-h-screen relative pb-20 p-6">
                {/* <HomeButton /> */}

                <div className="max-w-6xl mx-auto px-6 pt-52">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight drop-shadow-sm flex items-center justify-center gap-4"
                        >
                            <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                                <Dumbbell className="w-10 h-10 text-white" />
                            </div>
                            <span><span className="text-emerald-600">PREP</span> 트레이닝</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600 mt-8 md:mt-10 max-w-3xl mx-auto break-keep leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-xl"
                        >
                            <span className="text-emerald-600 font-bold">PREP 트레이닝</span>은 <br />당신의 생각을 가장 논리적인 구조로 다듬어주는<br />실전 훈련 파트너입니다.<br className="hidden sm:block" />
                            <br />
                            <span className="text-emerald-600 font-bold">4단계 가이드</span>를 따라 <br />핵심 주장을, 타당한 근거, 생생한 사례를 연결하다 보면<br /> 어느새 설득력 있는 답변이 완성됩니다.
                        </motion.p>
                    </div>

                    {(() => {
                        const trainingInfo = store.getPracticeTierInfo('prep-training');
                        const IconComp = ThreeLeavesIcon;
                        return (
                            <SkillDashboard
                                title="PREP 트레이닝"
                                subtitle="PREP의 내공을 쌓아 더 탄탄한 논리력을 갖추세요!"
                                tierName={<span><span className="text-blue-600">PREP 트레이닝</span> 레벨</span>}
                                tierIndex={trainingInfo.tierIndex}
                                tierIconNode={React.createElement(IconComp, { className: "w-8 h-8 text-blue-500" })}
                                currentScore={trainingInfo.count}
                                scoreLabel="회"
                                remainingScore={trainingInfo.remaining}
                                progressPercent={trainingInfo.progress}
                                theme="blue"
                                href="#modes" // Just a dummy anchor if they're already on the page
                                actionLabel="아래에서 시작"
                            />
                        );
                    })()}

                    <div id="modes" className="max-w-4xl mx-auto text-center mb-8 mt-12">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold mb-2 border border-emerald-100">
                            TRAINING MODE
                        </span>
                    </div>

                    <ModeSelection
                        onSelect={(m) => setMode(m)}
                        title="어떤 상황을 연습하고 싶으신가요?"
                        theme="emerald"
                    />
                </div>
            </div>
        );
    }

    const stepInfo = getStepContent();

    return (
        <WizardLayout
            title={stepInfo.title}
            description={stepInfo.description}
            pageTitle={
                <span className="flex items-center justify-center gap-4">
                    <span className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                        <Dumbbell className="w-10 h-10 text-white" />
                    </span>
                    <span><span className="text-emerald-600">PREP</span> 트레이닝</span>
                </span>
            }
            pageDescription={
                <>
                    <span className="text-emerald-600 font-bold">PREP 트레이닝</span>은 <br />당신의 생각을 가장 논리적인 구조로 다듬어주는<br />실전 훈련 파트너입니다.<br className="hidden sm:block" />
                    <br />
                    <span className="text-emerald-600 font-bold">4단계 가이드</span>를 따라 <br />핵심 주장을, 타당한 근거, 생생한 사례를 연결하다 보면<br /> 어느새 설득력 있는 답변이 완성됩니다.
                </>
            }
            theme="emerald"
        >
            {stepInfo.component}
        </WizardLayout>
    );
}
