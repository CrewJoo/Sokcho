"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepReasonDifficulty() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { reason: data.reason },
    });

    const onSubmit = (formData: { reason: string }) => {
        updateData(formData);
        setStep(3);
    };

    const placeholder = "작성 예시: 그 상황이 힘들었던 이유는, 마감 3일 전 인력 공백이 생겨 혼자 전체 개발 로드맵을 재설계해야 했기 때문입니다. 처음 맡아본 프로젝트 총괄이었고, 팀원들의 신뢰도 흔들리고 있었습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Reason (Difficulty)</label>

                <Textarea
                    {...register("reason", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-orange-500 border-gray-300 shadow-sm"
                />
                {errors.reason && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.reason.message}
                    </span>
                )}

                <div className="rounded-xl bg-orange-50 p-6 text-orange-900 border border-orange-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 고난의 무게를 구체적으로 전달하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        왜 그것이 어려웠는지, <strong>당시의 조건과 압박감</strong>을 솔직하게 표현하세요.
                        <br />
                        공감을 이끌어낼수록 이후의 <strong>극복 스토리가 더 빛납니다.</strong>
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-trust-navy text-white hover:bg-trust-navy/90 py-4 text-lg font-bold rounded-xl">
                    다음 (극복 과정 증명하기)
                </Button>
            </div>
        </form>
    );
}
