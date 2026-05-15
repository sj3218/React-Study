import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MAP_MODE } from "../hooks/useTileLayer";

const VWORLD_KEY = import.meta.env.VITE_VWORLD_KEY;

// ✅ OSM Nominatim 검색
const searchByNominatim = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=kr`;
  const res = await fetch(url, { headers: { "Accept-Language": "ko" } });
  const data = await res.json();
  return data.map((item) => ({
    label: item.display_name.split(",")[0],
    description: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
};

// ✅ V-World 검색
const searchByVworld = async (query) => {
  const url = `https://api.vworld.kr/req/search?service=search&request=search&version=2.0&crs=EPSG:4326&size=5&page=1&type=address&category=road&query=${encodeURIComponent(query)}&key=${VWORLD_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.response.status !== "OK") return [];

  return data.response.result.items.map((item) => ({
    label: item.address.road ?? item.address.parcel,
    description: item.address.parcel ?? item.address.road,
    lat: parseFloat(item.point.y),
    lng: parseFloat(item.point.x),
  }));
};

// ✅ 모드에 따라 자동 선택
const searchAddress =
  MAP_MODE === "vworld" ? searchByVworld : searchByNominatim;

export default function SearchBox({ label, color, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const updateDropdownPos = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    updateDropdownPos();

    if (!value.trim()) {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchAddress(value);
        setResults(data);
        updateDropdownPos();
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (item) => {
    setQuery(item.label);
    setResults([]);
    onSelect({ lat: item.lat, lng: item.lng });
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const dropdown = results.length > 0 && (
    <div
      style={{
        ...dropdownStyle,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      {results.map((item, i) => (
        <div
          key={i}
          onMouseDown={() => handleSelect(item)}
          style={{
            padding: "10px 12px",
            borderBottom: i < results.length - 1 ? "1px solid #f1f5f9" : "none",
            cursor: "pointer",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          <div
            style={{
              fontSize: 12,
              color: "#1e293b",
              marginBottom: 2,
              fontWeight: 500,
            }}
          >
            {item.label}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#94a3b8",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ position: "relative", marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 6px ${color}60`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 10,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </span>
        {/* ✅ 검색 엔진 표시 */}
        <span style={{ fontSize: 9, color: "#cbd5e1", marginLeft: "auto" }}>
          {MAP_MODE === "vworld" ? "V-World" : "Nominatim"}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={(e) => {
            e.target.style.borderColor = "#2563eb";
            updateDropdownPos();
          }}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          placeholder={
            MAP_MODE === "vworld" ? "도로명 주소 검색" : "주소 또는 장소 검색"
          }
          style={{
            width: "100%",
            padding: "9px 32px 9px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 12,
            color: "#1e293b",
            background: "#f8fafc",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        />
        {loading && (
          <span
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            ⏳
          </span>
        )}
        {!loading && query && (
          <span
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "#94a3b8",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ✕
          </span>
        )}
      </div>

      {createPortal(dropdown, document.body)}
    </div>
  );
}
