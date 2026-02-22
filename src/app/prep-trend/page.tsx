"use client";

import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPointTrend } from "@/components/wizard/trend/step-point-trend";
import { StepReasonTrend } from "@/components/wizard/trend/step-reason-trend";
import { StepExampleTrend } from "@/components/wizard/trend/step-example-trend";
import { StepPointReTrend } from "@/components/wizard/trend/step-point-re-trend";
import { FeedbackView } from "@/components/feedback/feedback-view";
import { useEffect } from "react";

export default function PrepTrendPage() {
    const { currentStep, reset } = usePrepStore();

    useEffect(() => {
        reset();
    }, [reset]);

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "트렌드를 한 문장 관점으로 선언하세요 (Point)",
                    description: "나열이 아닌, 이 트렌드가 이 산업/회사에 어떤 의미인지를 먼저 제시하세요.",
                    component: <StepPointTrend />,
                };
            case 2:
                return {
                    title: "왜 이 트렌드가 중요한가요? (Reason)",
                    description: "데이터, 보고서, 시장 변화를 근거로 트렌드의 중요성을 분석하세요.",
                    component: <StepReasonTrend />,
                };
            case 3:
                return {
                    title: "실제 사례로 증명하세요 (Example)",
                    description: "이 트렌드를 선도한 기업 사례와 귀사 적용 방안을 구체적으로 제시하세요.",
                    component: <StepExampleTrend />,
                };
            case 4:
                return {
                    title: "관찰자에서 실행자로 (Point)",
                    description: "트렌드를 아는 것에서 나아가, 내가 이 회사에서 어떻게 실현할지를 선언하세요.",
                    component: <StepPointReTrend />,
                };
            case 5:
                return {
                    title: "AI 사정관의 피드백",
                    description: "당신의 Trend 답변을 냉철하게 분석했습니다.",
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
                    <span className="text-sky-500">PREP</span>실전{" "}
                    <span className="text-slate-500 font-medium text-3xl sm:text-4xl">(Trend)</span>
                </>
            }
            pageDescription={
                <>
                    <span className="text-sky-500 font-bold">TREND</span>는
                    <br />입학사정관이 당신의{" "}
                    <strong>산업 이해력과 미래 감각</strong>을 검증하는 질문입니다.{" "}
                    <br />단순히 트렌드를 나열하는 것이 아니라,
                    <br /><span className="text-sky-500 font-bold">세상변화에 대한 관점</span>을 PREP 구조로 정리하면{" "}
                    <br />트렌드를 <strong>자신만의 관점(Insight)으로 해석하는 전문가</strong>로 보입니다.{" "}
                    <br /><br /><strong>Point(트렌드 선언)</strong> → <strong>Reason(중요성 분석)</strong> → <strong>Example(사례·적용)</strong> → <strong>Point(실행 포부)</strong>
                    <br />의 4단계로 나만의 트렌드 분석을 완성해 보세요.
                </>
            }
            theme="indigo"
        >
            {stepInfo.component}
        </WizardLayout>
    );
}
