"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHomeStore } from "@/store/use-home-store";
import { useInterviewStore } from "@/lib/interview-store";
import { Menu, X, Home, BarChart3 } from "lucide-react";
import dynamic from "next/dynamic";

const ProgramGuideModal = dynamic(() => import("@/components/common/program-guide-modal").then(mod => mod.ProgramGuideModal), { ssr: false });
const CoachingModal = dynamic(() => import("@/components/common/coaching-modal").then(mod => mod.CoachingModal), { ssr: false });

export function MainNav() {
    const [showGuide, setShowGuide] = useState(false);
    const [showCoaching, setShowCoaching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { viewMode, setViewMode } = useHomeStore();

    // Close all modals and menus when the route changes
    useEffect(() => {
        setShowGuide(false);
        setShowCoaching(false);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Logic: Hide Logo on Main Page (AI/Interview modes) and Subpages (About/Transform),
    // but KEEEP it on '/prep' based on user request ("Except PREP training places").
    const isHome = pathname === '/';
    // const isTrainingPlace = pathname.startsWith('/prep') || pathname.startsWith('/about');

    // If we are on the home page, only show if in intro mode (because other modes have their own header?)
    // Actually, user wants "PREP 생각의 공식" on left when menu items clicked.
    // The menu items lead to subpages.
    const showLogo = (isHome && viewMode === 'intro') || !isHome;

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        goHome();
    };

    const goHome = () => {
        if (isHome) {
            setViewMode('intro');
        } else {
            setViewMode('intro'); // Reset state for when we arrive
            router.push('/');
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="fixed top-6 left-0 z-[9999] w-full p-4 flex justify-center pointer-events-none">
                <nav className="pointer-events-auto w-full max-w-7xl bg-white border border-slate-200 shadow-xl rounded-full px-6 py-4 sm:px-8 sm:py-4 flex justify-between items-center transition-all">
                    {/* Logo - Conditional Visibility */}
                    <div
                        className={`flex flex-col items-start justify-center -space-y-1 cursor-pointer transition-opacity duration-300 flex-shrink-0 group ${showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={handleLogoClick}
                    >
                        <div className="flex items-center gap-2">
                            {/* New Cosmic Logo */}
                            <span className="text-6xl sm:text-5xl font-black tracking-tighter bg-gradient-to-r from-emerald-500 from-[55%] via-indigo-500 via-[85%] to-violet-600 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 group-hover:brightness-110 pr-1">
                                PREP
                            </span>
                            <div className="flex items-end gap-0.5 ml-0">
                                {['오', '디', '세', '이'].map((char, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="w-1 h-1 rounded-full bg-violet-500 mb-0.5 shadow-sm shrink-0" />
                                        <span className="text-2xl sm:text-3xl font-bold text-violet-600 tracking-tight group-hover:text-violet-700 transition-colors leading-none">
                                            {char}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className="text-[0.6rem] sm:text-[0.7rem] font-bold text-slate-400 tracking-[0.2em] uppercase ml-1 opacity-70 group-hover:opacity-100 transition-opacity mt-1">
                            프렙베이스캠프:여러분의 진로성공 파트너
                        </span>
                    </div>

                    {/* Menu Links */}
                    <div className="hidden lg:flex items-center flex-1 ml-4 lg:ml-6 xl:ml-10">
                        {/* Group 1: Text Links (Left Aligned) */}
                        <div className="flex items-center gap-3 lg:gap-5 xl:gap-8 mr-auto pr-4 lg:pr-8 xl:pr-12">
                            {/* PREP Group */}
                            <div className="relative flex flex-col items-start group mr-1 lg:mr-1">
                                <span className="px-4 py-1 lg:px-5 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold whitespace-nowrap border-2 border-emerald-500 bg-emerald-500 text-white cursor-default leading-none">
                                    PREP
                                </span>
                                <div className="absolute top-full left-0 mt-1 py-2.5 px-6 bg-white border border-emerald-300 rounded-2xl flex flex-row gap-8 text-sm font-medium text-slate-600 shadow-xl w-max z-50">
                                    <Link href="/about/prep" className="text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        PREP이란?
                                    </Link>
                                    <Link href="/prep-word-dancing" className="text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        PREP워드댄싱
                                    </Link>
                                    <Link href="/prep-training" className="text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        PREP트레이닝
                                    </Link>
                                    <Link href="/prep-transform" className="text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        PREP변환기
                                    </Link>
                                    <Link href="/prep-level-check" className="text-emerald-600 hover:text-emerald-700 transition-colors whitespace-nowrap flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                        PREP레벨체크
                                    </Link>
                                </div>
                            </div>
                            <Link href="/5d-odyssey" className="text-sm lg:text-sm xl:text-base font-bold text-violet-600 hover:text-violet-700 transition-all whitespace-nowrap">
                                5D오디세이
                            </Link>
                            <Link href="/5d-gwasaeteuk" className="text-sm lg:text-sm xl:text-base font-bold text-violet-600 hover:text-violet-700 transition-all whitespace-nowrap">
                                5D과세특
                            </Link>
                            <Link href="/5d-analysis" className="text-sm lg:text-sm xl:text-base font-bold text-violet-600 hover:text-violet-700 transition-all whitespace-nowrap">
                                5D학생부
                            </Link>
                            <Link href="/5d-elenchus" className="text-sm lg:text-sm xl:text-base font-bold text-violet-600 hover:text-violet-700 transition-all whitespace-nowrap">
                                5D산파술
                            </Link>
                            <Link href="/5d-interview" className="text-sm lg:text-sm xl:text-base font-bold text-violet-600 hover:text-violet-700 transition-all whitespace-nowrap" onClick={() => useInterviewStore.getState().reset()}>
                                5D모의면접
                            </Link>
                        </div>

                        {/* Group 2: Action Buttons (Right Aligned) */}
                        <div className="flex items-center gap-2">
                            <Link
                                href="/danbi-interview"
                                className="px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold whitespace-nowrap transition-all bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md"
                            >
                                AI최종분석
                            </Link>
                            <button
                                onClick={() => setShowGuide(true)}
                                className="px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold whitespace-nowrap transition-all border-2 border-amber-400 bg-white text-amber-600 hover:bg-amber-50 hover:border-amber-500 active:scale-95"
                            >
                                워크숍
                            </button>
                            <button
                                onClick={() => setShowCoaching(true)}
                                className="px-2 py-1 lg:px-3 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold whitespace-nowrap transition-all border-2 border-amber-400 text-amber-600 bg-white hover:bg-amber-50 hover:border-amber-500 active:scale-95"
                            >
                                1:1 코칭
                            </button>

                            <button
                                onClick={goHome}
                                className="p-2 lg:p-2 xl:p-2.5 rounded-full text-slate-400 hover:text-trust-navy hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 active:scale-95 group"
                                aria-label="Home"
                            >
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-slate-600 hover:text-trust-navy transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-md pt-40 px-6 lg:hidden flex flex-col items-center gap-6 animate-in fade-in slide-in-from-top-5 duration-200 overflow-y-auto pb-32">
                    <Link
                        href="/about/prep"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-emerald-600 hover:text-emerald-700 py-2"
                    >
                        PREP이란?
                    </Link>
                    <Link
                        href="/prep-word-dancing"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-emerald-600 hover:text-emerald-700 py-2"
                    >
                        PREP 워드댄싱
                    </Link>
                    <Link
                        href="/prep-training"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-emerald-600 hover:text-emerald-700 py-2"
                    >
                        PREP 트레이닝
                    </Link>
                    <Link
                        href="/prep-transform"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-emerald-600 hover:text-emerald-700 py-2"
                    >
                        PREP 변환기
                    </Link>
                    <Link
                        href="/prep-level-check"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-amber-600 hover:text-amber-700 py-2 flex items-center gap-2"
                    >
                        <BarChart3 className="w-5 h-5" />
                        PREP 레벨체크
                    </Link>
                    <Link
                        href="/5d-odyssey"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-violet-600 hover:text-violet-700 py-2"
                    >
                        5D 오디세이
                    </Link>
                    <Link
                        href="/5d-gwasaeteuk"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-violet-600 hover:text-violet-700 py-2"
                    >
                        5D 과세특
                    </Link>
                    <Link
                        href="/5d-analysis"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-violet-600 hover:text-violet-700 py-2"
                    >
                        5D 학생부
                    </Link>
                    <Link
                        href="/5d-elenchus"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-bold text-violet-600 hover:text-violet-700 py-2"
                    >
                        5D 산파술
                    </Link>
                    <Link
                        href="/5d-interview"
                        onClick={() => {
                            setIsMobileMenuOpen(false);
                            useInterviewStore.getState().reset();
                        }}
                        className="text-lg font-bold text-violet-600 hover:text-violet-700 py-2"
                    >
                        5D 모의면접
                    </Link>
                    {/* 액션 버튼 그룹 (모바일) */}
                    <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col gap-3 w-full">
                        <Link
                            href="/danbi-interview"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-center px-8 py-3.5 rounded-full font-bold text-white bg-blue-600 shadow-sm hover:bg-blue-700 active:scale-95 transition-all text-lg"
                        >
                            AI 최종분석
                        </Link>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setShowGuide(true);
                                }}
                                className="flex-1 px-6 py-3 rounded-full font-bold border-2 border-amber-400 text-amber-600 bg-white hover:bg-amber-50 active:scale-95 transition-all"
                            >
                                워크숍
                            </button>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setShowCoaching(true);
                                }}
                                className="flex-1 px-6 py-3 rounded-full font-bold border-2 border-amber-400 text-amber-600 bg-white hover:bg-amber-50 active:scale-95 transition-all"
                            >
                                1:1 코칭
                            </button>
                        </div>
                    </div>

                    {/* Home Link for Mobile (Icon Only) */}
                    <div className="w-full border-t border-slate-200 mt-6 pt-6 flex justify-center pb-2">
                        <button
                            onClick={goHome}
                            className="p-4 rounded-full text-slate-400 hover:text-trust-navy hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 active:scale-95 group"
                            aria-label="Home"
                        >
                            <Home className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            <ProgramGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
            <CoachingModal isOpen={showCoaching} onClose={() => setShowCoaching(false)} />
        </>
    );
}
