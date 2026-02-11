/**
 * DentalMap Server — 공공데이터 API 프록시 + 정적 파일 서빙
 *
 * 연동 API:
 *   1. 건강보험심사평가원 (HIRA)  — 치과 의료기관 수
 *   2. 행정안전부 (MOIS)          — 주민등록 인구통계
 *   3. 소상공인진흥공단 (SBIZ)     — 상권/업종 정보
 *   4. 국토교통부 (MOLIT)         — 상가 임대 실거래
 *
 * 실행:
 *   npm install
 *   cp .env.example .env   (API 키 입력)
 *   npm start
 *   → http://localhost:3000
 */

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── 정적 파일 서빙 (site/ 폴더) ──
app.use(express.static(path.join(__dirname, "site")));

// ── 헬퍼: XML → 간이 파싱 (data.go.kr은 대부분 XML 응답) ──
function extractTagValue(xml, tag) {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "g");
  const results = [];
  let m;
  while ((m = re.exec(xml)) !== null) results.push(m[1].trim());
  return results;
}

function extractItems(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  itemBlocks.forEach((block) => {
    const obj = {};
    const tags = block.match(/<(\w+)>([^<]*)<\/\1>/g) || [];
    tags.forEach((t) => {
      const m = t.match(/<(\w+)>([^<]*)<\/\1>/);
      if (m) obj[m[1]] = m[2];
    });
    items.push(obj);
  });
  return items;
}

// ── API 키 확인 ──
function checkKey(keyName) {
  const key = process.env[keyName];
  if (!key || key.includes("여기에")) return null;
  return key;
}

// ═══════════════════════════════════════════
//  API 1: 치과 의료기관 조회 (HIRA)
// ═══════════════════════════════════════════
app.get("/api/dental-clinics", async (req, res) => {
  const apiKey = checkKey("HIRA_API_KEY");
  if (!apiKey)
    return res
      .status(503)
      .json({ error: "HIRA_API_KEY가 설정되지 않았습니다.", mock: true });

  try {
    const { sido, sigungu, dong } = req.query;

    // clCd: 21=치과의원, 28=치과병원
    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: "1",
      numOfRows: "100",
      clCd: "21", // 치과의원
    });
    if (sido) params.append("sidoCd", sido);
    if (sigungu) params.append("sgguCd", sigungu);
    if (dong) params.append("emdongNm", dong);

    const url = `http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?${params}`;
    const response = await axios.get(url, { timeout: 10000 });
    const xml = response.data;

    // 총 건수 추출
    const totalCount = extractTagValue(xml, "totalCount")[0] || "0";
    const items = extractItems(xml);

    // 치과병원도 추가 조회
    params.set("clCd", "28");
    const url2 = `http://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?${params}`;
    const response2 = await axios.get(url2, { timeout: 10000 });
    const items2 = extractItems(response2.data);
    const totalCount2 = extractTagValue(response2.data, "totalCount")[0] || "0";

    res.json({
      success: true,
      dental_clinic_count: parseInt(totalCount),
      dental_hospital_count: parseInt(totalCount2),
      total_dental: parseInt(totalCount) + parseInt(totalCount2),
      clinics: items.map((i) => ({
        name: i.yadmNm || "",
        addr: i.addr || "",
        tel: i.telno || "",
        lat: i.YPos || "",
        lng: i.XPos || "",
        type: "치과의원",
      })),
      hospitals: items2.map((i) => ({
        name: i.yadmNm || "",
        addr: i.addr || "",
        tel: i.telno || "",
        lat: i.YPos || "",
        lng: i.XPos || "",
        type: "치과병원",
      })),
    });
  } catch (err) {
    console.error("[HIRA]", err.message);
    res
      .status(500)
      .json({ error: "HIRA API 호출 실패: " + err.message, mock: true });
  }
});

// ═══════════════════════════════════════════
//  API 2: 주민등록 인구통계 (MOIS)
// ═══════════════════════════════════════════
app.get("/api/population", async (req, res) => {
  const apiKey = checkKey("MOIS_API_KEY");
  if (!apiKey)
    return res
      .status(503)
      .json({ error: "MOIS_API_KEY가 설정되지 않았습니다.", mock: true });

  try {
    const { regionCode } = req.query; // 행정동코드

    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: "1",
      numOfRows: "20",
      regSeCd: "DONG", // 행정동 기준
      type: "xml",
    });
    if (regionCode) params.append("ctpvNm", regionCode);

    const url = `http://apis.data.go.kr/1741000/juminsu/getJuminsu?${params}`;
    const response = await axios.get(url, { timeout: 10000 });
    const xml = response.data;
    const items = extractItems(xml);

    res.json({
      success: true,
      data: items.map((i) => ({
        region: i.ctpvNm || i.signguNm || i.admmCdNm || "",
        total_population: parseInt(i.totPpltn || "0"),
        male: parseInt(i.maleNum || "0"),
        female: parseInt(i.femaleNum || "0"),
        households: parseInt(i.household || "0"),
      })),
    });
  } catch (err) {
    console.error("[MOIS]", err.message);
    res
      .status(500)
      .json({ error: "인구통계 API 호출 실패: " + err.message, mock: true });
  }
});

