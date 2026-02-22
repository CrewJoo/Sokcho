"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CoachingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CoachingModal({ isOpen, onClose }: CoachingModalProps) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        const formData = new FormData(e.currentTarget);

        const payload = {
            email: formData.get("email"),
            age: formData.get("age"),
            job: formData.get("job"),
            goal: formData.get("goal"),
            types: formData.getAll("type"),
            timestamp: new Date().toISOString(),
        };

        console.log("Submitting consultation:", payload);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setEmail("");
                }, 3000);
            } else {
                alert("신청 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("신청 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {!submitted ? (
                    <>
                        <div className="bg-amber-500 p-6 -mt-8 -mx-8 mb-6 relative rounded-t-2xl">
                            <h3 className="text-2xl font-bold text-white">1:1 프리미엄 코칭</h3>
                        </div>
                        <p className="mb-6 text-gray-600 text-lg px-1">
                            PREP 5D-Say 프레임워크로 당신만의 합격 서사를 완성해 드립니다.<br />
                            <span className="text-sm text-gray-500 block mt-2">지원 동기부터 면접 답변까지, 입학사정관을 설득하는 '생각의 근육'을 훈련하세요.</span>
                        </p>
                        <form onSubmit={handleWaitlistSubmit} className="space-y-5 px-1">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">연령대</label>
                                    <select name="age" className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:ring-2 focus:ring-trust-navy">
                                        <option>10대</option>
                                        <option>20대</option>
                                        <option>30대</option>
                                        <option>40대 이상</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">직업</label>
                                    <select name="job" className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:ring-2 focus:ring-trust-navy">
                                        <option>고등학생</option>
                                        <option>대학생 (1~2학년)</option>
                                        <option>대학생 (3~4학년)</option>
                                        <option>대학원생</option>
                                        <option>직장인 (1~3년차)</option>
                                        <option>직장인 (경력직 이직)</option>
                                        <option>프리랜서/기타</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">목표</label>
                                <div className="grid grid-cols-2 gap-2 p-1">
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                        <input type="radio" name="goal" value="new_recruit" defaultChecked className="accent-trust-navy w-4 h-4" /> 신입 공채
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                        <input type="radio" name="goal" value="intern" className="accent-trust-navy w-4 h-4" /> 인턴십
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                        <input type="radio" name="goal" value="career_change" className="accent-trust-navy w-4 h-4" /> 경력 이직
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                        <input type="radio" name="goal" value="promotion" className="accent-trust-navy w-4 h-4" /> 승진/평가
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">필요한 코칭 유형</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input type="checkbox" name="type" value="5d_analysis" className="accent-trust-navy w-4 h-4 rounded" /> 오디세이 (스토리/자소서)
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input type="checkbox" name="type" value="prep_strategy" className="accent-trust-navy w-4 h-4 rounded" /> PREP 면접 답변 전략
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input type="checkbox" name="type" value="sop" className="accent-trust-navy w-4 h-4 rounded" /> 자기소개서/경력기술서
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded">
                                        <input type="checkbox" name="type" value="mock_interview" className="accent-trust-navy w-4 h-4 rounded" /> 실전 모의 면접
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <label className="text-sm font-semibold text-gray-700">이메일 주소</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="contact@example.com"
                                    className="w-full rounded-xl border border-gray-300 p-3 text-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-trust-navy"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white">신청하기</Button>
                                <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white border-none" onClick={onClose}>닫기</Button>
                            </div>
                            <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed break-keep">
                                입력하신 정보는 '코칭 및 프로그램 안내' 목적으로만 사용되며, 그 외의 용도로는 사용되지 않습니다. 수집된 개인정보는 관련 법령에 따라 안전하게 보호됩니다.
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <h3 className="text-2xl font-bold text-success-green mb-2">신청 완료!</h3>
                        <p className="text-gray-600">작성해주신 내용을 바탕으로<br />빠른 시일 내에 이메일로 연락드리겠습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
