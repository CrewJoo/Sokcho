"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, RefreshCw, Quote, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";



const MAX_FILE_SIZE_MB = 10;

export default function PrepAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStage, setAnalysisStage] = useState<"idle" | "uploading" | "extracting" | "identifying" | "complete">("idle");
    const [result, setResult] = useState<any>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setAnalysisError(`파일 크기가 ${MAX_FILE_SIZE_MB}MB를 초과합니다. 더 작은 파일을 사용해주세요.`);
                return;
            }
            setAnalysisError(null);
            setFile(selected);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setAnalysisError(null);
        setIsAnalyzing(true);
        setAnalysisStage("uploading");

        // Progress simulation
        const intervalId = setInterval(() => {
            setAnalysisStage((prev) => {
                if (prev === "uploading") return "extracting";
                if (prev === "extracting") return "identifying";
                return prev;
            });
        }, 3000);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/analyze-resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Analysis failed");
            }

            const data = await response.json();

            clearInterval(intervalId);
            setAnalysisStage("complete");

            setTimeout(() => {
                setResult(data);
                setIsAnalyzing(false);
            }, 800);
        } catch (error) {
            console.error("Analysis Error:", error);
            clearInterval(intervalId);
            setIsAnalyzing(false);
            setAnalysisStage("idle");
            setAnalysisError("AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요. (API 키 설정을 확인하거나 파일 형식을 점검해주세요.)");
        }
    };

    const resetAnalysis = () => {
        setFile(null);
        setResult(null);
        setAnalysisStage("idle");
    };

    return (
        <div className="min-h-screen relative pb-20 p-6 bg-slate-50">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-6 pt-40">
                <div className="text-center mb-16 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl font-black text-trust-navy tracking-tight flex items-center justify-center gap-4"
                    >
                        <div className="bg-trust-navy rounded-full p-3 flex items-center justify-center shadow-lg">
                            <FileText className="w-10 h-10 text-white" />
                        </div>
                        <span><span className="text-purple-600">5D-Say</span> 학생부 분석</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 max-w-3xl mx-auto break-keep leading-relaxed"
                    >
                        <strong className="text-purple-600">학교생활기록부</strong>  또는 학생 활동이력 파일을 업로드하세요. <br className="hidden sm:block" />
                        AI가 <strong className="text-purple-600">5가지 핵심 역량(5D)</strong>을 정밀 분석하여,<br className="hidden sm:block" />
                        입학사정관을 사로잡는 <strong className="text-purple-600">PREP 합격 답변</strong>으로 구조화해 드립니다.
                    </motion.p>
                </div>

                {/* Analysis Area */}
                <div className="w-full max-w-5xl mx-auto">
                    {!result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200"
                        >
                            <div className="p-8 sm:p-12 flex flex-col items-center text-center">
                                {/* Upload UI */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-10 transition-all ${file ? 'border-success-green bg-success-green/10' : 'border-slate-200 hover:border-violet-400/50 hover:bg-slate-50'}`}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                        disabled={isAnalyzing}
                                    />
                                    <label htmlFor="file-upload" className={`cursor-pointer flex flex-col items-center gap-4 ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}>
                                        <div className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${file ? 'bg-success-green text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {file ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
                                        </div>
                                        <div>
                                            {file ? (
                                                <>
                                                    <p className="font-bold text-lg text-slate-800">{file.name}</p>
                                                    <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB ready to analyze</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-bold text-lg text-slate-700">파일을 드래그하거나 클릭하여 업로드</p>
                                                    <p className="text-sm text-slate-500 mt-1">지원 형식: PDF, WORD, TXT (최대 {MAX_FILE_SIZE_MB}MB)</p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                {/* Action Button & Status */}
                                <div className="mt-8 w-full max-w-sm">
                                    {isAnalyzing ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-3 text-slate-700 font-bold text-lg">
                                                <Loader2 className="h-6 w-6 animate-spin text-success-green" />
                                                <span>
                                                    {analysisStage === 'uploading' && "파일 업로드 중..."}
                                                    {analysisStage === 'extracting' && "텍스트 데이터 추출 중..."}
                                                    {analysisStage === 'identifying' && "5D 핵심 키워드 선별 중..."}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                <motion.div
                                                    className="h-full bg-success-green"
                                                    initial={{ width: "0%" }}
                                                    animate={{
                                                        width: analysisStage === 'uploading' ? "30%" :
                                                            analysisStage === 'extracting' ? "60%" :
                                                                analysisStage === 'identifying' ? "90%" : "100%"
                                                    }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {analysisError && (
                                                <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm text-left">
                                                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                                    <p>{analysisError}</p>
                                                </div>
                                            )}
                                            <Button
                                                size="lg"
                                                className="w-full h-14 text-xl font-bold rounded-xl shadow-lg hover:translate-y-[-2px] transition-all bg-violet-600 hover:bg-violet-700 text-white"
                                                disabled={!file}
                                                onClick={handleAnalyze}
                                            >
                                                분석 시작하기
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        // Result View
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {/* Result Header */}
                            <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-success-green to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        A
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">분석 완료 ({file?.name})</h2>
                                        <p className="text-sm text-slate-500">생기부에서 추출한 5D 차원별 핵심 분석 결과입니다.</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={resetAnalysis} className="gap-2 border-slate-300 text-slate-600 hover:bg-slate-50">
                                    <RefreshCw className="h-4 w-4" /> 다시 분석하기
                                </Button>
                            </div>

                            {/* 5D Results Grid */}
                            <div className="grid grid-cols-1 gap-8">
                                {(result?.five_d || []).map((item: any, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:border-violet-200 transition-all group"
                                    >
                                        {/* Header: Label & Creative Title */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-sm font-black bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-200`}>
                                                    {item.label}
                                                </span>
                                                <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                                                    {item.creative_title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* PREP Content (Prioritized) */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                            {/* Point */}
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 relative group-hover:border-violet-200 transition-colors">
                                                <div className={`absolute -top-3 left-4 bg-${item.color}-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md`}>
                                                    POINT (결론)
                                                </div>
                                                <p className="text-slate-800 font-bold leading-relaxed pt-2">
                                                    "{item.prep.point}"
                                                </p>
                                            </div>

                                            {/* Reason */}
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 relative group-hover:border-violet-200 transition-colors">
                                                <div className="absolute -top-3 left-4 bg-slate-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md">
                                                    REASON (이유)
                                                </div>
                                                <p className="text-slate-600 leading-relaxed pt-2">
                                                    {item.prep.reason}
                                                </p>
                                            </div>

                                            {/* Example (Wider) */}
                                            <div className="md:col-span-2 bg-slate-50 rounded-2xl p-5 border border-slate-200 relative group-hover:border-violet-200 transition-colors">
                                                <div className="absolute -top-3 left-4 bg-slate-500 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md">
                                                    EXAMPLE (사례)
                                                </div>
                                                <p className="text-slate-600 leading-relaxed pt-2">
                                                    {item.prep.example}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Source Evidence (Reference) */}
                                        <div className="bg-slate-50 rounded-xl p-4 flex gap-4 items-start border border-slate-100">
                                            <Quote className="h-5 w-5 text-slate-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                    Reference (생기부/활동 기록)
                                                </p>
                                                <p className="text-slate-500 text-sm italic">
                                                    "{item.source_text}"
                                                </p>
                                            </div>
                                        </div>

                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
