"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPoint() {
    const { setStep, updateData, data, question } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point1: data.point1 },
    });

    const onSubmit = (formData: { point1: string }) => {
        updateData(formData);
        setStep(2);
    };

    const placeholder = question?.guide.point || "작성 예시: 저는 [핵심 학업 역량]을 바탕으로, 귀 학과의 [구체적 학문 분야] 연구에 기여하고 싶습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">핵심 결론 (Point)</label>

                <Textarea
                    {...register("point1", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[250px] text-xl p-6 leading-relaxed resize-none focus:ring-emerald-500 border-gray-300 shadow-sm"
                />
                {errors.point1 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point1.message}
                    </span>
                )}

                <div className="rounded-xl bg-emerald-50 p-6 text-emerald-900 border border-emerald-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 두괄식으로 말하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        가장 하고 싶은 말을 명확한 한 문장으로 요약해서 제시하는 단계입니다.
                        <br />
                        질문에 대한 <strong>가장 직접적인 대답</strong>을 먼저 던지세요.
                    </p>
                </div>
            </div>

            <Button type="submit" className="w-full bg-trust-navy py-6 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 h-auto">
                다음 (이유 설명하기)
            </Button>
        </form>
    );
}
