"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointDifficulty() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point1: data.point1 },
    });

    const onSubmit = (formData: { point1: string }) => {
        updateData(formData);
        setStep(2);
    };

    const placeholder = "작성 예시: 저는 팀 프로젝트에서 핵심 개발자가 갑자기 이탈하는 최악의 위기를 경험했고, 그 과정에서 위기 대응 능력과 리더십을 키웠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Difficulty)</label>

                <Textarea
                    {...register("point1", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[250px] text-xl p-6 leading-relaxed resize-none focus:ring-orange-500 border-gray-300 shadow-sm"
                />
                {errors.point1 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point1.message}
                    </span>
                )}

                <div className="rounded-xl bg-orange-50 p-6 text-orange-900 border border-orange-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 고난을 솔직하게, 그러나 성장의 시작으로.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        &ldquo;힘들었다&rdquo;에서 멈추지 말고, <strong>&ldquo;그 고난이 나를 어떻게 바꿨는가&rdquo;</strong>까지 한 문장에 담으세요.
                        <br />
                        입학사정관은 실패 자체가 아닌, 실패를 <strong>어떻게 해석하고 극복했는지</strong>를 봅니다.
                    </p>
                </div>
            </div>

            <Button type="submit" className="w-full bg-trust-navy py-6 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 h-auto">
                다음 (이유 설명하기)
            </Button>
        </form>
    );
}
