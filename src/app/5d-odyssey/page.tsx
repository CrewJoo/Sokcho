"use client";

// import { HomeButton } from "@/components/common/home-button";
import { motion } from "framer-motion";
import { PromptExampleModal, PromptExampleType } from "@/components/prep/prompt-example-modal";
import { useState } from "react";
import { Compass } from "lucide-react";
import Link from "next/link";

export default function PrepPromptPage() {
    const [activeExample, setActiveExample] = useState<PromptExampleType | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 p-6">
            {/* <HomeButton /> */}

            <div className="max-w-6xl mx-auto px-6 pt-40">
                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight drop-shadow-sm flex items-center justify-center gap-4"
                    >
                        <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                            <Compass className="w-10 h-10 text-white" />
                        </div>
                        <span><span className="text-purple-500">5D-Say</span> 오디세이</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 mt-8 md:mt-10 max-w-3xl mx-auto break-keep leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-xl"
                    >
                        <span className="text-purple-500 font-bold">5D-Say(오디세이)</span>는 <br />입학사정관이 당신에게 던지는 5가지 핵심 질문의 키워드입니다.<br className="hidden sm:block" />
                        [<span className="text-purple-500 font-bold">Dream,  trenD, Difficulty, branD, Different]</span>
                        <br />
                        <br />5D를 각각 <span className="text-purple-500 font-bold">PREP 구조</span>로 정리해두면, <br />어떤 질문에도 흔들리지 않는 <span className="text-purple-500 font-bold">나만의 서사</span>가 완성됩니다.
                    </motion.p>
                </div>

                <div className="space-y-8">

                    {/* DREAM */}
                    <PromptCard
                        label="DREAM"
                        title="목표/목적"
                        description={<>단순히 '무엇이 되고 싶은가'를 넘어, <strong>'어떤 가치를 실현하고 싶은가'</strong>에 대한 근본적인 질문입니다. 지원자가 가진 장기적인 비전과 그 꿈을 이루기 위한 구체적인 로드맵을 통해, <strong>성장 가능성</strong>과 <strong>목표 지향적 태도</strong>를 평가합니다.</>}
                        prepTitle="PREP 활용방법"
                        prepDescription={<>막연한 꿈을 설득력 있는 비전으로 바꿉니다. <strong>Point(나의 꿈)</strong>를 명확히 정의하고, <strong>Reason(그 꿈을 갖게 된 계기)</strong>를 통해 진정성을 보여주며, <strong>Example(구체적인 노력과 계획)</strong>로 실현 가능성을 증명하여 입학사정관을 설득합니다.</>}
                        delay={0.2}
                        labelColor="text-purple-400"
                        prepBgColor="bg-purple-50/60"
                        onExampleClick={() => setActiveExample('DREAM')}
                        prepLink="/prep-dream"
                    />

                    {/* DIFFICULTY */}
                    <PromptCard
                        label="DIFFICULTY"
                        title="고난/극복/전환점"
                        description={<>인생에서 마주한 가장 큰 시련과 그것을 <strong>어떻게 극복했는지</strong>를 봅니다. 결과적인 성공보다는 <strong>문제 해결 과정</strong>에서의 태도와, 실패를 통해 무엇을 배우고 어떻게 성장했는지(Resilience)를 핵심적으로 파악합니다.</>}
                        prepTitle="PREP 활용방법"
                        prepDescription={<>고난을 전환점이 명확한 영웅적인 서사로 만듭니다. <strong>Point(겪었던 어려움)</strong>를 솔직하게 밝히고, <strong>Reason(그것이 왜 힘들었는지)</strong>를 통해 공감을 얻으며, <strong>Example(극복을 위한 구체적 행동)</strong>을 제시하여 문제 해결 능력을 강조합니다.</>}
                        delay={0.3}
                        labelColor="text-orange-500"
                        prepBgColor="bg-orange-50/60"
                        onExampleClick={() => setActiveExample('DIFFICULTY')}
                        prepLink="/prep-difficulty"
                        prepButtonColor="orange"
                    />

                    {/* TREND */}
                    <PromptCard
                        label="TREND"
                        title="통찰/관심"
                        description={<>지원 분야의 최신 트렌드와 이슈에 대해 얼마나 <strong>깊이 있게 이해하고 있는지</strong> 확인합니다. 단순한 뉴스 나열이 아니라, 변화의 흐름을 읽고 자신만의 <strong>관점(Insight)</strong>으로 해석할 수 있는 능력을 봅니다.</>}
                        prepTitle="PREP 활용방법"
                        prepDescription={<>정보를 나만의 통찰로 승화시킵니다. <strong>Point(주요 트렌드)</strong>를 제시하고, <strong>Reason(이 트렌드가 중요한 이유)</strong>를 분석하며, <strong>Example(적용 방안이나 예측)</strong>을 덧붙여 전문가적인 식견을 보여줍니다.</>}
                        delay={0.4}
                        labelColor="text-sky-500"
                        prepBgColor="bg-sky-50/60"
                        onExampleClick={() => setActiveExample('TREND')}
                        prepLink="/prep-trend"
                        prepButtonColor="sky"
                    />

                    {/* STAND */}
                    <PromptCard
                        label="STAND"
                        title="가치관/태도"
                        description={<>어떤 기준으로 의사결정을 내리고 행동하는지, 지원자의 <strong>확고한 신념</strong>을 봅니다. 직업 윤리, 협업 태도, 삶을 대하는 자세 등 <strong>인성적인 측면</strong>과 지원 대학/학과의 인재상 적합성을 판단하는 중요한 척도입니다.</>}
                        prepTitle="PREP 활용방법"
                        prepDescription={<>보이지 않는 신념을 보이게 만듭니다. <strong>Point(나의 핵심 가치)</strong>를 선언하고, <strong>Reason(왜 그 가치를 중시하는지)</strong> 설명하며, <strong>Example(가치관을 지켰던 경험)</strong>을 통해 신뢰감을 형성합니다.</>}
                        delay={0.5}
                        labelColor="text-rose-500"
                        prepBgColor="bg-rose-50/60"
                        onExampleClick={() => setActiveExample('STAND')}
                        prepLink="/prep-stand"
                        prepButtonColor="rose"
                    />

                    {/* DIFFERENT */}
                    <PromptCard
                        label="DIFFERENT"
                        title="차별성/무기"
                        description={<>남들과 다른 <strong>자신만의 고유한 강점</strong>은 무엇인지 묻습니다. 단순한 성적보다는, 자신만의 <strong>독창적인 경험</strong>이나 <strong>관점</strong>이 어떻게 공동체에 기여할 수 있는지를 봅니다. '대체 불가능한 인재'임을 증명해야 합니다.</>}
                        prepTitle="PREP 활용방법"
                        prepDescription={<>나만의 무기를 날카롭게 다듬습니다. <strong>Point(차별화된 강점)</strong>를 한 문장 요약하고, <strong>Reason(이 강점이 필요한 이유)</strong>를 대학/학과의 니즈와 연결하며, <strong>Example(강점이 발휘된 성과)</strong>로 결정적인 한 방을 날립니다.</>}
                        delay={0.6}
                        labelColor="text-teal-500"
                        prepBgColor="bg-teal-50/60"
                        onExampleClick={() => setActiveExample('DIFFERENT')}
                        prepLink="/prep-different"
                        prepButtonColor="teal"
                    />

                </div>
            </div>

            {activeExample && (
                <PromptExampleModal
                    isOpen={!!activeExample}
                    type={activeExample}
                    onClose={() => setActiveExample(null)}
                />
            )}
        </div>
    );
}

