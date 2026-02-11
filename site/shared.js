/* ═══════════════════════════════════════════
   DentalMap — shared.js (공통 데이터·유틸·UI)
   ═══════════════════════════════════════════ */

/* ── Mock Data ── */
const REGIONS=[
{dong_code:"1168010100",sido:"서울",sigungu:"강남구",dong:"역삼동",population:32450,age_20_39_pct:35,age_40_59_pct:28,age_60_plus_pct:19,dental_count:12,pop_per_clinic:2704,avg_rent_pyeong:18,area_pyeong:40,subway_station:"역삼역",subway_line:"2호선",subway_walk_min:3,bus_stops_500m:8,daily_floating:85000,pop_growth_rate:1.2,commercial_grade:"A",scores:{population:82,competition:55,cost:48,access:91,growth:68,total:72},grade:"B",lat:37.5007,lng:127.0365},
{dong_code:"1165010700",sido:"서울",sigungu:"서초구",dong:"서초동",population:28300,age_20_39_pct:32,age_40_59_pct:30,age_60_plus_pct:20,dental_count:15,pop_per_clinic:1887,avg_rent_pyeong:20,area_pyeong:40,subway_station:"서초역",subway_line:"2호선",subway_walk_min:5,bus_stops_500m:6,daily_floating:72000,pop_growth_rate:0.8,commercial_grade:"A",scores:{population:75,competition:42,cost:40,access:85,growth:60,total:63},grade:"C",lat:37.4837,lng:127.0073},
{dong_code:"4146310100",sido:"경기",sigungu:"성남시 분당구",dong:"판교동",population:41200,age_20_39_pct:40,age_40_59_pct:32,age_60_plus_pct:10,dental_count:8,pop_per_clinic:5150,avg_rent_pyeong:12,area_pyeong:40,subway_station:"판교역",subway_line:"신분당선",subway_walk_min:7,bus_stops_500m:5,daily_floating:95000,pop_growth_rate:5.8,commercial_grade:"A",scores:{population:90,competition:82,cost:72,access:75,growth:95,total:85},grade:"A",lat:37.3948,lng:127.1112},
{dong_code:"1120010300",sido:"서울",sigungu:"성동구",dong:"성수동",population:25600,age_20_39_pct:42,age_40_59_pct:25,age_60_plus_pct:15,dental_count:6,pop_per_clinic:4267,avg_rent_pyeong:14,area_pyeong:35,subway_station:"성수역",subway_line:"2호선",subway_walk_min:4,bus_stops_500m:7,daily_floating:68000,pop_growth_rate:4.2,commercial_grade:"B",scores:{population:78,competition:78,cost:65,access:88,growth:88,total:79},grade:"B",lat:37.5445,lng:127.0564},
{dong_code:"1174010100",sido:"서울",sigungu:"마포구",dong:"합정동",population:19800,age_20_39_pct:45,age_40_59_pct:22,age_60_plus_pct:14,dental_count:7,pop_per_clinic:2829,avg_rent_pyeong:13,area_pyeong:30,subway_station:"합정역",subway_line:"2·6호선",subway_walk_min:2,bus_stops_500m:9,daily_floating:62000,pop_growth_rate:3.1,commercial_grade:"B",scores:{population:68,competition:65,cost:68,access:95,growth:82,total:74},grade:"B",lat:37.5496,lng:126.9139},
{dong_code:"4111710100",sido:"경기",sigungu:"수원시 영통구",dong:"광교동",population:52000,age_20_39_pct:38,age_40_59_pct:35,age_60_plus_pct:8,dental_count:10,pop_per_clinic:5200,avg_rent_pyeong:10,area_pyeong:45,subway_station:"광교역",subway_line:"신분당선",subway_walk_min:8,bus_stops_500m:4,daily_floating:45000,pop_growth_rate:7.2,commercial_grade:"B",scores:{population:92,competition:85,cost:80,access:68,growth:98,total:87},grade:"A",lat:37.2935,lng:127.0454},
{dong_code:"3020011200",sido:"대전",sigungu:"유성구",dong:"봉명동",population:35800,age_20_39_pct:36,age_40_59_pct:28,age_60_plus_pct:16,dental_count:9,pop_per_clinic:3978,avg_rent_pyeong:8,area_pyeong:40,subway_station:"시청역",subway_line:"1호선",subway_walk_min:10,bus_stops_500m:6,daily_floating:38000,pop_growth_rate:2.5,commercial_grade:"B",scores:{population:80,competition:72,cost:88,access:62,growth:75,total:77},grade:"B",lat:36.3623,lng:127.3561},
{dong_code:"2644010100",sido:"부산",sigungu:"해운대구",dong:"우동",population:48500,age_20_39_pct:30,age_40_59_pct:32,age_60_plus_pct:18,dental_count:14,pop_per_clinic:3464,avg_rent_pyeong:11,area_pyeong:40,subway_station:"해운대역",subway_line:"2호선",subway_walk_min:6,bus_stops_500m:7,daily_floating:55000,pop_growth_rate:1.5,commercial_grade:"A",scores:{population:85,competition:60,cost:75,access:78,growth:65,total:74},grade:"B",lat:35.1631,lng:129.1636}
];