// ═══════════════════════════════════════════
//  API 3: 상가(상권) 정보 (소상공인진흥공단)
// ═══════════════════════════════════════════
app.get("/api/commercial", async (req, res) => {
  const apiKey = checkKey("SBIZ_API_KEY");
  if (!apiKey)
    return res
      .status(503)
      .json({ error: "SBIZ_API_KEY가 설정되지 않았습니다.", mock: true });

  try {
    const { dongCode } = req.query; // 법정동 코드

    // 상가업소정보 - 행정동 기준 조회
    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: "1",
      numOfRows: "100",
      divId: "adongCd",
      key: dongCode || "",
    });

    const url = `http://apis.data.go.kr/B553077/api/open/sdsc/storeListInDong?${params}`;
    const response = await axios.get(url, { timeout: 10000 });
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;

    const items = data.body?.items || [];
    const totalCount = data.body?.totalCount || 0;

    // 치과 관련 업종 필터 (대분류: 의료)
    const dentalStores = items.filter(
      (i) =>
        (i.indsLclsNm || "").includes("의료") &&
        (i.indsMclsNm || "").includes("치과")
    );

    res.json({
      success: true,
      total_stores: totalCount,
      dental_stores: dentalStores.length,
      stores: items.slice(0, 50).map((i) => ({
        name: i.bizesNm || "",
        category_large: i.indsLclsNm || "",
        category_mid: i.indsMclsNm || "",
        category_small: i.indsSclsNm || "",
        addr: i.lnoAdr || i.rdnmAdr || "",
        lat: i.lat || "",
        lng: i.lon || "",
      })),
    });
  } catch (err) {
    console.error("[SBIZ]", err.message);
    res
      .status(500)
      .json({ error: "상권정보 API 호출 실패: " + err.message, mock: true });
  }
});

// ═══════════════════════════════════════════
//  API 4: 상가 임대 실거래 (국토교통부)
// ═══════════════════════════════════════════
app.get("/api/rent", async (req, res) => {
  const apiKey = checkKey("MOLIT_API_KEY");
  if (!apiKey)
    return res
      .status(503)
      .json({ error: "MOLIT_API_KEY가 설정되지 않았습니다.", mock: true });

  try {
    const { regionCode, dealYmd } = req.query;
    // regionCode: 법정동 앞 5자리 (시군구코드)
    // dealYmd: 계약년월 (YYYYMM)

    const now = new Date();
    const defaultYmd =
      String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, "0");

    const params = new URLSearchParams({
      serviceKey: apiKey,
      pageNo: "1",
      numOfRows: "100",
      LAWD_CD: (regionCode || "11680").substring(0, 5),
      DEAL_YMD: dealYmd || defaultYmd,
    });

    const url = `http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcNrgTrade?${params}`;
    const response = await axios.get(url, { timeout: 10000 });
    const xml = response.data;
    const items = extractItems(xml);

    // 임대료 통계
    const rents = items
      .map((i) => parseInt((i.monthlyRent || "0").replace(/,/g, "")))
      .filter((r) => r > 0);
    const avgRent =
      rents.length > 0
        ? Math.round(rents.reduce((a, b) => a + b, 0) / rents.length)
        : 0;

    res.json({
      success: true,
      total_deals: items.length,
      avg_monthly_rent: avgRent,
      deals: items.slice(0, 30).map((i) => ({
        dong: i.umdNm || "",
        floor: i.floor || "",
        area: i.excluUseAr || "",
        deposit: i.deposit || "",
        monthly_rent: i.monthlyRent || "",
        deal_year: i.dealYear || "",
        deal_month: i.dealMonth || "",
        build_year: i.buildYear || "",
      })),
    });
  } catch (err) {
    console.error("[MOLIT]", err.message);
    res
      .status(500)
      .json({
        error: "임대실거래 API 호출 실패: " + err.message,
        mock: true,
      });
  }
});