function PromptCard({
    label, title, description, prepTitle, prepDescription, delay, labelColor = "text-blue-600", titleColor = "text-slate-800", prepBgColor = "bg-slate-50/50", onExampleClick, prepLink, prepButtonColor = "purple"
}: {
    label: string, title: string, description: string | React.ReactNode, prepTitle: string, prepDescription: string | React.ReactNode, delay: number, labelColor?: string, titleColor?: string, prepBgColor?: string, onExampleClick?: () => void, prepLink?: string, prepButtonColor?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden"
        >
            {/* Left Col: Concept */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100">
                <div className={`text-sm font-black tracking-widest mb-2 ${labelColor}`}>{label}</div>
                <h3 className={`text-2xl font-black mb-4 ${titleColor}`}>{title}</h3>
                <div className="text-slate-600 leading-relaxed text-lg break-keep">
                    {description}
                </div>
            </div>

            {/* Right Col: PREP Application */}
            <div className={`p-8 ${prepBgColor}`}>
                <div className="text-sm font-black tracking-widest text-slate-400 mb-2">{prepTitle}</div>
                <div className="text-slate-700 leading-relaxed text-lg break-keep mb-6">
                    {prepDescription}
                </div>
                <div className="flex justify-end gap-2">
                    {onExampleClick && (
                        <button
                            onClick={onExampleClick}
                            className="px-5 py-2 rounded-full border-2 border-slate-200 text-slate-500 font-bold hover:border-trust-navy hover:text-trust-navy hover:bg-slate-50 transition-all text-sm"
                        >
                            예시
                        </button>
                    )}
                    {prepLink && (
                        <Link
                            href={prepLink}
                            className={`px-5 py-2 rounded-full border-2 font-bold transition-all text-sm
                                ${prepButtonColor === 'orange' ? 'border-orange-300 text-orange-500 hover:border-orange-600 hover:text-orange-700 hover:bg-orange-50'
                                    : prepButtonColor === 'sky' ? 'border-sky-300 text-sky-500 hover:border-sky-600 hover:text-sky-700 hover:bg-sky-50'
                                        : prepButtonColor === 'rose' ? 'border-rose-300 text-rose-500 hover:border-rose-600 hover:text-rose-700 hover:bg-rose-50'
                                            : prepButtonColor === 'teal' ? 'border-teal-300 text-teal-500 hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50'
                                                : 'border-purple-300 text-purple-500 hover:border-purple-600 hover:text-purple-700 hover:bg-purple-50'
                                }`}
                        >
                            PREP실전
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