/* ── Utility Functions ── */
function fmt(n){return new Intl.NumberFormat('ko-KR').format(n)}
function getGradeColor(g){const m={S:'text-purple-600 bg-purple-50',A:'text-blue-600 bg-blue-50',B:'text-green-600 bg-green-50',C:'text-yellow-600 bg-yellow-50',D:'text-orange-600 bg-orange-50'};return m[g]||'text-red-600 bg-red-50'}
function getScoreColor(s){return s>=80?'text-blue-600':s>=60?'text-green-600':s>=40?'text-yellow-600':'text-red-500'}
function getScoreBarColor(s){return s>=80?'bg-blue-500':s>=60?'bg-green-500':s>=40?'bg-yellow-500':'bg-red-500'}
function formatPrice(p){return p===0?'0':fmt(p)}

/* ── Region Generation ── */
function hashStr(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0}return Math.abs(h)}
function seededRand(seed,min,max){seed=(seed*9301+49297)%233280;return min+Math.floor((seed/233280)*(max-min+1))}

function generateRegion(name){
  const h=hashStr(name);
  const r=n=>(min,max)=>seededRand(h*n+n,min,max);
  const pop=r(1)(15000,60000);const dental=r(2)(3,18);const rent=r(3)(6,22);const area=r(4)(25,50);
  const walkMin=r(5)(2,15);const bus=r(6)(2,10);const floating=r(7)(20000,100000);
  const growth=parseFloat(((r(8)(0,80)-20)/10).toFixed(1));
  const a2039=r(9)(25,48);const a4059=r(10)(20,35);const a60=100-a2039-a4059;
  const popScore=Math.min(100,Math.max(30,Math.round(pop/600)+r(11)(-5,5)));
  const compScore=Math.min(100,Math.max(20,100-dental*5+r(12)(-5,10)));
  const costScore=Math.min(100,Math.max(20,100-rent*3+r(13)(-5,5)));
  const accessScore=Math.min(100,Math.max(30,100-walkMin*4+bus*3+r(14)(-5,5)));
  const growthScore=Math.min(100,Math.max(20,50+Math.round(growth*8)+r(15)(-5,5)));
  const total=Math.round(popScore*0.25+compScore*0.25+costScore*0.2+accessScore*0.15+growthScore*0.15);
  const grade=total>=80?'A':total>=70?'B':total>=60?'C':'D';
  const stations=['역삼역','강남역','홍대입구역','신촌역','잠실역','건대입구역','사당역','왕십리역','을지로역','종각역','신림역','판교역','수원역','인천역'];
  const lines=['2호선','3호선','4호선','7호선','9호선','신분당선','경의중앙선','1호선','5호선','6호선'];
  const grades=['A','B','C'];
  const code='GEN'+h.toString().slice(0,7).padStart(7,'0');
  return {dong_code:code,sido:'',sigungu:'',dong:name,population:pop,age_20_39_pct:a2039,age_40_59_pct:a4059,age_60_plus_pct:Math.max(0,a60),dental_count:dental,pop_per_clinic:Math.round(pop/dental),avg_rent_pyeong:rent,area_pyeong:area,subway_station:stations[h%stations.length],subway_line:lines[h%lines.length],subway_walk_min:walkMin,bus_stops_500m:bus,daily_floating:floating,pop_growth_rate:growth,commercial_grade:grades[h%grades.length],scores:{population:popScore,competition:compScore,cost:costScore,access:accessScore,growth:growthScore,total:total},grade:grade,lat:37.5+((h%100)-50)/500,lng:127+((h%100)-50)/500,_generated:true};
}

