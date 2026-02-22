"use client";

import { WordDancingGame } from "@/components/prep/word-dancing-game";

export default function Step2Page() {
    return (
        <div className="min-h-screen bg-slate-50 relative">
            <div className="max-w-6xl w-full mx-auto pt-32 pb-20">
                <WordDancingGame level={2} />
            </div>
        </div>
    );
}
