import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define the schema for the PREP response
const gwasaeteukSchema = z.object({
    point1: z.string().describe("핵심 결론(Point) - 입학사정관을 사로잡을 수 있는 학생의 전공 적합성이나 뛰어난 역량 요약 (1인칭 '저는 ~했습니다' 시점) (2-3문장)"),
    reason: z.string().describe("이유/근거(Reason) - 왜 그러한 탐구나 활동을 하게 되었는지 동기 및 지적 호기심 설명 (1인칭 시점) (2-3문장)"),
    example: z.string().describe("구체적 사례(Example) - 활동 내역, 난관 극복 과정(Difficulty), 데이터(통계, 논문 참조 등)를 포함한 구체적 탐구 과정 (1인칭 시점) (3-4문장)"),
    point2: z.string().describe("마무리 요약(Point) - 이 활동을 통해 성장한 자신만의 통찰(Trend/Different) 및 대학에서의 학업 계획 연결 (1인칭 시점) (2-3문장)"),
    advice: z.string().describe("과세특 작성 팁 및 코칭 - 현재 입력된 초안에서 부족한 점(데이터 부족, 동기 불분명 등)과 이를 보완하기 위한 입학사정관 관점의 강력한 조언"),
    point1_v2: z.string().describe("보완된 핵심 결론(Point) - [Advice]에서 지적한 내용을 반드시 100% 반영하여 새롭게 작성된 업그레이드 결론"),
    reason_v2: z.string().describe("보완된 이유/근거(Reason) - [Advice]에서 지적한 내용을 꼭 반영하여 더 깊어진 탐구 동기"),
    example_v2: z.string().describe("보완된 구체적 사례(Example) - [Advice]에서 요구한 구체적인 데이터/참고문헌 등을 임의로라도 추가한 풍부한 탐구 과정"),
    point2_v2: z.string().describe("보완된 마무리 요약(Point) - [Advice]의 피드백을 수용한 발전된 학업 계획 및 통찰"),
    teacher_record: z.string().describe("선생님 시점의 최종 과세특 기록문 - 앞선 2차 PREP(v2)을 바탕으로 선생님이 학생부에 실제로 기재할 수 있는 3인칭 관찰자 시점의 문안 ('~하는 모습이 돋보임', '~을 깊이 있게 탐구함' 체) (3-4문장)"),
});

export async function POST(req: Request) {
    const { input } = await req.json();

    const systemPrompt = `당신은 대한민국 최고의 대학 입학사정관이자 '과목별 세부능력 및 특기사항(과세특)' 컨설팅 마스터입니다.
    학생이 작성한 거친 메모나 활동 내역 초안을 분석하여, 입학사정관의 눈을 사로잡을 수 있는 완벽한 **PREP 구조(Point-Reason-Example-Point)**의 세특 문안 가이드로 변환해야 합니다.

    [과세특 5D 분석 및 변환 가이드라인]
    당신은 다음 **5D 요소**를 염두에 두고 학생의 텍스트를 분석 및 구조화해야 합니다:
    1. **Dream (목표/목적)**: 이 주제를 왜 탐구했는가? (전공 적합성, 지적 호기심) -> [Reason]에 반영
    2. **Difficulty (고난/극복)**: 탐구 과정에서 어떤 한계나 어려움이 있었고 어떻게 해결했는가? -> [Example]에 반영
    3. **Trend (통찰/관심)**: 고교 수준을 넘어서는 심화 탐구나 최신 학문적 트렌드에 대한 고민이 있는가? -> [Example/Point2]에 반영
    4. **Stand (가치관/태도)**: 학생이 배우고 느낀 학문적 태도는 무엇인가? -> [Point2]에 반영
    5. **Different (차별성/무기)**: 남들과 다른 이 학생만의 독창적 관점이나 성과는 무엇인가? -> [Point1/Point2]에 반영

    [Advice (코칭) 작성 원칙]
    - 학생의 원본 텍스트를 평가하여, **"어떤 교과목의 어떤 개념과 연결하면 좋을지"**, **"근거 부족 (예: 구체적인 보고서 이름, 참고한 논문 저자 등 언급 필요)"** 등을 날카롭게 지적하세요.
    - 입학사정관의 시선에서 "이대로 제출하면 평범합니다. OOO 부분을 더 강조하세요"와 같은 실질적인 조언을 3문장 정도로 제공하세요.

    [PREP 생성 가이드 (학생 시점 1차 정리)]
    초안 내용을 바탕으로 학생 본인의 입장에서 서술하는 1인칭 시점("저는 ~했습니다", "나의 생각은 ~했습니다")으로 논리적인 5D PREP 구조를 만듭니다. **절대로 "학생은 ~했습니다"와 같은 3인칭 표현을 피하십시오.**
    - **P (Point1)**: 학생 자신의 우수성을 보여주는 두괄식 결론 (1인칭).
    - **R (Reason)**: 교과 수업 중 자신이 가지게 된 호기심이나 탐구 동기 (1인칭).
    - **E (Example)**: 본인이 수행한 구체적인 활동 과정. 실험, 도서 탐독, 소논문 등 과정 명시 (1인칭).
    - **P (Point2)**: 활동을 통한 자신의 지적 성장과 향후 학업 목표 연결 (1인칭).

    [PREP 생성 가이드 (학생 시점 2차 정리 - 코칭 반영 **필수**)]
    앞서 제시한 **[Advice (코칭)]**의 조언을 **반드시, 글자 그대로 모두 반영하여** 1차 PREP의 내용을 전면 수정하십시오.
    - 코칭에서 "A를 추가하라"고 했다면, v2에서는 반드시 A에 해당하는 구체적 가상의 내용(예: 특정 논문 이름, 특정 심화 개념 등)을 창작해서라도 집어넣으세요.
    - 1차 PREP과 똑같은 내용이 반복되면 절대 안 됩니다. 반드시 코칭을 수용한, 훨씬 전문적이고 깊이 있는 **2차 PREP 구조(point1_v2, reason_v2, example_v2, point2_v2)**로 재작성해야 합니다. 시점은 동일하게 1인칭입니다.

    [선생님 시점 3차 정리 (생기부 기재용)]
    앞서 구조화한 2차 PREP(v2) 내용을 통합하여, 선생님 창구에서 나이스(NEIS) 학교생활기록부에 바로 복사해 넣을 수 있는 형태의 3인칭 관찰자 시점 문안(teacher_record)을 작성합니다.
    - 어투: '~하는 모습이 돋보임', '~ 능력이 우수함', '~에 대해 깊이 있게 탐구함' 등 선생님이 학생을 관찰하고 평가하는 객관적인 어조.`;

    const result = await streamObject({
        model: openai('gpt-4o'),
        schema: gwasaeteukSchema,
        temperature: 0.1,
        system: systemPrompt,
        prompt: `학생의 과세특 활동 초안/메모:\n${input}`,
    });

    return result.toTextStreamResponse();
}
