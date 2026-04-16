/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 안의 모든 파일을 감시합니다.
  ],
  theme: {
    extend: {
      // 여기에 등록해야 bg-game-bg, text-game-text 클래스를 사용할 수 있습니다.
      colors: {
        'game-bg': '#0F172A',
        'game-card': '#1E293B',
        'game-accent': '#38BDF8',
        'game-text': '#F1F5F9',
        'game-muted': '#94A3B8',
        'viewport': '#020617',
      },
      // 그리드 레이아웃이 깨진다면 아래 설정도 도움이 됩니다.
      gridTemplateColumns: {
        'game-layout': '240px 1fr 240px',
      }
    },
  },
  plugins: [],
}