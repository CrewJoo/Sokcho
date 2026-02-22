"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepExampleDifficulty() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { example: data.example },
    });

    const onSubmit = (formData: { example: string }) => {
        updateData(formData);
        setStep(4);
    };

    const placeholder = "작성 예시: 저는 즉시 팀원별 역할을 재분배하고, 야간 작업 일정을 자발적으로 편성했습니다. 핵심 기능을 MVP 단위로 쪼개어 최소한의 완성도를 보장하는 방향으로 방향을 전환했고, 결국 기한 내 배포에 성공했습니다. 이 경험을 통해 위기일수록 '선 구조화, 후 실행'의 원칙이 중요하다는 것을 배웠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Example (Difficulty)</label>

                <Textarea
                    {...register("example", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[220px] text-xl p-6 leading-relaxed resize-none focus:ring-orange-500 border-gray-300 shadow-sm"
                />
                {errors.example && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.example.message}
                    </span>
                )}

                <div className="rounded-xl bg-orange-50 p-6 text-orange-900 border border-orange-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-3">
                        💡 극복 서사 3단계 공식
                    </p>
                    <ul className="space-y-2 text-base opacity-90">
                        <li><span className="font-bold">① 행동 (Action):</span> 위기를 타개하기 위해 구체적으로 무엇을 했나요?</li>
                        <li><span className="font-bold">② 결과 (Result):</span> 그 행동으로 어떤 결과가 나왔나요?</li>
                        <li><span className="font-bold">③ 교훈 (Learning):</span> 이 경험을 통해 무엇을 배우고 어떻게 성장했나요?</li>
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
