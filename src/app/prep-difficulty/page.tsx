"use client";

import { usePrepStore } from "@/lib/store";
import { WizardLayout } from "@/components/wizard/wizard-layout";
import { StepPointDifficulty } from "@/components/wizard/difficulty/step-point-difficulty";
import { StepReasonDifficulty } from "@/components/wizard/difficulty/step-reason-difficulty";
import { StepExampleDifficulty } from "@/components/wizard/difficulty/step-example-difficulty";
import { StepPointReDifficulty } from "@/components/wizard/difficulty/step-point-re-difficulty";
import { FeedbackView } from "@/components/feedback/feedback-view";
import { useEffect } from "react";

export default function PrepDifficultyPage() {
    const { currentStep, reset } = usePrepStore();

    useEffect(() => {
        reset();
    }, [reset]);

    const getStepContent = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "고난을 한 문장으로 선언하세요 (Point)",
                    description: "겪었던 어려움과 그것이 남긴 성장을 압축하여 먼저 제시하세요.",
                    component: <StepPointDifficulty />,
                };
            case 2:
                return {
                    title: "왜 그것이 힘들었나요? (Reason)",
                    description: "당시의 상황과 압박감을 구체적으로 설명하여 공감을 이끌어 내세요.",
                    component: <StepReasonDifficulty />,
                };
            case 3:
                return {
                    title: "어떻게 극복했나요? (Example)",
                    description: "구체적인 행동, 결과, 그리고 교훈을 순서대로 서술하세요.",
                    component: <StepExampleDifficulty />,
                };
            case 4:
                return {
                    title: "성장을 전공에 연결하세요 (Point)",
                    description: "이 경험으로 얻은 역량이 이 회사에서 어떻게 발휘될지 선언하며 마무리하세요.",
                    component: <StepPointReDifficulty />,
                };
            case 5:
                return {
                    title: "AI 사정관의 피드백",
                    description: "당신의 Difficulty 답변을 냉철하게 분석했습니다.",
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
                    <span className="text-orange-500">PREP</span>실전{" "}
                    <span className="text-slate-500 font-medium text-3xl sm:text-4xl">(Difficulty)</span>
                </>
            }
            pageDescription={
                <>
                    <span className="text-orange-500 font-bold">DIFFICULTY</span>는
                    <br />입학사정관이 당신의{" "}
                    <strong>문제 해결력과 회복 탄력성</strong>을 가늠하는 질문입니다.{" "}
                    <br />단순히 &apos;힘들었다&apos;에서 끝내지 말고, <span className="text-orange-500 font-bold">전환점</span>을 PREP 구조로 정리하면,{" "}
                    <br />고난이 <strong>설득력 있는 성장 서사</strong>로 바뀝니다.{" "}
                    <br /><br /><strong>Point(고난 선언)</strong> → <strong>Reason(왜 힘들었는지)</strong> → <strong>Example(극복 행동·결과·교훈)</strong> → <strong>Point(전공 연결)</strong>
                    <br />의 4단계로 나만의 영웅 서사를 완성해 보세요.
                </>
            }
            theme="indigo"
        >
            {stepInfo.component}
        </WizardLayout>
    );
}
