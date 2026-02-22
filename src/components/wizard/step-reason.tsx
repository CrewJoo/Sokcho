"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepReason() {
    const { setStep, updateData, data, question } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { reason: data.reason },
    });

    const onSubmit = (formData: { reason: string }) => {
        updateData(formData);
        setStep(3);
    };

    const placeholder = question?.guide.reason || "작성 예시: 왜냐하면 지난 [기간] 동안 [관련 교내 활동]을 수행하며 [구체적 학업 성취]를 달성했기 때문입니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">이유/근거 (Reason)</label>

                <Textarea
                    {...register("reason", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-emerald-500 border-gray-300 shadow-sm"
                />
                {errors.reason && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.reason.message}
                    </span>
                )}

                <div className="rounded-xl bg-emerald-50 p-6 text-emerald-900 border border-emerald-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 주관적 감정보다는 &lsquo;객관적 사실&rsquo;을.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        왜 그렇게 생각하시나요?{" "}
                        <strong>상대방이 납득할 수 있는 구체적인 근거</strong>를 제시해 주세요.
                        <br />
                        수치, 데이터, 사실 기반의 이유일수록 설득력이 높아집니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-trust-navy text-white hover:bg-trust-navy/90 py-4 text-lg font-bold rounded-xl">
                    다음 (경험 증명하기)
                </Button>
            </div>
        </form>
    );
}
