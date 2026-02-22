import { cn } from "@/lib/utils";

interface OwlIconProps extends React.SVGProps<SVGSVGElement> {
    variant?: "icon" | "watermark" | "loader" | "plain";
    className?: string;
}

export function OwlIcon({ variant = "icon", className, ...props }: OwlIconProps) {
    // Geometric Owl Design
    // Concept: Wisdom Eyes + Geometric Brow/Ear tufts

    if (variant === "watermark") {
        return (
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("opacity-5 w-full h-full", className)}
                {...props}
            >
                <path
                    d="M100 40C60 40 30 70 30 110C30 150 60 180 100 180C140 180 170 150 170 110C170 70 140 40 100 40Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="animate-[pulse_4s_ease-in-out_infinite]"
                />
                <path
                    d="M65 90C65 90 80 110 100 110C120 110 135 90 135 90"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <circle cx="70" cy="80" r="8" fill="currentColor" />
                <circle cx="130" cy="80" r="8" fill="currentColor" />
                <path
                    d="M100 110V140M100 140L85 130M100 140L115 130"
                    stroke="currentColor"
                    strokeWidth="3"
                />
            </svg>
        );
    }

    if (variant === "loader") {
        return (
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("w-12 h-12 text-amber-400", className)}
                {...props}
            >
                <circle cx="35" cy="45" r="8" fill="currentColor" className="animate-[blink_2s_ease-in-out_infinite]" />
                <circle cx="65" cy="45" r="8" fill="currentColor" className="animate-[blink_2s_ease-in-out_0.2s_infinite]" />
                <path
                    d="M35 30L25 15M65 30L75 15"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    // Default Icon / Plain
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-6 h-6", className)}
            {...props}
        >
            <path d="M12 2L8 8H4V12L2 16V22H8L12 18L16 22H22V16L20 12H16L12 2Z" /> {/* Abstract Feather/Shield Shape */}
            <circle cx="9" cy="14" r="1.5" fill="currentColor" />
            <circle cx="15" cy="14" r="1.5" fill="currentColor" />
        </svg>
    );
}
