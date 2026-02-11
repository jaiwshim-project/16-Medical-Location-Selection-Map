# 09. 개발자 전달용 최종 PRD (Product Requirements Document)

---

## 문서 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | DentalMap (덴탈맵) |
| 문서 버전 | v1.0 |
| 작성일 | 2025-XX-XX |
| 작성자 | ○○○ (기획) |
| 대상 독자 | 개발팀 (프론트엔드, 백엔드, AI/데이터) |
| 상태 | Draft → Review → **Approved** |

---

## 1. 제품 개요

### 1.1 한 줄 요약
> 치과 개원 예정 원장에게 데이터 기반 입지 분석, 투자 시뮬레이션, AI 결정 리포트를 제공하는 SaaS 웹 서비스

### 1.2 핵심 가치
- **객관성**: 공공·상업 데이터 기반 입지 점수화
- **개인화**: 원장 유형별 맞춤 추천
- **실행 가능성**: 투자금·수익 시뮬레이션 + 실행 로드맵

### 1.3 타겟 사용자
| 사용자 | 설명 | 비중 |
|--------|------|------|
| Primary | 개원 준비 중인 치과의사 (봉직의, 수련의) | 70% |
| Secondary | 인수·이전을 검토하는 기존 원장 | 20% |
| Tertiary | 치과 컨설팅 업체, 금융사 | 10% |

---

## 2. 기술 스택

### 2.1 프론트엔드
```
Framework:    Next.js 14+ (App Router, TypeScript)
Styling:      Tailwind CSS 3.4+
UI Library:   shadcn/ui
Map:          Kakao Maps JavaScript SDK v3
              (대안: Mapbox GL JS — 해외 확장 시)
Charts:       Recharts (레이더, 라인, 바)
State:        Zustand (클라이언트) + TanStack Query v5 (서버)
Form:         React Hook Form + Zod (밸리데이션)
Auth:         NextAuth.js v5
Payment:      토스페이먼츠 JavaScript SDK
PDF:          @react-pdf/renderer
```

### 2.2 백엔드
```
Runtime:      Node.js 20+ (Next.js API Routes)
ORM:          Prisma 5+
Database:     PostgreSQL 15+ with PostGIS 3.4
Hosting:      Supabase (PostgreSQL + Auth + Storage)
Cache:        Redis (Upstash Serverless)
AI:           Claude API (claude-sonnet-4-5-20250929)
              (대안: OpenAI GPT-4o)
File Storage: Supabase Storage (PDF 리포트 등)
Email:        Resend (트랜잭션 이메일)
Job Queue:    Inngest (백그라운드 데이터 갱신)
```

### 2.3 인프라
```
Hosting:      Vercel (프론트 + API)
Database:     Supabase (PostgreSQL + PostGIS)
Monitoring:   Sentry (에러 트래킹)
Analytics:    PostHog (또는 Mixpanel)
CI/CD:        GitHub Actions → Vercel
Domain:       dentmap.co.kr
```

### 2.4 MVP 인프라 월 비용 추정
```
Vercel Pro:         $20/월
Supabase Pro:       $25/월
Upstash Redis:      $10/월
Claude API:         ~$50/월 (분석 건당 ~$0.05)
카카오 Map API:      무료 (일 30만 호출)
Resend:             무료 (월 3,000건)
토스페이먼츠:        결제 건당 3.5%
Sentry:             무료 (5,000 이벤트)
──────────────────────────────
합계:               약 $110/월 (~15만원) + 데이터 비용
```

---

## 3. 기능 명세 (Functional Specification)

### 3.1 MVP 기능 목록 (Phase 1)

| ID | 기능 | 우선순위 | 스프린트 | 담당 |
|----|------|---------|---------|------|
| F01 | 회원가입/로그인 (이메일 + 카카오) | P0 | S1 | FE+BE |
| F02 | 원장 프로필 설문 (5단계) | P0 | S1 | FE |
| F03 | 전국 지도 뷰 (치과 마커) | P0 | S1 | FE |
| F04 | 히트맵 레이어 (인구밀도, 경쟁강도) | P0 | S2 | FE+BE |
| F05 | 지역 클릭 → 사이드패널 요약 | P0 | S2 | FE |
| F06 | 입지 상세 분석 (5축 점수) | P0 | S3 | BE+AI |
| F07 | 투자금 시뮬레이터 (기본) | P0 | S3 | FE+BE |
| F08 | AI 결정 리포트 생성 | P0 | S4 | BE+AI |
| F09 | 리포트 PDF 다운로드 | P1 | S4 | FE |
| F10 | 요금제 & 결제 (토스페이먼츠) | P0 | S4 | FE+BE |
| F11 | 관심 목록 (저장/삭제) | P1 | S5 | FE+BE |
| F12 | 랜딩 페이지 | P0 | S1 | FE |
| F13 | 반응형 (모바일/태블릿) | P1 | S5 | FE |

