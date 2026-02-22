"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvestmentGameStore, ChecklistItem, Stage } from "@/store/use-investment-game-store";
import { Check, AlertCircle, Stamp, Trophy, Loader2, RotateCcw, Sparkles, Bot, XCircle, ChevronDown, ChevronUp, Copy } from "lucide-react";
import confetti from "canvas-confetti";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";

const prepSchema = z.object({
    point1: z.string(),
    reason: z.string(),
    example: z.string(),
    point2: z.string(),
    advice: z.string(),
    evaluation: z.object({
        is_point_first: z.boolean(),
        is_relevant: z.boolean(),
        no_abstract_adjectives: z.boolean(),
        is_logical_why: z.boolean(),
        is_structured_reason: z.boolean(),
        has_differentiation: z.boolean(),
        has_data_evidence: z.boolean(),
        has_action_verbs: z.boolean(),
        has_vision_connection: z.boolean(),
    }).optional(),
});

// Mapping checklist IDs to evaluation keys
const evaluationMap: Record<string, keyof NonNullable<z.infer<typeof prepSchema>['evaluation']>> = {
    '1-1': 'is_point_first',
    '1-4': 'is_relevant',
    '1-3': 'no_abstract_adjectives',
    '2-1': 'is_logical_why',
    '2-3': 'is_structured_reason',
    '2-2': 'has_differentiation',
    '3-1': 'has_data_evidence',
    '3-2': 'has_action_verbs',
    '1-5': 'has_vision_connection',
};

