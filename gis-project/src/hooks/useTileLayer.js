import { useState } from "react";

const MODE = import.meta.env.VITE_MAP_MODE;
const VWORLD_KEY = import.meta.env.VITE_VWORLD_KEY;

const OSM_LAYERS = {
  osm: {
    label: "기본",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  satellite: {
    label: "위성",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  dark: {
    label: "다크",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  },
  light: {
    label: "라이트",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  },
};

const VWORLD_LAYERS = {
  vworld_base: {
    label: "기본",
    url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`,
    attribution: "&copy; 국토교통부",
  },
  vworld_satellite: {
    label: "위성",
    url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`,
    attribution: "&copy; 국토교통부",
  },
  vworld_hybrid: {
    label: "하이브리드",
    url: `https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Hybrid/{z}/{y}/{x}.png`,
    attribution: "&copy; 국토교통부",
  },
};

export const TILE_LAYERS = MODE === "vworld" ? VWORLD_LAYERS : OSM_LAYERS;

export const MAP_MODE = MODE; // ✅ 사이드바 UI에서 모드 표시용

export default function useTileLayer() {
  const [current, setCurrent] = useState(Object.keys(TILE_LAYERS)[0]);
  return { current, setCurrent, layer: TILE_LAYERS[current] };
}
