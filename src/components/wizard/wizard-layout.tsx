import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePrepStore } from "@/lib/store";
import { QUESTIONS_INTERVIEW, QUESTIONS_STUDENT } from "@/lib/constants";

// import { HomeButton } from "@/components/common/home-button";

interface WizardLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
    pageTitle?: string | ReactNode;
    pageDescription?: string | ReactNode;
    theme?: 'emerald' | 'indigo' | 'purple';
}

export function WizardLayout({ children, title, description, pageTitle, pageDescription, theme = 'emerald' }: WizardLayoutProps) {
    const { question, setQuestion, mode } = usePrepStore();

    // ... (useEffect remains same)

    const borderGradients = {
        emerald: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400",
        indigo: "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-500",
        purple: "bg-gradient-to-r from-purple-400 via-violet-500 to-fuchsia-400"
    };

    return (
        <div className="min-h-screen relative pb-20 p-6">
            {/* <HomeButton /> */}

            <div className="max-w-6xl mx-auto px-6 pt-40">
                {/* Page Header (Optional) - Global Page Title */}
                {(pageTitle || pageDescription) && (
                    <div className="text-center mb-16 space-y-6">
                        {pageTitle && (
                            <motion.h1
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight drop-shadow-sm"
                            >
                                {pageTitle}
                            </motion.h1>
                        )}
                        {/* ... (description remains same) */}
                        {pageDescription && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xl text-slate-600 mt-8 md:mt-10 max-w-3xl mx-auto break-keep leading-relaxed bg-white p-6 rounded-2xl border border-slate-200 shadow-xl"
                            >
                                {pageDescription}
                            </motion.div>
                        )}
                    </div>
                )}

                <motion.div
                    // ... (animation props remain same)
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-4xl mx-auto text-center"
                >
                    {/* Question Context Display */}
                    {question && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 text-left w-full pl-2"
                        >
                            <div className="flex items-start gap-4">
                                <span className={`text-4xl font-handwriting font-bold -mt-2 drop-shadow-sm ${theme === 'indigo' ? 'text-indigo-500' : theme === 'purple' ? 'text-purple-500' : 'text-emerald-500'}`}>Q.</span>
                                <h3 className={`text-2xl font-bold leading-tight drop-shadow-sm ${theme === 'indigo' ? 'text-indigo-600' : theme === 'purple' ? 'text-purple-600' : 'text-emerald-600'}`}>
                                    {question.q}
                                </h3>
                                <div className={`flex-1 h-px mt-4 ml-4 self-center ${theme === 'indigo' ? 'bg-indigo-200' : theme === 'purple' ? 'bg-purple-200' : 'bg-emerald-200'}`} />
                            </div>
                        </motion.div>
                    )}

                    <div className="w-full overflow-hidden rounded-2xl bg-white p-8 shadow-2xl sm:p-12 text-left border border-slate-200 relative">
                        {/* Inner Glow */}
                        <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${borderGradients[theme]}`} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-8 mb-4">
                        <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">{title}</h2>
                        {description && (
                            <p className="text-xl text-slate-400 font-medium">{description}</p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
