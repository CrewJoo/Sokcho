import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: NextRequest) {
    try {
        const { category, currentStep, history, currentInput } = await req.json();

        // category: 'DREAM', etc.
        // currentStep: 1 (Definition), 2 (Elenchus), 3 (Maieutics)
        // history: Array of { step, question, answer }
        // currentInput: Use's latest answer.

        let prompt = "";
        let role = "";
        let nextStep = currentStep + 1;
        let finalSystemInstruction = "";

        // Common System Instruction for Tone
        const systemTone = `
            당신은 '냉철하고 슬기로운 소크라테스'입니다.
            **말투 가이드라인**:
            1. 상대를 "자네"라고 칭하세요.
            2. 문장 끝은 "~하게", "~인가?", "~어떠한가?", "~보게나" 등 고풍스러운 하오체를 사용하세요. (해요체 금지)
            3. 예시: "자네가 생각하는 정의란 무엇인가?", "그렇다면 이 경우는 어떠한가?"
            
            가벼운 공감보다는, 사용자의 지성을 자극하는 날카로운 통찰과 지혜로운 문답을 지향합니다.
            질문은 핵심을 찌르되, 자네가 답변하기 쉽도록 구체적인 선택지나 예시를 곁들이는 지혜를 발휘하게.
            만약 "잘 모르겠어요"라고 답하면, 질책하는 대신 그가 미처 보지 못한 관점을 제시하며 생각의 물꼬를 터주게나.
        `;

        if (currentStep === 1) {
            // STEP 1 -> 2: Elenchus (Challenge -> Gentle Inquiry)
            // Goal: Gently broaden the user's perspective.
            role = `${systemTone}
            사용자의 첫 정의에 대해 부드러운 호기심을 갖고 질문하세요.
            논리적 허점을 찌르기보다, "그렇다면 혹시 이런 상황에서는 어떨까요?"라며 상황을 구체화하는 질문이 좋습니다.`;

            prompt = `
                주제: ${category}
                사용자 답변: "${currentInput}"
                
                미션:
                사용자가 자신의 생각을 조금 더 깊이 들어다볼 수 있도록 돕는 '쉬운 질문' 하나를 던지세요.
                예시: "흥미롭군요! 그렇다면 [반대 상황]일 때도 그 생각이 변함없나요?" 혹은 "그것을 위해 가장 먼저 포기할 수 있는 것은 무엇인가요?"
            `;
        } else if (currentStep === 2) {
            // STEP 2 -> 3: Maieutics (Deepening)
            role = `${systemTone}
            사용자가 고민 끝에 내놓은 답변을 칭찬하고, 핵심 가치(Keyword)를 포착해주세요.`;

            prompt = `
                주제: ${category}
                이전 질문: ${history[history.length - 1]?.question}
                사용자 답변: "${currentInput}"
                
                미션:
                사용자의 답변에서 가장 빛나는 키워드를 찾아내어 언급하고, 그것이 사용자의 '진짜 강점'인지 확인하는 질문을 던지세요.
                예시: "[키워드]라는 표현이 참 좋네요. 그렇다면 님에게 [키워드]란 구체적으로 어떤 행동을 의미하나요?"
            `;
        } else if (currentStep === 3) {
            // STEP 3 -> 4: Synthesis (Suggestion)
            // CRITICAL CHANGE: AI suggests the draft.
            // HISTORY AWARENESS: AI must look at ALL history, especially if current answer is vague.
            role = `${systemTone}
            이제 대화를 정리하는 단계입니다. 사용자의 답변들을 종합하여 가장 멋진 '한 줄 정의'를 선물해주세요.
            만약 사용자가 마지막에 "잘 모르겠다"고 답했다면, 당황하지 말고 이전 단계에서 사용자가 했던 답변들(키워드)을 조합하여 대신 정리해주세요. 절대 없는 말을 지어내지 마세요.`;

            // Construct history context string
            const historyContext = history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n");

            prompt = `
                주제: ${category}
                대화 기록:
                ${historyContext}
                사용자 마지막 답변: "${currentInput}"
                
                미션:
                1. 위 대화 기록 전체를 통찰하여 사용자의 핵심 역량(5D)을 PREP의 'Point(결론)' 형태로 제안해주세요.
                2. [중요] 만약 사용자가 마지막에 "잘 모르겠다"거나 단답형으로 대답했다면, **이전 질문들에 대한 답변(A1, A2...)**에서 힌트를 얻어 종합하세요. 절대 "지속가능성" 같은 뚱딴지 같은 소리를 하지 마세요.
                3. "제가 보기에 당신의 [주제]는 '__________' 인 것 같습니다." 형태로 제안하고, 이 정의가 마음에 드는지 물어보세요.
            `;
        } else if (currentStep === 4) {
            // Finished. Generate Final PREP Paragraph.
            // User has confirmed the synthesis. Now we generate a full paragraph.

            const historyContext = history.map((h: any, i: number) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`).join("\n");

            const finalPrompt = `
                주제: ${category}
                대화 기록:
                ${historyContext}
                사용자 마지막 확인: "${currentInput}"
                
                미션:
                위 대화 내용을 바탕으로, 사용자의 핵심 역량(5D)을 가장 잘 드러내는 **완성된 PREP 한 문단**을 작성해주세요.
                
                조건:
                1. **두괄식(Point)**으로 핵심을 먼저 던지세요.
                2. 그 **이유(Reason)**와 대화 중 언급된 구체적 **사례(Example/Evidence)**를 자연스럽게 연결하세요.
                3. 마지막으로 **재강조(Point)**하며 마무리하세요.
                4. 말투는 "저는 ~입니다."와 같은 자기소개서/면접 답변 톤으로 작성하세요.
                5. 분량은 3~5문장 내외로 깔끔하게 정리하세요.
                6. (중요) 사용자가 대충 말했더라도, 당신이 '찰떡같이' 알아듣고 포장을 잘 해주어야 합니다.
             `;

            const { text: finalPrep } = await generateText({
                model: openai('gpt-4o'),
                system: "당신은 최고의 자기소개서 컨설턴트입니다. 사용자의 투박한 답변을 세련된 문장으로 다듬어주세요.",
                prompt: finalPrompt,
            });

            return NextResponse.json({ nextStep: 'RESULT', nextQuestion: "수고하셨습니다.", finalPrep });
        }

        // Call OpenAI via AI SDK
        const { text } = await generateText({
            model: openai('gpt-4o'),
            system: role,
            prompt: prompt,
        });

        return NextResponse.json({
            nextStep,
            nextQuestion: text
        });

    } catch (error) {
        console.error("Elenchus API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
