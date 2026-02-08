# 07. 실제 웹페이지용 섹션별 HTML/구조 가이드

---

## 기술 스택 권장

```
Frontend:  Next.js 14+ (App Router) + TypeScript
UI:        Tailwind CSS + shadcn/ui
지도:      Kakao Maps SDK 또는 Mapbox GL JS
차트:      Recharts 또는 Apache ECharts
상태관리:  Zustand (가벼움) 또는 TanStack Query (서버 상태)
인증:      NextAuth.js (카카오/네이버 소셜)
결제:      토스페이먼츠 SDK 또는 Stripe

Backend:   Next.js API Routes + Prisma ORM
DB:        PostgreSQL + PostGIS (Supabase 추천)
AI:        OpenAI API (GPT-4) 또는 Claude API
캐싱:      Redis (Upstash)
배포:      Vercel + Supabase

MVP 기준 예상 인프라 비용: 월 30~50만원
```

---

## 1. 랜딩 페이지 구조 (/)

```html
<!-- ============================================================ -->
<!-- 랜딩 페이지 전체 구조                                         -->
<!-- ============================================================ -->

<!-- SECTION 1: 네비게이션 -->
<header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
  <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- 좌: 로고 -->
    <a href="/" class="flex items-center gap-2">
      <img src="/logo.svg" alt="DentMap" class="h-8" />
      <span class="font-bold text-xl">덴트맵</span>
    </a>

    <!-- 중앙: 메뉴 (데스크톱) -->
    <div class="hidden md:flex items-center gap-8">
      <a href="/map">지도 탐색</a>
      <a href="/pricing">요금제</a>
      <a href="/blog">블로그</a>
      <a href="/faq">고객센터</a>
    </div>

    <!-- 우: CTA -->
    <div class="flex items-center gap-3">
      <a href="/login" class="text-sm text-gray-600">로그인</a>
      <a href="/register" class="btn-primary">무료로 시작하기</a>
    </div>

    <!-- 모바일 햄버거 -->
    <button class="md:hidden">☰</button>
  </nav>
</header>

<!-- SECTION 2: Hero -->
<section class="relative min-h-[80vh] flex items-center">
  <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
    <!-- 좌: 텍스트 -->
    <div class="flex flex-col justify-center">
      <h1 class="text-4xl md:text-6xl font-bold leading-tight">
        개원,<br/>감이 아니라<br/>
        <span class="text-blue-600">데이터</span>로.
      </h1>
      <p class="mt-6 text-lg text-gray-600 leading-relaxed">
        인구, 경쟁, 임대료, 교통, 성장성 —<br/>
        5가지 핵심 데이터를 AI가 분석하고,<br/>
        선생님에게 딱 맞는 개원 입지를 추천합니다.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-3">
        <a href="/register" class="btn-primary text-lg px-8 py-4">
          무료로 내 입지 분석하기 →
        </a>
      </div>
      <p class="mt-3 text-sm text-gray-400">
        가입 후 1개 지역 무료 분석 · 카드 등록 불필요
      </p>
    </div>

    <!-- 우: 대시보드 목업 이미지/영상 -->
    <div class="relative">
      <img src="/hero-dashboard.png" alt="덴트맵 대시보드"
           class="rounded-2xl shadow-2xl" />
      <!-- 플로팅 카드 -->
      <div class="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
        <p class="text-sm text-gray-500">종합 점수</p>
        <p class="text-3xl font-bold text-blue-600">81점</p>
        <p class="text-xs text-green-600">상위 15%</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 3: 신뢰 지표 (소셜 프루프 바) -->
<section class="bg-gray-50 py-8">
  <div class="max-w-5xl mx-auto px-6 flex flex-wrap justify-center gap-12">
    <div class="text-center">
      <p class="text-2xl font-bold">3,200+</p>
      <p class="text-sm text-gray-500">분석 완료</p>
    </div>
    <div class="text-center">
      <p class="text-2xl font-bold">1,500+</p>
      <p class="text-sm text-gray-500">가입 원장</p>
    </div>
    <div class="text-center">
      <p class="text-2xl font-bold">4.7/5.0</p>
      <p class="text-sm text-gray-500">만족도</p>
    </div>
    <div class="text-center">
      <p class="text-2xl font-bold">15종+</p>
      <p class="text-sm text-gray-500">분석 데이터</p>
    </div>
  </div>
</section>

<!-- SECTION 4: 문제 제기 -->
<section class="py-20">
  <div class="max-w-4xl mx-auto px-6 text-center">
    <h2 class="text-3xl md:text-4xl font-bold">
      치과 원장 10명 중 7명,<br/>
      <span class="text-red-500">"입지 선정이 가장 어려웠다"</span>
    </h2>
    <div class="mt-12 grid md:grid-cols-2 gap-6 text-left">
      <!-- 문제점 카드 4개 -->
      <div class="bg-red-50 rounded-xl p-6 border border-red-100">
        <span class="text-red-400 text-2xl">✕</span>
        <p class="mt-2 font-semibold">부동산 중개사의 주관적 추천에 의존</p>
      </div>
      <div class="bg-red-50 rounded-xl p-6 border border-red-100">
        <span class="text-red-400 text-2xl">✕</span>
        <p class="mt-2 font-semibold">지인 소개로 '감'에 의한 결정</p>
      </div>
      <div class="bg-red-50 rounded-xl p-6 border border-red-100">
        <span class="text-red-400 text-2xl">✕</span>
        <p class="mt-2 font-semibold">인구·경쟁·임대료 데이터를 직접 수집</p>
      </div>
      <div class="bg-red-50 rounded-xl p-6 border border-red-100">
        <span class="text-red-400 text-2xl">✕</span>
        <p class="mt-2 font-semibold">개원 후에야 "여기가 아니었는데" 후회</p>
      </div>
    </div>
    <p class="mt-10 text-xl text-blue-600 font-semibold">
      덴트맵은 이 모든 과정을 데이터로 바꿉니다.
    </p>
  </div>
</section>

<!-- SECTION 5: 핵심 기능 -->
<section class="py-20 bg-gray-50">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl md:text-4xl font-bold text-center">
      개원의 모든 숫자, 한눈에.
    </h2>

    <!-- 기능 카드 그리드 -->
    <div class="mt-16 grid md:grid-cols-3 gap-8">
      <!-- 카드 1 -->
      <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
          📍
        </div>
        <h3 class="mt-4 text-xl font-bold">입지 히트맵</h3>
        <p class="mt-2 text-gray-600">
          전국 치과 분포, 인구밀도, 유동인구를
          히트맵으로 한눈에 파악하세요.
        </p>
      </div>

      <!-- 카드 2 -->
      <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
        <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
          📊
        </div>
        <h3 class="mt-4 text-xl font-bold">AI 입지 점수</h3>
        <p class="mt-2 text-gray-600">
          인구·경쟁·비용·접근성·성장성 5개 축으로
          100점 만점의 객관적 점수를 확인하세요.
        </p>
      </div>

      <!-- 카드 3 -->
      <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
        <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
          💰
        </div>
        <h3 class="mt-4 text-xl font-bold">투자 시뮬레이터</h3>
        <p class="mt-2 text-gray-600">
          보증금, 인테리어, 장비, 인건비까지
          맞춤형 투자금과 손익분기를 계산합니다.
        </p>
      </div>

      <!-- 카드 4 -->
      <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
        <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
          ⚖️
        </div>
        <h3 class="mt-4 text-xl font-bold">개업 vs 인수</h3>
        <p class="mt-2 text-gray-600">
          같은 지역의 신규 개원과 인수 매물을
          동시에 비교하고 최적 선택을 안내합니다.
        </p>
      </div>

      <!-- 카드 5 -->
      <div class="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
        <div class="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-2xl">
          📋
        </div>
        <h3 class="mt-4 text-xl font-bold">AI 결정 리포트</h3>
        <p class="mt-2 text-gray-600">
          점수와 분석을 종합한 AI 리포트로
          은행 상담, 파트너 설득에 바로 활용하세요.
        </p>
      </div>

      <!-- 카드 6: 추가 기능 미리보기 -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8
                  border-2 border-dashed border-blue-200">
        <div class="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center text-2xl">
          🔜
        </div>
        <h3 class="mt-4 text-xl font-bold text-blue-700">더 많은 기능</h3>
        <p class="mt-2 text-blue-600">
          전문가 매칭, 금융 연계, 개원 후 모니터링...
          계속 추가됩니다.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 6: 작동 방식 (How It Works) -->
<section class="py-20">
  <div class="max-w-5xl mx-auto px-6">
    <h2 class="text-3xl font-bold text-center">3단계로 시작하세요</h2>

    <div class="mt-16 grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full
                    flex items-center justify-center text-2xl font-bold">1</div>
        <h3 class="mt-4 font-bold text-lg">프로필 입력</h3>
        <p class="mt-2 text-gray-600">경력, 예산, 관심 지역을<br/>30초 만에 입력하세요</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full
                    flex items-center justify-center text-2xl font-bold">2</div>
        <h3 class="mt-4 font-bold text-lg">지도 탐색</h3>
        <p class="mt-2 text-gray-600">히트맵으로 유망 지역을<br/>한눈에 파악하세요</p>
      </div>
      <div class="text-center">
        <div class="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full
                    flex items-center justify-center text-2xl font-bold">3</div>
        <h3 class="mt-4 font-bold text-lg">리포트 확인</h3>
        <p class="mt-2 text-gray-600">AI가 분석한 입지 점수와<br/>투자 계획을 받아보세요</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 7: 후기 -->
<section class="py-20 bg-gray-50">
  <div class="max-w-5xl mx-auto px-6">
    <h2 class="text-3xl font-bold text-center">
      먼저 경험한 원장님들의 이야기
    </h2>
    <div class="mt-12 grid md:grid-cols-3 gap-8">
      <!-- 후기 카드 (반복) -->
      <div class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="flex text-yellow-400 text-lg">★★★★★</div>
        <p class="mt-4 text-gray-700 leading-relaxed">
          "부동산 5군데 돌아다닌 것보다
          덴트맵 30분이 더 유용했습니다."
        </p>
        <div class="mt-6 flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <p class="font-semibold text-sm">김○○ 원장</p>
            <p class="text-xs text-gray-400">서울 성동구 개원</p>
          </div>
        </div>
      </div>
      <!-- ... 카드 2, 3 반복 ... -->
    </div>
  </div>
</section>

<!-- SECTION 8: 요금제 -->
<section class="py-20" id="pricing">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl font-bold text-center">
      필요한 만큼만, 합리적으로.
    </h2>
    <p class="mt-3 text-center text-gray-500">
      연간 결제 시 2개월 무료 (17% 할인)
    </p>
    <!-- 요금제 카드 3개 (별도 컴포넌트) -->
    <div class="mt-12 grid md:grid-cols-3 gap-8">
      <!-- Free / Basic / Premium 카드 -->
    </div>
  </div>
</section>

<!-- SECTION 9: FAQ -->
<section class="py-20 bg-gray-50">
  <div class="max-w-3xl mx-auto px-6">
    <h2 class="text-3xl font-bold text-center">자주 묻는 질문</h2>
    <div class="mt-12 space-y-4">
      <!-- 아코디언 아이템 -->
      <details class="bg-white rounded-xl p-6 shadow-sm">
        <summary class="font-semibold cursor-pointer">
          무료로 어디까지 이용할 수 있나요?
        </summary>
        <p class="mt-3 text-gray-600">
          전국 지도 탐색과 월 1회 입지 분석(종합 점수)이 무료입니다.
          상세 5축 분석, 투자 시뮬레이션, AI 리포트는
          베이직 플랜부터 이용할 수 있습니다.
        </p>
      </details>
      <!-- ... 추가 FAQ ... -->
    </div>
  </div>
</section>

<!-- SECTION 10: 최종 CTA -->
<section class="py-20 bg-blue-600 text-white">
  <div class="max-w-3xl mx-auto px-6 text-center">
    <h2 class="text-3xl md:text-4xl font-bold">
      아직 감으로 입지를 고르고 계신가요?
    </h2>
    <p class="mt-4 text-blue-100 text-lg">
      지금 시작하면 1개 지역 무료 분석이 제공됩니다.<br/>
      데이터가 보여주는 최적의 자리를 직접 확인해 보세요.
    </p>
    <a href="/register"
       class="mt-8 inline-block bg-white text-blue-600 font-bold
              px-10 py-4 rounded-xl text-lg hover:shadow-lg transition">
      무료로 시작하기 →
    </a>
    <p class="mt-3 text-sm text-blue-200">
      이미 계정이 있으신가요? <a href="/login" class="underline">로그인</a>
    </p>
  </div>
</section>

<!-- FOOTER -->
<footer class="bg-gray-900 text-gray-400 py-12">
  <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
    <div>
      <p class="text-white font-bold text-lg">DentMap 덴트맵</p>
      <p class="mt-2 text-sm">데이터로 찾는 최적의 개원 입지</p>
    </div>
    <div>
      <p class="text-white font-semibold mb-3">서비스</p>
      <a href="/map" class="block text-sm mb-2">지도 탐색</a>
      <a href="/pricing" class="block text-sm mb-2">요금제</a>
      <a href="/blog" class="block text-sm mb-2">블로그</a>
    </div>
    <div>
      <p class="text-white font-semibold mb-3">고객 지원</p>
      <a href="/faq" class="block text-sm mb-2">자주 묻는 질문</a>
      <a href="/contact" class="block text-sm mb-2">문의하기</a>
      <a href="/terms" class="block text-sm mb-2">이용약관</a>
      <a href="/privacy" class="block text-sm mb-2">개인정보처리방침</a>
    </div>
    <div>
      <p class="text-white font-semibold mb-3">연락처</p>
      <p class="text-sm">hello@dentmap.co.kr</p>
      <p class="text-sm">1600-0000</p>
    </div>
  </div>
  <div class="max-w-6xl mx-auto px-6 mt-8 pt-8 border-t border-gray-800 text-xs">
    <p>사업자등록번호: 000-00-00000 | 대표: ○○○</p>
    <p class="mt-1">© 2025 DentMap. All rights reserved.</p>
    <p class="mt-1">본 서비스의 분석 결과는 참고용이며, 최종 의사결정에 대한 법적 책임은 사용자에게 있습니다.</p>
  </div>
</footer>
```

