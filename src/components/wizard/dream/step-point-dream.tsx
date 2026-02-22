"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointDream() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point1: data.point1 },
    });

    const onSubmit = (formData: { point1: string }) => {
        updateData(formData);
        setStep(2);
    };

    const placeholder = "작성 예시: 저는 지속가능한 에너지 분야의 전문가가 되어, 기후 위기 해결에 실질적으로 기여하는 연구자로 성장하고 싶습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Dream)</label>

                <Textarea
                    {...register("point1", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[250px] text-xl p-6 leading-relaxed resize-none focus:ring-purple-500 border-gray-300 shadow-sm"
                />
                {errors.point1 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point1.message}
                    </span>
                )}

                <div className="rounded-xl bg-purple-50 p-6 text-purple-900 border border-purple-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 꿈을 하나의 선명한 문장으로.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        &ldquo;무엇이 되고 싶다&rdquo;가 아니라, <strong>&ldquo;어떤 가치를 실현하고 싶다&rdquo;</strong>는 방식으로 표현하세요.
                        <br />
                        입학사정관이 첫 문장만 듣고도 당신의 방향성을 파악할 수 있어야 합니다.
                    </p>
                </div>
            </div>

            <Button type="submit" className="w-full bg-trust-navy py-6 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 h-auto">
                다음 (이유 설명하기)
            </Button>
        </form>
    );
}
