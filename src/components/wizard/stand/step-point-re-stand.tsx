"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointReStand() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point2: data.point2 },
    });

    const onSubmit = (formData: { point2: string }) => {
        updateData(formData);
        setStep(5);
    };

    const placeholder = "작성 예시: 이 '주도적 탐구 자세'는 단순한 태도가 아닌, 저의 학업 방식 자체입니다. 귀 학과에 입학하면 팀 프로젝트의 방향이 모호할 때 가장 먼저 핵심 자료를 분석하고, 근거 있는 제안으로 팀에 기여하겠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Stand)</label>

                <Textarea
                    {...register("point2", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-rose-500 border-gray-300 shadow-sm"
                />
                {errors.point2 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point2.message}
                    </span>
                )}

                <div className="rounded-xl bg-rose-50 p-6 text-rose-900 border border-rose-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 차별점을 입학 후 계획으로 전환하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        &ldquo;남들과 다른 나&rdquo;를 강조하는 것에서 나아가,{" "}
                        <strong>그 차별점이 대학에서 구체적으로 어떤 학업적 성취로 이어질지</strong>를 선언하세요.
                        <br />
                        첫 문장의 철학이 마지막 행동으로 연결될 때 <strong>강력한 수미상관</strong>이 완성됩니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-rose-600 text-white hover:bg-rose-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-rose-200">
                    AI 분석 받기
                </Button>
            </div>
        </form>
    );
}
