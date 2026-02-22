"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointDifferent() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point1: data.point1 },
    });

    const onSubmit = (formData: { point1: string }) => {
        updateData(formData);
        setStep(2);
    };

    const placeholder = "작성 예시: 저는 기획자이지만 코드를 읽고 직접 수정할 수 있는 '테크 기획자'입니다. 이 경계를 넘나드는 역량이 개발팀과의 협업 효율을 극대화하는 저의 핵심 차별점입니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Different)</label>

                <Textarea
                    {...register("point1", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[250px] text-xl p-6 leading-relaxed resize-none focus:ring-teal-500 border-gray-300 shadow-sm"
                />
                {errors.point1 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point1.message}
                    </span>
                )}

                <div className="rounded-xl bg-teal-50 p-6 text-teal-900 border border-teal-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: &apos;다름&apos;은 조합에서 나옵니다.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        단순히 &ldquo;특기가 있다&rdquo;가 아니라,{" "}
                        <strong>두 가지 이상의 역량이 결합되어 만들어지는 유일한 가치</strong>를
                        선언하세요. &ldquo;A와 B 모두 할 수 있는 사람&rdquo;이 가장 강력합니다.
                    </p>
                </div>
            </div>

            <Button type="submit" className="w-full bg-trust-navy py-6 text-xl font-bold hover:bg-trust-navy/90 rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 h-auto">
                다음 (이유 설명하기)
            </Button>
        </form>
    );
}
