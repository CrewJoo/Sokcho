"use client";

import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPointDream } from "@/components/wizard/dream/step-point-dream";
import { StepReasonDream } from "@/components/wizard/dream/step-reason-dream";
import { StepExampleDream } from "@/components/wizard/dream/step-example-dream";
import { StepPointReDream } from "@/components/wizard/dream/step-point-re-dream";
import { FeedbackView } from "@/components/feedback/feedback-view";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function PrepDreamPage() {
    const { currentStep, reset } = usePrepStore();

    useEffect(() => {
        reset();
    }, [reset]);

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "결론부터 선언하세요 (Point)",
                    description: "당신의 꿈을 한 문장으로 압축하여 가장 먼저 제시하세요.",
                    component: <StepPointDream />,
                };
            case 2:
                return {
                    title: "꿈의 뿌리를 보여주세요 (Reason)",
                    description: "그 꿈을 갖게 된 진정성 있는 계기와 이유를 설명하세요.",
                    component: <StepReasonDream />,
                };
            case 3:
                return {
                    title: "실천으로 증명하세요 (Example)",
                    description: "꿈을 향한 구체적인 노력과 앞으로의 로드맵을 제시하세요.",
                    component: <StepExampleDream />,
                };
            case 4:
                return {
                    title: "꿈과 회사를 연결하세요 (Point)",
                    description: "나의 꿈이 이 회사에서 실현될 수 있음을 선언하며 마무리하세요.",
                    component: <StepPointReDream />,
                };
            case 5:
                return {
                    title: "AI 사정관의 피드백",
                    description: "당신의 Dream 답변을 냉철하게 분석했습니다.",
                    component: <FeedbackView />,
                };
            default:
                return {
                    title: "",
                    description: "",
                    component: null,
                };
        }
    };

    const stepInfo = getStepContent();

    return (
        <WizardLayout
            title={stepInfo.title}
            description={stepInfo.description}
            pageTitle={
                <>
                    <span className="text-purple-500">PREP</span>실전{" "}
                    <span className="text-slate-500 font-medium text-3xl sm:text-4xl">(Dream)</span>
                </>
            }
            pageDescription={
                <>
                    <span className="text-purple-500 font-bold">DREAM</span>은
                    <br />입학사정관이 가장 먼저 묻는 핵심 질문입니다.{" "}
                    <br />단순히 &apos;무엇이 되고 싶다&apos;를 넘어,{" "}
                    <br /><span className="text-purple-500 font-bold">어떤 가치를 왜 실현하고 싶은지</span>를 PREP 구조로 정리하면,{" "}
                    <br />진정성과 논리를 모두 갖춘 설득력 있는 답변이 완성됩니다.{" "}
                    <br /><br /><strong>Point(꿈 선언)</strong> → <strong>Reason(계기)</strong> → <strong>Example(실천과 계획)</strong> → <strong>Point(포부)</strong>
                    <br />의 4단계로 당신의 꿈 이야기를 완성해 보세요.
                </>
            }
            theme="purple"
        >
            {stepInfo.component}
        </WizardLayout>
    );
}
