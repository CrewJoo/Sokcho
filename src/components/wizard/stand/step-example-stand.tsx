"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepExampleStand() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { example: data.example },
    });

    const onSubmit = (formData: { example: string }) => {
        updateData(formData);
        setStep(4);
    };

    const placeholder = "작성 예시: 졸업 프로젝트에서 팀원들은 기능 구현에 집중했지만, 저는 실사용자 5명을 직접 인터뷰하여 가장 빈번한 불편 지점 3가지를 찾아냈습니다. 이를 반영한 우리 팀 UI는 발표 당일 교수님으로부터 '현장감이 있다'는 유일한 평가를 받았고, 최우수 프로젝트로 선정되었습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Example (Stand)</label>

                <Textarea
                    {...register("example", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[220px] text-xl p-6 leading-relaxed resize-none focus:ring-rose-500 border-gray-300 shadow-sm"
                />
                {errors.example && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.example.message}
                    </span>
                )}

                <div className="rounded-xl bg-rose-50 p-6 text-rose-900 border border-rose-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-3">
                        💡 차별점 증명 3단계 공식
                    </p>
                    <ul className="space-y-2 text-base opacity-90">
                        <li><span className="font-bold">① 상황 (Situation):</span> 나의 접근이 달랐던 구체적인 상황은 무엇인가요?</li>
                        <li><span className="font-bold">② 행동 (Action):</span> 남들과 다르게 무엇을 했나요?</li>
                        <li><span className="font-bold">③ 성과 (Result):</span> 그 나만의 관점이 만들어낸 결과는 무엇인가요?</li>
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