---

## 2. 지도 페이지 구조 (/map)

```html
<div class="h-screen flex flex-col">
  <!-- 상단 바 -->
  <header class="h-14 border-b flex items-center px-4 gap-4">
    <a href="/">← 덴트맵</a>
    <input type="search" placeholder="지역명, 주소를 입력하세요"
           class="flex-1 max-w-md border rounded-lg px-4 py-2" />
    <div class="flex gap-2">
      <!-- 필터 칩 -->
      <button class="chip active">인구밀도</button>
      <button class="chip">경쟁강도</button>
      <button class="chip">임대비용</button>
      <button class="chip">접근성</button>
      <button class="chip">성장성</button>
    </div>
  </header>

  <!-- 메인: 지도 + 사이드패널 -->
  <div class="flex-1 flex">
    <!-- 지도 영역 (70%) -->
    <div id="map-container" class="flex-1 relative">
      <!-- Kakao/Mapbox 지도 렌더링 -->
      <!-- 오버레이: 히트맵 레이어, 마커 레이어 -->

      <!-- 범례 (좌하단) -->
      <div class="absolute bottom-4 left-4 bg-white/90 rounded-xl p-3 shadow">
        <p class="text-xs font-semibold mb-1">인구밀도</p>
        <div class="flex items-center gap-1">
          <span class="w-4 h-3 bg-blue-100 rounded"></span>
          <span class="w-4 h-3 bg-blue-300 rounded"></span>
          <span class="w-4 h-3 bg-blue-500 rounded"></span>
          <span class="w-4 h-3 bg-blue-700 rounded"></span>
          <span class="w-4 h-3 bg-blue-900 rounded"></span>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-1">
          <span>낮음</span><span>높음</span>
        </div>
      </div>

      <!-- 레이어 토글 (우하단) -->
      <div class="absolute bottom-4 right-4 bg-white/90 rounded-xl p-3 shadow">
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" checked /> 치과 위치
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" /> 지하철역
        </label>
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" /> 상권 경계
        </label>
      </div>
    </div>

    <!-- 사이드패널 (30%) -->
    <aside class="w-[400px] border-l bg-white overflow-y-auto">
      <!-- 선택된 지역 정보 -->
      <div class="p-6">
        <h2 class="text-xl font-bold">서울 강남구 역삼동</h2>
        <p class="text-sm text-gray-500 mt-1">행정동코드: 1168010100</p>

        <!-- 요약 수치 -->
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-500">거주인구</p>
            <p class="text-2xl font-bold">32,450명</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-500">치과 수</p>
            <p class="text-2xl font-bold text-red-500">12개</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-500">1인당 치과수</p>
            <p class="text-2xl font-bold">1:2,704</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-sm text-gray-500">평균 임대료</p>
            <p class="text-2xl font-bold">18만/평</p>
          </div>
        </div>

        <!-- 종합 점수 (미리보기) -->
        <div class="mt-6 bg-blue-50 rounded-xl p-6 text-center">
          <p class="text-sm text-blue-600">종합 입지 점수</p>
          <p class="text-5xl font-bold text-blue-700 mt-2">72</p>
          <p class="text-sm text-blue-500 mt-1">B등급 — 양호</p>
        </div>

        <!-- CTA 버튼 -->
        <div class="mt-6 space-y-3">
          <a href="/analysis/1168010100"
             class="block w-full btn-primary text-center py-3">
            상세 분석 보기
          </a>
          <button class="block w-full btn-outline text-center py-3">
            ⭐ 관심 목록에 추가
          </button>
        </div>
      </div>

      <!-- 인근 치과 목록 -->
      <div class="border-t p-6">
        <h3 class="font-bold">인근 치과 12개</h3>
        <div class="mt-4 space-y-3">
          <!-- 치과 카드 (반복) -->
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div class="flex-1">
              <p class="font-semibold text-sm">○○치과의원</p>
              <p class="text-xs text-gray-400">일반진료·임플란트 | 도보 3분</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">4.3★</p>
              <p class="text-xs text-gray-400">리뷰 128</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</div>
```

---

## 반응형 브레이크포인트

```
모바일:   < 768px  — 지도 전체 화면 + 하단 시트
태블릿:   768~1024 — 지도 60% + 사이드패널 40%
데스크톱: > 1024   — 지도 70% + 사이드패널 30%
```

## 핵심 컴포넌트 목록

```
공통:
  - Header (네비게이션)
  - Footer
  - Button (primary, outline, ghost)
  - Modal
  - Toast/Notification
  - LoadingSpinner
  - EmptyState

지도:
  - MapContainer
  - HeatmapLayer
  - ClinicMarker
  - RegionPopup
  - SidePanel
  - FilterChips
  - Legend

분석:
  - ScoreCard (개별 축)
  - RadarChart (5축 레이더)
  - ScoreBar (프로그레스)
  - AnalysisTab
  - InvestmentSlider
  - BreakevenChart

리포트:
  - ReportHeader
  - SectionBlock
  - RiskCard
  - ComparisonTable
  - ActionTimeline
  - PDFExportButton

인증:
  - LoginForm
  - RegisterForm
  - SocialLoginButton
  - ProfileSurvey (Step 1~5)
  - PaywallModal

결제:
  - PricingCard
  - CheckoutForm
  - PaymentMethodSelector
  - OrderSummary
```
