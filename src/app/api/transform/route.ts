import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define the schema for the PREP response
const prepSchema = z.object({
  point1: z.string().describe("핵심 주장 (결론) - 두괄식으로 명확하게 (2-3문장)"),
  reason: z.string().describe("주장을 뒷받침하는 논리적 근거 - '왜냐하면' 등으로 구체화 (2-3문장)"),
  example: z.string().describe("구체적인 경험이나 사례 - 상황, 행동, 결과(STAR) 포함하여 풍부하게 (3-4문장)"),
  point2: z.string().describe("마무리 요약 및 재강조 - 입학 후 학업 관련 계획과 연결 (2-3문장)"),
  advice: z.string().describe("논리적 보완을 위한 구체적인 조언"),
  evaluation: z.object({
    // Paper Stage
    is_point_first: z.boolean().describe("핵심 결론(Yes/No/Keyword)이 첫 문장에 두괄식으로 제시되었는가? (1-1)"),
    is_relevant: z.boolean().describe("질문의 의도에 맞고 동문서답하지 않았는가? (1-4)"),
    no_abstract_adjectives: z.boolean().describe("추상적 표현이 없거나, 있더라도 구체적 증거로 뒷받침되었는가? (1-3)"),

    // Interview Stage
    is_logical_why: z.boolean().describe("이유가 타당하고 '왜냐하면'으로 논리적 연결이 자연스러운가? (2-1)"),
    is_structured_reason: z.boolean().describe("'첫째, 둘째'와 같은 구조화 표지를 사용하여 이유를 설명했는가? (2-3)"),
    has_differentiation: z.boolean().describe("누구나 할 수 있는 뻔한 말이 아니라, 지원자만의 차별화된 통찰(Insight)이 있는가? (2-2)"),

    // Final Stage
    has_data_evidence: z.boolean().describe("구체적인 숫자(%, 원, 개)나 성과 데이터가 포함되어 있는가? (3-1)"),
    has_action_verbs: z.boolean().describe("자신의 행동을 구체적인 동사로 묘사했는가? (3-2)"),
    has_vision_connection: z.boolean().describe("입학 후 목표나 대학/학과 비전과 연결하여 마무리했는가? (1-5)"),
  }).describe("각 체크리스트 항목에 대한 AI의 냉철한 O/X 평가"),
});

export async function POST(req: Request) {
  const { input, question } = await req.json();

  const systemPrompt = `당신은 '5D-Say 면접'의 엄격하고 냉철한 AI 입학사정관입니다.
    사용자의 스크립트를 분석하여 PREP 구조와 체크리스트를 기준으로 평가합니다.

    [평가 가이드라인 - 업계 최고 수준의 엄격함 적용]
    0. **Question Relevance**: 사용자의 입력이 질문과 **90% 이상 일치**해야 합니다. 조금이라도 빗나가면 'is_relevant'는 False입니다.
    1. **is_relevant (동문서답)**: 질문의 핵심 키워드가 답변에 포함되어 있지 않거나, 논리적 흐름이 질문과 무관하면 무조건 False. 
    2. **has_data_evidence (데이터 증거)**: 텍스트 내에 숫자(%, 원, 명, 개, 건, 배, 회 등)가 **명시적으로** 존재해야 합니다. "다수의", "많은", "수차례" 같은 표현은 데이터로 인정하지 않습니다. 숫자가 없으면 무조건 False.
    3. **is_point_first (두괄식)**: 첫 번째 문장(마침표 기준)에서 질문에 대한 핵심 결론이 바로 나오지 않으면 False. 서론이 길면 탈락입니다.
    4. **is_structured_reason (구조화)**: '첫째, 둘째' 또는 '그 이유는 세 가지입니다' 등 논리적 구조를 명시하는 표현이 없으면 False.
    5. **has_differentiation (차별화)**: "열심히 하겠다", "최선을 다했다" 등 누구나 쓸 수 있는 상투적인 문구만 나열되어 있다면 False. 지원자만의 구체적인 Insight나 독특한 해결 방식이 보여야 합니다.
    6. **has_vision_connection**: 마지막 문장이 대학/학과의 발전, 본인의 학업적 성장, 또는 구체적인 기여 방안으로 연결되지 않으면 False.

    [Advice 작성 원칙 - 3단계 분석]
    평가 결과(evaluation)가 False인 항목에 대해 다음 3단계 구조로 advice를 작성하세요:
    1. **문제점**: "현재 답변에는 구체적인 데이터(숫자)가 누락되어 있습니다."
    2. **개선 방향**: "성과를 증명할 수 있는 정량적 지표(예: 효율 20% 개선 등)를 포함해야 신뢰도가 높아집니다."
    3. **구체적 예시**: "예를 들어, '많은 고객을 응대했다' 대신 '일 평균 50명의 고객을 응대하며'라고 수정해 보세요."

    [합격 스크립트 작성 가이드 - 마스터피스 수준]
    사용자의 경험을 재료로 삼아, 위 모든 체크리스트를 100% 충족하는 **완벽한 PREP 답변**을 생성하세요.
    - **P (Point)**: 질문에 대한 직접적인 선언적 답변. (가장 강렬하게)
    - **R (Reason)**: 주장을 뒷받침하는 2-3가지 논리적 근거. (구조화 표지 사용)
    - **E (Example)**: 성과가 드러나는 데이터(숫자) 기반의 구체적 사례. (STAR 기법)
    - **P (Point)**: 입학 후 학업 계획 및 기여 방안과 연결된 강렬한 마무리.
    - **주의**: 사용자가 숫자를 제공하지 않았더라도, 문맥상 적절한 가상의 숫자(XXX% 등)를 넣어 "이렇게 숫자를 포함해야 합니다"라는 것을 시각적으로 보여주세요.`;

  const result = await streamObject({
    model: openai('gpt-4o'),
    schema: prepSchema,
    temperature: 0.1,
    system: systemPrompt,
    prompt: `질문: ${question || '자기소개/면접 답변'}\n사용자 입력: ${input}`,
  });

  return result.toTextStreamResponse();
}
