import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

const prepSchema = z.object({
    point: z.string().describe("결론/주장 (Point) - 1문장. 두괄식으로 강력하게."),
    reason: z.string().describe("이유/근거 (Reason) - 1~2문장. 논리적 연결."),
    example: z.string().describe("구체적 사례/경험 (Example) - 상세 서술. 상황-액션-결과(STAR) 포함."),
});

const dimensionSchema = z.object({
    label: z.enum([
        "DREAM (비전/목표)",
        "DIFFERENT (차별성)",
        "DIFFICULTY (역경 극복)",
        "STAND (학업 윤리/태도)",
        "TREND (트렌드 이해)"
    ]),
    color: z.enum(["blue", "purple", "red", "green", "orange"]),
    creative_title: z.string().describe("해당 경험을 요약하는 매력적인 헤드라인 (예: 위기를 기회로 바꾼 소통의 리더)"),
    source_text: z.string().describe("학교생활기록부/포트폴리오 원문에서 발췌한 관련 내용 (증거 자료)"),
    prep: prepSchema
});

const analysisResultSchema = z.object({
    five_d: z.array(dimensionSchema).length(5).describe("5가지 차원(Dream, Different, Difficulty, Stand, Trend) 각각에 대한 분석 결과. 반드시 5개 항목을 모두 채워야 함.")
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        let text = "";
        const buffer = Buffer.from(await file.arrayBuffer());

        try {
            if (file.type === "application/pdf") {
                const pdfData = await pdf(buffer);
                text = pdfData.text;
            } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const result = await mammoth.extractRawText({ buffer });
                text = result.value;
            } else {
                // Default to text decoding for txt or others
                text = buffer.toString('utf-8');
            }
        } catch (e) {
            console.error("File parsing error:", e);
            // Fallback: try reading as text if parsing fails (might result in garbage for binary, but safe for txt)
            text = buffer.toString('utf-8');
        }

        // Truncate text if too long to avoid token limits (e.g., 50k chars)
        const truncatedText = text.slice(0, 50000);

        const { object } = await generateObject({
            model: openai("gpt-4o"),
            schema: analysisResultSchema,
            system: `당신은 20년 경력의 대학 입학사정관이자 진학 코치입니다. 
            지원자의 학교생활기록부/포트폴리오를 분석하여 '5D-Say' 프레임워크(Dream, Different, Difficulty, Stand, Trend)에 맞춰 핵심 역량을 도출하고, 
            이를 입학사정관을 설득할 수 있는 논리적인 PREP 구조(Point-Reason-Example) 답변으로 변환해야 합니다.`,
            prompt: `
            [지원자 학교생활기록부/포트폴리오 내용]
            ---
            ${truncatedText}
            ---

            위 내용을 바탕으로 다음 5가지 차원 각각에 가장 적합한 경험, 성과, 또는 가치관을 찾아 분석해주세요.
            각 항목당 하나씩, 총 5개의 분석 결과를 생성해야 합니다.

            1. DREAM (비전/목표): 지원자가 추구하는 가치, 장기적 목표, 전공에 대한 진정성 있는 열정 (Color: blue)
            2. DIFFERENT (차별성): 남들과 다른 고유한 강점, 학업적 역량, 정량적 성과 (Color: purple)
            3. DIFFICULTY (역경 극복): 문제 해결 능력, 실패를 통한 성장, 갈등 해결, 회복 탄력성 (Color: red)
            4. STAND (학업 윤리/태도): 원칙 준수, 협업 태도, 책임감, 성실성, 학업적 가치관 (Color: green)
            5. TREND (트렌드 이해): 전공 분야 최신 기술/이슈에 대한 관심, 학습 능력, 학술 통찰력 (Color: orange)

            [작성 가이드]
            - label과 color는 위 정의된 대로 정확히 매핑하세요.
            - creative_title: 입학사정관의 이목을 끄는 카피라이팅 스타일로 작성하세요.
            - source_text: 분석의 근거가 되는 서류 내 원문을 인용하세요.
            - prep:
                - Point: 두괄식으로 결론 제시 ("저는 ~한 역량을 갖추고 있습니다.")
                - Reason: 그 역량이 왜 중요한지, 또는 내가 왜 그렇게 생각하는지 이유 제시
                - Example: 구체적인 상황(S), 행동(A), 결과(R)가 포함된 경험 서술
            
            만약 특정 차원에 딱 맞는 내용이 없다면, 전체 맥락에서 가장 연관성이 높은 내용을 찾아 논리적으로 연결하여 작성하세요. ('없음'으로 비워두지 말 것)
            `
        });

        return NextResponse.json(object);

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
    }
}
