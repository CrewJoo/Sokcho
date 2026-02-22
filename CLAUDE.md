# CLAUDE.md — PREP-5Dsay 프로젝트 가이드

## 프로젝트 개요
PREP-5Dsay는 PREP(Point-Reason-Example-Point) 말하기/글쓰기 훈련 플랫폼입니다.


## 기술 스택
- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: TailwindCSS 3
- **상태관리**: Zustand
- **UI 컴포넌트**: Radix UI, Lucide React 아이콘
- **애니메이션**: Framer Motion
- **AI**: Vercel AI SDK (@ai-sdk/openai)
- **폼**: React Hook Form + Zod 검증
- **DB**: Supabase
- **이메일**: Resend
- **테스트**: Playwright (E2E)
- **차트**: Recharts

## 핵심 디렉토리 구조
```
src/
├── app/                    # Next.js App Router 페이지
│   ├── about/              # PREP 소개 페이지
│   ├── api/                # API 라우트 (transform, contact 등)
│   ├── elenchus/           # 엘렌쿠스(소크라테스 대화) 모듈
│   ├── prep-analysis/      # PREP 분석
│   ├── prep-interview/     # PREP 인터뷰
│   ├── prep-training/      # PREP 훈련
│   ├── prep-transform/     # PREP 변환기
│   ├── prep-word-dancing/  # PREP 워드댄싱
│   └── page.tsx            # 홈페이지 (랜딩)
├── components/
│   ├── common/             # 공통 (main-nav, coaching-modal 등)
│   ├── elenchus/           # 엘렌쿠스 전용 컴포넌트
│   ├── interview/          # 인터뷰 전용 컴포넌트
│   ├── prep/               # PREP 연습 컴포넌트
│   ├── ui/                 # 기본 UI (Button, Progress, OwlIcon 등)
│   └── wizard/             # 위자드(단계별) 레이아웃
├── lib/
│   ├── constants.ts        # 사이트 전체 상수/콘텐츠 데이터
│   ├── utils.ts            # 유틸리티 (cn 함수 등)
│   ├── store.ts            # Zustand 스토어
│   ├── supabase.ts         # Supabase 클라이언트
│   └── *-store.ts          # 각 모듈별 Zustand 스토어
└── store/                  # 추가 스토어
tests/
└── e2e/                    # Playwright E2E 테스트
```

## 코딩 컨벤션
- 컴포넌트 파일명: kebab-case (예: `main-nav.tsx`)
- CSS 클래스: TailwindCSS 유틸리티 클래스 사용
- 스타일 병합: `cn()` 함수 (`lib/utils.ts`)
- 상태관리: Zustand 스토어 패턴 (`lib/*-store.ts`)
- API 라우트: `src/app/api/*/route.ts` (Next.js Route Handlers)
- 환경변수: `.env.local` 사용 (`.env.example` 참조)

## 자주 쓰는 명령어
```bash
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run test:e2e     # Playwright E2E 테스트
npm run test:e2e:ui  # Playwright UI 모드
```

## 주의사항
- 모든 UI 텍스트는 **한국어**로 작성
- 네비게이션 바는 fixed 위치이므로 z-index 주의 (과거 오버랩 이슈 있었음)

