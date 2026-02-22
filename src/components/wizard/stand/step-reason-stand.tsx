"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepReasonStand() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { reason: data.reason },
    });

    const onSubmit = (formData: { reason: string }) => {
        updateData(formData);
        setStep(3);
    };

    const placeholder = "작성 예시: 이 철학이 형성된 것은, 아르바이트 당시 고객 불만 사항을 직접 수집해 개선안을 매니저에게 제안했던 경험 때문입니다. '왜 이게 불편할까?'를 습관처럼 묻는 태도가 저를 단순한 실행자가 아닌 문제 발견자로 만들어 주었습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Reason (Stand)</label>

                <Textarea
                    {...register("reason", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-rose-500 border-gray-300 shadow-sm"
                />
                {errors.reason && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.reason.message}
                    </span>
                )}

                <div className="rounded-xl bg-rose-50 p-6 text-rose-900 border border-rose-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 차별점의 뿌리를 보여주세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        그 철학이나 강점이 <strong>어디서, 어떤 경험을 통해 만들어졌는지</strong>를 설명하세요.
                        <br />
                        뿌리가 있는 강점은 <strong>훈련된 역량</strong>으로 인정받습니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-trust-navy text-white hover:bg-trust-navy/90 py-4 text-lg font-bold rounded-xl">
                    다음 (차별점 증명하기)
                </Button>
            </div>
        </form>
    );
}
