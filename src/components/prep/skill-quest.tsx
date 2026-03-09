"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight, CheckCircle, Volume2, Zap, Shield, Lightbulb } from "lucide-react";

// ─── 공통 타이머 훅 ───────────────────────────────────────────────
function useCountdown(seconds: number) {
    const [timeLeft, setTimeLeft] = useState(seconds);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = useCallback(() => {
        setTimeLeft(seconds);
        setRunning(true);
    }, [seconds]);

    const reset = useCallback(() => {
        setRunning(false);
        setTimeLeft(seconds);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, [seconds]);

    useEffect(() => {
        if (!running) return;
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    setRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current!);
    }, [running]);

    const percent = ((seconds - timeLeft) / seconds) * 100;
    return { timeLeft, running, percent, start, reset };
}

// ─── 타이머 바 (공통 UI) ──────────────────────────────────────────
function TimerBar({ percent, timeLeft, color = "emerald" }: { percent: number; timeLeft: number; color?: string }) {
    const colorMap: Record<string, string> = {
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        violet: "bg-violet-500",
    };
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
                <span>남은 시간</span>
                <span className="font-bold text-lg text-slate-700">{timeLeft}초</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${colorMap[color]}`}
                    style={{ width: `${percent}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}

// ─── Step 1: 입 열기 훈련 ─────────────────────────────────────────
const SAMPLE_SCRIPTS = [
    {
        q: "1분 자기소개를 해보세요.",
        script:
            "안녕하세요. 저는 논리적 사고와 꾸준한 탐구 정신을 가진 ○○고등학교 ○○○입니다. 저는 교내 수학 탐구 동아리에서 2년간 활동하며, 복잡한 문제를 단계적으로 해결하는 과정에서 큰 성취감을 느꼈습니다. 이 경험을 바탕으로 입학 후에도 끊임없이 배우고 도전하는 학생이 되겠습니다. 감사합니다.",
    },
    {
        q: "지원 동기가 무엇인가요?",
        script:
            "저는 사회 현상을 데이터로 분석하는 경제학에 매력을 느껴 이 학과에 지원했습니다. 고교 시절, 소비자 물가 상승에 대한 탐구 보고서를 작성하면서 경제학적 사고가 실생활 문제 해결에 얼마나 강력한지를 직접 체험했습니다. 이 학과에서 배운 분석 능력을 사회에 기여하는 데 쓰고 싶습니다.",
    },
    {
        q: "자신의 장점을 말해보세요.",
        script:
            "저의 가장 큰 장점은 '끝까지 파고드는 집요함'입니다. 화학 실험 수업에서 반응 결과가 예상과 다르게 나왔을 때, 포기하지 않고 변수를 바꿔가며 7번의 재실험 끝에 오차 원인을 찾아냈습니다. 이 경험이 저에게 문제 앞에서 물러서지 않는 태도를 길러주었습니다.",
    },
];

