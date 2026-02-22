"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepPointReDifficulty() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { point2: data.point2 },
    });

    const onSubmit = (formData: { point2: string }) => {
        updateData(formData);
        setStep(5);
    };

    const placeholder = "작성 예시: 이 경험은 저에게 위기를 두려워하지 않는 담대함과, 압박 속에서도 냉정하게 우선순위를 설정하는 능력을 길러 주었습니다. 귀사에서도 예상치 못한 변수가 생길 때, 이 경험을 바탕으로 팀을 안정시키는 역할을 하겠습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Point (Difficulty)</label>

                <Textarea
                    {...register("point2", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-orange-500 border-gray-300 shadow-sm"
                />
                {errors.point2 && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.point2.message}
                    </span>
                )}

                <div className="rounded-xl bg-orange-50 p-6 text-orange-900 border border-orange-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 고난의 교훈을 전공 적합성으로 연결하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        단순한 &ldquo;성장했다&rdquo;가 아니라, <strong>그 성장이 이 학과에서 어떻게 발휘될지</strong>를 명확히 하세요.
                        <br />
                        첫 문장(Point)과 호응하도록 마무리하면 <strong>완벽한 수미상관</strong> 구조가 완성됩니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-orange-600 text-white hover:bg-orange-700 py-4 text-lg font-bold rounded-xl shadow-lg shadow-orange-200">
                    AI 분석 받기
                </Button>
            </div>
        </form>
    );
}
