/**
 * PREP 아이콘 — 한자 '因' SVG
 * 에메랄드 원형 배경 + 화이트 '因' 글자
 */
export function PrepIcon({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg flex-shrink-0 ${className}`}>
            <svg
                className="w-9 h-9"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                    fontSize="80"
                    fontWeight="900"
                    fontFamily="sans-serif"
                >
                    P
                </text>
            </svg>
        </div>
    );
}
