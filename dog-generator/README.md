# 🐶 Dog Generator

저폴리(Low-poly) 3D 강아지 커스터마이저. React + Vite + React Three Fiber로 제작.

## 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173` 열기

## 빌드

```bash
npm run build    # dist/ 폴더에 빌드 결과물 생성
npm run preview  # 빌드 결과물 미리보기
```

## 프로젝트 구조

```
src/
├── main.jsx              # 앱 진입점
├── App.jsx               # 루트 레이아웃
├── App.module.css
├── index.css             # 전역 스타일 & CSS 변수
├── useDogState.js        # 공유 상태 훅 (palettes, breed presets, sliders)
└── components/
    ├── ControlPanel.jsx  # 왼쪽 UI 패널 (색상 선택, 슬라이더, 브리드 버튼)
    ├── ControlPanel.module.css
    ├── DogModel.jsx      # Three.js 저폴리 강아지 씬 (React Three Fiber)
```

## 기술 스택

| 라이브러리 | 역할 |
|---|---|
| React 18 | UI 컴포넌트 |
| Vite | 빌드 도구 |
| Three.js | 3D 렌더링 |
| @react-three/fiber | Three.js React 바인딩 |
| @react-three/drei | OrbitControls 등 유틸리티 |

## 커스터마이징 옵션

- **브리드** : Normal / Corgi / Greyhound / Chow Chow
- **색상** : 몸통, 귀/악센트, 코
- **프로포션 슬라이더** : 머리 크기, 몸통 너비, 다리 길이, 주둥이 길이, 귀 크기, 꼬리 길이
