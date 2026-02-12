#!/bin/bash
# HIRA API에서 전국 치과 데이터를 다운로드하여 경량 JSON으로 저장
# 사용법: bash scripts/fetch-clinics.sh
# 출력: data/clinics.json

API_KEY="f04ff78ae341a1b99e6b8c4810be12683ad7062e609e8d91cd4076282e7c715d"
BASE_URL="https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList"
DATA_DIR="$(dirname "$0")/../data"
RAW_DIR="$DATA_DIR/raw"
OUTPUT="$DATA_DIR/clinics.json"

mkdir -p "$RAW_DIR"

PAGE_SIZE=1000

echo "=== HIRA 전국 치과 데이터 다운로드 ==="

# 치과의원(51) 다운로드
echo ""
echo "[치과의원] 총 건수 확인..."
TOTAL_51=$(curl -s --max-time 30 "${BASE_URL}?ServiceKey=${API_KEY}&clCd=51&numOfRows=1&pageNo=1&_type=json" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).response.body.totalCount))")
echo "[치과의원] Total: $TOTAL_51"

PAGES_51=$(( (TOTAL_51 + PAGE_SIZE - 1) / PAGE_SIZE ))
echo "[치과의원] Pages: $PAGES_51"

for ((p=1; p<=PAGES_51; p++)); do
  echo "[치과의원] Fetching page $p/$PAGES_51..."
  curl -s --max-time 120 "${BASE_URL}?ServiceKey=${API_KEY}&clCd=51&numOfRows=${PAGE_SIZE}&pageNo=${p}&_type=json" > "$RAW_DIR/51_page${p}.json"
  sleep 0.5
done

# 치과병원(41) 다운로드
echo ""
echo "[치과병원] 총 건수 확인..."
TOTAL_41=$(curl -s --max-time 30 "${BASE_URL}?ServiceKey=${API_KEY}&clCd=41&numOfRows=1&pageNo=1&_type=json" | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d).response.body.totalCount))")
echo "[치과병원] Total: $TOTAL_41"

PAGES_41=$(( (TOTAL_41 + PAGE_SIZE - 1) / PAGE_SIZE ))
echo "[치과병원] Pages: $PAGES_41"

for ((p=1; p<=PAGES_41; p++)); do
  echo "[치과병원] Fetching page $p/$PAGES_41..."
  curl -s --max-time 120 "${BASE_URL}?ServiceKey=${API_KEY}&clCd=41&numOfRows=${PAGE_SIZE}&pageNo=${p}&_type=json" > "$RAW_DIR/41_page${p}.json"
  sleep 0.5
done

# JSON 파일들 병합 및 최소화
echo ""
echo "데이터 병합 중..."
node -e "
const fs=require('fs'),path=require('path');
const rawDir=path.resolve('$RAW_DIR');
const files=fs.readdirSync(rawDir).filter(f=>f.endsWith('.json')).sort();
let all=[];
files.forEach(f=>{
  try{
    const d=JSON.parse(fs.readFileSync(path.join(rawDir,f),'utf8'));
    const items=d?.response?.body?.items?.item;
    if(Array.isArray(items))all=all.concat(items);
    else if(items)all.push(items);
  }catch(e){console.error('Error reading',f,e.message)}
});
console.log('Raw items:',all.length);

const clinics=all.filter(it=>{
  const lat=parseFloat(it.YPos),lng=parseFloat(it.XPos);
  return lat&&lng&&lat>33&&lat<39&&lng>124&&lng<132;
}).map(it=>({
  n:it.yadmNm||'',
  a:it.addr||'',
  t:it.telno||'',
  y:Math.round(parseFloat(it.YPos)*100000)/100000,
  x:Math.round(parseFloat(it.XPos)*100000)/100000,
  c:it.clCd,
  d:parseInt(it.drTotCnt)||0,
  s:parseInt(it.detySdrCnt)||0,
  e:it.estbDd||0,
  si:it.sidoCdNm||'',
  sg:it.sgguCdNm||'',
}));
console.log('Valid clinics:',clinics.length);

const byRegion={};
clinics.forEach(c=>{byRegion[c.si]=(byRegion[c.si]||0)+1});
console.log('\\n시도별 치과 수:');
Object.entries(byRegion).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log('  '+k+': '+v));

const output={meta:{source:'HIRA 건강보험심사평가원 병원정보서비스',fetched:new Date().toISOString().split('T')[0],totalCount:clinics.length},clinics:clinics};
const jsonStr=JSON.stringify(output);
fs.writeFileSync('$OUTPUT',jsonStr,'utf8');
const sizeMB=(Buffer.byteLength(jsonStr)/1024/1024).toFixed(2);
console.log('\\nSaved: $OUTPUT ('+sizeMB+' MB)');
"

# raw 파일 정리
rm -rf "$RAW_DIR"

echo ""
echo "=== 완료 ==="