### 3.2 Phase 2 기능

| ID | 기능 | 예상 시기 |
|----|------|----------|
| F20 | 후보지 비교 대시보드 (최대 3개) | MVP + 1개월 |
| F21 | 개업 vs 인수 비교 판정 | MVP + 1개월 |
| F22 | 인수 매물 DB & 탐색 | MVP + 2개월 |
| F23 | 카드매출 데이터 연동 | MVP + 2개월 |
| F24 | 통신사 유동인구 연동 | MVP + 3개월 |
| F25 | 금융사 대출 비교 연계 | MVP + 3개월 |
| F26 | 전문가 매칭 (인테리어, 세무) | MVP + 4개월 |
| F27 | 개원 후 모니터링 대시보드 | MVP + 6개월 |
| F28 | 블로그/인사이트 콘텐츠 | MVP + 2개월 |

---

## 4. 상세 기능 명세

### F01: 회원가입/로그인

```
[수락 기준]
- 이메일 + 비밀번호 회원가입 가능
- 카카오 소셜 로그인 가능
- 비밀번호: 8자 이상, 영문+숫자 필수
- 가입 후 프로필 설문(F02)으로 리다이렉트
- 중복 이메일 체크
- 비밀번호 재설정 이메일 발송

[API]
POST /api/auth/register  { email, password, name }
POST /api/auth/login     { email, password }
GET  /api/auth/kakao     (OAuth redirect)
POST /api/auth/reset     { email }

[DB]
users 테이블 (스키마 문서 참조)

[UI]
- /register 페이지
- /login 페이지
- 소셜 로그인 버튼
```

### F02: 원장 프로필 설문

```
[수락 기준]
- 5단계 스텝 폼
- 각 단계 건너뛰기 가능 ("나중에 할게요")
- 입력값 users 테이블에 저장
- 완료 시 /map으로 리다이렉트

[5단계 상세]
Step 1: dentist_type (ENUM: trainee, associate, experienced, specialist)
Step 2: opening_type (ENUM: new, acquire, undecided)
Step 3: budget_min_krw, budget_max_krw (BIGINT), include_loan (BOOL)
Step 4: preferred_regions (TEXT[] — 행정동 코드 배열)
Step 5: specialties (TEXT[] — general, implant, ortho, cosmetic, pediatric, other)

[UI]
- 프로그레스 바 (1/5)
- 각 단계 애니메이션 전환 (슬라이드)
- 완료 시 "분석 시작하기" 버튼
```

### F03+F04+F05: 지도 탐색

```
[수락 기준]
- 카카오맵 기반 전국 지도 렌더링
- 줌 레벨에 따른 데이터 표시:
  - 줌 1~7: 시도 단위 색상 코딩
  - 줌 8~10: 시군구 단위 히트맵
  - 줌 11~13: 행정동 단위 히트맵 + 치과 클러스터
  - 줌 14+: 개별 치과 마커
- 히트맵 레이어 전환: 인구밀도 / 경쟁강도 / 임대비용 / 접근성 / 성장성
- 지도 클릭 → 사이드패널에 지역 요약 표시
- 검색창: 지역명/주소 검색 → 해당 위치로 이동

[API]
GET /api/map/regions?zoom={level}&bounds={sw_lat,sw_lng,ne_lat,ne_lng}
  → 현재 뷰포트의 지역 데이터 반환

GET /api/map/clinics?lat={}&lng={}&radius={meter}
  → 반경 내 치과 목록 반환

GET /api/map/heatmap?type={population|competition|cost|access|growth}
  &zoom={level}&bounds={...}
  → 히트맵 타일 데이터 반환

GET /api/regions/{dong_code}/summary
  → 사이드패널용 요약 데이터

[성능 요구사항]
- 지도 로딩: 2초 이내
- 히트맵 전환: 1초 이내
- 마커 클러스터링: 100개 이상 시 자동 그룹핑
```

### F06: 입지 상세 분석

