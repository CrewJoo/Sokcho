"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepExampleDream() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { example: data.example },
    });

    const onSubmit = (formData: { example: string }) => {
        updateData(formData);
        setStep(4);
    };

    const placeholder = "작성 예시: 이 꿈을 실현하기 위해 대학에서 신재생에너지 관련 전공 수업을 이수하며 기초를 쌓았고, 지역 태양광 발전소 견학 프로그램에 자발적으로 참여하여 현장 실무를 익혔습니다. 심화 동아리 활동을 통해 탐구 보고서를 완성하며 학업 역량을 축적했습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Example (Dream)</label>

                <Textarea
                    {...register("example", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[220px] text-xl p-6 leading-relaxed resize-none focus:ring-purple-500 border-gray-300 shadow-sm"
                />
                {errors.example && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.example.message}
                    </span>
                )}

                <div className="rounded-xl bg-purple-50 p-6 text-purple-900 border border-purple-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-3">
                        💡 Dream Example 3단계 공식
                    </p>
                    <ul className="space-y-2 text-base opacity-90">
                        <li><span className="font-bold">① 실천 (Action):</span> 꿈을 위해 지금까지 무엇을 했나요?</li>
                        <li><span className="font-bold">② 성장 (Growth):</span> 그 과정에서 무엇을 배우고 어떻게 성장했나요?</li>
                        <li><span className="font-bold">③ 계획 (Plan):</span> 앞으로 어떤 구체적인 로드맵으로 꿈을 이룰 건가요?</li>
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