export function Step1ReadingTrainer() {
    const [idx, setIdx] = useState(0);
    const [done, setDone] = useState(false);
    const { timeLeft, running, percent, start, reset } = useCountdown(40);
    const sample = SAMPLE_SCRIPTS[idx];

    if (!sample) return null;

    const handleNext = () => {
        reset();
        setDone(false);
        setIdx((i) => (i + 1) % SAMPLE_SCRIPTS.length);
    };

    useEffect(() => {
        if (timeLeft === 0) setDone(true);
    }, [timeLeft]);

    return (
        <div className="flex flex-col gap-5">
            {/* 질문 */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Q 면접 질문</p>
                <p className="text-base font-bold text-slate-800">{sample.q}</p>
            </div>

            {/* 대본 */}
            <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5">
                <p className="text-xs font-bold text-emerald-500 mb-3 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> 소리 내어 읽어보세요
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{sample.script}</p>
            </div>

            {/* 타이머 */}
            <TimerBar percent={percent} timeLeft={timeLeft} color="emerald" />

            {/* 완료 메시지 */}
            <AnimatePresence>
                {done && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-50 p-3 rounded-xl"
                    >
                        <CheckCircle className="w-4 h-4" /> 잘 했어요! 실제 면접에서도 이 호흡으로 말해보세요.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 버튼 */}
            <div className="flex gap-3">
                {!running && !done && (
                    <button
                        onClick={start}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors"
                    >
                        <Play className="w-4 h-4" /> 타이머 시작
                    </button>
                )}
                {(running || done) && (
                    <button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" /> 다시
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                    다음 문장 <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Step 2: 두괄식 순발력 훈련 ──────────────────────────────────
const QUICK_QUESTIONS = [
    "학교생활 중 가장 도전적인 경험은?",
    "왜 이 학과를 선택했나요?",
    "자신의 단점을 솔직하게 말해주세요.",
    "최근 관심 있는 사회 이슈는 무엇인가요?",
    "팀플에서 갈등이 생겼을 때 어떻게 해결했나요?",
    "10년 후 자신의 모습을 그려보세요.",
];

export function Step2PointFirstTrainer() {
    const [qIdx, setQIdx] = useState(0);
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { timeLeft, running, percent, start, reset } = useCountdown(8);

    const handleNext = () => {
        setAnswer("");
        setSubmitted(false);
        reset();
        setQIdx((i) => (i + 1) % QUICK_QUESTIONS.length);
    };

    const handleSubmit = () => {
        if (answer.trim()) setSubmitted(true);
    };

    useEffect(() => {
        if (timeLeft === 0 && !submitted) setSubmitted(true);
    }, [timeLeft, submitted]);

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> 8초 안에 결론부터!
                </p>
                <p className="text-base font-bold text-slate-800">{QUICK_QUESTIONS[qIdx]}</p>
            </div>

            <TimerBar percent={percent} timeLeft={timeLeft} color="amber" />

            {!submitted ? (
                <>
                    {!running && (
                        <button
                            onClick={start}
                            className="flex items-center justify-center gap-2 py-3 bg-amber-400 text-white text-sm font-bold rounded-xl hover:bg-amber-500 transition-colors"
                        >
                            <Play className="w-4 h-4" /> 질문 받기 (타이머 시작)
                        </button>
                    )}
                    {running && (
                        <textarea
                            autoFocus
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="첫 문장만 입력하세요 — 결론부터! (이유 필요 없어요)"
                            rows={3}
                            className="w-full border-2 border-amber-200 rounded-xl p-4 text-sm text-slate-700 focus:outline-none focus:border-amber-400 resize-none"
                        />
                    )}
                    {running && (
                        <button
                            onClick={handleSubmit}
                            className="py-3 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700"
                        >
                            제출하기
                        </button>
                    )}
                </>
            ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                    <div className="bg-white border border-slate-100 rounded-xl p-4">
                        <p className="text-xs text-slate-400 mb-1">내 첫 문장</p>
                        <p className="text-sm font-bold text-slate-800">{answer || "(시간 초과)"}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
                        💡 결론이 첫 문장에 왔나요? "저는 ~~한 사람입니다" 형태로 시작하면 두괄식 완성!
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => { setAnswer(""); setSubmitted(false); reset(); }} className="flex items-center gap-1 px-4 py-3 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200">
                            <RotateCcw className="w-3.5 h-3.5" /> 다시
                        </button>
                        <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700">
                            다음 질문 <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ─── Step 3: 생기부 방어 훈련 ─────────────────────────────────────
const FLASHCARDS = [
    { keyword: "수학 동아리", hint: "어떤 활동을 했나요? 배운 점은?" },
    { keyword: "독서 활동", hint: "어떤 책을 읽었나요? 인상 깊은 내용은?" },
    { keyword: "봉사활동 경험", hint: "어디서 무엇을 했나요? 느낀 점은?" },
    { keyword: "교내 대회 수상", hint: "무슨 대회인가요? 어떻게 준비했나요?" },
    { keyword: "팀 프로젝트", hint: "어떤 역할을 맡았나요? 결과는?" },
    { keyword: "과학 탐구 활동", hint: "어떤 주제를 탐구했나요? 발견한 내용은?" },
];

export function Step3DefenseTrainer() {
    const [cardIdx, setCardIdx] = useState(Math.floor(Math.random() * FLASHCARDS.length));
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const { timeLeft, running, percent, start, reset } = useCountdown(60);
    const card = FLASHCARDS[cardIdx % FLASHCARDS.length];

    if (!card) return null;

    const handleStart = () => {
        setStarted(true);
        setFinished(false);
        start();
    };

    const handleNext = () => {
        reset();
        setStarted(false);
        setFinished(false);
        setCardIdx((i) => (i + 1) % FLASHCARDS.length);
    };

    useEffect(() => {
        if (timeLeft === 0 && started) setFinished(true);
    }, [timeLeft, started]);

    return (
        <div className="flex flex-col gap-5">
            {/* 플래시카드 */}
            <motion.div
                key={cardIdx}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-100 rounded-2xl p-8 text-center"
            >
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> 생기부 키워드
                </p>
                <p className="text-3xl font-black text-violet-800 mb-3">{card.keyword}</p>
                <p className="text-sm text-violet-500">{card.hint}</p>
            </motion.div>

            {started && <TimerBar percent={percent} timeLeft={timeLeft} color="violet" />}

            {!started && !finished && (
                <button
                    onClick={handleStart}
                    className="flex items-center justify-center gap-2 py-4 bg-violet-500 text-white text-sm font-bold rounded-xl hover:bg-violet-600 transition-colors"
                >
                    <Play className="w-4 h-4" /> 1분 타이머 시작 — 말해보세요!
                </button>
            )}

            {started && !finished && (
                <div className="bg-white border border-violet-100 rounded-xl p-4 text-sm text-slate-500">
                    <Lightbulb className="w-4 h-4 text-violet-400 inline mr-1" />
                    이 키워드에 대해 1분간 끊임없이 설명해 보세요. 막히면 힌트({card.hint})를 활용하세요!
                </div>
            )}

            <AnimatePresence>
                {finished && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-sm text-violet-700 font-bold text-center">
                            ✅ 1분 완료! 막히는 부분이 있었다면 그 부분이 앞으로 보강해야 할 포인트예요.
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { reset(); setStarted(false); setFinished(false); }} className="flex items-center gap-1 px-4 py-3 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200">
                                <RotateCcw className="w-3.5 h-3.5" /> 다시
                            </button>
                            <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700">
                                다음 키워드 <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