function addGeneratedRegion(name){
  const existing=REGIONS.find(r=>r.dong===name&&r._generated);
  if(existing)return existing;
  const r=generateRegion(name);REGIONS.push(r);return r;
}

function findRegionByName(name){
  return REGIONS.find(r=>r.dong.includes(name)||r.sigungu.includes(name)||r.sido.includes(name));
}

function goAnalysis(name){
  const existing=findRegionByName(name);
  if(existing){location.href='analysis.html#'+existing.dong_code;return}
  location.href='analysis.html#gen:'+encodeURIComponent(name);
}

/* 해시값에서 지역 데이터 찾기 (기존 dong_code 또는 gen:이름) */
function resolveRegionFromHash(hash){
  if(!hash)return null;
  if(hash.startsWith('gen:')){
    const name=decodeURIComponent(hash.slice(4));
    return addGeneratedRegion(name);
  }
  return REGIONS.find(x=>x.dong_code===hash);
}

/* ── Analysis Text Generator ── */
function genTexts(r){
  const popText=r.scores.population>=80?`반경 1km 내 거주인구 ${fmt(r.population)}명으로 치과 수요가 충분합니다. 특히 20~39세 인구가 ${r.age_20_39_pct}%로 심미·교정 진료 수요가 높을 것으로 예상됩니다.`:r.scores.population>=50?`거주인구 ${fmt(r.population)}명은 평균 수준입니다. 20~39세 비중이 ${r.age_20_39_pct}%이며, 주간 유동인구 ${fmt(r.daily_floating)}명을 함께 고려하면 실질 수요는 양호합니다.`:`반경 1km 거주인구 ${fmt(r.population)}명으로 수요 기반이 다소 취약합니다.`;
  const compText=r.scores.competition>=70?`반경 500m 내 치과 ${r.dental_count}개로 경쟁이 적습니다. 신규 진입 기회가 있습니다.`:r.scores.competition>=50?`반경 500m 내 치과 ${r.dental_count}개는 평균적인 수준입니다. 차별화 전략으로 경쟁력 확보가 가능합니다.`:`반경 500m 내 치과 ${r.dental_count}개로 경쟁이 치열합니다. 인구당 치과 비율 1:${fmt(r.pop_per_clinic)}로, 강력한 차별화가 필요합니다.`;
  const costText=r.scores.cost>=70?`평당 임대료 ${r.avg_rent_pyeong}만원은 합리적인 수준으로 비용 효율이 높습니다.`:r.scores.cost>=50?`평당 임대료 ${r.avg_rent_pyeong}만원은 보통 수준입니다. ${r.area_pyeong}평 기준 월 ${fmt(r.avg_rent_pyeong*r.area_pyeong)}만원의 임대료가 예상됩니다.`:`평당 임대료 ${r.avg_rent_pyeong}만원은 높은 편입니다. 월 ${fmt(r.avg_rent_pyeong*r.area_pyeong)}만원의 고정비를 커버하려면 충분한 매출이 필요합니다.`;
  const accessText=`가장 가까운 지하철역은 ${r.subway_station}(${r.subway_line}, 도보 ${r.subway_walk_min}분)이며, 반경 300m 내 버스정류장 ${r.bus_stops_500m}개가 있습니다. 일 평균 유동인구 ${fmt(r.daily_floating)}명으로 유입 효과가 ${r.scores.access>=80?'우수':'양호'}합니다.`;
  const growthText=r.pop_growth_rate>3?`${r.dong}의 최근 3년 인구 증가율은 +${r.pop_growth_rate}%이며, 향후 중장기 투자 가치가 높습니다.`:r.pop_growth_rate>0?`${r.dong}의 인구 증가율은 +${r.pop_growth_rate}%로 완만한 성장세입니다.`:`${r.dong}의 인구는 최근 3년간 ${r.pop_growth_rate}% 변동하였습니다.`;
  return{popText,compText,costText,accessText,growthText};
}

