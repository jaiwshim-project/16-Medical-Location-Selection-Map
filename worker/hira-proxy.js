/**
 * Cloudflare Worker — HIRA 병원정보서비스 CORS 프록시
 *
 * 배포 방법:
 *   1. Cloudflare 대시보드 → Workers & Pages → Create Worker
 *   2. 이 코드를 붙여넣기
 *   3. Settings → Variables → HIRA_API_KEY 에 data.go.kr ServiceKey 등록
 *   4. Save and Deploy
 *
 * 엔드포인트:
 *   GET /clinics?lat=37.45&lng=126.73&radius=1000
 *   GET /clinics?sidoCd=110000&sgguCd=110023&numOfRows=100
 *   GET /debug  — API 키 상태 및 테스트 호출
 */

const HIRA_BASE = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
const FETCH_TIMEOUT = 8000; /* 8초 타임아웃 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env) {
    /* OPTIONS preflight */
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    /* health check */
    if (url.pathname === '/' || url.pathname === '/health') {
      return json({ status: 'ok', service: 'dentalmap-hira-proxy' });
    }

    /* debug endpoint */
    if (url.pathname === '/debug') {
      return handleDebug(env);
    }

    /* /clinics endpoint */
    if (url.pathname === '/clinics') {
      return handleClinics(url, env);
    }

    return json({ error: 'Not found. Use GET /clinics?lat=...&lng=...&radius=...' }, 404);
  }
};

/* 타임아웃 포함 fetch */
async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp;
  } finally {
    clearTimeout(timer);
  }
}

/* 디버그 엔드포인트 — API 키 상태 확인 */
async function handleDebug(env) {
  const apiKey = env.HIRA_API_KEY;
  const result = {
    apiKeyConfigured: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPreview: apiKey ? apiKey.substring(0, 8) + '...' : null,
  };

  if (apiKey) {
    /* 간단한 테스트 호출 (1건만) */
    try {
      const testUrl = `${HIRA_BASE}?ServiceKey=${encodeURIComponent(apiKey)}&clCd=51&numOfRows=1&pageNo=1&_type=json`;
      result.testUrl = testUrl.replace(apiKey, '***');
      const resp = await fetchWithTimeout(testUrl, {
        headers: { 'Accept': 'application/json' },
      }, FETCH_TIMEOUT);
      result.testStatus = resp.status;
      result.testStatusText = resp.statusText;
      const text = await resp.text();
      result.testResponseLength = text.length;
      result.testResponsePreview = text.substring(0, 300);
    } catch (err) {
      result.testError = err.message || String(err);
    }
  }

  return json(result);
}

async function handleClinics(url, env) {
  const apiKey = env.HIRA_API_KEY;
  if (!apiKey) {
    return json({ error: 'HIRA_API_KEY not configured' }, 500);
  }

  /* 파라미터 추출 */
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const radius = url.searchParams.get('radius') || '1000';
  const sidoCd = url.searchParams.get('sidoCd');
  const sgguCd = url.searchParams.get('sgguCd');
  const numOfRows = url.searchParams.get('numOfRows') || '100';
  const pageNo = url.searchParams.get('pageNo') || '1';

  /* 치과의원(51) + 치과병원(41) 병렬 호출 */
  const clCodes = ['51', '41'];

  try {
    /* 두 코드에 대해 병렬 호출 */
    const promises = clCodes.map(clCd => {
      /* 각 호출마다 독립적인 params 생성 */
      const params = new URLSearchParams({
        ServiceKey: apiKey,
        numOfRows: numOfRows,
        pageNo: pageNo,
        _type: 'json',
        clCd: clCd,
      });
      if (lat && lng) {
        params.set('yPos', lat);
        params.set('xPos', lng);
        params.set('radius', radius);
      }
      if (sidoCd) params.set('sidoCd', sidoCd);
      if (sgguCd) params.set('sgguCd', sgguCd);

      const apiUrl = `${HIRA_BASE}?${params.toString()}`;

      return fetchWithTimeout(apiUrl, {
        headers: { 'Accept': 'application/json' },
      }, FETCH_TIMEOUT)
        .then(async resp => {
          if (!resp.ok) return [];
          const data = await resp.json();
          const items = data?.response?.body?.items?.item;
          if (Array.isArray(items)) return items;
          if (items) return [items];
          return [];
        })
        .catch(() => []);
    });

    const results = await Promise.all(promises);
    const allItems = results.flat();

    /* 좌표 없는 항목 제거 */
    const clinics = allItems
      .filter(it => it.XPos && it.YPos)
      .map(it => ({
        name: it.yadmNm || '',
        addr: it.addr || '',
        tel: it.telno || '',
        lat: parseFloat(it.YPos),
        lng: parseFloat(it.XPos),
        clCd: it.clCd,
        clCdNm: it.clCdNm || '',
        drTotCnt: parseInt(it.drTotCnt) || 0,
        detySdrCnt: parseInt(it.detySdrCnt) || 0,
        estbDd: it.estbDd || '',
        hospUrl: it.hospUrl || '',
        postNo: it.postNo || '',
        sidoCdNm: it.sidoCdNm || '',
        sgguCdNm: it.sgguCdNm || '',
        distance: it.distance ? parseFloat(it.distance) : null,
      }));

    return json({
      totalCount: clinics.length,
      clinics: clinics,
      source: 'HIRA',
      cached: false,
    });

  } catch (err) {
    return json({ error: 'API call failed', message: err.message }, 502);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
  });
}