// ═══════════════════════════════════════════
//  종합 분석 API (4개 API 동시 호출 후 결합)
// ═══════════════════════════════════════════
app.get("/api/analyze", async (req, res) => {
  const { dong, dongCode, sido, sigungu } = req.query;

  const results = { dental: null, population: null, commercial: null, rent: null };
  const errors = [];

  // 4개 API 병렬 호출
  const promises = [];

  // 1) 치과 수
  if (checkKey("HIRA_API_KEY")) {
    promises.push(
      axios
        .get(`http://localhost:${PORT}/api/dental-clinics`, {
          params: { sido, sigungu, dong },
          timeout: 15000,
        })
        .then((r) => {
          results.dental = r.data;
        })
        .catch((e) => errors.push("HIRA: " + e.message))
    );
  } else {
    errors.push("HIRA_API_KEY 미설정");
  }

  // 2) 인구
  if (checkKey("MOIS_API_KEY")) {
    promises.push(
      axios
        .get(`http://localhost:${PORT}/api/population`, {
          params: { regionCode: sido },
          timeout: 15000,
        })
        .then((r) => {
          results.population = r.data;
        })
        .catch((e) => errors.push("MOIS: " + e.message))
    );
  } else {
    errors.push("MOIS_API_KEY 미설정");
  }

  // 3) 상권
  if (checkKey("SBIZ_API_KEY")) {
    promises.push(
      axios
        .get(`http://localhost:${PORT}/api/commercial`, {
          params: { dongCode },
          timeout: 15000,
        })
        .then((r) => {
          results.commercial = r.data;
        })
        .catch((e) => errors.push("SBIZ: " + e.message))
    );
  } else {
    errors.push("SBIZ_API_KEY 미설정");
  }

  // 4) 임대료
  if (checkKey("MOLIT_API_KEY")) {
    promises.push(
      axios
        .get(`http://localhost:${PORT}/api/rent`, {
          params: { regionCode: dongCode },
          timeout: 15000,
        })
        .then((r) => {
          results.rent = r.data;
        })
        .catch((e) => errors.push("MOLIT: " + e.message))
    );
  } else {
    errors.push("MOLIT_API_KEY 미설정");
  }

  await Promise.allSettled(promises);

  // ── 점수 계산 ──
  const dentalCount = results.dental
    ? results.dental.total_dental
    : null;
  const population = results.population?.data?.[0]?.total_population || null;
  const avgRent = results.rent?.avg_monthly_rent || null;

  let scores = null;
  if (dentalCount !== null || population !== null) {
    const pop = population || 30000;
    const dc = dentalCount || 10;
    const rent = avgRent || 500;
    const popPerClinic = Math.round(pop / Math.max(dc, 1));

    const popScore = Math.min(100, Math.max(30, Math.round(pop / 600)));
    const compScore = Math.min(100, Math.max(20, 100 - dc * 5));
    const costScore = Math.min(100, Math.max(20, 100 - Math.round(rent / 30)));
    const accessScore = 70; // 교통 API 별도 연동 시 계산
    const growthScore = 60; // 인구증감 데이터 연동 시 계산
    const total = Math.round(
      popScore * 0.25 +
        compScore * 0.25 +
        costScore * 0.2 +
        accessScore * 0.15 +
        growthScore * 0.15
    );
    const grade =
      total >= 80 ? "A" : total >= 70 ? "B" : total >= 60 ? "C" : "D";

    scores = {
      population: popScore,
      competition: compScore,
      cost: costScore,
      access: accessScore,
      growth: growthScore,
      total,
      grade,
      pop_per_clinic: popPerClinic,
    };
  }

  res.json({
    query: { dong, dongCode, sido, sigungu },
    api_results: results,
    scores,
    errors,
    api_status: {
      hira: !!checkKey("HIRA_API_KEY"),
      mois: !!checkKey("MOIS_API_KEY"),
      sbiz: !!checkKey("SBIZ_API_KEY"),
      molit: !!checkKey("MOLIT_API_KEY"),
    },
  });
});

// ═══════════════════════════════════════════
//  API 키 상태 확인
// ═══════════════════════════════════════════
app.get("/api/status", (req, res) => {
  res.json({
    server: "running",
    port: PORT,
    apis: {
      hira: { configured: !!checkKey("HIRA_API_KEY"), desc: "건강보험심사평가원 — 치과 의료기관 조회" },
      mois: { configured: !!checkKey("MOIS_API_KEY"), desc: "행정안전부 — 주민등록 인구통계" },
      sbiz: { configured: !!checkKey("SBIZ_API_KEY"), desc: "소상공인진흥공단 — 상가(상권) 정보" },
      molit: { configured: !!checkKey("MOLIT_API_KEY"), desc: "국토교통부 — 상가 임대 실거래" },
    },
  });
});

// ── SPA 폴백 (site/ 안의 파일이 없으면 index.html) ──
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "site", "index.html"));
});

// ── 서버 시작 ──
app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════╗`);
  console.log(`║   🦷 DentalMap Server                     ║`);
  console.log(`║   http://localhost:${PORT}                   ║`);
  console.log(`╚═══════════════════════════════════════════╝\n`);

  // API 키 상태 출력
  const keys = [
    ["HIRA_API_KEY", "건강보험심사평가원 (치과 수)"],
    ["MOIS_API_KEY", "행정안전부 (인구통계)"],
    ["SBIZ_API_KEY", "소상공인진흥공단 (상권)"],
    ["MOLIT_API_KEY", "국토교통부 (임대료)"],
  ];
  console.log("API 키 상태:");
  keys.forEach(([k, label]) => {
    const ok = checkKey(k);
    console.log(`  ${ok ? "✅" : "❌"} ${label} — ${ok ? "설정됨" : "미설정 (.env 파일 확인)"}`);
  });
  console.log("");
});
