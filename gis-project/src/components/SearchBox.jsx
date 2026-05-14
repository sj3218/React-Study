import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const searchAddress = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=kr`;
  const res = await fetch(url, { headers: { "Accept-Language": "ko" } });
  return await res.json();
};

export default function SearchBox({ label, color, onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // 인풋 위치 계산해서 드롭다운 좌표 설정
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
    setQuery(item.display_name.split(",")[0]);
    setResults([]);
    onSelect({ lat: parseFloat(item.lat), lng: parseFloat(item.lon) });
  };

  // 바깥 클릭 시 드롭다운 닫기
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
          key={item.place_id}
          onMouseDown={() => handleSelect(item)} // onMouseDown으로 blur보다 먼저 실행
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
            {item.display_name.split(",")[0]}
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
            {item.display_name}
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
          placeholder="주소 또는 장소 검색"
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

      {/* ✅ 드롭다운을 body에 포탈로 렌더링 */}
      {createPortal(dropdown, document.body)}
    </div>
  );
}
