"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepExampleTrend() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { example: data.example },
    });

    const onSubmit = (formData: { example: string }) => {
        updateData(formData);
        setStep(4);
    };

    const placeholder = "작성 예시: 실제로 넷플릭스는 콘텐츠 추천 알고리즘 고도화에 집중하여 구독 유지율을 획기적으로 높였고, 스타벅스는 사이렌 오더 앱의 주문 데이터를 분석해 개인화 쿠폰을 제공함으로써 재방문율을 35% 향상시켰습니다. 귀사도 보유한 고객 데이터를 AI로 분석한다면 유사한 효과를 기대할 수 있습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Example (Trend)</label>

                <Textarea
                    {...register("example", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[220px] text-xl p-6 leading-relaxed resize-none focus:ring-sky-500 border-gray-300 shadow-sm"
                />
                {errors.example && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.example.message}
                    </span>
                )}

                <div className="rounded-xl bg-sky-50 p-6 text-sky-900 border border-sky-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-3">
                        💡 트렌드 Example 3단계 공식
                    </p>
                    <ul className="space-y-2 text-base opacity-90">
                        <li><span className="font-bold">① 사례 (Case):</span> 이 트렌드를 선도하는 사례나 연구는 무엇인가요?</li>
                        <li><span className="font-bold">② 성과 (Result):</span> 그 결과 어떤 구체적인 현상/성과가 있었나요?</li>
                        <li><span className="font-bold">③ 적용 (Application):</span> 귀 학과/전공에 어떻게 적용할 수 있을까요?</li>
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
