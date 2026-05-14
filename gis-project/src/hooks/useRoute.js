import { useState } from "react";

const fetchRoute = async (start, end) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  const route = data.routes[0];
  return {
    coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distance: route.distance,
    duration: route.duration,
  };
};

const STORAGE_KEY = "gis_saved_routes";

const getSaved = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export default function useRoute() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("start");
  const [info, setInfo] = useState(null);
  const [savedRoutes, setSavedRoutes] = useState(getSaved);

  const applyRoute = async (s, e) => {
    setLoading(true);
    try {
      const { coords, distance, duration } = await fetchRoute(s, e);
      setRoute(coords);
      setInfo({ distance, duration });
    } catch {
      alert("경로를 불러오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (latlng) => {
    if (mode === "start") {
      setStart(latlng);
      setEnd(null);
      setRoute(null);
      setInfo(null);
      setMode("end");
    } else {
      setEnd(latlng);
      setMode("start");
      await applyRoute(start, latlng);
    }
  };

  const updateMarker = async (type, latlng) => {
    const newStart = type === "start" ? latlng : start;
    const newEnd = type === "end" ? latlng : end;
    if (type === "start") setStart(latlng);
    if (type === "end") setEnd(latlng);
    if (newStart && newEnd) await applyRoute(newStart, newEnd);
  };

  const setMarker = async (type, latlng) => {
    if (type === "start") {
      setStart(latlng);
      setRoute(null);
      setInfo(null);
      if (end) await applyRoute(latlng, end);
    } else {
      setEnd(latlng);
      setRoute(null);
      setInfo(null);
      if (start) await applyRoute(start, latlng);
    }
  };

  const reset = () => {
    setStart(null);
    setEnd(null);
    setRoute(null);
    setInfo(null);
    setMode("start");
  };

  // ✅ 현재 경로 저장
  const saveRoute = (name) => {
    if (!start || !end || !info) return;
    const entry = {
      id: Date.now(),
      name,
      start: { lat: start.lat, lng: start.lng },
      end: { lat: end.lat, lng: end.lng },
      distance: info.distance,
      duration: info.duration,
      savedAt: new Date().toLocaleDateString("ko-KR"),
    };
    const updated = [entry, ...getSaved()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedRoutes(updated);
  };

  // ✅ 저장된 경로 불러오기
  const loadRoute = async (entry) => {
    setStart(entry.start);
    setEnd(entry.end);
    setMode("start");
    await applyRoute(entry.start, entry.end);
  };

  // ✅ 저장된 경로 삭제
  const deleteSaved = (id) => {
    const updated = getSaved().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSavedRoutes(updated);
  };

  return {
    start,
    end,
    route,
    loading,
    mode,
    info,
    handleMapClick,
    updateMarker,
    setMarker,
    reset,
    savedRoutes,
    saveRoute,
    loadRoute,
    deleteSaved,
  };
}
