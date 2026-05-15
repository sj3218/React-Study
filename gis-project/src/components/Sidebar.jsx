import { useState, useRef, useCallback } from "react";
import SearchBox from "./SearchBox";
import SavedRoutes from "./SavedRoutes";
import Accordion from "./Accordion";
import { TILE_LAYERS, MAP_MODE } from "../hooks/useTileLayer";
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
  savedRoutes,
  onSaveRoute,
  onLoadRoute,
  onDeleteSaved,
  currentTile,
  onTileChange,
}) {
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
        setWidth(
          Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta)),
        );
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

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileLoad(file);
  };
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) onFileLoad(file);
    e.target.value = "";
  };

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
    // ✅ 프래그먼트로 사이드바 + 핸들 나란히
    <>
      {/* 사이드바 본체 */}
      <div
        style={{
          width, // ✅ width state 적용
          minWidth: width,
          flexShrink: 0,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
          boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid #e2e8f0",
            flexShrink: 0,
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
            {/* ✅ 모드 뱃지 */}
            <span
              style={{
                fontSize: 9,
                padding: "2px 7px",
                borderRadius: 4,
                background: MAP_MODE === "vworld" ? "#ecfdf5" : "#eff6ff",
                color: MAP_MODE === "vworld" ? "#059669" : "#2563eb",
                border: `1px solid ${MAP_MODE === "vworld" ? "#a7f3d0" : "#bfdbfe"}`,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {MAP_MODE === "vworld" ? "V-World" : "OSM"}
            </span>
          </div>
          <div
            style={{ fontSize: 11, color: "#94a3b8", letterSpacing: "0.05em" }}
          >
            경로 탐색 시스템
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <Accordion title="현재 모드" defaultOpen={true}>
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
          </Accordion>

          <Accordion title="지도 스타일" defaultOpen={false}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
              }}
            >
              {Object.entries(TILE_LAYERS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => onTileChange(key)}
                  style={{
                    padding: "8px 0",
                    border:
                      currentTile === key
                        ? "1.5px solid #2563eb"
                        : "1px solid #e2e8f0",
                    borderRadius: 8,
                    background: currentTile === key ? "#eff6ff" : "#f8fafc",
                    color: currentTile === key ? "#2563eb" : "#64748b",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    ...(key.startsWith("vworld") &&
                      currentTile !== key && {
                        borderColor: "#e0f2fe",
                        color: "#0369a1",
                        background: "#f0f9ff",
                      }),
                  }}
                >
                  {val.label}
                </button>
              ))}
            </div>
          </Accordion>

          <Accordion title="주소 검색" defaultOpen={true}>
            <SearchBox
              label="출발지"
              color="#22c55e"
              onSelect={(l) => onSearch("start", l)}
            />
            <SearchBox
              label="도착지"
              color="#ef4444"
              onSelect={(l) => onSearch("end", l)}
            />
          </Accordion>

          <Accordion title="마커" defaultOpen={true}>
            <CoordCard
              label="출발지"
              color="#22c55e"
              value={
                start
                  ? `${start.lat.toFixed(5)}, ${start.lng.toFixed(5)}`
                  : null
              }
            />
            <CoordCard
              label="도착지"
              color="#ef4444"
              value={
                end ? `${end.lat.toFixed(5)}, ${end.lng.toFixed(5)}` : null
              }
            />
          </Accordion>

          <Accordion title="경로 정보" defaultOpen={true}>
            <div style={{ display: "flex", gap: 8 }}>
              <InfoCard value={km} unit="km" />
              <InfoCard value={timeStr} unit="예상 시간" />
            </div>
          </Accordion>

          <Accordion title="경로 저장 / 불러오기" defaultOpen={false}>
            <SavedRoutes
              savedRoutes={savedRoutes}
              canSave={!!start && !!end && !!info}
              onSave={onSaveRoute}
              onLoad={onLoadRoute}
              onDelete={onDeleteSaved}
            />
          </Accordion>

          <Accordion title="GeoJSON 레이어" defaultOpen={false}>
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
            {layers.length === 0 ? (
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
            ) : (
              layers.map((layer) => (
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
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: layer.color,
                      flexShrink: 0,
                    }}
                  />
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
                  <button
                    onClick={() => onToggleLayer(layer.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      color: layer.visible ? "#2563eb" : "#cbd5e1",
                      padding: 2,
                    }}
                  >
                    {layer.visible ? "👁" : "👁️‍🗨️"}
                  </button>
                  <button
                    onClick={() => onRemoveLayer(layer.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "#cbd5e1",
                      padding: 2,
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
                    onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </Accordion>

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
        </div>

        {/* 푸터 */}
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div
            style={{ fontSize: 10, color: "#cbd5e1", letterSpacing: "0.05em" }}
          >
            OSRM Routing Engine · OSM Data
          </div>
        </div>
      </div>

      {/* ✅ 핸들을 사이드바 바깥 형제로 분리 — 지도에 절대 안 가려짐 */}
      <div
        onMouseDown={onMouseDown}
        style={{
          width: 5,
          height: "100vh",
          cursor: "col-resize",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: 2,
            height: 40,
            borderRadius: 2,
            background: "#e2e8f0",
            pointerEvents: "none",
            transition: "background 0.15s",
          }}
        />
      </div>
    </>
  );
}