/* ── Common Header/Footer ── */
function renderTestBanner(){
  return `<div class="bg-green-600 text-white text-center py-2 text-sm font-medium">🧪 테스트 모드 — 로그인 없이 모든 기능을 자유롭게 체험하세요 &nbsp;|&nbsp; <a href="map.html" class="underline font-bold hover:text-green-100">바로 분석 시작 &rarr;</a></div>`;
}

function renderHeader(active){
  const nav=[{href:'map.html',label:'지도 탐색',key:'map'},{href:'pricing.html',label:'요금제',key:'pricing'},{href:'reports.html',label:'리포트',key:'reports'},{href:'promo.html',label:'홍보',key:'promo'},{href:'faq.html',label:'FAQ',key:'faq'}];
  return `<header class="sticky top-0 z-50 bg-sky-100/90 backdrop-blur border-b border-sky-200">
<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
<a href="index.html" class="flex items-center gap-2"><div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-sm">D</span></div><span class="font-bold text-lg text-blue-900">덴탈맵AI <span class="text-base font-semibold text-blue-600">치과개원 입지분석</span></span></a>
<nav class="hidden md:flex items-center gap-8">${nav.map(n=>`<a href="${n.href}" class="text-sm ${active===n.key?'text-blue-600 font-semibold':'text-gray-600 hover:text-blue-600'} transition">${n.label}</a>`).join('')}</nav>
<div class="hidden md:flex items-center gap-3"><a href="map.html" class="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition">바로 체험하기</a></div>
<button id="mobile-toggle" class="md:hidden p-2 text-blue-800" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button>
</div>
<div id="mobile-menu" class="hidden md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
${nav.map(n=>`<a href="${n.href}" class="block text-gray-700 py-2">${n.label}</a>`).join('')}
<hr class="border-gray-100">
<a href="map.html" class="block bg-blue-600 text-white text-center py-2.5 rounded-lg font-semibold">바로 체험하기</a>
</div></header>`;
}

function renderFooter(){
  return `<footer class="bg-gray-900 text-gray-400 py-12">
<div class="max-w-7xl mx-auto px-6">
<div class="grid md:grid-cols-4 gap-8">
<div><div class="flex items-center gap-2 mb-3"><div class="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold text-xs">D</span></div><span class="font-bold text-white">덴탈맵AI <span class="text-sm font-medium text-gray-300">치과개원 입지분석</span></span></div><p class="text-sm">데이터로 찾는 최적의 치과 개원 입지</p></div>
<div><h3 class="text-white font-semibold mb-3 text-sm">서비스</h3><div class="space-y-2 text-sm"><a href="map.html" class="block hover:text-white transition">지도 탐색</a><a href="pricing.html" class="block hover:text-white transition">요금제</a></div></div>
<div><h3 class="text-white font-semibold mb-3 text-sm">지원</h3><div class="space-y-2 text-sm"><a href="faq.html" class="block hover:text-white transition">자주 묻는 질문</a><a href="contact.html" class="block hover:text-white transition">문의하기</a></div></div>
<div><h3 class="text-white font-semibold mb-3 text-sm">연락처</h3><div class="space-y-2 text-sm"><p>심재우 대표</p><p><a href="mailto:jaiwshim@gmail.com" class="hover:text-white">jaiwshim@gmail.com</a></p><p><a href="tel:010-2397-5734" class="hover:text-white">010-2397-5734</a></p></div></div>
</div>
<div class="border-t border-gray-800 mt-8 pt-8 text-xs"><p>덴탈맵AI 치과개원 입지분석 | 심재우 대표</p><p class="mt-1">문의: <a href="mailto:jaiwshim@gmail.com" class="text-gray-400 hover:text-white">jaiwshim@gmail.com</a> · <a href="tel:010-2397-5734" class="text-gray-400 hover:text-white">010-2397-5734</a></p><p class="mt-2">&copy; 2025 DentalMap. All rights reserved.</p><p class="mt-2 text-gray-600">본 서비스의 분석 결과는 참고용이며, 투자 결정에 대한 법적 책임을 지지 않습니다.</p></div>
</div></footer>`;
}

