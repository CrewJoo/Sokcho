
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Stage = 'Paper' | 'Interview' | 'Final' | 'Hired';

export interface ChecklistItem {
    id: string;
    section: 'P' | 'R' | 'E' | 'P2' | 'Attitude';
    question: string;
    description: string;
    isCritical: boolean;
    isChecked: boolean;
}

interface InvestmentGameState {
    script: string;
    selectedQuestion: string;
    checklist: ChecklistItem[];
    currentStage: Stage;
    stampsEarned: number;
    showStampAnimation: string | null; // ID of the stamp to animate

    setScript: (script: string) => void;
    setSelectedQuestion: (question: string) => void;
    toggleCheck: (id: string) => void;
    setChecked: (ids: string[], isChecked: boolean) => void;
    resetGame: () => void;
    checkStageProgression: () => void;
}

export const initialChecklist: ChecklistItem[] = [
    // Section 1: P (Point) - 서류 전형 (구조)
    { id: '1-1', section: 'P', question: "두괄식 결론?", description: "첫 문장에 핵심 결론(Yes/No/Keyword)이 명확한가?", isCritical: true, isChecked: false },
    { id: '1-4', section: 'P', question: "질문 의도 일치?", description: "동문서답하지 않고 질문에 정확히 답했는가?", isCritical: true, isChecked: false },
    { id: '1-3', section: 'P', question: "구체적 증거?", description: "추상적 형용사('열심히') 대신 구체적 증거가 있는가?", isCritical: true, isChecked: false },

    // Section 2: R (Reason) - 실무 면접 (논리)
    { id: '2-1', section: 'R', question: "논리적 연결(Why)?", description: "'왜냐하면'으로 이어지는 논리가 타당한가?", isCritical: true, isChecked: false },
    { id: '2-3', section: 'R', question: "구조화 표지?", description: "'첫째, 둘째' 등으로 이유를 명확히 구분했는가?", isCritical: true, isChecked: false },
    { id: '2-2', section: 'R', question: "차별화된 관점?", description: "누구나 할 수 있는 말이 아닌, 자신만의 통찰이 있는가?", isCritical: false, isChecked: false },

    // Section 3: E (Example) - 임원 면접 (증거)
    { id: '3-1', section: 'E', question: "수치 데이터(Data)?", description: "구체적인 숫자(%, 원, 개)나 성과 지표가 있는가?", isCritical: true, isChecked: false },
    { id: '3-2', section: 'E', question: "행동 중심 서술?", description: "자신의 행동(Action)을 구체적인 동사로 묘사했는가?", isCritical: false, isChecked: false },
    { id: '1-5', section: 'P2', question: "비전/포부 연결?", description: "지원 학과의 목표나 입학 후 계획 및 비전과 연결하여 마무리했는가?", isCritical: false, isChecked: false },
];

export const useInvestmentGameStore = create<InvestmentGameState>()(
    persist(
        (set, get) => ({
            script: '',
            selectedQuestion: '1분 자기소개', // Default question
            checklist: initialChecklist,
            currentStage: 'Paper',
            stampsEarned: 0,
            showStampAnimation: null,

            setScript: (script) => set({ script }),
            setSelectedQuestion: (selectedQuestion) => set({ selectedQuestion }),

            toggleCheck: (id) => {
                set((state) => {
                    const newChecklist = state.checklist.map((item) =>
                        item.id === id ? { ...item, isChecked: !item.isChecked } : item
                    );

                    // Trigger stamp animation if checking (not unchecking)
                    const isChecking = !state.checklist.find(i => i.id === id)?.isChecked;

                    return {
                        checklist: newChecklist,
                        showStampAnimation: isChecking ? id : null
                    };
                });
                get().checkStageProgression();

                // Reset animation trigger after short delay
                setTimeout(() => set({ showStampAnimation: null }), 1000);
            },

            setChecked: (ids, isChecked) => {
                set((state) => {
                    const newChecklist = state.checklist.map((item) =>
                        ids.includes(item.id) ? { ...item, isChecked } : item
                    );

                    // Show stamp animation for the last item if checking
                    const lastId = ids.length > 0 && isChecked ? ids[ids.length - 1] : null;

                    return {
                        checklist: newChecklist,
                        showStampAnimation: lastId
                    };
                });
                get().checkStageProgression();
                if (isChecked) {
                    setTimeout(() => set({ showStampAnimation: null }), 1000);
                }
            },

            checkStageProgression: () => {
                const { checklist, currentStage } = get();

                // Define stage requirements
                const paperItems = checklist.filter(i => ['P', 'Attitude'].includes(i.section) && parseInt(i.id) < 20); // Quick hack for logic
                // Better filtering based on planned stages:
                // Paper: Section 1 & 4 (IDs starting with 1- or 4-)
                const paperIds = ['1-1', '1-2', '1-3', '1-4', '4-1'];
                const interviewIds = ['2-1', '2-2', '2-3', '5-1'];
                const finalIds = ['3-1', '3-2', '3-3', '1-5'];

                const isPaperComplete = paperIds.every(id => checklist.find(i => i.id === id)?.isChecked);
                const isInterviewComplete = interviewIds.every(id => checklist.find(i => i.id === id)?.isChecked);
                const isFinalComplete = finalIds.every(id => checklist.find(i => i.id === id)?.isChecked);

                let nextStage: Stage = 'Paper';

                if (isPaperComplete) {
                    nextStage = 'Interview';
                }
                if (nextStage === 'Interview' && isInterviewComplete) {
                    nextStage = 'Final';
                }
                if (nextStage === 'Final' && isFinalComplete) {
                    nextStage = 'Hired';
                }

                if (nextStage !== currentStage) {
                    set({ currentStage: nextStage });
                }

                const earned = checklist.filter(i => i.isChecked).length;
                set({ stampsEarned: earned });
            },

            resetGame: () => set({
                script: '',
                checklist: initialChecklist,
                currentStage: 'Paper',
                stampsEarned: 0,
                selectedQuestion: '1분 자기소개',
            }),
        }),
        {
            name: 'investment-game-storage',
        }
    )
);
