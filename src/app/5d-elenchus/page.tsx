"use client";

import { useElenchusStore } from "@/lib/elenchus-store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { ElenchusSelection } from "@/components/elenchus/elenchus-selection";
import { ElenchusStep } from "@/components/elenchus/elenchus-step";
import { ElenchusResult } from "@/components/elenchus/elenchus-result";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Landmark } from "lucide-react";

export default function ElenchusPage() {
    const { currentStep, reset, category } = useElenchusStore();

    useEffect(() => {
        reset();
    }, [reset]);

    // Selection Mode
    if (currentStep === 0) {
        return (
            <div className="min-h-screen bg-slate-50 relative pb-20 p-6">
                <div className="max-w-6xl mx-auto px-6 pt-40">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight flex items-center justify-center gap-4"
                        >
                            <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                                <Landmark className="w-10 h-10 text-white" />
                            </div>
                            <span><span className="text-purple-600">5D-Say</span> 산파술</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-600 max-w-3xl mx-auto break-keep leading-relaxed"
                        >
                            "<span className="font-bold text-purple-600">너 자신을 알라.</span>"<br className="hidden sm:block" />
                            <br /><span className="font-bold text-purple-600">AI 소크라테스</span>와의 끝장 토론(Elenchus)을 통해<br className="hidden sm:block" />
                            당신조차 몰랐던 당신의 <span className="font-bold text-purple-600">핵심 역량(5D)</span>을 발견하세요.
                        </motion.p>
                    </div>

                    <ElenchusSelection />
                </div>
            </div>
        );
    }

    // Wizard Mode
    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "Step 1: 정의 (Definition)",
                    description: "당신의 생각을 있는 그대로 솔직하게 이야기해주세요.",
                    component: <ElenchusStep />
                };
            case 2:
                return {
                    title: "Step 2: 반박 (Elenchus)",
                    description: "소크라테스가 당신의 생각에 숨겨진 모순을 파고듭니다.",
                    component: <ElenchusStep />
                };
            case 3:
                return {
                    title: "Step 3: 산파술 (Maieutics)",
                    description: "혼란 속에서 새로운 진리가 태어나는 순간입니다.",
                    component: <ElenchusStep />
                };
            case 4:
                return {
                    title: "Step 4: 통합 (Synthesis)",
                    description: "발견한 진리를 하나의 문장으로 정리해보세요.",
                    component: <ElenchusStep />
                };
            case 5:
                return {
                    title: "발견 완료 (Discovery)",
                    description: "치열한 문답 끝에 탄생한 당신만의 5D입니다.",
                    component: <ElenchusResult />
                };
            default:
                return { title: "", description: "", component: null };
        }
    };

    const content = getStepContent();

    return (
        <WizardLayout
            title={content.title}
            description={content.description}
            pageTitle={
                <div className="flex items-center justify-center gap-4">
                    <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                        <Landmark className="w-8 h-8 text-white" />
                    </div>
                    <span><span className="text-purple-600">5D-Say</span> 산파술</span>
                </div>
            }
            pageDescription={<>
                소크라테스와의 문답법을 통해<br className="hidden sm:block" />
                나의 <span className="font-bold text-purple-600">{category}</span>에 대한 본질적인 답을 찾아갑니다.
            </>}
        >
            {content.component}
        </WizardLayout>
    );
}
