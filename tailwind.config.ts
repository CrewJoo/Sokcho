import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Cosmic Intelligence Palette
        // slate: default palette is sufficient (includes 950 in v3.4)
        violet: {
          600: "#7c3aed", // Electric Neural Primary
          500: "#8b5cf6", // Hover
        },
        fuchsia: {
          500: "#d946ef", // Gradient Accent
        },
        amber: {
          400: "#fbbf24", // Owl Gold (Luxury Accent)
          500: "#f59e0b",
        },
        // Functional Colors
        success: "#10b981",
        error: "#f43f5e",
        "trust-navy": "#1e293b", // Slate 800 for legacy compatibility
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
