"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepReasonTrend() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { reason: data.reason },
    });

    const onSubmit = (formData: { reason: string }) => {
        updateData(formData);
        setStep(3);
    };

    const placeholder = "작성 예시: 이 트렌드가 중요한 이유는, 환경 문제에 대한 사회적 인식이 높아짐에 따라 '친환경'이 필수가 되고 있기 때문입니다. 관련 연구에 따르면 친환경 공정을 도입한 제품의 소비자 선호도가 평균 10~15% 높으며, 생태계 보전에도 긍정적입니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Reason (Trend)</label>

                <Textarea
                    {...register("reason", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-sky-500 border-gray-300 shadow-sm"
                />
                {errors.reason && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.reason.message}
                    </span>
                )}

                <div className="rounded-xl bg-sky-50 p-6 text-sky-900 border border-sky-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 데이터·근거로 신뢰를 높이세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        트렌드의 중요성을 뒷받침할 <strong>수치, 보고서, 실제 사례</strong>를 활용하면
                        <br />
                        단순한 의견이 아닌 <strong>전문가적 분석</strong>으로 격상됩니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-trust-navy text-white hover:bg-trust-navy/90 py-4 text-lg font-bold rounded-xl">
                    다음 (적용 방안 제시하기)
                </Button>
            </div>
        </form>
    );
}
