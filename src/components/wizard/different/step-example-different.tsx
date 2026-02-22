"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepExampleDifferent() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { example: data.example },
    });

    const onSubmit = (formData: { example: string }) => {
        updateData(formData);
        setStep(4);
    };

    const placeholder = "작성 예시: 교내 동아리 기장으로 활동하며 부원들 간의 갈등을 중재하고 서로의 피드백을 수용하여 더 나은 창의적 아이디어를 도출해낸 경험이 있습니다. 저는 의견 교류의 중요성을 알고 적극 활용합니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Example (Different)</label>

                <Textarea
                    {...register("example", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[220px] text-xl p-6 leading-relaxed resize-none focus:ring-teal-500 border-gray-300 shadow-sm"
                />
                {errors.example && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.example.message}
                    </span>
                )}

                <div className="rounded-xl bg-teal-50 p-6 text-teal-900 border border-teal-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-3">
                        💡 다름 증명 3단계 공식
                    </p>
                    <ul className="space-y-2 text-base opacity-90">
                        <li><span className="font-bold">① 문제 발견 (Problem):</span> 나의 다름이 필요했던 상황은 무엇인가요?</li>
                        <li><span className="font-bold">② 통합 행동 (Action):</span> 두 역량을 어떻게 동시에 활용했나요?</li>
                        <li><span className="font-bold">③ 나만의 성과 (Result):</span> 그 조합이 만들어낸 유일한 결과는 무엇인가요?</li>
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
