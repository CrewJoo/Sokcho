"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointReDifferent() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point2: data.point2 },
    });

    const onSubmit = (formData: { point2: string }) => {
        updateData(formData);
        setStep(5);
    };

    const placeholder = "작성 예시: 결국 저의 차별점은 경계를 두지 않는 사고방식에 있습니다. 귀사에서도 기획-개발-마케팅 사이의 보이지 않는 벽을 허물고, 빠른 실행과 정확한 소통을 동시에 실현하는 다리 역할을 하겠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Different)</label>

                <Textarea
                    {...register("point2", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-teal-500 border-gray-300 shadow-sm"
                />
                {errors.point2 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point2.message}
                    </span>
                )}

                <div className="rounded-xl bg-teal-50 p-6 text-teal-900 border border-teal-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 나의 다름이 조직에 주는 가치를 선언하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        &ldquo;저는 이런 사람입니다&rdquo;에서 끝내지 말고,{" "}
                        <strong>그 독특함이 대학에서 구체적으로 어떤 학업적 과제를 해결하는지</strong>를 연결하세요.
                        <br />
                        다름은 학력 향상이나 교내 기여로 연결될 때 비로소 <strong>선발의 이유</strong>가 됩니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-teal-600 text-white hover:bg-teal-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-teal-200">
                    AI 분석 받기
                </Button>
            </div>
        </form>
    );
}
