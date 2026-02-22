"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepExample() {
    const { setStep, updateData, data, question } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { example: data.example },
    });

    const onSubmit = (formData: { example: string }) => {
        updateData(formData);
        setStep(4);
    };

    const placeholder = question?.guide.example || "작성 예시 (데이터): 글로벌 컨설팅 기관 Gartner에 따르면, 해당 분야 시장 규모는 2025년까지 연 23% 성장할 것으로 전망됩니다.\n작성 예시 (사례): 넷플릭스는 AI 추천 알고리즘 도입으로 콘텐츠 이탈률을 40% 낮추며 이 주장을 실제로 증명했습니다.\n작성 예시 (개인 경험): 인턴 기간 동안 고객 VOC 분석 자동화 시스템을 도입하여 처리 시간을 주당 12시간에서 2시간으로 단축했습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">구체적 사례 (Example)</label>

                <Textarea
                    {...register("example", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[220px] text-xl p-6 leading-relaxed resize-none focus:ring-emerald-500 border-gray-300 shadow-sm"
                />
                {errors.example && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.example.message}
                    </span>
                )}

                <div className="rounded-xl bg-emerald-50 p-6 text-emerald-900 border border-emerald-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-3">
                        💡 주장을 가장 설득력 있게 뒷받침하는 증거를 선택하세요
                    </p>
                    <ul className="space-y-2 text-base opacity-90">
                        <li><span className="font-bold">📊 데이터/통계:</span> 수치와 출처로 객관성을 확보하세요.</li>
                        <li><span className="font-bold">🏢 객관적 사례:</span> 전공·학계의 구체적 사례로 논리를 증명하세요.</li>
                        <li><span className="font-bold">💬 전문가 의견:</span> 권위 있는 연구·인용으로 신뢰도를 높이세요.</li>
                        <li><span className="font-bold">🙋 개인 경험:</span> 본인의 구체적인 교내외 활동으로 진정성을 더하세요.</li>
                    </ul>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-trust-navy text-white hover:bg-trust-navy/90 py-4 text-lg font-bold rounded-xl">
                    다음 (마무리 짓기)
                </Button>
            </div>
        </form>
    );
}
