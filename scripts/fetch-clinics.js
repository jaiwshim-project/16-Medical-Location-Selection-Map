/**
 * HIRA API에서 전국 치과 데이터를 다운로드하여 경량 JSON으로 저장하는 스크립트.
 *
 * 사용법: node scripts/fetch-clinics.js
 * 출력: data/clinics.json
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.HIRA_API_KEY || 'f04ff78ae341a1b99e6b8c4810be12683ad7062e609e8d91cd4076282e7c715d';
const BASE_URL = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'clinics.json');

function fetchPage(clCd, pageNo, numOfRows, retries = 2) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      ServiceKey: API_KEY,
      clCd: clCd,
      numOfRows: String(numOfRows),
      pageNo: String(pageNo),
      _type: 'json',
    });
    const url = `${BASE_URL}?${params.toString()}`;

    const req = https.get(url, { timeout: 60000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const body = json?.response?.body;
          if (!body) { resolve({ items: [], total: 0 }); return; }
          const items = body.items?.item;
          const arr = Array.isArray(items) ? items : items ? [items] : [];
          resolve({ items: arr, total: body.totalCount || 0 });
        } catch (e) {
          reject(new Error(`JSON parse error: ${e.message}\nRaw: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', (err) => {
      if (retries > 0) {
        console.log(`  Retry (${retries} left)...`);
        setTimeout(() => fetchPage(clCd, pageNo, numOfRows, retries - 1).then(resolve, reject), 2000);
      } else reject(err);
    });
    req.on('timeout', () => {
      req.destroy();
      if (retries > 0) {
        console.log(`  Timeout, retry (${retries} left)...`);
        setTimeout(() => fetchPage(clCd, pageNo, numOfRows, retries - 1).then(resolve, reject), 2000);
      } else reject(new Error('Request timeout after retries'));
    });
  });
}

async function fetchAll(clCd, label) {
  const PAGE_SIZE = 1000;
  console.log(`\n[${label}] Fetching page 1...`);
  const first = await fetchPage(clCd, 1, PAGE_SIZE);
  const total = first.total;
  console.log(`[${label}] Total: ${total}`);

  let allItems = first.items;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  for (let p = 2; p <= totalPages; p++) {
    console.log(`[${label}] Fetching page ${p}/${totalPages}...`);
    const result = await fetchPage(clCd, p, PAGE_SIZE);
    allItems = allItems.concat(result.items);
    // 1초 대기 (rate limit 방지)
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`[${label}] Fetched ${allItems.length} items`);
  return allItems;
}

function extractMinimal(item) {
  const lat = parseFloat(item.YPos);
  const lng = parseFloat(item.XPos);
  if (!lat || !lng || lat < 33 || lat > 39 || lng < 124 || lng > 132) return null;

  return {
    n: item.yadmNm || '',       // name
    a: item.addr || '',          // address
    t: item.telno || '',         // tel
    y: Math.round(lat * 100000) / 100000,  // lat (5 decimal places)
    x: Math.round(lng * 100000) / 100000,  // lng (5 decimal places)
    c: item.clCd,                // clCd (51=의원, 41=병원)
    d: parseInt(item.drTotCnt) || 0,        // doctor count
    s: parseInt(item.detySdrCnt) || 0,      // specialist count
    e: item.estbDd || 0,         // establishment date
    si: item.sidoCdNm || '',     // sido name
    sg: item.sgguCdNm || '',     // sigungu name
  };
}

async function main() {
  console.log('=== HIRA 전국 치과 데이터 다운로드 ===');
  console.log(`Output: ${OUTPUT_FILE}`);

  const clinics51 = await fetchAll('51', '치과의원');
  const clinics41 = await fetchAll('41', '치과병원');

  const allRaw = clinics51.concat(clinics41);
  console.log(`\nTotal raw items: ${allRaw.length}`);

  const minimal = allRaw.map(extractMinimal).filter(Boolean);
  console.log(`Valid items (with coordinates): ${minimal.length}`);

  // 시도별 통계
  const byRegion = {};
  minimal.forEach(c => {
    const key = c.si || 'unknown';
    byRegion[key] = (byRegion[key] || 0) + 1;
  });
  console.log('\n시도별 치과 수:');
  Object.entries(byRegion).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${k}: ${v}`);
  });

  // 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const output = {
    meta: {
      source: 'HIRA 건강보험심사평가원 병원정보서비스',
      fetched: new Date().toISOString().split('T')[0],
      totalCount: minimal.length,
    },
    clinics: minimal,
  };

  const jsonStr = JSON.stringify(output);
  fs.writeFileSync(OUTPUT_FILE, jsonStr, 'utf-8');

  const sizeMB = (Buffer.byteLength(jsonStr) / 1024 / 1024).toFixed(2);
  console.log(`\nSaved: ${OUTPUT_FILE} (${sizeMB} MB)`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
