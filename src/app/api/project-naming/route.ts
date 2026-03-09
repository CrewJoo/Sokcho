import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const namingSchema = z.object({
    suggestion1: z.string().describe("첫 번째 추천 수행평가 영역명 (20자 이내, 교과 핵심 개념 + 평가 방식 조합)"),
    suggestion2: z.string().describe("두 번째 추천 수행평가 영역명 (20자 이내, 미래 역량·트렌드 반영)"),
    suggestion3: z.string().describe("세 번째 추천 수행평가 영역명 (20자 이내, 학생 주도성·탐구 과정 강조)"),
    suggestion4: z.string().describe("네 번째 추천 수행평가 영역명 (20자 이내, 교과 융합 또는 사회 연계)"),
    suggestion5: z.string().describe("다섯 번째 추천 수행평가 영역명 (20자 이내, 창의·독창적 관점)"),
    reason1: z.string().describe("suggestion1 추천 이유 (한 문장)"),
    reason2: z.string().describe("suggestion2 추천 이유 (한 문장)"),
    reason3: z.string().describe("suggestion3 추천 이유 (한 문장)"),
    reason4: z.string().describe("suggestion4 추천 이유 (한 문장)"),
    reason5: z.string().describe("suggestion5 추천 이유 (한 문장)"),
    tip: z.string().describe("수행평가 작명 시 교사가 참고할 핵심 팁 2~3문장"),
});

export async function POST(req: Request) {
    const body = await req.json();
    console.log("[project-naming] Received request:", body);
    const { subject, unit, method, competency } = body;

    const systemPrompt = `당신은 2022 개정 교육과정 전문가이자 대학 입학사정관 실무 경험이 있는 수행평가 설계 컨설턴트입니다.
교사가 NEIS(나이스) 학교생활기록부에 입력할 '수행평가 영역명(제목)'을 AI가 추천해 드립니다.

[핵심 목표]
- 단순한 '수행평가 1', '논술형 평가' 같은 형식적 이름이 아닌, 입학사정관이 학생의 역량을 즉시 파악할 수 있는 '주제 × 방법'의 복합 구조 제목을 만들어야 합니다.
- NEIS 글자 수 제한: 영역명은 20자 이내가 이상적입니다 (최대 30자).
- 2022 개정 교육과정의 핵심 역량(비판적 사고력, 창의·융합, 디지털 리터러시, 협업 능력 등)이 자연스럽게 드러나는 제목을 선호합니다.

[좋은 제목의 조건]
1. 구체적: 어떤 내용을 평가하는지 한눈에 파악 가능
2. 차별적: 입학사정관의 눈에 띄는 독창성
3. 역량 반영: 핵심 역량이 제목에 녹아있음
4. 적정 길이: 20자 이내 권장

[추천 제목 예시]
- "AI 활용 데이터 분석 프로젝트" (수학)
- "기후변화 원인 탐구 보고서" (지구과학)
- "PREP 구조 독서 감상문" (국어)
- "지역사회 문제 해결 제안서" (사회)`;

    const userPrompt = `다음 조건에 맞는 수행평가 영역명을 5개 추천해 주세요:
- 과목: ${subject}
- 단원/내용: ${unit}
- 평가 방식: ${method}
- 반영할 핵심 역량: ${competency}`;

    try {
        const result = await streamObject({
            model: openai('gpt-4o'),
            schema: namingSchema,
            temperature: 0.7,
            system: systemPrompt,
            prompt: userPrompt,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("[project-naming] Error calling OpenAI:", error);
        return new Response(JSON.stringify({ error: "Failed to generate AI recommendation" }), { status: 500 });
    }
}
