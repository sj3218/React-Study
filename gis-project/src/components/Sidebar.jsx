import { useRef, useState, useCallback } from "react";
import SearchBox from "./SearchBox";

const DOT = ({ color }) => (
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
);

const SectionLabel = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      color: "#94a3b8",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      marginBottom: 10,
    }}
  >
    {children}
  </div>
);

const CoordCard = ({ label, color, value }) => (
  <div
    style={{
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "10px 12px",
      marginBottom: 6,
    }}
  >
    <div
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}
    >
      <DOT color={color} />
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
    <div
      style={{
        fontSize: 12,
        color: value ? "#2563eb" : "#cbd5e1",
        fontFamily: "monospace",
      }}
    >
      {value ?? "미설정"}
    </div>
  </div>
);

const InfoCard = ({ value, unit }) => (
  <div
    style={{
      flex: 1,
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: 12,
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: 20,
        fontWeight: 600,
        color: "#2563eb",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: 10,
        color: "#94a3b8",
        marginTop: 2,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
      }}
    >
      {unit}
    </div>
  </div>
);

const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function Sidebar({
  mode,
  start,
  end,
  info,
  loading,
  onReset,
  onSearch,
  layers,
  onFileLoad,
  onToggleLayer,
  onRemoveLayer,
}) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileLoad(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) onFileLoad(file);
    e.target.value = ""; // 같은 파일 재업로드 허용
  };
  const [width, setWidth] = useState(280);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e) => {
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMouseMove = (e) => {
        if (!isDragging.current) return;
        const delta = e.clientX - startX.current;
        const newWidth = Math.min(
          MAX_WIDTH,
          Math.max(MIN_WIDTH, startWidth.current + delta),
        );
        setWidth(newWidth);
      };

      const onMouseUp = () => {
        isDragging.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [width],
  );

  const km = info ? (info.distance / 1000).toFixed(1) : "—";
  const timeStr = (() => {
    if (!info) return "—";
    const min = Math.round(info.duration / 60);
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}시간 ${m}분` : `${min}분`;
  })();

  const modeText = loading
    ? "⏳ 경로 계산 중..."
    : mode === "start"
      ? "출발지를 클릭하세요"
      : "도착지를 클릭하세요";

  const modeColor = loading
    ? "#f59e0b"
    : mode === "start"
      ? "#22c55e"
      : "#ef4444";

  return (
    <div style={{ position: "relative", display: "flex", flexShrink: 0 }}>
      {/* 사이드바 본체 */}
      <div
        style={{
          width,
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <DOT color="#2563eb" />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1e293b",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Route GIS
            </span>
          </div>
          <div
            style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em" }}
          >
            경로 탐색 시스템
          </div>
        </div>

        {/* 모드 */}
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
        >
          <SectionLabel>현재 모드</SectionLabel>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <DOT color={modeColor} />
            <span style={{ fontSize: 12, color: "#475569" }}>{modeText}</span>
          </div>
        </div>

        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
        >
          <SectionLabel>주소 검색</SectionLabel>
          <SearchBox
            label="출발지"
            color="#22c55e"
            onSelect={(latlng) => onSearch("start", latlng)}
          />
          <SearchBox
            label="도착지"
            color="#ef4444"
            onSelect={(latlng) => onSearch("end", latlng)}
          />
        </div>

        {/* 마커 좌표 */}
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
        >
          <SectionLabel>마커</SectionLabel>
          <CoordCard
            label="출발지"
            color="#22c55e"
            value={
              start ? `${start.lat.toFixed(5)}, ${start.lng.toFixed(5)}` : null
            }
          />
          <CoordCard
            label="도착지"
            color="#ef4444"
            value={end ? `${end.lat.toFixed(5)}, ${end.lng.toFixed(5)}` : null}
          />
        </div>

        {/* 경로 정보 */}
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
        >
          <SectionLabel>경로 정보</SectionLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <InfoCard value={km} unit="km" />
            <InfoCard value={timeStr} unit="예상 시간" />
          </div>
        </div>

        {/* 초기화 버튼 */}
        {(start || end) && (
          <div style={{ padding: "12px 20px" }}>
            <button
              onClick={onReset}
              style={{
                width: "100%",
                padding: 10,
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: "0.05em",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#ef4444";
                e.target.style.color = "#ef4444";
                e.target.style.background = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.color = "#94a3b8";
                e.target.style.background = "transparent";
              }}
            >
              ↺ 초기화
            </button>
          </div>
        )}
        <div
          style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}
        >
          <SectionLabel>GeoJSON 레이어</SectionLabel>

          {/* 파일 업로드 드롭존 */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("geojson-input").click()}
            style={{
              border: "1.5px dashed #e2e8f0",
              borderRadius: 8,
              padding: "14px 12px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: 10,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.background = "#eff6ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 4 }}>📂</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              클릭하거나 파일을 드래그하세요
            </div>
            <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2 }}>
              .geojson / .json
            </div>
            <input
              id="geojson-input"
              type="file"
              accept=".geojson,.json"
              style={{ display: "none" }}
              onChange={handleFileInput}
            />
          </div>

          {/* 레이어 목록 */}
          {layers.map((layer) => (
            <div
              key={layer.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                marginBottom: 4,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
              }}
            >
              {/* 색상 도트 */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: layer.color,
                  flexShrink: 0,
                }}
              />

              {/* 레이어명 */}
              <span
                style={{
                  fontSize: 11,
                  color: layer.visible ? "#1e293b" : "#94a3b8",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {layer.name}
              </span>

              {/* 토글 버튼 */}
              <button
                onClick={() => onToggleLayer(layer.id)}
                title={layer.visible ? "숨기기" : "보이기"}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: layer.visible ? "#2563eb" : "#cbd5e1",
                  padding: 2,
                  lineHeight: 1,
                }}
              >
                {layer.visible ? "👁" : "👁️‍🗨️"}
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={() => onRemoveLayer(layer.id)}
                title="레이어 삭제"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "#cbd5e1",
                  padding: 2,
                  lineHeight: 1,
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
              >
                ✕
              </button>
            </div>
          ))}

          {layers.length === 0 && (
            <div
              style={{
                fontSize: 11,
                color: "#e2e8f0",
                textAlign: "center",
                padding: "4px 0",
              }}
            >
              업로드된 레이어 없음
            </div>
          )}
        </div>
        {/* 푸터 */}
        <div
          style={{
            marginTop: "auto",
            padding: "16px 20px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{ fontSize: 10, color: "#cbd5e1", letterSpacing: "0.05em" }}
          >
            OSRM Routing Engine · OSM Data
          </div>
        </div>
      </div>

      {/* ✅ 리사이즈 핸들 */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          right: -3,
          top: 0,
          width: 6,
          height: "100%",
          cursor: "col-resize",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 핸들 시각적 표시 */}
        <div
          style={{
            width: 2,
            height: 40,
            borderRadius: 2,
            background: "#e2e8f0",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
        />
      </div>
    </div>
  );
}
