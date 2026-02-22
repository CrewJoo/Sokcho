import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // Analysis might take longer

// Schema for 5D-PREP Matrix and Feedback
const analysisSchema = z.object({
    matrix: z.object({
        dream: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }).describe("DREAM 항목의 PREP 구조화"),
        difficulty: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }).describe("DIFFICULTY 항목의 PREP 구조화"),
        trend: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }).describe("TREND 항목의 PREP 구조화"),
        stand: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }).describe("STAND 항목의 PREP 구조화"),
        different: z.object({ p: z.string(), r: z.string(), e: z.string(), p2: z.string() }).describe("DIFFERENT 항목의 PREP 구조화"),
    }),
    feedback: z.object({
        dream: z.string().describe("DREAM 항목에 대한 원포인트 레슨"),
        difficulty: z.string().describe("DIFFICULTY 항목에 대한 원포인트 레슨"),
        trend: z.string().describe("TREND 항목에 대한 원포인트 레슨"),
        stand: z.string().describe("STAND 항목에 대한 원포인트 레슨"),
        different: z.string().describe("DIFFERENT 항목에 대한 원포인트 레슨"),
    }),
    scores: z.object({
        dream: z.number().min(0).max(10).describe("DREAM 항목 평가 점수 (0-10)"),
        difficulty: z.number().min(0).max(10).describe("DIFFICULTY 항목 평가 점수 (0-10)"),
        trend: z.number().min(0).max(10).describe("TREND 항목 평가 점수 (0-10)"),
        stand: z.number().min(0).max(10).describe("STAND 항목 평가 점수 (0-10)"),
        different: z.number().min(0).max(10).describe("DIFFERENT 항목 평가 점수 (0-10)"),
    }).describe("각 항목별 역량 균형도를 나타내는 점수"),
    overallFeedback: z.string().describe("지원자에 대한 냉정하고 객관적인 종합 평가 (500자 내외). 입학사정관의 시선에서 대입 합격 가능성이나 치명적인 약점 등을 직설적으로 언급할 것."),
});

export async function POST(req: Request) {
    const { answers, mode } = await req.json();

    const modeLabel = mode === 'SCHOOL' ? '고교생 대입 심층 면접 (학생부 종합 전형)'
        : mode === 'TRANSFER' ? '대학 편입학 심층 면접 (전공 적합성 중심)'
            : '대입/진학 심층 면접 (지원자 종합 평가)';

    const context = `
    [Interview Mode]: ${modeLabel}
    
    [Candidate's 5D Answers]
    1. Dream (Vision): ${answers.dream}
    2. Difficulty (Adversity): ${answers.difficulty}
    3. Trend (Insight): ${answers.trend}
    4. Stand (Values): ${answers.stand}
    5. Different (Uniqueness): ${answers.different}
    `;

    const roleDescription = mode === 'TRANSFER'
        ? "You are an expert Admissions Officer evaluating candidates for university transfer."
        : "You are an expert Admissions Officer evaluating high school students for university admission.";

    const systemPrompt = `
    # Role
    ${roleDescription}
    Analyze the candidate's 5D answers provided below.
    
    # Tone & Attitude
    **Extremely Cold, Objective, and Professional.**
    - Do not praise unnecessarily.
    - Point out weaknesses directly.
    - Evaluate as if you are deciding whether to pass or fail this candidate in a real high-stakes interview.
    
    # 5D Framework Definition
    1. DREAM: Mission-oriented vision.
    2. DIFFICULTY: Overcoming adversity and lessons learned.
    3. TREND: Insight into industry/social changes.
    4. STAND: Professional ethics and values.
    5. DIFFERENT: Unique originality.

    # Task
    Analyze the provided answers and output the following JSON format:
    1. [Matrix] Refine/Restructure each 5D answer into a PREP format (Point, Reason, Example, Point). Infill missing logic if necessary.
    2. [Feedback] Provide specific, calculating constructive feedback for improvement for each dimension.
    3. [Scores] Evaluate the quality on a scale of 0-10.
    4. [Overall Feedback] Provide a comprehensive, cold, and objective review of the candidate. Mention specific strengths but focus on critical weaknesses or areas that need significant improvement to pass the university admission interview.
    
    Output in Korean.
    `;

    const result = await streamObject({
        model: openai('gpt-4o'),
        schema: analysisSchema,
        system: systemPrompt,
        prompt: context,
    });

    return result.toTextStreamResponse();
}
