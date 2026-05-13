import { useState } from "react";

export default function useGeoJson() {
  const [layers, setLayers] = useState([]); // 여러 파일 지원

  const loadFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setLayers((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: file.name.replace(".geojson", "").replace(".json", ""),
            data,
            visible: true,
            color: randomColor(),
          },
        ]);
      } catch {
        alert("GeoJSON 파싱 실패. 올바른 파일인지 확인하세요.");
      }
    };
    reader.readAsText(file);
  };

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    );
  };

  const removeLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  return { layers, loadFile, toggleLayer, removeLayer };
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];
let colorIndex = 0;
const randomColor = () => COLORS[colorIndex++ % COLORS.length];