```
[수락 기준]
- 5개 축 각각 0~100점 산출
- 종합 점수 산출 (가중 합산)
- 사용자 유형에 따른 가중치 자동 적용
- 각 축별 상세 데이터 테이블 표시
- 축별 해석 문장 자동 생성 (AI)

[API]
POST /api/analysis/location
  Body: { dong_code, user_id }
  Response: {
    total_score: 72.5,
    grade: "B",
    breakdown: {
      population: { score: 82, data: {...}, text: "..." },
      competition: { score: 55, data: {...}, text: "..." },
      cost: { score: 48, data: {...}, text: "..." },
      access: { score: 91, data: {...}, text: "..." },
      growth: { score: 68, data: {...}, text: "..." }
    },
    weights_applied: { population: 0.25, competition: 0.30, ... },
    user_type: "TYPE_B"
  }

[점수 산출 로직]
→ 03_판단로직_및_알고리즘.md 참조

[유료 기능 분리]
무료: 종합 점수 + 등급만
베이직: 5축 상세 점수 + 해석 문장
프리미엄: 커스텀 가중치 조정 가능
```

### F07: 투자금 시뮬레이터

```
[수락 기준]
- 위치 기반 자동 임대료 추정
- 면적(평수) 슬라이더 조정 가능 (20~80평)
- 각 항목 금액 직접 수정 가능
- 3가지 시나리오 (보수적/기본/낙관) 자동 계산
- 월별 누적 손익 그래프 표시

[기본 항목]
초기 투자:
  - 보증금 (지역 시세 기반 자동 입력)
  - 인테리어 (평당 단가 × 면적)
  - 의료장비 (규모별 기본값)
  - 운영자금 (3개월치)
  - 인허가/기타

월간 비용:
  - 임대료 (지역 시세)
  - 관리비
  - 인건비 (규모별 기본값)
  - 재료비 (매출의 15%)
  - 기타 고정비

월간 수익:
  - 일 평균 환자 수 × 객단가
  - 환자 수: 인구/경쟁 기반 추정
  - 객단가: 진료 구성 기반 추정

[API]
POST /api/analysis/investment
  Body: {
    dong_code,
    area_pyeong: 40,
    overrides: {          // 사용자가 직접 수정한 값
      deposit: 50000000,
      interior: null,     // null = 자동 계산
      ...
    }
  }
  Response: {
    initial_investment: { ... },
    monthly_cost: { ... },
    monthly_revenue: { ... },
    breakeven: {
      optimistic: 12,
      base: 16,
      conservative: 22
    },
    monthly_chart_data: [ { month: 1, cumulative: -27000 }, ... ]
  }
```

### F08: AI 결정 리포트

```
[수락 기준]
- F06 + F07 결과를 종합하여 자연어 리포트 생성
- 8개 섹션 구성 (04_AI_결정리포트_템플릿.md 참조)
- 생성 시간: 30초 이내
- 생성 중 프로그레스 표시

[AI 프롬프트 구조]
System: 역할 정의 + 톤 가이드라인
User: 점수 데이터 + 사용자 프로필 + 지역 데이터
→ Structured output (JSON with text fields)

[API]
POST /api/analysis/report
  Body: { analysis_id, user_id }
  Response: {
    report_id: "uuid",
    sections: {
      executive_summary: "...",
      score_summary: { ... },
      axis_analysis: [ { axis, score, text }, ... ],
      decision: { type, confidence, text },
      investment: { ... },
      risks_opportunities: { risks: [...], opportunities: [...] },
      roadmap: [...],
      disclaimer: "..."
    }
  }

[리포트 저장]
analysis_reports 테이블에 저장
사용자당 조회 가능
```

### F10: 요금제 & 결제

```
[수락 기준]
- 3가지 플랜 표시 (Free, Basic, Premium)
- 월간/연간 토글
- 토스페이먼츠 결제 연동
- 구독 관리 (업그레이드/다운그레이드/해지)
- 세금계산서 발행 안내

[결제 흐름]
1. /pricing에서 플랜 선택
2. /checkout으로 이동
3. 토스페이먼츠 SDK로 카드 결제
4. 웹훅으로 결제 확인 → 구독 활성화
5. /dashboard로 리다이렉트

[API]
POST /api/payments/checkout   { plan, period }
POST /api/payments/webhook    (토스 웹훅)
GET  /api/payments/subscription
PUT  /api/payments/cancel
```

---

## 5. 데이터 파이프라인

### 5.1 데이터 수집 스케줄

