"use client";

import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPointStand } from "@/components/wizard/stand/step-point-stand";
import { StepReasonStand } from "@/components/wizard/stand/step-reason-stand";
import { StepExampleStand } from "@/components/wizard/stand/step-example-stand";
import { StepPointReStand } from "@/components/wizard/stand/step-point-re-stand";
import { FeedbackView } from "@/components/feedback/feedback-view";
import { useEffect } from "react";

export default function PrepStandPage() {
    const { currentStep, reset } = usePrepStore();

    useEffect(() => {
        reset();
    }, [reset]);

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "나를 한 문장으로 차별화하세요 (Point)",
                    description: "스펙이 아닌 철학·관점·역량의 조합으로 오직 나만의 가치를 선언하세요.",
                    component: <StepPointStand />,
                };
            case 2:
                return {
                    title: "그 차별점은 어디서 왔나요? (Reason)",
                    description: "차별점을 만들어낸 구체적인 경험과 계기를 설명하세요.",
                    component: <StepReasonStand />,
                };
            case 3:
                return {
                    title: "행동으로 증명하세요 (Example)",
                    description: "그 차별점이 실제 결과로 이어진 구체적인 사례를 서술하세요.",
                    component: <StepExampleStand />,
                };
            case 4:
                return {
                    title: "차별점을 기여로 전환하세요 (Point)",
                    description: "나의 다름이 이 회사에서 어떤 실질적 기여로 이어질지를 선언하세요.",
                    component: <StepPointReStand />,
                };
            case 5:
                return {
                    title: "AI 사정관의 피드백",
                    description: "당신의 Stand 답변을 냉철하게 분석했습니다.",
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
                    <span className="text-rose-500">PREP</span>실전{" "}
                    <span className="text-slate-500 font-medium text-3xl sm:text-4xl">(Stand)</span>
                </>
            }
            pageDescription={
                <>
                    <span className="text-rose-500 font-bold">STAND</span>는
                    <br />입학사정관이 <strong>&apos;왜 당신이어야 하는가?&apos;</strong>를 묻는 핵심 질문입니다.{" "}
                    <br />스펙 나열이 아닌, <span className="text-rose-500 font-bold">나만의 철학/가치관</span>을 PREP 구조로 정리하면{" "}
                    <br /><strong>논리적이고 설득력 있는 스토리</strong>로 완성됩니다.{" "}
                    <br /><br /><strong>Point(가치관 선언)</strong> → <strong>Reason(배경/이유)</strong> → <strong>Example(행동/경험)</strong> → <strong>Point(성과/기여)</strong>의
                    <br />4단계로 나만이 가진 이유를 완성해 보세요.
                </>
            }
            theme="indigo"
        >
            {stepInfo.component}
        </WizardLayout>
    );
}
