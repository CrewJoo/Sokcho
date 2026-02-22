"use client";

import { useForm } from "react-hook-form";
import { usePrepStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function StepReasonDifferent() {
    const { setStep, updateData, data } = usePrepStore();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { reason: data.reason },
    });

    const onSubmit = (formData: { reason: string }) => {
        updateData(formData);
        setStep(3);
    };

    const placeholder = "작성 예시: 제가 기획과 개발 양쪽을 익힌 이유는, 대학 시절 사이드 프로젝트에서 기획서를 개발팀에 전달할 때마다 '이건 구현이 어렵다'는 벽을 반복적으로 경험했기 때문입니다. 그 간극을 메우기 위해 스스로 코딩을 배우기 시작했고, 이것이 지금의 저를 만들었습니다.";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 text-left">
                <label className="text-xl font-bold text-gray-900 block">Reason (Different)</label>

                <Textarea
                    {...register("reason", { required: "필수 입력 항목입니다." })}
                    placeholder={placeholder}
                    className="min-h-[200px] text-xl p-6 leading-relaxed resize-none focus:ring-teal-500 border-gray-300 shadow-sm"
                />
                {errors.reason && (
                    <span className="text-base font-medium text-red-500 flex items-center gap-2 mt-2">
                        ⚠️ {errors.reason.message}
                    </span>
                )}

                <div className="rounded-xl bg-teal-50 p-6 text-teal-900 border border-teal-100 mt-4">
                    <p className="text-lg font-bold flex items-center gap-2 mb-2">
                        💡 Tip: 다름의 계기를 이야기하세요.
                    </p>
                    <p className="text-base leading-relaxed opacity-90">
                        그 독특한 역량 조합이 <strong>어떤 문제의식 또는 경험에서 출발했는지</strong>를 설명하세요.
                        <br />
                        우연이 아닌 <strong>의도적으로 만들어진 차별점</strong>은 더 강한 설득력을 가집니다.
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="w-1/3">
                    이전
                </Button>
                <Button type="submit" className="w-2/3 bg-trust-navy text-white hover:bg-trust-navy/90 py-4 text-lg font-bold rounded-xl">
                    다음 (차별점 증명하기)
                </Button>
            </div>
        </form>
    );
}
