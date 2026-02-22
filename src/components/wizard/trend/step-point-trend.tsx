"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointTrend() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point1: data.point1 },
    });

    const onSubmit = (formData: { point1: string }) => {
        updateData(formData);
        setStep(2);
    };

    const placeholder = "작성 예시: 저는 AI 기반 개인화 서비스가 산업 전반을 재편하는 핵심 트렌드라고 생각하며, 이 흐름이 귀사의 고객 경험 전략에 결정적인 기회를 제공할 것으로 봅니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Trend)</label>

                <Textarea
                    {...register("point1", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[250px] text-xl p-6 leading-relaxed resize-none focus:ring-sky-500 border-gray-300 shadow-sm"
                />
                {errors.point1 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point1.message}
                    </span>
                )}

                <div className="rounded-xl bg-sky-50 p-6 text-sky-900 border border-sky-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 트렌드를 설명하지 말고, 해석하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        누구나 아는 트렌드를 나열하는 것이 아니라,{" "}
                        <strong>&ldquo;이 트렌드가 이 학문/산업에 어떤 의미인가&rdquo;</strong>라는
                        자신만의 관점(Insight)으로 시작하세요.
                    </p>
                </div>
            </div>

            <Button type="submit" className="w-full bg-trust-navy py-6 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 h-auto">
                다음 (이유 설명하기)
            </Button>
        </form>
    );
}
