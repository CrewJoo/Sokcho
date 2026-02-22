"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

export type PromptExampleType = 'META_PROMPT' | 'RAG' | 'CONTEXT_ENGINEERING' | 'SLOW_THINKING' | 'DREAM' | 'DIFFICULTY' | 'TREND' | 'STAND' | 'DIFFERENT';

interface PromptExampleModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: PromptExampleType | null;
}

const EXAMPLES: Record<PromptExampleType, { title: string; desc: string; content: string }> = {
    META_PROMPT: {
        title: "META PROMPT 예시",
        desc: "AI의 페르소나와 임무를 PREP 구조로 명확히 정의합니다.",
        content: `**[Point: 역할 정의]**
당신은 컴퓨터공학과 교수님이자 '자료구조' 과목의 일타강사입니다. 복잡한 개념을 쉬운 비유와 시각적 묘사로 설명하는 것이 당신의 핵심 역량입니다.

**[Reason: 배경 및 이유]**
이번 학기 수강생 중 문과 출신 교차 지원자가 많아 '스택(Stack)'과 '큐(Queue)'의 개념을 어려워하고 있습니다. 전공 서적의 딱딱한 정의는 이해를 방해합니다.

**[Example: 구체적 지침]**
- '스택'은 프링글스 통이나 접시 쌓기에 비유하세요.
- '큐'는 놀이공원 줄 서기나 맛집 웨이팅에 비유하세요.
- 코드를 작성하지 말고, 일상 용어로 개념의 차이점(LIFO vs FIFO)을 설명하세요.

**[Point: 최종 임무]**
위의 가이드라인을 바탕으로, 스택과 큐의 차이점을 초보자도 한 번에 이해할 수 있는 300자 내외의 설명글을 작성해주세요.`
    },
    RAG: {
        title: "RAG (검색증강) 예시",
        desc: "AI가 정확한 정보를 찾을 수 있도록 검색 의도를 구조화합니다.",
        content: `**[Point: 검색 목표]**
최근 3년간 전 세계적인 '기후 변화'의 주요 트렌드와 이것이 '청년 세대'에게 미치는 영향을 찾아서 요약해주세요.

**[Reason: 검색 이유]**
단순한 기온 상승 수치가 아니라, '기후 우울증(Eco-anxiety)'이나 '가치 소비'처럼 기후 변화가 청년들의 라이프스타일과 정신 건강에 미친 구체적인 변화를 탐구 보고서에 담아야 하기 때문입니다.

**[Example: 포함해야 할 키워드]**
- '기후 우울증(Climate Anxiety) 통계'
- 'MZ세대의 친환경 소비 패턴 변화'
- '그레타 툰베리 효과와 청년 환경 운동'

**[Point: 답변 형식]**
검색된 정보를 종합하여, [주요 트렌드 3가지] - [청년 세대에 미친 사회적/심리적 영향] - [시사점] 순서로 보고서 형태로 정리해주세요.`
    },
    CONTEXT_ENGINEERING: {
        title: "CONTEXT ENGINEERING 예시",
        desc: "복잡한 상황을 PREP으로 정리하여 AI에게 맥락을 주입합니다.",
        content: `**[Point: 핵심 요청]**
우리 대학 '에코 페스티벌(Eco-Festival)'의 홍보 포스터 문구를 제안해주세요.

**[Reason: 행사 배경]**
기존 축제는 쓰레기가 많이 발생해서 문제가 되었습니다. 이번 축제는 'Zero Waste'를 목표로 텀블러 지참 시 무료 음료 제공, 리사이클링 부스 운영 등 친환경 요소를 전면에 내세웁니다.

**[Example: 타겟 및 톤앤매너]**
- 타겟: 환경 보호에 관심은 있지만 실천을 어려워하는 대학생들.
- 톤앤매너: 훈계조('지구를 지키자')보다는 힙하고 즐거운 분위기('지구를 힙하게').
- 피해야 할 단어: '의무', '금지', '벌금'.

**[Point: 결과물 요건]**
눈길을 사로잡는 짧은 메인 카피 3개와, 참여를 유도하는 서브 카피 3개를 각각 매칭해서 제안해주세요.`
    },
    SLOW_THINKING: {
        title: "SLOW THINKING 예시",
        desc: "AI가 단계별로 논리적인 추론을 하도록 강제합니다.",
        content: `**[Point: 문제 정의]**
의대 면접 상황입니다. 다음 환자의 초기 증상만 듣고 가장 가능성 높은 질환을 진단하되, 결론을 바로 내리지 말고 단계적으로 추론하세요.
"환자: 20대 남성 대학생, 오른쪽 아랫배 통증 호소, 식욕 부진, 미열 있음."

**[Reason: 추론 단계 설정]**
1. 환자의 나이와 성별, 핵심 증상(우하복부 통증)을 의학적 키워드로 정리하세요.
2. 해당 부위 통증을 유발할 수 있는 소화기 질환 후보군(감별 진단 리스트)을 나열하세요.
3. 식욕 부진과 미열이라는 추가 증상을 근거로 후보군 중 가장 유력한 질환을 좁혀가세요.

**[Example: 참고 지식]**
- 장염은 설사를 동반하는 경우가 많음.
- 맹장염(충수돌기염)은 초기에는 체한 듯하다가 통증이 오른쪽 아래로 이동함.

**[Point: 최종 결론]**
위의 논리적 추론 과정을 거쳐, 가장 의심되는 질환 1순위를 제시하고, 확진을 위해 추가로 확인해야 할 검사(예: 맥버니 포인트 압통 확인)를 제안하세요.`
    },
    TREND: {
        title: "TREND (통찰/관심) 예시",
        desc: "최신 이슈를 분석하고 자신의 관점을 제시하는 PREP 답변입니다.",
        content: `**[Point: 주목하는 트렌드]**
저는 최근 교육 현장에 도입되고 있는 'AI 튜터'와 '하이터치 하이테크(High Touch High Tech)' 트렌드에 주목하고 있습니다.

**[Reason: 해당 트렌드의 중요성]**
AI가 지식 전달(High Tech)을 효율적으로 담당할수록, 교수님은 학생의 진로 상담과 심층 멘토링(High Touch)에 집중할 수 있는 기회가 생기기 때문입니다. 이는 고등 교육의 질을 근본적으로 바꿀 전환점입니다.

**[Example: 사례 및 적용]**
- **사례:** 애리조나 주립대학교의 AI 학습 분석 시스템 도입 후, 중도 탈락률이 현저히 감소하고 학생 만족도가 높아진 사례가 있습니다.
- **적용:** 저는 교육공학 전공자로서, 단순히 AI 기술을 도입하는 것을 넘어 '교사의 역할 변화'를 돕는 연수 프로그램을 기획해보고 싶습니다.

**[Point: 나의 통찰]**
결국 에듀테크의 핵심은 기술 자체가 아니라, 그 기술을 통해 '인간적인 연결'을 어떻게 회복하느냐에 달려있다고 생각합니다. 귀교에서 기술과 교육학을 융합하여 이 문제를 해결하는 전문가가 되고 싶습니다.`
    },

    // 5D Examples - (Already student/admission focus checked)
    DREAM: {
        title: "DREAM (꿈/목표) 답변 예시",
        desc: "비전과 학업 계획을 논리적으로 연결하는 PREP 답변입니다.",
        content: `**[Point: 나의 꿈과 목표]**
저의 목표는 '인공지능 윤리 전문가'가 되어 기술과 인문학을 잇는 가교 역할을 하는 것입니다.

**[Reason: 꿈을 갖게 된 계기]**
급격한 AI 기술 발전 속에서 기술적 효율성뿐만 아니라, 그것이 사회에 미칠 윤리적 영향을 평가하고 조율하는 역할이 필수적이라고 확신했기 때문입니다. 특히 학부 시절 '알고리즘 편향성'에 대한 세미나를 들으며 이 문제의 심각성을 깊이 체감했습니다.

**[Example: 구체적 실행 계획]**
- **단기:** 귀교의 컴퓨터공학 커리큘럼을 통해 기술적 이해도를 높이고, 철학과 부전공을 병행하겠습니다.
- **중기:** 'AI 윤리 연구소' 인턴십에 참여하여 실제 정책 수립 과정을 경험하겠습니다.
- **장기:** 기술적 솔루션과 윤리적 가이드라인을 통합한 'AI 신뢰성 평가 모델'을 개발하고 싶습니다.

**[Point: 포부 재강조]**
이러한 목표를 달성하기 위해, 귀교의 융합 학문 환경은 저에게 최적의 토양이 될 것입니다. 기술과 사람을 모두 이해하는 전문가로 성장하겠습니다.`
    },
    DIFFICULTY: {
        title: "DIFFICULTY (고난/극복) 답변 예시",
        desc: "어려움을 성장의 발판으로 삼은 과정을 보여주는 PREP 답변입니다.",
        content: `**[Point: 겪었던 어려움과 태도]**
가장 힘들었던 순간은 캡스톤 디자인 프로젝트 당시, 팀원 간의 소통 부재로 프로젝트가 무산될 위기에 처했을 때였습니다. 하지만 저는 이를 '리더십을 시험할 기회'로 받아들였습니다.

**[Reason: 어려움의 원인과 해결 필요성]**
서로의 기술적 배경이 달라 용어부터 통일되지 않았고, 역할 분담이 모호해 감정적인 골이 깊어진 상태였습니다. 프로젝트 완수를 위해서는 단순한 중재가 아닌, 근본적인 소통 시스템 구축이 필요했습니다.

**[Example: 구체적 극복 행동]**
- **용어집 생성:** 개발자와 디자이너가 사용하는 용어를 정리한 '공용어 사전'을 만들었습니다.
- **데일리 스크럼 도입:** 매일 10분씩 각자의 진행 상황과 고충을 공유하는 시간을 가졌습니다.
- **역할 재배치:** 각자의 강점에 맞춰 업무를 재분배하고, 작은 성취를 서로 칭찬하는 문화를 만들었습니다.

**[Point: 배운 점 및 성장]**
그 결과, 팀워크가 되살아나 공모전 은상이라는 성과를 거뒀습니다. 이 경험을 통해 진정한 리더십은 카리스마가 아닌 '경청과 조율'에서 나온다는 것을 배웠습니다.`
    },
    STAND: {
        title: "STAND (가치관/태도) 답변 예시",
        desc: "자신의 신념과 그에 따른 행동 일관성을 보여주는 PREP 답변입니다.",
        content: `**[Point: 핵심 가치관]**
제가 가장 중요하게 생각하는 가치는 '기본에 대한 충실함(Integrity)'입니다.

**[Reason: 가치관의 이유]**
화려한 성과는 운으로 얻을 수도 있지만, 지속 가능한 성장은 오직 탄탄한 기본기 위에서만 가능하다고 믿기 때문입니다. 편법은 빠르지만 무너지기 쉽습니다.

**[Example: 경험 증명]**
학보사 편집장 시절, 자극적인 제목으로 조회수를 올리자는 의견이 많았습니다. 하지만 저는 학내 언론의 본질은 '정확한 사실 전달'이라고 설득하며, 팩트 체크를 3단계로 강화하는 원칙을 고수했습니다. 처음에는 조회수가 정체되었지만, 점차 '가장 신뢰할 수 있는 소식통'이라는 평판을 얻으며 정기 구독자가 20% 증가했습니다.

**[Point: 적용 및 다짐]**
이처럼 눈앞의 이익보다는 원칙을 지키는 태도로 학업에 임하겠습니다. 요행을 바라지 않고, 학문의 기초부터 단단히 다지는 연구자가 되겠습니다.`
    },
    DIFFERENT: {
        title: "DIFFERENT (차별성/무기) 답변 예시",
        desc: "나만의 고유한 강점과 차별점을 어필하는 PREP 답변입니다.",
        content: `**[Point: 차별화된 무기]**
저의 가장 큰 차별점은 '인문학적 상상력'을 '공학적 언어'로 구현해내는 '융합적 실행력'입니다.

**[Reason: 차별점의 근거]**
많은 문과생들이 아이디어 기획에 그치고, 많은 공대생들이 기술 구현에만 집중하는 경향이 있습니다. 하지만 저는 문헌정보학을 전공하며 데이터를 구조화하는 법을 배웠고, 부트캠프를 통해 이를 파이썬으로 직접 크롤링하고 시각화하는 능력을 갖췄습니다.

**[Example: 구체적 성과]**
'도서관 이용자 패턴 분석' 프로젝트에서, 단순히 대출 순위만 보여주는 것이 아니라, 날씨 데이터와 연동하여 '비 오는 날 읽기 좋은 책'을 추천하는 큐레이션 알고리즘을 직접 코딩했습니다. 이는 실제 도서관 앱에 도입되어 이용자 만족도를 15% 높였습니다.

**[Point: 기여 방안]**
이처럼 저는 기획자와 개발자 사이의 통역사가 될 수 있습니다. 귀교의 융합 소프트웨어 과정에서, 인문학적 감수성이 기술로 생생하게 구현되는 결과물을 만들어내겠습니다.`
    }
};

export function PromptExampleModal({ isOpen, onClose, type }: PromptExampleModalProps) {
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !type || !mounted) return null;

    const data = EXAMPLES[type];

    const handleCopy = () => {
        navigator.clipboard.writeText(data.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[10001] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white pointer-events-auto w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-trust-navy">{data.title}</h2>
                                    <p className="text-slate-500 mt-2 font-medium">{data.desc}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50">
                                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                                    <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-base sm:text-lg">
                                        <div dangerouslySetInnerHTML={{
                                            __html: data.content
                                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-trust-navy block mb-1 mt-4 first:mt-0 text-xl overflow-visible">$1</strong>')
                                                .replace(/^- (.*)/gm, '<li class="ml-4 list-disc marker:text-slate-300">$1</li>')
                                        }} />
                                    </pre>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="rounded-full px-6 font-bold"
                                >
                                    닫기
                                </Button>
                                <Button
                                    onClick={handleCopy}
                                    className="rounded-full px-6 bg-trust-navy hover:bg-trust-navy/90 text-white font-bold gap-2"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? "복사완료" : "프롬프트 복사"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