export default function InvestmentGamePage() {
    const { script, setScript, checklist, toggleCheck, setChecked, currentStage, stampsEarned, showStampAnimation, resetGame, selectedQuestion, setSelectedQuestion } = useInvestmentGameStore();
    const [mounted, setMounted] = useState(false);

    const [showImproved, setShowImproved] = useState(false);
    const [showChecklistResult, setShowChecklistResult] = useState(false);
    const [isCustomQuestion, setIsCustomQuestion] = useState(false);

    const QUESTIONS = [
        "1분 자기소개",
        "지원동기 (학과/전공)",
        "입학 후 학업 계획",
        "전공 관련 탐구 경험 (성공/실패)",
        "최근에 가장 열정적으로 몰입했던 학업 활동",
        "당신의 가슴을 뛰게 하는 진로 비전",
        "관심 있는 전공 분야의 트렌드",
        "절대 타협할 수 없는 당신만의 학업 원칙",
        "남들과 다른 나만의 차별화된 강점",
        "기타 직접 입력"
    ];

    const QUESTION_EXAMPLES: Record<string, string> = {
        "1분 자기소개":
            `[예시 - PREP 구조]
▶ Point(결론): 저는 복잡한 데이터 속에서 가치를 발견하여 사회 문제를 해결하는 '데이터 과학자'가 되고 싶습니다. 
▶ Reason(이유): 첫째, 교내 탐구 활동에서 1,000건 이상의 환경 데이터를 분석해 우리 지역 쓰레기 배출량 감소 방안을 제시한 경험이 있고, 둘째, 수학과 코딩을 결합해 실생활 문제를 해결하는 데 흥미가 있기 때문입니다.
▶ Example(사례): 실제로 2학년 과학 탐구 프로젝트 당시, 주간 급식 잔반 데이터를 분석해 특정 메뉴에서 잔반이 15% 이상 발생하는 것을 발견했습니다. 이를 해결하기 위해 선호도 설문을 진행하고 영양사 선생님께 건의한 결과, 2주 만에 잔반량을 25% 줄인 경험이 있습니다.
▶ Point(상기): 이러한 분석적 사고와 실행력을 바탕으로, 귀 학과에서 더욱 깊이 있는 연구를 주도하는 융합형 인재로 성장하겠습니다.`,
        "지원동기 (학과/전공)":
            `[예시 - PREP 구조]
▶ Point: 귀 학과가 추구하는 '융복합형 인재 양성'의 가치가 제가 그동안 교내에서 실천해 온 문제해결 방식과 가장 부합하여 지원했습니다.
▶ Reason: 저는 항상 학문 간의 경계를 넘어 새로운 가치를 창출해야 한다고 믿어왔으며, 귀 학과의 커리큘럼이 이를 실현할 최적의 장소라고 확신하기 때문입니다.
▶ Example: 대학교 진학을 앞두고, 시각장애인을 위한 점자 도서 부족 문제를 해결하기 위해 동아리원들과 점자 변환 프로그램을 기획한 적이 있습니다. 코딩 기술에 국어 점자 규정을 접목하여 정확도를 높였고, 교내 발명 대회에서 수상의 기쁨도 누렸습니다.
▶ Point: 귀 학과의 일원이 되어 다양한 학문을 아우르며 사회에 실질적으로 공헌하는 연구자로 성장하고 싶습니다.`,
        "입학 후 학업 계획":
            `[예시 - PREP 구조]
▶ Point: 입학 후 1학년 때부터 전공 기초를 탄탄히 다지며, 2학년부터는 학부 연구생으로 참여해 '인공지능 모델 최적화' 분야의 전문성을 깊이 키우겠습니다.
▶ Reason: 대학 생활의 핵심은 이론적 지식을 실제 연구 환경에 적용해 보며 자신만의 학문적 깊이를 더해가는 것이라 생각하기 때문입니다.
▶ Example: 고등학교 정보 교과에서 파이썬 기초를 배운 후, 자율 동아리를 만들어 간단한 날씨 예측 모델을 구현해 본 경험이 있습니다. 코드를 분석하고 오류를 수정하며 며칠 밤을 새웠지만, 작동하는 모델을 완성했을 때의 희열은 제 진로를 확고하게 해주었습니다.
▶ Point: 이러한 학문적 호기심과 끈기를 바탕으로, 입학 후에도 멈추지 않고 연구 역량을 고도화해 나가는 학생이 되겠습니다.`,
        "전공 관련 탐구 경험 (성공/실패)":
            `[예시 - PREP 구조]
▶ Point: 교내 과학 실험 대회 당시, 예상치 못한 변인 통제 실패 상황을 침착하게 원인 분석으로 연결하여 훌륭한 탐구 보고서를 작성한 경험이 있습니다.
▶ Reason: 실패 자체보다 중요한 것은 그 원인을 객관적으로 분석하고 다음 단계의 발전 요소로 삼는 학문적 태도라고 판단했기 때문입니다.
▶ Example: 대회 3일을 앞두고 실험 데이터가 가설과 전혀 다르게 나오는 문제가 발생했습니다. 당황하지 않고 조원들과 함께 실험 과정을 처음부터 역추적하며 습도 조건이 통제되지 않았음을 발견했습니다. 이 과정을 오히려 '외부 환경이 실험 결과에 미치는 영향'이라는 주제로 심화 보고서에 담아 제출했고, 결국 우수상을 받을 수 있었습니다.
▶ Point: 이 경험을 통해 배운 위기 대처 능력과 객관적인 분석력을 진학 후의 심화 연구에서도 유감없이 발휘하겠습니다.`,
        "최근에 가장 열정적으로 몰입했던 학업 활동":
            `[예시 - PREP 구조]
▶ Point: 최근 3개월 동안 매주 2시간씩 교내 '지역사회 문제 해결 프로젝트'에 참여하며 실생활의 불편을 개선하는 데 몰입했습니다.
▶ Reason: 단순히 교과 지식을 암기하는 것을 넘어, 배운 내용을 실제로 적용해 우리 주변을 변화시키는 경험이 저의 심장을 뛰게 했기 때문입니다.
▶ Example: 처음에는 학교 주변 쓰레기 무단 투기 실태를 조사하는 것부터 시작했습니다. 이후 지리 정보 시스템(GIS)을 활용해 최적의 쓰레기통 설치 위치를 도출하고, 이를 구청에 제안하는 보고서까지 작성했습니다. 이 과정에서 친구들과 5번의 수정 회의를 거쳐 최종안을 완성했을 때 가장 큰 성취감을 느꼈습니다.
▶ Point: 입학 후에도 전공 지식을 실천적 탐구 활동으로 확장하며, 배움을 사회에 환원하는 인재로 성장하겠습니다.`,
        "당신의 가슴을 뛰게 하는 진로 비전":
            `[예시 - PREP 구조]
▶ Point: 저의 비전은 '지속 가능한 에너지를 개발하여 환경 문제와 자원 불평등을 동시에 해결하는 공학자'가 되는 것입니다.
▶ Reason: 올바른 기술적 진보가 환경을 보호하고, 나아가 누구나 에너지를 평등하게 누릴 수 있는 기반을 만든다고 믿기 때문입니다.
▶ Example: 교내 환경 포럼에서 기후 변화로 인해 개발도상국이 겪는 에너지 위기에 대해 발표하며, 적정 기술의 필요성을 절감했습니다. 이후 태양광 패널의 효율을 높이는 화학적 원리에 대해 자율 탐구를 진행하며, 6개월간의 끈질긴 문헌 조사 끝에 제 관심 분야를 신재생 에너지로 구체화할 수 있었습니다.
▶ Point: 이러한 비전을 실현하기 위해 귀 학과에서 더욱 전문적이고 심도 있는 공학 지식을 쌓아 사회적 책임을 다하는 연구자로 거듭나겠습니다.`,
        "관심 있는 전공 분야의 트렌드":
            `[예시 - PREP 구조]
▶ Point: 저는 최근 바이오 의약품 연구에서 인공지능이 후보 물질 탐색을 주도하는 'AI 신약 개발' 트렌드에 깊은 관심을 가지고 있습니다.
▶ Reason: AI가 단순히 처리 장치에 머물지 않고 연구의 효율을 극대화하여 난치병 정복의 패러다임을 바꿀 핵심 동력이기 때문입니다.
▶ Example: 실제로 생명과학 동아리 활동 중, 기존 방식으로는 수년이 걸리는 단백질 구조 예측을 AI 알파폴드가 며칠 만에 해내는 것을 논문으로 접하며 큰 충격을 받았습니다. 이제는 생명 현상의 이해를 넘어 AI 데이터를 어떻게 생명공학 연구에 접목할지에 대한 융합적 사고가 필요한 시점이라고 생각합니다.
▶ Point: 귀 학과에 진학하여 이러한 최신 데이터 과학 트렌드를 생명공학 연구에 접목하는 혁신적인 능력을 기르고 싶습니다.`,
        "절대 타협할 수 없는 당신만의 학업 원칙":
            `[예시 - PREP 구조]
▶ Point: 저의 무기이자 원칙은 '시간이 걸리더라도 원리를 완전히 이해할 때까지 파고드는 집요함'입니다.
▶ Reason: 표면적인 결과 도출보다 근본적인 원리 파악이 새로운 문제 상황에 부딪혔을 때 응용력을 발휘할 수 있는 진정한 기초가 된다는 것을 잘 알기 때문입니다.
▶ Example: 수학 심화 문제 해결 과정에서 단순히 공식을 암기해 푸는 것보다, 그 공식이 도출된 증명 과정을 백지에 스스로 완벽하게 서술할 때까지 반복했습니다. 처음에는 진도가 느려 불안했지만, 이러한 방식 덕분에 모의고사에서 신유형 응용 문제가 출제되었을 때 흔들림 없이 접근할 수 있었고 만점을 받았습니다.
▶ Point: 귀 학과의 심화 학업 과정에서도 이러한 집요함이라는 원칙을 바탕으로 깊이 있는 진리를 탐구해 나가겠습니다.`,
        "남들과 다른 나만의 차별화된 강점":
            `[예시 - PREP 구조]
▶ Point: 저만의 차별화된 강점은 서로 다른 의견을 존중하며 합의점을 찾아내는 '통합적 리더십'입니다.
▶ Example: 2학년 때 학급 반장으로서 체육대회 종목 선정 과정을 이끌었습니다. 운동을 좋아하는 친구들과 다치는 것을 우려하는 친구들의 의견이 팽팽하게 맞섰을 때, 저는 양측의 입장을 모두 경청한 뒤 누구나 참여할 수 있는 반 대항 응원전과 전략 스포츠를 함께 제안했습니다. 결과적으로 모두가 소외되지 않고 참여하여 종합 우승이라는 성과를 이룰 수 있었습니다.
▶ Point: 이러한 통합적 리더십과 소통 능력을 바탕으로, 대학 진학 후에도 다양한 배경의 학우들과 시너지를 내는 협업의 중심축이 되겠습니다.`,
    };

    const scriptPlaceholder = (selectedQuestion && QUESTION_EXAMPLES[selectedQuestion])
        ? QUESTION_EXAMPLES[selectedQuestion]
        : `이곳에 답변을 입력하세요. (30초 분량, 500자 내외 추천)\n예: 위기를 기회로 바꾸는 지원자 OOO입니다...`;

    useEffect(() => {
        setMounted(true);
        if (selectedQuestion && !QUESTIONS.includes(selectedQuestion) && selectedQuestion !== "직접 입력") {
            setIsCustomQuestion(true);
        }
    }, []);

    const { object, submit, isLoading, error } = useObject({
        api: "/api/transform",
        schema: prepSchema,
    });

    const handleReset = () => {
        if (confirm('모든 진행 상황을 초기화하시겠습니까?')) {
            resetGame();
            setShowChecklistResult(false);
            setIsCustomQuestion(false);
        }
    };

    // ... (sound/confetti effects)
    useEffect(() => {
        if (currentStage === 'Hired') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ef4444', '#22c55e', '#eab308']
            });
        }
    }, [currentStage]);

    if (!mounted) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

    const paperIds = ['1-1', '1-4', '1-3'];
    const interviewIds = ['2-1', '2-3', '2-2'];
    const finalIds = ['3-1', '3-2', '1-5'];

    const isLocked = (targetStage: Stage) => {
        const stages = ['Paper', 'Interview', 'Final', 'Hired'];
        return stages.indexOf(currentStage) < stages.indexOf(targetStage);
    };

    const handleToggleCheck = (id: string) => {
        toggleCheck(id);
    };

    const handleAIAnalysis = () => {
        if (!script || script.trim().length < 20) {
            alert("스크립트 내용을 먼저 작성해주세요! (최소 20자 이상)");
            return;
        }
        if (!selectedQuestion || selectedQuestion.trim() === "") {
            alert("면접 질문을 선택하거나 입력해주세요!");
            return;
        }

        setShowChecklistResult(false);
        setShowImproved(false);

        submit({ input: script, question: selectedQuestion });
    };

    const handleChecklistVerification = () => {
        if (!object?.evaluation) return;

        const passedIds: string[] = [];
        Object.entries(evaluationMap).forEach(([id, key]) => {
            if (object.evaluation && object.evaluation[key as keyof typeof object.evaluation]) {
                passedIds.push(id);
            }
        });

        if (passedIds.length > 0) {
            setChecked(passedIds, true);
        }
        setShowChecklistResult(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 px-4 sm:px-8 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative z-0">
            {/* Main Header */}
            <div className="max-w-6xl mx-auto mb-16 text-center pt-52">
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 relative">
                    <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg relative z-10 transform hover:scale-110 transition-transform duration-300">
                        <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <span className="relative z-10 drop-shadow-sm"><span className="text-blue-600">PREP</span> <span className="text-slate-900">AI 최종분석</span></span>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-200/20 blur-[100px] rounded-full pointer-events-none -z-0" />
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                    "<span className="text-blue-600 font-bold">스크립트 검증 및 완성</span>(Validation)"<br />
                    <br />작성된 답변 스크립트 뭉치를 넣으면, <br /><span className="text-blue-600 font-bold">깐깐한 체크리스트</span>를 통해<br />
                    면접장용 <span className="text-blue-600 font-bold">최종 PREP 답변</span>으로 가공하고 합격(HIRED)을 판정합니다.
                </p>
            </div>

            {/* Instruction Card */}
            <div className="max-w-7xl mx-auto mb-8 bg-white border border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-rose-400 to-indigo-500 group-hover:w-3 transition-all" />
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pl-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 mb-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-black text-lg">M</span>
                            사용설명서

                        </h2>
                        <ul className="space-y-2 text-slate-600 text-sm sm:text-base font-medium">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-700" />
                                <span>드롭다운 화살표를 눌러<strong>분석할 내용</strong>을 선택하세요.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-700" />
                                <span>면접 스크립트 입력창에 <strong>나의 의견 또는 생각</strong>을 입력하세요.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-700" />
                                <span><strong>AI 쓴소리 듣기</strong> 버튼을 눌러 입학사정관의 냉철한 피드백을 받으세요.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-700" />
                                <span>우측 <strong>분석시작</strong> 버튼을 눌러 AI 최종분석을 받아보세요.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-700" />
                                <span><strong>최종 합격(HIRED)</strong> 도장을 받을 때까지 반복 도전하세요!</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-16rem)] min-h-[800px]">

                {/* Left Panel: Script Editor */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 p-8 flex flex-col relative overflow-hidden h-full">

                    {/* Question Selector (Moved Up) */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                <span className="text-blue-600">면접 질문 선택</span>
                            </h2>
                        </div>
                        <div className="relative">
                            {!isCustomQuestion ? (
                                <div className="relative">
                                    <select
                                        value={selectedQuestion}
                                        onChange={(e) => {
                                            if (e.target.value === "직접 입력") {
                                                setIsCustomQuestion(true);
                                                setSelectedQuestion("");
                                            } else {
                                                setSelectedQuestion(e.target.value);
                                            }
                                        }}
                                        className="w-full p-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                    >
                                        {QUESTIONS.map((q) => (
                                            <option key={q} value={q}>{q}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            ) : (
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={selectedQuestion}
                                        onChange={(e) => setSelectedQuestion(e.target.value)}
                                        placeholder="질문을 직접 입력하세요 (예: 본인의 실패 경험을 말해주세요)"
                                        className="w-full p-4 bg-white border-2 border-indigo-100 rounded-xl font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-indigo-300"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => {
                                            setIsCustomQuestion(false);
                                            setSelectedQuestion(QUESTIONS[0]!);
                                        }}
                                        className="p-4 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors"
                                        title="목록으로 돌아가기"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Header with Buttons (Challenge Script) */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                <span className="text-blue-600">면접/답변 스크립트</span>
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleAIAnalysis}
                                disabled={isLoading || script.length < 20}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-lg ${isLoading
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95'
                                    }`}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                                {isLoading ? '분석 중...' : 'AI 쓴소리 듣기'}
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-100 transition-all shadow-sm"
                                title="초기화"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex align-top h-[30%] min-h-[180px] mb-6 relative group">
                        <textarea
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder={scriptPlaceholder}
                            className="w-full h-full p-6 text-lg leading-relaxed resize-none focus:outline-none focus:ring-4 focus:ring-indigo-100/50 bg-slate-50/50 rounded-2xl border-2 border-slate-100 focus:bg-white focus:border-indigo-200 transition-all font-medium text-slate-700 placeholder:text-slate-400/70 caret-indigo-600 shadow-inner"
                            spellCheck={false}
                        />
                        <div className="absolute bottom-4 right-6 pointer-events-none px-3 py-1 bg-white/80 backdrop-blur rounded-full text-xs font-bold text-slate-400 border border-slate-100 shadow-sm">
                            {script.length}자
                        </div>
                    </div>

                    {/* AI Analysis Result Sections */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        <AnimatePresence>
                            {(object?.advice || error) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    {/* 1. Bitter Feedback (Advice) */}
                                    <div className={`p-6 rounded-2xl border-2 shadow-sm ${error || object?.evaluation?.is_relevant === false ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-xl shrink-0 ${error || object?.evaluation?.is_relevant === false ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                {error || object?.evaluation?.is_relevant === false ? <XCircle className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg mb-3 text-slate-800 flex items-center gap-2">
                                                    AI 입학사정관의 쓴소리
                                                    {object?.evaluation?.is_relevant === false && <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase font-black">FAIL</span>}
                                                </h4>
                                                <div className="mb-4 bg-white/50 rounded-xl p-3 border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Question</span>
                                                    <div className="text-sm font-bold text-slate-700 flex items-start gap-2">
                                                        <span className="text-indigo-500">Q.</span>
                                                        {selectedQuestion}
                                                    </div>
                                                </div>
                                                <div className="text-slate-700 leading-relaxed text-sm bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                                                    {error
                                                        ? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
                                                        : (object?.evaluation?.is_relevant === false
                                                            ? '질문의 의도와 전혀 다른 답변입니다. 체크리스트 진행이 제한됩니다.'
                                                            : object?.advice)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Panel: Interactive Checklist (Investment Game) */}
                <div className="bg-blue-50 rounded-[2rem] shadow-2xl shadow-blue-200/60 p-8 flex flex-col relative overflow-hidden h-full text-slate-800">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 z-0" />

                    <div className="relative z-10 flex justify-between items-start mb-8 border-b border-blue-200 pb-6">
                        <div>

                            <h2 className="text-3xl font-black tracking-tight leading-none text-slate-800">
                                최종합격<br />
                                <span className="text-blue-600">체크리스트</span>
                            </h2>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            {!error && object?.evaluation?.is_relevant !== false && (
                                <button
                                    onClick={handleChecklistVerification}
                                    disabled={showChecklistResult}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${showChecklistResult
                                        ? 'bg-blue-100 text-blue-300 cursor-not-allowed border border-blue-200'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/30'
                                        }`}
                                >
                                    <Check className="w-4 h-4" />
                                    {showChecklistResult ? '분석완료 (Verified)' : '분석시작(Verify)'}
                                </button>
                            )}
                            <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm">
                                <div className="text-3xl font-black text-blue-600 tracking-tighter tabular-nums leading-none text-center">
                                    {stampsEarned} <span className="text-xs text-blue-300 font-bold align-top">/ 9</span>
                                </div>
                                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest text-center mt-1">Stamps</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent relative z-10">

                        {/* Stage 1: Paper Screening */}
                        <StageSection
                            title="STEP 1. 서류 전형 (구조)"
                            items={checklist.filter(i => paperIds.includes(i.id))}
                            isActive={currentStage === 'Paper'}
                            isCompleted={!isLocked('Interview')}
                            toggleCheck={handleToggleCheck}
                            evaluation={object?.evaluation}
                            evaluationMap={evaluationMap}
                            showChecklistResult={showChecklistResult}
                            color="blue"
                            icon={<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">1</div>}
                        />

                        {/* Stage 2: Practical Interview */}
                        <StageSection
                            title="STEP 2. 전공 구술 면접 (논리)"
                            items={checklist.filter(i => interviewIds.includes(i.id))}
                            isActive={currentStage === 'Interview'}
                            isCompleted={!isLocked('Final')}
                            toggleCheck={handleToggleCheck}
                            evaluation={object?.evaluation}
                            evaluationMap={evaluationMap}
                            showChecklistResult={showChecklistResult}
                            color="blue"
                            icon={<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">2</div>}
                        />

                        {/* Stage 3: Final Interview */}
                        <StageSection
                            title="STEP 3. 제시문 기반 집중 면접 (증거)"
                            items={checklist.filter(i => finalIds.includes(i.id))}
                            isActive={currentStage === 'Final'}
                            isCompleted={currentStage === 'Hired'}
                            toggleCheck={handleToggleCheck}
                            evaluation={object?.evaluation}
                            evaluationMap={evaluationMap}
                            showChecklistResult={showChecklistResult}
                            color="blue"
                            icon={<div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">3</div>}
                        />

                        {/* AI 합격 스크립트 (Improved Script) - Right Panel Bottom */}
                        <AnimatePresence>
                            {object?.point1 && (
                                <>
                                    {!showImproved ? (
                                        <button
                                            onClick={() => setShowImproved(true)}
                                            className="w-full mt-8 py-4 bg-white border-2 border-dashed border-blue-200 rounded-3xl text-blue-600 font-bold flex items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-300 transition-all group active:scale-[0.98]"
                                        >
                                            <Sparkles className="w-5 h-5 fill-blue-100 group-hover:rotate-12 transition-transform" />
                                            <span>합격 스크립트 확인하기</span>
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </button>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-8 pt-8 border-t border-blue-200 relative z-10"
                                        >
                                            <div className="flex justify-between items-center mb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-sm border border-blue-200">
                                                        <Sparkles className="w-5 h-5 fill-blue-300" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <h4 className="font-bold text-lg text-slate-800">
                                                                AI 합격 스크립트
                                                            </h4>
                                                            <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">Perfect Prep-Solution</p>
                                                        </div>
                                                        <button
                                                            onClick={() => setShowImproved(false)}
                                                            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md transition-colors"
                                                        >
                                                            접기 <ChevronUp className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (object) {
                                                            const text = `${object.point1} ${object.reason} ${object.example} ${object.point2}`;
                                                            navigator.clipboard.writeText(text);
                                                            alert('클립보드에 복사되었습니다.');
                                                        }
                                                    }}
                                                    className="text-xs flex items-center gap-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white px-3.5 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 group"
                                                >
                                                    <Copy className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" /> 복사하기
                                                </button>
                                            </div>
                                            <div className="bg-white rounded-3xl border border-blue-100 p-6 space-y-5 shadow-xl shadow-blue-500/5 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 blur-3xl pointer-events-none" />
                                                {[
                                                    { label: 'P. 결론', content: object?.point1, color: 'bg-red-400', border: 'border-red-200', desc: '두괄식 핵심 답변' },
                                                    { label: 'R. 이유', content: object?.reason, color: 'bg-blue-400', border: 'border-blue-400', desc: '논리적 근거' },
                                                    { label: 'E. 사례', content: object?.example, color: 'bg-emerald-500', border: 'border-emerald-500', desc: '데이터 기반 경험' },
                                                    { label: 'P. 강조', content: object?.point2, color: 'bg-orange-400', border: 'border-orange-400', desc: '입학 후 학업 방향' },
                                                ].map((section, idx) => (
                                                    <div key={idx} className={`relative pl-5 border-l-2 ${section.border} group/item`}>
                                                        <div className="flex items-center gap-2 mb-1.5">
                                                            <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md text-white ${section.color}`}>
                                                                {section.label}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-slate-400 capitalize">{section.desc}</span>
                                                        </div>
                                                        <p className="text-slate-700 leading-relaxed font-semibold text-[15px] group-hover/item:text-slate-900 transition-colors">{section.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Final Hired Stamp Overlay */}
                    <AnimatePresence>
                        {currentStage === 'Hired' && (
                            <motion.div
                                initial={{ scale: 2, opacity: 0, rotate: -15 }}
                                animate={{ scale: 1, opacity: 1, rotate: -15 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                            >
                                <div className="border-[8px] border-rose-500 text-rose-500 px-10 py-6 rounded-[2rem] font-black text-7xl tracking-widest uppercase opacity-90 mix-blend-color-dodge shadow-[0_0_80px_rgba(244,63,94,0.6)] transform -rotate-12 bg-slate-900/90 backdrop-blur-xl">
                                    HIRED
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function StageSection({ title, items, isActive, isLocked = false, isCompleted = false, toggleCheck, icon, evaluation, evaluationMap, showChecklistResult, color }: any) {
    return (
        <div className={`relative transition-all duration-500 ${isLocked ? 'opacity-30 blur-sm pointer-events-none grayscale' : 'opacity-100'}`}>
            <div className="flex items-center gap-4 mb-4 relative pl-1">
                {icon}
                <h3 className="text-lg font-bold text-slate-700 tracking-tight">{title}</h3>
                <AnimatePresence>
                    {isCompleted && (
                        <motion.div
                            initial={{ scale: 2, opacity: 0, rotate: 15 }}
                            animate={{ scale: 1, opacity: 0.8, rotate: -12 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="absolute right-0 top-0 pointer-events-none"
                        >
                            <div className="border-[3px] border-amber-500 text-amber-600 px-3 py-1 rounded font-black text-sm tracking-widest uppercase shadow-[0_0_15px_rgba(251,191,36,0.3)] bg-amber-50/80 backdrop-blur-[1px]">
                                PASSED
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-3 pl-4">
                {items.map((item: ChecklistItem) => {
                    const evalKey = evaluationMap[item.id];
                    const isEvaluatedFail = showChecklistResult && evaluation && evalKey && evaluation[evalKey] === false;

                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`
                                group cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative overflow-hidden backdrop-blur-sm
                                ${item.isChecked
                                    ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                                    : (isEvaluatedFail
                                        ? 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                                        : 'bg-white border-blue-100 hover:bg-blue-50 hover:border-blue-200 hover:translate-x-1')
                                }
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`
                                    w-6 h-6 rounded-lg border-[2.5px] flex items-center justify-center transition-all mt-0.5 shrink-0
                                    ${item.isChecked
                                        ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/20'
                                        : (isEvaluatedFail
                                            ? 'border-rose-300 text-rose-500 bg-rose-50'
                                            : 'border-blue-200 group-hover:border-blue-400 text-transparent')
                                    }
                                `}>
                                    {item.isChecked ? <Check className="w-3.5 h-3.5 stroke-[4]" /> : (isEvaluatedFail ? <XCircle className="w-4 h-4" /> : null)}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-sm sm:text-base transition-colors ${item.isChecked ? 'text-emerald-700' : (isEvaluatedFail ? 'text-rose-600' : 'text-slate-700')}`}>
                                        {item.question}
                                    </h4>
                                    <p className={`text-xs sm:text-sm mt-1 leading-relaxed font-medium ${isEvaluatedFail ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