```
매일 01:00 - 치과 요양기관 현황 갱신 (건강보험공단)
매주 월 02:00 - 인구통계 갱신 (행정안전부)
매월 1일 03:00 - 상권정보 갱신 (소상공인진흥공단)
매분기 - 임대 시세 갱신 (부동산원)
수시 - 사용자 입력 데이터 (실시간)
```

### 5.2 데이터 처리 파이프라인

```
[Raw Data] → [ETL Job (Inngest)]
  → 좌표 변환 (EPSG:5179 → EPSG:4326)
  → 행정동 코드 매핑
  → 결측치 처리 (이전 값 또는 주변 평균)
  → 정규화 (min-max scaling)
  → [PostgreSQL 적재]
  → [Redis 캐시 갱신]
```

---

## 6. 비기능 요구사항

| 항목 | 요구사항 |
|------|---------|
| 성능 | 페이지 로딩 < 3초 (LCP), 지도 인터랙션 < 100ms |
| 가용성 | 99.5% 업타임 (월 3.6시간 허용 다운타임) |
| 보안 | HTTPS 필수, JWT 인증, SQL Injection 방지, XSS 방지 |
| 접근성 | WCAG 2.1 AA 수준 |
| 브라우저 | Chrome/Edge/Safari 최신 2버전, IE 미지원 |
| 모바일 | 반응형, iOS Safari/Chrome Android 지원 |
| SEO | 랜딩+블로그 SSR, 메타태그, OG 태그 |
| 개인정보 | 개인정보처리방침 필수, 이메일 수집 동의 |
| 로깅 | API 요청 로그, 에러 로그 (Sentry), 분석 이벤트 (PostHog) |

---

## 7. 개발 일정 (예상)

```
Sprint 1 (2주): 인프라 셋업 + 인증 + 랜딩
  - Next.js 프로젝트 초기화
  - Supabase 연동 (DB + Auth)
  - 회원가입/로그인 (F01)
  - 프로필 설문 (F02)
  - 랜딩 페이지 (F12)

Sprint 2 (2주): 데이터 파이프라인 + 지도 기본
  - 공공 API 연동 (인구, 치과, 상권)
  - 데이터 ETL 파이프라인
  - 카카오맵 연동 (F03)
  - 히트맵 레이어 (F04)
  - 사이드패널 (F05)

Sprint 3 (2주): 분석 엔진
  - 5축 점수 산출 엔진 (F06)
  - 투자 시뮬레이터 (F07)
  - 사용자 유형 분류 로직

Sprint 4 (2주): AI 리포트 + 결제
  - AI 리포트 생성 (F08)
  - PDF 다운로드 (F09)
  - 요금제 & 결제 (F10)
  - 유료 기능 접근 제어

Sprint 5 (2주): 마무리 + QA
  - 관심 목록 (F11)
  - 반응형 (F13)
  - 버그 수정 + QA
  - 성능 최적화
  - 베타 배포

──────────────────────────────
총 MVP 개발 기간: 약 10주 (2.5개월)
──────────────────────────────
```

---

## 8. 성공 지표 (KPI)

### MVP 출시 후 3개월 목표

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 가입자 수 | 500명 | DB 집계 |
| 유료 전환율 | 5% (25명) | 구독자/가입자 |
| 월 리포트 생성 | 200건 | 이벤트 로그 |
| NPS (순추천지수) | 40+ | 인앱 설문 |
| 이탈률 | < 60% | PostHog |
| 평균 세션 시간 | > 5분 | PostHog |
| 월 매출 | 250만원+ | 결제 데이터 |

---

## 9. 참조 문서

```
01_데이터_소스_및_스키마.md    — 데이터 소스, 비용, DB 스키마
02_서비스_UX_흐름도.md        — 사용자 여정, 화면 흐름, 네비게이션
03_판단로직_및_알고리즘.md     — 점수 산출, 비교 판정, 추천 알고리즘
04_AI_결정리포트_템플릿.md     — 문장 템플릿, 점수/문장 조합 전략
05_IP보호_특허_저작권.md       — 특허, 저작권, 상표, 영업비밀
06_홈페이지_카피_요금제_전략.md — 카피, 요금제, UI텍스트, 결제
07_HTML구조_가이드.md          — 섹션별 HTML, 기술스택, 컴포넌트
08_특허출원_저작권등록_문서.md  — 특허 청구항, 저작권 패키지
```

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| v1.0 | 2025-XX-XX | 최초 작성 | ○○○ |
