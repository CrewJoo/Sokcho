"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointReDream() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point2: data.point2 },
    });

    const onSubmit = (formData: { point2: string }) => {
        updateData(formData);
        setStep(5);
    };

    const placeholder = "작성 예시: 결국 제 꿈은 단순한 직업 선택이 아닌, 지속가능한 세상을 만들고자 하는 사명감에서 비롯됩니다. 귀사의 신재생에너지 프로젝트팀에서 그 첫걸음을 내딛고 싶습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Dream)</label>

                <Textarea
                    {...register("point2", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-purple-500 border-gray-300 shadow-sm"
                />
                {errors.point2 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point2.message}
                    </span>
                )}

                <div className="rounded-xl bg-purple-50 p-6 text-purple-900 border border-purple-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 꿈과 학교/학과를 하나로 연결하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        나의 꿈이 <strong>이 학교와 이 전공에서만 실현될 수 있는 이유</strong>를 담아 마무리하세요.
                        <br />
                        첫 문장(Point)과 메아리처럼 호응하면 <strong>완벽한 수미상관</strong> 구조가 완성됩니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-purple-600 text-white hover:bg-purple-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-purple-200">
                    AI 분석 받기
                </Button>
            </div>
        </form>
    );
}