/* ── Common Page Shell ── */
function initPage(activeNav){
  document.getElementById('test-banner').innerHTML=renderTestBanner();
  document.getElementById('app-header').innerHTML=renderHeader(activeNav);
  document.getElementById('app-footer').innerHTML=renderFooter();
}

/* ── Pricing Builder ── */
let pricingYearly=false;
function buildPricingHTML(){
  const plans=[
    {name:"무료",en:"Free",mp:0,yp:0,badge:null,cta:"무료로 시작",cs:"border border-gray-300 text-gray-700 hover:bg-gray-50",feats:[{t:"전국 지도 탐색",i:true},{t:"시도 단위 히트맵",i:true},{t:"치과 분포 (위치만)",i:true},{t:"인구 데이터 요약",i:true},{t:"입지 분석 월 1회 (종합 점수만)",i:true},{t:"5축 상세 분석",i:false},{t:"투자 시뮬레이션",i:false},{t:"AI 결정 리포트",i:false},{t:"후보지 비교",i:false}]},
    {name:"베이직",en:"Basic",mp:99000,yp:990000,badge:"인기",cta:"베이직 시작",cs:"bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20",feats:[{t:"전국 지도 탐색",i:true},{t:"시군구 단위 히트맵",i:true},{t:"치과 상세정보",i:true},{t:"인구 데이터 상세",i:true},{t:"입지 분석 월 10회 (5축 상세)",i:true},{t:"투자 시뮬레이션 (기본)",i:true},{t:"AI 결정 리포트 월 3회",i:true},{t:"PDF 다운로드",i:true},{t:"후보지 2개 비교",i:true}]},
    {name:"프리미엄",en:"Premium",mp:299000,yp:2990000,badge:null,cta:"프리미엄 시작",cs:"border border-gray-300 text-gray-700 hover:bg-gray-50",feats:[{t:"전국 지도 탐색",i:true},{t:"행정동 단위 히트맵",i:true},{t:"치과 리뷰·평점 포함",i:true},{t:"인구 연령별·트렌드",i:true},{t:"입지 분석 무제한 (커스텀 가중치)",i:true},{t:"투자 시뮬레이션 (대출 연동)",i:true},{t:"AI 결정 리포트 무제한",i:true},{t:"후보지 5개 비교",i:true},{t:"전문가 매칭 + 월 1회 상담",i:true}]}
  ];
  const iy=pricingYearly;
  const chk=`<svg class="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`;
  const xIc=`<svg class="w-5 h-5 text-gray-300 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;
  let h=`<div class="max-w-6xl mx-auto px-6"><h2 class="text-3xl font-bold text-center text-gray-900">필요한 만큼만, 합리적으로.</h2>`;
  h+=`<div class="mt-6 flex items-center justify-center gap-3"><span class="text-sm font-medium ${!iy?'text-gray-900':'text-gray-400'}">월간</span><button onclick="togglePricing()" class="relative w-14 h-7 rounded-full transition-colors ${iy?'bg-blue-600':'bg-gray-300'}"><span class="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${iy?'translate-x-7':'translate-x-0.5'}"></span></button><span class="text-sm font-medium ${iy?'text-gray-900':'text-gray-400'}">연간</span>${iy?'<span class="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">2개월 무료</span>':''}</div>`;
  h+=`<div class="mt-12 grid md:grid-cols-3 gap-8">`;
  plans.forEach(p=>{const price=iy?Math.round(p.yp/12):p.mp;const pop=p.badge==='인기';
    h+=`<div class="relative rounded-2xl p-8 ${pop?'bg-white ring-2 ring-blue-600 shadow-xl':'bg-white border border-gray-200 shadow-sm'}">`;
    if(pop)h+=`<div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">가장 인기</div>`;
    h+=`<h3 class="text-lg font-bold text-gray-900">${p.name}<span class="text-sm font-normal text-gray-400 ml-2">${p.en}</span></h3>`;
    h+=`<div class="mt-4"><span class="text-4xl font-bold text-gray-900">${price===0?'무료':formatPrice(price)+'원'}</span>${price>0?'<span class="text-gray-500 text-sm">/월</span>':''}</div>`;
    if(iy&&p.yp>0)h+=`<p class="text-xs text-gray-400 mt-1">연 ${formatPrice(p.yp)}원 결제</p>`;
    h+=`<a href="map.html" class="mt-6 block w-full text-center py-3 rounded-lg font-semibold transition ${p.cs}">${p.cta}</a>`;
    h+=`<ul class="mt-8 space-y-3">`;p.feats.forEach(f=>{h+=`<li class="flex items-start gap-2 text-sm">${f.i?chk:xIc}<span class="${f.i?'text-gray-700':'text-gray-400'}">${f.t}</span></li>`});
    h+=`</ul></div>`;});
  h+=`</div><p class="mt-8 text-center text-sm text-gray-400">모든 유료 플랜은 7일 무료 체험 가능 &middot; 언제든 해지 가능 (위약금 없음)</p></div>`;
  return h;
}
function togglePricing(){pricingYearly=!pricingYearly;document.querySelectorAll('[data-pricing]').forEach(el=>{el.innerHTML=buildPricingHTML()})}

