import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Use Inter instead of Geist
import "./globals.css";
import { MainNav } from "@/components/common/main-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://think-prep.vercel.app'), // TODO: Update with actual domain
  title: {
    default: "PREP오디세이 | AI 시대의 차별화 전략",
    template: "%s | PREP오디세이"
  },
  description: "AI 시대의 한 수 위, 차별화 전략. PREP 5D-Say를 통해 논리적 사고와 설득력을 키우세요.",
  keywords: ["PREP", "5D-Say", "인터뷰", "면접 준비", "논리적 말하기", "AI 코칭"],
  openGraph: {
    title: "PREP오디세이 | AI 시대의 차별화 전략",
    description: "AI 시대의 한 수 위, 차별화 전략. PREP 5D-Say를 통해 논리적 사고와 설득력을 키우세요.",
    url: 'https://think-prep.vercel.app',
    siteName: 'PREP오디세이',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PREP오디세이 | AI 시대의 차별화 전략",
    description: "AI 시대의 한 수 위, 차별화 전략. PREP 5D-Say를 통해 논리적 사고와 설득력을 키우세요.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

import { OwlIcon } from "@/components/ui/owl-icon";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 selection:bg-violet-500/30`}>
        {/* Background Elements */}
        {/* <div className="fixed inset-0 z-[-1] bg-cosmic-gradient opacity-30 pointer-events-none" /> */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <OwlIcon variant="watermark" className="absolute -right-20 -bottom-20 w-[600px] h-[600px] text-slate-200/50 rotate-12" />
        </div>

        <MainNav />
        <main className="isolate">
          {children}
        </main>
      </body>
    </html>
  );
}
