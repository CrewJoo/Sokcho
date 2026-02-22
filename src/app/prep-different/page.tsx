"use client";

import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPointDifferent } from "@/components/wizard/different/step-point-different";
import { StepReasonDifferent } from "@/components/wizard/different/step-reason-different";
import { StepExampleDifferent } from "@/components/wizard/different/step-example-different";
import { StepPointReDifferent } from "@/components/wizard/different/step-point-re-different";
import { FeedbackView } from "@/components/feedback/feedback-view";
import { useEffect } from "react";

export default function PrepDifferentPage() {
    const { currentStep, reset } = usePrepStore();

    useEffect(() => {
        reset();
    }, [reset]);

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "나의 독특한 조합을 선언하세요 (Point)",
                    description: "두 가지 이상의 역량이 결합된 나만의 유일한 가치를 먼저 제시하세요.",
                    component: <StepPointDifferent />,
                };
            case 2:
                return {
                    title: "그 조합은 왜 만들어졌나요? (Reason)",
                    description: "역량 조합을 이끌어낸 문제의식과 계기를 설명하세요.",
                    component: <StepReasonDifferent />,
                };
            case 3:
                return {
                    title: "조합의 힘을 증명하세요 (Example)",
                    description: "두 역량을 동시에 활용해 만들어낸 유일한 결과를 서술하세요.",
                    component: <StepExampleDifferent />,
                };
            case 4:
                return {
                    title: "다름을 조직 기여로 전환하세요 (Point)",
                    description: "나의 독특함이 이 조직의 어떤 문제를 해결하는지를 선언하세요.",
                    component: <StepPointReDifferent />,
                };
            case 5:
                return {
                    title: "AI 사정관의 피드백",
                    description: "당신의 Different 답변을 냉철하게 분석했습니다.",
                    component: <FeedbackView />,
                };
            default:
                return { title: "", description: "", component: null };
        }
    };

    const stepInfo = getStepContent();

    return (
        <WizardLayout
            title={stepInfo.title}
            description={stepInfo.description}
            pageTitle={
                <>
                    <span className="text-teal-500">PREP</span>실전{" "}
                    <span className="text-slate-500 font-medium text-3xl sm:text-4xl">(Different)</span>
                </>
            }
            pageDescription={
                <>
                    <span className="text-teal-500 font-bold">DIFFERENT</span>는
                    <br />입학사정관이{" "}<strong>경쟁자들과 다른 점</strong>을 직접 증명하라는 요구입니다.{" "}
                    <br />단순히 <span className="text-teal-500 font-bold">&apos;나음&apos;이 아닌, &apos;다름&apos;의 가치</span>를 PREP 구조로 정리하면{" "}
                    <br />작은 차이를 <strong>대체 불가능한 가치</strong>로 만들 수 있습니다.{" "}
                    <br /><br /><strong>Point(나의 다름)</strong> → <strong>Reason(계기와 이유)</strong> → <strong>Example(행동·실천)</strong> → <strong>Point(성과·기여)</strong>
                    <br />의 4단계로 나만이 가진 다름을 완성해 보세요.
                </>
            }
            theme="emerald"
        >
            {stepInfo.component}
        </WizardLayout>
    );
}
