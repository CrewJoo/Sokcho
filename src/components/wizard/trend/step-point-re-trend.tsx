"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointReTrend() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point2: data.point2 },
    });

    const onSubmit = (formData: { point2: string }) => {
        updateData(formData);
        setStep(5);
    };

    const placeholder = "작성 예시: 결국, AI 개인화 트렌드는 선택이 아닌 생존의 문제입니다. 저는 데이터 분석 역량과 트렌드 감각을 바탕으로, 귀 학과가 이 흐름의 선두 인재를 배출할 수 있도록 학업에 매진하겠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Trend)</label>

                <Textarea
                    {...register("point2", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-sky-500 border-gray-300 shadow-sm"
                />
                {errors.point2 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point2.message}
                    </span>
                )}

                <div className="rounded-xl bg-sky-50 p-6 text-sky-900 border border-sky-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 관찰자에서 실행자로 마무리하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        트렌드를 &ldquo;알고 있다&rdquo;에서 끝내지 말고,{" "}
                        <strong>내가 그 트렌드를 이 학과/전공에서 어떻게 실현할 것인지</strong>를 선언하세요.
                        <br />
                        첫 문장과 호응하는 마무리로 <strong>전문가적 통찰</strong>을 완성하세요.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-sky-600 text-white hover:bg-sky-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-sky-200">
                    AI 분석 받기
                </Button>
            </div>
        </form>
    );
}