/* ═══════════════════════════════════════════
   API 연동 (서버 모드에서만 동작)
   서버 없이 file:// 로 열면 목 데이터 사용
   ═══════════════════════════════════════════ */
const API_BASE=location.protocol==='file:'?null:'';

async function checkApiStatus(){
  if(!API_BASE&&API_BASE!=='')return{server:false};
  try{
    const r=await fetch('/api/status');
    return await r.json();
  }catch(e){return{server:false}}
}

async function fetchRealAnalysis(dong,dongCode,sido,sigungu){
  if(!API_BASE&&API_BASE!=='')return null;
  try{
    const params=new URLSearchParams({dong:dong||'',dongCode:dongCode||'',sido:sido||'',sigungu:sigungu||''});
    const r=await fetch('/api/analyze?'+params);
    const data=await r.json();
    if(data.errors&&data.errors.length===4)return null; // 모든 API 미설정
    return data;
  }catch(e){return null}
}

/* 실제 API 데이터를 RegionData 형식으로 변환 */
function apiToRegion(apiData,name,dongCode){
  const s=apiData.scores;
  if(!s)return null;
  const dc=apiData.api_results?.dental?.total_dental||10;
  const pop=apiData.api_results?.population?.data?.[0]?.total_population||30000;
  const avgRent=apiData.api_results?.rent?.avg_monthly_rent||0;
  const rentPy=avgRent>0?Math.round(avgRent/40):10; // 40평 기준 환산
  return{
    dong_code:dongCode||'API'+hashStr(name).toString().slice(0,7).padStart(7,'0'),
    sido:apiData.query?.sido||'',sigungu:apiData.query?.sigungu||'',dong:name,
    population:pop,age_20_39_pct:33,age_40_59_pct:28,age_60_plus_pct:18,
    dental_count:dc,pop_per_clinic:s.pop_per_clinic||Math.round(pop/Math.max(dc,1)),
    avg_rent_pyeong:rentPy,area_pyeong:40,
    subway_station:'(API 연동 시 표시)',subway_line:'-',subway_walk_min:0,bus_stops_500m:0,
    daily_floating:0,pop_growth_rate:0,commercial_grade:'-',
    scores:{population:s.population,competition:s.competition,cost:s.cost,access:s.access,growth:s.growth,total:s.total},
    grade:s.grade,lat:37.5,lng:127.0,
    _api:true, _apiRaw:apiData
  };
}

/* API로 실시간 분석 시도, 실패 시 목 데이터 폴백 */
async function goAnalysisWithApi(name){
  const existing=findRegionByName(name);
  if(existing){location.href='analysis.html#'+existing.dong_code;return}

  // API 서버 모드인 경우 실시간 조회 시도
  if(API_BASE===''){
    try{
      const data=await fetchRealAnalysis(name,'','','');
      if(data&&data.scores){
        const r=apiToRegion(data,name);
        if(r){REGIONS.push(r);location.href='analysis.html#'+r.dong_code;return}
      }
    }catch(e){console.log('API fallback:',e)}
  }

  // 폴백: gen: 해시로 이동
  location.href='analysis.html#gen:'+encodeURIComponent(name);
}
