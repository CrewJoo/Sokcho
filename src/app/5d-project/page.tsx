"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, BookOpen, Lightbulb, ChevronRight, AlertCircle } from "lucide-react";

// ─── 스키마 ───────────────────────────────────────────────────────────────────
const namingSchema = z.object({
    suggestion1: z.string(),
    suggestion2: z.string(),
    suggestion3: z.string(),
    suggestion4: z.string(),
    suggestion5: z.string(),
    reason1: z.string(),
    reason2: z.string(),
    reason3: z.string(),
    reason4: z.string(),
    reason5: z.string(),
    tip: z.string(),
});

// ─── 우수 사례 데이터 (출처: 동국대학교 수행평가 영역명 설정 가이드북) ────────────
const REFERENCE_CASES = [
    // 국어 (가이드북 '추가 내용 활용' 스타일)
    { subject: "국어", title: "특정 사회 문제를 다룬 소설 작품의 인물에 대해 비평하기", unit: "문학", method: "논술·비평", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "국어", title: "지역 방언과 세대 간 언어 차이를 반영한 새말 및 표준어 탐구하기", unit: "언어", method: "탐구", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "국어", title: "매체에 나타난 가짜 뉴스 사례 분석을 통한 비판적 읽기 보고서 작성", unit: "매체", method: "논술·비평", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "국어", title: "진로와 관련된 문학 작품 서평 작성 및 독서 토론 진행", unit: "의사소통", method: "말하기", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "국어", title: "고전 시가에 나타난 자연관과 현대 환경 문제 해결 방안 논술하기", unit: "독서", method: "글쓰기", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    // 수학 (가이드북 실제 '추가 내용 활용' 사례 포함)
    { subject: "수학", title: "정적분과 급수의 합을 이용한 적분 과정의 증명", unit: "적분법", method: "추론·증명", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "수학", title: "매체 속 통계 자료 비판적으로 해석하기", unit: "통계", method: "자료분석", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "수학", title: "실생활 문제의 수학적 재구성 프로젝트", unit: "주제탐구", method: "프로젝트", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "수학", title: "전염병 확산 모델링을 통한 지수함수 그래프 분석", unit: "함수와 그래프", method: "문제해결", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "수학", title: "기하학적 원리를 활용한 건축 구조물 모형 제작", unit: "기하", method: "제작", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    // 영어 (가이드북 '추가 내용 활용' 스타일)
    { subject: "영어", title: "교과서 주제를 포함한 영자 신문 인터넷 기사 작성하기", unit: "독해", method: "완성하기", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "영어", title: "TED 강연 스크립 분석을 통한 효과적인 프레젠테이션 전략 발표", unit: "말하기", method: "발표", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "영어", title: "글로벌 환경 문제에 대한 영어 에세이 작성 및 피어 리뷰", unit: "의견", method: "글쓰기·논술", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "영어", title: "영어 원서 소설의 문화적 배경 조사 및 현대적 관점에서 재해석", unit: "문학", method: "탐구", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "영어", title: "희망 전공 관련된 영어 논문 초록 요약 및 자신의 의견 말하기", unit: "진로", method: "의사소통", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    // 사회 (가이드북 실제 '추가 내용 활용' 사례 포함)
    { subject: "사회", title: "거주 지역의 에너지 정책 논술하기", unit: "지리", method: "논술", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "사회", title: "고용 관련 경제 지표 분석하기", unit: "경제", method: "탐구하기", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "사회", title: "사상가와 자신의 행복관 비교하기", unit: "철학", method: "논술", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "사회", title: "지역 간 불평등 해소를 위한 복지 정책 제안서 작성", unit: "사회문화", method: "글쓰기", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "사회", title: "역사적 판결 사례를 통한 현대 법치주의의 한계와 대안 토론", unit: "법과 정치", method: "의사소통", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    // 과학 (가이드북 '추가 내용 활용' 스타일)
    { subject: "과학", title: "자유 낙하 운동 실험 데이터의 시뮬레이션 분석 및 오차 규명", unit: "운동과 힘", method: "실험평가", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "과학", title: "실제 가계도 분석을 통한 유전 형질의 추론 및 예방 포스터 제작", unit: "유전", method: "탐구", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "과학", title: "기후 변화 데이터를 활용한 한반도 생태계 변화 예측 모델링", unit: "환경", method: "자료분석", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "과학", title: "산화 환원 반응 원리를 적용한 친환경 손난로 설계 및 효율 평가", unit: "화학 반응", method: "설계", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "과학", title: "지역 지질 명소 탐사를 통한 지층 형성 과정 추론 보고서", unit: "지구", method: "보고서", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    // 정보 (가이드북 실제 '추가 내용 활용' 사례 포함)
    { subject: "정보", title: "용돈 지출 데이터 기반 선형회귀를 활용한 소비 패턴 분석", unit: "데이터", method: "분석", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "정보", title: "암호화 원리를 적용한 안전한 비밀번호 설계", unit: "정보보안", method: "설계", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "정보", title: "머신러닝을 적용한 정형 데이터 분석하기", unit: "인공지능", method: "프로젝트", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "정보", title: "공공데이터 API를 활용한 우리 동네 문제 해결 앱 시제품 제작", unit: "프로그래밍", method: "제작", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
    { subject: "정보", title: "인공지능 윤리 가이드라인 위반 사례 조사 및 개선안 발표", unit: "인공지능 윤리", method: "탐구", adopted: true, source: "동국대 가이드북 (추가 내용 활용)" },
];

const SUBJECTS = ["전체", "국어", "수학", "영어", "사회", "과학", "정보"];

// ─── 탭 타입 ──────────────────────────────────────────────────────────────────
type Tab = "ai" | "cases" | "guide";

// ─── 추천 카드 ────────────────────────────────────────────────────────────────
function SuggestionCard({ title, reason, index }: { title: string; reason: string; index: number }) {
    const [copied, setCopied] = useState(false);
    const charCount = title.length;
    const isOver = charCount > 30;
    const isWarning = charCount > 20 && charCount <= 30;

    const copyTitle = async () => {
        await navigator.clipboard.writeText(title);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-700 text-xs font-black flex items-center justify-center mt-0.5">
                        {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-lg font-bold text-slate-900 break-keep">{title}</p>
                        {reason && <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{reason}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* NEIS 글자수 배지 */}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isOver ? "bg-red-50 text-red-600 border-red-200" :
                        isWarning ? "bg-amber-50 text-amber-600 border-amber-200" :
                            "bg-emerald-50 text-emerald-600 border-emerald-200"
                        }`}>
                        {charCount}자 {isOver ? "⚠️초과" : isWarning ? "조심" : "✓"}
                    </span>
                    <button
                        onClick={copyTitle}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="복사"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── 입력 부속 컴포넌트 ──────────────────────────────────────────────────────────
function ComboInput({
    label,
    value,
    onChange,
    options,
    placeholder,
    required = false
}: {
    label: string,
    value: string,
    onChange: (val: string) => void,
    options: string[],
    placeholder: string,
    required?: boolean
}) {
    const [isCustom, setIsCustom] = useState(false);

    // 값이 비어있지 않고 목록에 없는 값이면 무조건 직접입력 모드로 간주
    const showInput = isCustom || (value !== "" && !options.includes(value));

    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {showInput ? (
                <div className="flex gap-2">
                    <input
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => {
                            setIsCustom(false);
                            onChange(options[0] || "");
                        }}
                        className="px-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 text-sm font-bold whitespace-nowrap"
                    >
                        목록 보기
                    </button>
                </div>
            ) : (
                <select
                    value={value}
                    onChange={e => {
                        if (e.target.value === "직접입력") {
                            setIsCustom(true);
                            onChange("");
                        } else {
                            onChange(e.target.value);
                        }
                    }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-400 transition bg-white"
                >
                    <option value="" disabled>목록에서 선택하거나 직접입력하세요</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    <option value="직접입력" className="text-red-600 font-bold">✎ 직접입력</option>
                </select>
            )}
        </div>
    );
}

const SUBJECT_CATEGORY_OPTIONS = [
    "국어 - 문학", "국어 - 독서", "국어 - 매체", "국어 - 언어",
    "수학 - 함수와 그래프", "수학 - 미적분", "수학 - 통계",
    "영어 - 독해", "영어 - 회화", "영어 - 작문",
    "사회 - 일반사회", "사회 - 지리", "사회 - 역사",
    "과학 - 물리학", "과학 - 화학", "과학 - 생명과학", "과학 - 지구과학",
    "정보 - 프로그래밍", "정보 - 인공지능", "정보 - 데이터"
];

const UNIT_WORD_OPTIONS = [
    "문학 작품 속 인물 심리 분석",
    "빅데이터 분석 및 시각화",
    "기후 변화 데이터 분석",
    "사회 문제 해결을 위한 앱 제작",
    "역사적 사건의 현대적 재해석"
];

const METHOD_OPTIONS = [
    "논술형", "프로젝트형", "포트폴리오형", "토론·발표형", "탐구보고서", "실험보고서", "구술형", "자기평가형"
];

const COMPETENCY_OPTIONS = [
    "문제해결력", "의사소통 능력", "창의·융합 사고", "비판적 사고력", "디지털 리터러시", "협업·공동체 역량", "자기관리 능력", "심미적 감성"
];

// ─── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
function ProjectNamingContent() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as Tab | null;

    // URL에 파라미터가 있으면 우선 적용하고, 없으면 기본 "ai" 사용
    const [activeTab, setActiveTab] = useState<Tab>(tabParam || "ai");

    // 파라미터 변경 시 상태 동기화 (같은 페이지 내에서 쿼리만 바뀔 경우)
    useEffect(() => {
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const [subject, setSubject] = useState("");
    const [unit, setUnit] = useState("");
    const [method, setMethod] = useState("논술형");
    const [competency, setCompetency] = useState("문제해결력");
    const [caseFilter, setCaseFilter] = useState("전체");

    const { object, submit, isLoading, error } = useObject({
        api: "/api/project-naming",
        schema: namingSchema,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !unit.trim()) return;
        submit({ subject, unit, method, competency } as any);
    };

    const suggestions = object ? [
        { title: object.suggestion1 || "", reason: object.reason1 || "" },
        { title: object.suggestion2 || "", reason: object.reason2 || "" },
        { title: object.suggestion3 || "", reason: object.reason3 || "" },
        { title: object.suggestion4 || "", reason: object.reason4 || "" },
        { title: object.suggestion5 || "", reason: object.reason5 || "" },
    ].filter(s => s.title) : [];

    const filteredCases = caseFilter === "전체"
        ? REFERENCE_CASES
        : REFERENCE_CASES.filter(c => c.subject === caseFilter);

    const TABS = [
        { id: "guide" as Tab, label: "사용 가이드", desc: "도움말" },
        { id: "ai" as Tab, label: "AI 작명", desc: "AI 추천" },
        { id: "cases" as Tab, label: "우수 사례", desc: "레퍼런스" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-slate-50">
            {/* 페이지 헤더 */}
            <div className="pt-52 pb-10 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 mb-6"
                >
                    <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                        <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">

                        <h1 className="text-3xl font-black text-slate-900">수행평가 작명소</h1>
                    </div>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed"
                >
                    과목·단원·평가 방식을 입력하면, <br /><strong className="text-red-700">입학사정관이 주목하는</strong> 수행평가 영역명을 AI가 추천합니다.<br />
                    NEIS 글자 수에 최적화된 제목을 바로 복사해서 사용하세요.
                </motion.p>
            </div>

            {/* 탭 */}
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-8 w-fit mx-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? "bg-white text-red-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ── AI 작명 탭 ── */}
                    {activeTab === "ai" && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="grid lg:grid-cols-2 gap-6 pb-20"
                        >
                            {/* 입력 패널 */}
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs flex items-center justify-center font-black">1</span>
                                    조건 입력
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* 과목 */}
                                    <ComboInput
                                        label="과목 및 범주"
                                        value={subject}
                                        onChange={setSubject}
                                        options={SUBJECT_CATEGORY_OPTIONS}
                                        placeholder="예: 국어 - 문학, 수학 - 대수"
                                        required
                                    />
                                    {/* 단원 */}
                                    <ComboInput
                                        label="단원/예시단어"
                                        value={unit}
                                        onChange={setUnit}
                                        options={UNIT_WORD_OPTIONS}
                                        placeholder="예: 빅데이터 분석 및 시각화"
                                        required
                                    />
                                    {/* 평가 방식 */}
                                    <ComboInput
                                        label="평가 방식"
                                        value={method}
                                        onChange={setMethod}
                                        options={METHOD_OPTIONS}
                                        placeholder="예: 논술형, 탐구보고서"
                                    />
                                    {/* 핵심 역량 */}
                                    <ComboInput
                                        label="핵심 역량"
                                        value={competency}
                                        onChange={setCompetency}
                                        options={COMPETENCY_OPTIONS}
                                        placeholder="예: 문제해결력, 의사소통 능력"
                                    />

                                    <button
                                        type="submit"
                                        disabled={isLoading || !subject.trim() || !unit.trim()}
                                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl text-base transition-all active:scale-95 shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <><Sparkles className="w-5 h-5 animate-spin" /> 추천 생성 중...</>
                                        ) : (
                                            <><Sparkles className="w-5 h-5" /> AI 수행평가명 추천받기</>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* 결과 패널 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        <span className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs flex items-center justify-center font-black">2</span>
                                        AI 추천 결과
                                    </h2>
                                    <span className="text-xs text-slate-400 ml-2">NEIS 글자 수 표시됨</span>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-sm font-semibold">오류가 발생했습니다. 다시 시도해주세요.</p>
                                    </div>
                                )}

                                {!object && !isLoading && !error && (
                                    <div className="h-[420px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 gap-3">
                                        <Sparkles className="w-10 h-10 opacity-30" />
                                        <p className="text-base font-semibold">왼쪽에서 조건을 입력하고</p>
                                        <p className="text-sm">AI 추천받기 버튼을 누르세요</p>
                                    </div>
                                )}

                                {isLoading && suggestions.length === 0 && (
                                    <div className="h-[420px] flex flex-col items-center justify-center gap-4 text-red-600">
                                        <Sparkles className="w-10 h-10 animate-pulse" />
                                        <p className="text-base font-bold animate-pulse">수행평가명 생성 중...</p>
                                    </div>
                                )}

                                {suggestions.length > 0 && (
                                    <div className="space-y-3">
                                        {suggestions.map((s, i) => (
                                            <SuggestionCard key={i} title={s.title} reason={s.reason} index={i} />
                                        ))}
                                        {object?.tip && !isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-2 bg-amber-50 border border-amber-200 rounded-2xl p-5"
                                            >
                                                <p className="text-sm font-bold text-amber-700 flex items-center gap-2 mb-2">
                                                    <Lightbulb className="w-4 h-4" /> 작명 팁
                                                </p>
                                                <p className="text-sm text-amber-800 leading-relaxed">{object.tip}</p>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* ── 우수 사례 탭 ── */}
                    {activeTab === "cases" && (
                        <motion.div
                            key="cases"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="pb-20"
                        >
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-xl font-black text-slate-800">수행평가 영역명 예시</h2>
                                        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-semibold">
                                            출처: 동국대학교 수행평가 영역명 설정 가이드북
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {SUBJECTS.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => setCaseFilter(s)}
                                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${caseFilter === s
                                                    ? "bg-red-600 text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {filteredCases.map((c, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border border-slate-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-sm transition-all group cursor-pointer"
                                            onClick={() => {
                                                setSubject(c.subject);
                                                setMethod(c.method);
                                                setActiveTab("ai");
                                            }}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold">{c.subject}</span>
                                                {c.adopted && <span className="text-xs text-emerald-600 font-bold">✓ 채택</span>}
                                            </div>
                                            <p className="font-bold text-slate-800 text-base mb-1.5 leading-snug">{c.title}</p>
                                            <p className="text-xs text-slate-500 mb-2 font-medium">{c.unit} · {c.method}</p>
                                            <div className="flex items-center gap-1.5 opacity-60">
                                                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                                                <span className="text-[11px] text-slate-500 font-medium">{'source' in c ? (c as any).source : '동국대 가이드북 (추가 내용 활용)'}</span>
                                            </div>
                                            <div className="mt-3 flex items-center gap-1 text-xs text-red-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                                이 조건으로 작명하기 <ChevronRight className="w-3.5 h-3.5" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ── 사용 가이드 탭 ── */}
                    {activeTab === "guide" && (
                        <motion.div
                            key="guide"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="pb-20"
                        >
                            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-3xl mx-auto">
                                <h2 className="text-2xl font-black text-slate-800 mb-8">사용 가이드</h2>

                                {/* 3단계 */}
                                <div className="space-y-6 mb-10">
                                    {[
                                        { step: "1", title: "조건 입력", desc: "과목명, 단원명을 입력하고 평가 방식과 핵심 역량을 선택합니다.", color: "red" },
                                        { step: "2", title: "AI 추천받기", desc: "버튼을 클릭하면 5가지 수행평가 영역명이 자동 생성됩니다.", color: "red" },
                                        { step: "3", title: "복사 후 NEIS 입력", desc: "마음에 드는 제목 옆 복사 버튼으로 바로 복사해 사용하세요.", color: "red" },
                                    ].map(item => (
                                        <div key={item.step} className="flex gap-5">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-red-100">
                                                {item.step}
                                            </div>
                                            <div className="pt-1.5">
                                                <p className="font-black text-slate-800 text-base mb-1">{item.title}</p>
                                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* NEIS 기준 */}
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                                    <p className="font-black text-amber-800 mb-3 flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5" /> NEIS 글자 수 기준
                                    </p>
                                    <div className="flex gap-4 flex-wrap text-sm">
                                        <span className="flex items-center gap-1.5 text-emerald-700 font-bold"><span className="w-3 h-3 rounded-full bg-emerald-400"></span>20자 이내 — 권장</span>
                                        <span className="flex items-center gap-1.5 text-amber-700 font-bold"><span className="w-3 h-3 rounded-full bg-amber-400"></span>21~30자 — 주의</span>
                                        <span className="flex items-center gap-1.5 text-red-700 font-bold"><span className="w-3 h-3 rounded-full bg-red-400"></span>30자 초과 — 입력 불가</span>
                                    </div>
                                </div>

                                {/* 배경 */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                                    <p className="font-black text-slate-800 mb-2">왜 수행평가 제목이 중요한가요?</p>
                                    <ul className="text-sm text-slate-600 space-y-2 leading-relaxed">
                                        <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">•</span>2022 개정 교육과정부터 수행평가 영역명이 대학에 직접 제공됩니다.</li>
                                        <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">•</span>과세특 분량이 500바이트로 축소되어 평가 제목의 영향력이 커졌습니다.</li>
                                        <li className="flex gap-2"><span className="text-red-500 font-bold flex-shrink-0">•</span>입학사정관은 영역명만으로 학생의 역량과 탐구 수준을 1차 판단합니다.</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
}

export default function ProjectNamingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <ProjectNamingContent />
        </Suspense>
    );
}
