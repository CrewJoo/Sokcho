import { motion } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";

interface ModeSelectionProps {
    onSelect: (mode: 'INTERVIEW' | 'WORK') => void;
    title?: string;
    subtitle?: string;
    theme?: 'emerald' | 'indigo';
}

export function ModeSelection({ onSelect, title, subtitle, theme = 'emerald' }: ModeSelectionProps) {
    const colors = {
        emerald: {
            title: "text-trust-navy",
            iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
            iconBorder: "border-emerald-100 group-hover:border-emerald-200",
            iconColor: "text-emerald-600",
            iconBg2: "bg-teal-50 group-hover:bg-teal-100",
            iconBorder2: "border-teal-100 group-hover:border-teal-200",
            iconColor2: "text-teal-600",
        },
        indigo: {
            title: "text-slate-900",
            iconBg: "bg-indigo-50 group-hover:bg-indigo-100",
            iconBorder: "border-indigo-100 group-hover:border-indigo-200",
            iconColor: "text-indigo-600",
            iconBg2: "bg-violet-50 group-hover:bg-violet-100",
            iconBorder2: "border-violet-100 group-hover:border-violet-200",
            iconColor2: "text-violet-600",
        }
    };

    const c = colors[theme];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-4 drop-shadow-sm ${c.title}`}>
                {title || "어떤 상황을 준비하고 계신가요?"}
            </h2>
            {subtitle && (
                <p className="text-xl text-slate-600 text-center mb-12">
                    {subtitle}
                </p>
            )}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${!subtitle ? "mt-12" : ""}`}>
                {/* Interview Mode */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect('INTERVIEW')}
                    className="flex flex-col items-center p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all group duration-300 border border-slate-200 relative overflow-hidden"
                >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 border transition-colors shadow-sm ${c.iconBg} ${c.iconBorder}`}>
                        <GraduationCap className={`w-12 h-12 transition-colors ${c.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">대입 면접 / 수시</h3>
                    <p className="text-slate-500 text-center leading-relaxed group-hover:text-slate-700 transition-colors">
                        대입 면접, 모의 면접 등<br />
                        자신의 학업 역량을 어필해야 하는 순간
                    </p>
                </motion.button>

                {/* Work Mode */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect('WORK')}
                    className="flex flex-col items-center p-12 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all group duration-300 border border-slate-200 relative overflow-hidden"
                >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 border transition-colors shadow-sm ${c.iconBg2} ${c.iconBorder2}`}>
                        <BookOpen className={`w-12 h-12 transition-colors ${c.iconColor2}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">생기부 / 자소서</h3>
                    <p className="text-slate-500 text-center leading-relaxed group-hover:text-slate-700 transition-colors">
                        학교생활기록부, 대입 자소서 등<br />
                        논리적인 교내 활동 기록이 필요할 때
                    </p>
                </motion.button>
            </div>
        </div>
    );
}
