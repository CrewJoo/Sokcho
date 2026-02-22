"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Calendar, MapPin, Users, Target } from "lucide-react";
import { PROGRAM_GUIDE_COPY } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface ProgramGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProgramGuideModal({ isOpen, onClose }: ProgramGuideModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[10002] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
                    >
                        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl pointer-events-auto relative">
                            {/* Header */}
                            <div className="bg-amber-500 p-6 sm:p-8 text-white relative flex-shrink-0">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                                    {PROGRAM_GUIDE_COPY.title}
                                </h2>
                                <p className="text-amber-100 text-lg">
                                    {PROGRAM_GUIDE_COPY.subtitle}
                                </p>
                            </div>

                            {/* Scrollable Body */}
                            <div className="overflow-y-auto p-6 sm:p-10 space-y-12 text-gray-800">

                                {/* 0. Catchphrase */}
                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                                    {PROGRAM_GUIDE_COPY.catchphrase.map((line, i) => (
                                        <p key={i} className="text-xl font-bold text-trust-navy leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>

                                {/* 1. Overview */}
                                <section>
                                    <h3 className="text-2xl font-bold text-trust-navy mb-6 flex items-center gap-2">
                                        <Target className="w-6 h-6" /> {PROGRAM_GUIDE_COPY.overview.title}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {PROGRAM_GUIDE_COPY.overview.items.map((item, i) => (
                                            <div key={i} className="flex bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <span className="font-bold text-gray-500 w-24 flex-shrink-0">{item.label}</span>
                                                <span className="font-medium text-gray-900">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 2. Background (Why Now?) */}
                                <section>
                                    <h3 className="text-2xl font-bold text-trust-navy mb-6">
                                        {PROGRAM_GUIDE_COPY.background.title}
                                    </h3>
                                    <div className="space-y-6">
                                        {PROGRAM_GUIDE_COPY.background.points.map((point, i) => (
                                            <div key={i} className="pl-4 border-l-4 border-amber-200">
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h4>
                                                <p className="text-gray-600 leading-relaxed">{point.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 3. Goals */}
                                <section>
                                    <h3 className="text-2xl font-bold text-trust-navy mb-6">
                                        {PROGRAM_GUIDE_COPY.goals.title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {PROGRAM_GUIDE_COPY.goals.items.map((goal, i) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-10 h-10 rounded-full bg-trust-navy/10 flex items-center justify-center text-trust-navy font-bold mb-4">
                                                    {i + 1}
                                                </div>
                                                <h4 className="text-lg font-bold mb-2">{goal.title}</h4>
                                                <p className="text-sm text-gray-600">{goal.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 4. Curriculum */}
                                <section>
                                    <h3 className="text-2xl font-bold text-trust-navy mb-6 flex items-center gap-2">
                                        <Calendar className="w-6 h-6" /> {PROGRAM_GUIDE_COPY.curriculum.title}
                                    </h3>
                                    <div className="space-y-6">
                                        {PROGRAM_GUIDE_COPY.curriculum.days.map((day, i) => (
                                            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
                                                <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                    <span className="bg-trust-navy text-white px-3 py-1 rounded-full text-sm font-bold">{day.day}</span>
                                                    <h4 className="font-bold text-gray-900 text-lg">{day.theme}</h4>
                                                </div>
                                                <div className="p-6 space-y-4">
                                                    <p className="text-amber-600 font-medium text-sm">{day.goal}</p>
                                                    <div className="space-y-3">
                                                        {day.modules.map((mod, j) => (
                                                            <div key={j} className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                                                                <span className="font-mono text-gray-500 w-20 flex-shrink-0">{mod.time}</span>
                                                                <div>
                                                                    <span className="font-bold text-gray-900 block mb-1">{mod.name}</span>
                                                                    <span className="text-gray-600">{mod.desc}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 5. Outcome */}
                                <section>
                                    <h3 className="text-2xl font-bold text-trust-navy mb-6">
                                        {PROGRAM_GUIDE_COPY.outcome.title}
                                    </h3>
                                    <div className="space-y-4">
                                        {PROGRAM_GUIDE_COPY.outcome.items.map((item, i) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <CheckCircle2 className="w-6 h-6 text-success-green flex-shrink-0 mt-1" />
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                                                    <p className="text-gray-600">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Closing */}
                                <div className="bg-trust-navy text-white p-8 rounded-2xl text-center">
                                    <p className="text-lg sm:text-xl font-medium leading-relaxed whitespace-pre-wrap">
                                        {PROGRAM_GUIDE_COPY.closing}
                                    </p>
                                </div>

                                <div className="text-center pt-4">
                                    <Button onClick={onClose} size="lg" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-10">
                                        닫기
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
