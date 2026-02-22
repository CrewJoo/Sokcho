import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const feedbackSchema = z.object({
  feedback: z.string().describe("지원자 답변에 대한 날카로운 지적과 수정 제안"),
  script: z.string().describe("면접장에서 그대로 읽을 수 있는 1분 길이의 다듬어진 스크립트"),
  coaching: z.string().describe("P-R-E-P 각 단계별로 구체적으로 어떻게 개선해야 하는지에 대한 상세 코칭"),
  improved_prep: z.object({
    point1: z.string().describe("개선된 결론 (P)"),
    reason: z.string().describe("개선된 이유 (R)"),
    example: z.string().describe("개선된 사례 (E)"),
    point2: z.string().describe("개선된 재강조 (P)")
  }).describe("지원자의 초안을 바탕으로 더 논리적이고 임팩트 있게 재구성한 PREP 구조")
});

export async function POST(req: Request) {
  const { point1, reason, example, point2 } = await req.json();

  const prompt = `
  지원자의 면접 답변 초안입니다:
  1. 결론(P): ${point1}
  2. 이유(R): ${reason}
  3. 경험(E): ${example}
  4. 재강조(P): ${point2}
  
  당신의 역할:
  당신은 15년차 대학 입학사정관이자 '독설가' 입학사정관입니다. 
  
  지시사항:
  1. [feedback] 필드: 지원자의 논리적 허점과 설득력이 부족한 부분을 날카롭게 지적하세요.
  2. [script] 필드: 바로 면접장에서 사용할 수 있는 '합격 시그널'이 담긴 1분 스피킹 스크립트를 작성하세요. (구어체, 정중함, 자신감)
  3. [coaching] 필드: P-R-E-P 각 단계별로 내용을 어떻게 보강해야 하는지 구체적인 가이드를 제공하세요.
  4. [improved_prep] 필드: 지원자의 초안을 바탕으로 완벽하게 구조화된 PREP 버전을 새로 작성하세요. (단, '일기' 같은 표현은 모두 배제하고 '논리적 보고서' 톤으로 업그레이드할 것)
  
  말투는 정중하지만 내용은 매우 직설적이고 논리적이어야 합니다. 두루뭉술한 칭찬은 지양하십시오.
  `;

  const result = await streamObject({
    model: openai('gpt-4o'),
    schema: feedbackSchema,
    system: "당신은 냉철하고 논리적인 입학사정관입니다.",
    prompt: prompt,
  });

  return result.toTextStreamResponse();
}
