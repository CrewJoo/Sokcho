"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepReasonDream() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { reason: data.reason },
    });

    const onSubmit = (formData: { reason: string }) => {
        updateData(formData);
        setStep(3);
    };

    const placeholder = "작성 예시: 고등학교 시절, 지역 사회의 에너지 빈곤 문제를 접한 경험이 계기였습니다. 당시 전기 없이 공부하는 친구들을 보며, 에너지 접근성이 삶의 기회 자체를 좌우한다는 것을 절감했고, 이를 해결하는 일을 평생의 과업으로 삼기로 결심했습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Reason (Dream)</label>

                <Textarea
                    {...register("reason", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-purple-500 border-gray-300 shadow-sm"
                />
                {errors.reason && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.reason.message}
                    </span>
                )}

                <div className="rounded-xl bg-purple-50 p-6 text-purple-900 border border-purple-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 진정성이 설득력입니다.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        단순한 &ldquo;좋아서&rdquo;가 아닌, <strong>삶에서 경험한 구체적인 순간</strong>을 근거로 제시하세요.
                        <br />
                        입학사정관은 꿈의 크기보다 <strong>꿈의 뿌리</strong>를 봅니다.
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
