# 🗺️ Route GIS

React + Leaflet 기반 경로 탐색 GIS 웹 애플리케이션

![지도 스타일](https://img.shields.io/badge/지도-OpenStreetMap-brightgreen)
![라우팅](https://img.shields.io/badge/라우팅-OSRM-blue)
![프레임워크](https://img.shields.io/badge/React-18-61DAFB)
![번들러](https://img.shields.io/badge/Vite-5-646CFF)

---

## 기능

| 기능 | 설명 |
|------|------|
| 출발/도착 마커 | 지도 클릭으로 출발지·도착지 설정 |
| 마커 드래그 | 마커를 드래그해서 위치 재설정, 경로 자동 재계산 |
| 경로 탐색 | OSRM API 기반 실제 도로 경로 표시 |
| 거리·시간 표시 | 경로 거리(km) 및 예상 소요 시간 표시 |
| 주소 검색 | Nominatim API 기반 주소 검색으로 마커 자동 설정 |
| 경로 저장/불러오기 | 경로를 로컬스토리지에 저장, 새로고침 후에도 유지 |
| GeoJSON 레이어 | `.geojson` / `.json` 파일 업로드 및 레이어 관리 |
| 지도 스타일 토글 | 기본 / 위성 / 다크 / 라이트 4가지 타일 레이어 |
| 리사이즈 사이드바 | 사이드바 너비 드래그로 조절 (200px ~ 480px) |
| 아코디언 UI | 섹션별 접기/펼치기로 깔끔한 사이드바 정리 |

---

## 기술 스택

- **React 18** + **Vite**
- **Leaflet** + **React-Leaflet** — 지도 렌더링
- **OSRM** — 오픈소스 도로 경로 탐색 (무료, API 키 불필요)
- **Nominatim** — OpenStreetMap 기반 주소 검색 (무료, API 키 불필요)
- **LocalStorage** — 경로 저장/불러오기

---

## 프로젝트 구조

```
src/
├── components/
│   ├── Map.jsx              # 지도 컨테이너
│   ├── Sidebar.jsx          # 사이드바 (리사이즈 포함)
│   ├── Accordion.jsx        # 접기/펼치기 섹션
│   ├── SearchBox.jsx        # 주소 검색창 (포탈 드롭다운)
│   ├── ClickHandler.jsx     # 지도 클릭 이벤트
│   ├── RoutePolyline.jsx    # 경로 선
│   ├── GeoJsonLayer.jsx     # GeoJSON 레이어
│   └── SavedRoutes.jsx      # 경로 저장/불러오기 UI
├── hooks/
│   ├── useRoute.js          # 경로 상태 + OSRM API
│   ├── useGeoJson.js        # GeoJSON 레이어 상태
│   └── useTileLayer.js      # 지도 스타일 상태
├── utils/
│   └── icons.js             # 출발/도착 마커 아이콘
├── App.jsx
└── main.jsx
```

---

## 시작하기

### 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/route-gis.git
cd route-gis

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

---

## 사용 방법

1. **경로 탐색** — 지도를 클릭해 출발지 → 도착지 순서로 마커 설정
2. **주소 검색** — 사이드바 검색창에 주소 입력 후 결과 선택
3. **마커 이동** — 마커를 드래그하면 경로 자동 재계산
4. **경로 저장** — 경로 완성 후 "현재 경로 저장" 버튼 클릭
5. **GeoJSON** — `.geojson` 파일을 드래그앤드롭 또는 클릭으로 업로드
6. **지도 스타일** — 사이드바에서 기본 / 위성 / 다크 / 라이트 선택

---

## 라이선스

MIT
