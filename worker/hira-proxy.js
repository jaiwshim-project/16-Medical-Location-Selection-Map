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
 */

const HIRA_BASE = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';

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

    /* /clinics endpoint */
    if (url.pathname === '/clinics') {
      return handleClinics(url, env);
    }

    return json({ error: 'Not found. Use GET /clinics?lat=...&lng=...&radius=...' }, 404);
  }
};

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

  /* HIRA API 호출 URL 구성 */
  const params = new URLSearchParams({
    ServiceKey: apiKey,
    numOfRows: numOfRows,
    pageNo: pageNo,
    _type: 'json',
  });

  /* 치과의원(51) + 치과병원(41) 둘 다 조회하기 위해 두 번 호출 후 합침 */
  const clCodes = ['51', '41'];

  /* 좌표 기반 검색 */
  if (lat && lng) {
    params.set('yPos', lat);
    params.set('xPos', lng);
    params.set('radius', radius);
  }
  /* 지역코드 기반 검색 */
  if (sidoCd) params.set('sidoCd', sidoCd);
  if (sgguCd) params.set('sgguCd', sgguCd);

  try {
    const allItems = [];

    for (const clCd of clCodes) {
      params.set('clCd', clCd);
      const apiUrl = `${HIRA_BASE}?${params.toString()}`;

      const resp = await fetch(apiUrl, {
        headers: { 'Accept': 'application/json' },
        cf: { cacheTtl: 3600 }, /* 1시간 캐시 */
      });

      if (!resp.ok) continue;

      const data = await resp.json();
      const body = data?.response?.body;
      if (!body) continue;

      const items = body.items?.item;
      if (Array.isArray(items)) {
        allItems.push(...items);
      } else if (items) {
        allItems.push(items); /* 결과 1개일 때 객체로 옴 */
      }
    }

    /* 좌표 없는 항목 제거 & 정렬 (거리순 또는 이름순) */
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
