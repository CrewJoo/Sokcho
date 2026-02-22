"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointRe() {
    const { setStep, updateData, data, question } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point2: data.point2 },
    });

    const onSubmit = (formData: { point2: string }) => {
        updateData(formData);
        setStep(5);
    };

    const placeholder = question?.guide.point2 || "작성 예시: 이러한 강점을 바탕으로, [구체적 기간] 내에 [구체적 목표]를 달성하는 인재가 되겠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">마무리 결론 (Point)</label>

                <Textarea
                    {...register("point2", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-emerald-500 border-gray-300 shadow-sm"
                />
                {errors.point2 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point2.message}
                    </span>
                )}

                <div className="rounded-xl bg-emerald-50 p-6 text-emerald-900 border border-emerald-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 수미상관으로 완벽하게.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        앞선 주장과 근거를 <strong>한 문장으로 요약</strong>하며,
                        <br />
                        포부와 함께 마무리하면 강력한 <strong>수미상관 구조</strong>가 완성됩니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-emerald-600 text-white hover:bg-emerald-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-emerald-200">
                    AI 분석 받기
                </Button>
            </div>
        </form>
    );
}
