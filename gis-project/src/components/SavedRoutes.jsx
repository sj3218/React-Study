import { useState } from "react";

const formatDist = (m) => (m / 1000).toFixed(1) + " km";
const formatTime = (s) => {
  const min = Math.round(s / 60);
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}시간 ${m}분` : `${min}분`;
};

export default function SavedRoutes({
  savedRoutes,
  onLoad,
  onDelete,
  onSave,
  canSave,
}) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setSaving(false);
  };

  return (
    <div style={{ borderBottom: "1px solid #f1f5f9" }}>
      {/* 저장 버튼 or 이름 입력 */}
      {canSave &&
        (saving ? (
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="경로 이름 입력"
              style={{
                flex: 1,
                padding: "8px 10px",
                border: "1px solid #2563eb",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "inherit",
                outline: "none",
                color: "#1e293b",
                background: "#f8fafc",
              }}
            />
            <button
              onClick={handleSave}
              style={{
                padding: "8px 12px",
                background: "#2563eb",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              저장
            </button>
            <button
              onClick={() => {
                setSaving(false);
                setName("");
              }}
              style={{
                padding: "8px 10px",
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSaving(true)}
            style={{
              width: "100%",
              padding: "9px 0",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 8,
              color: "#2563eb",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 10,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#dbeafe")}
            onMouseLeave={(e) => (e.target.style.background = "#eff6ff")}
          >
            + 현재 경로 저장
          </button>
        ))}

      {/* 저장된 경로 목록 */}
      {savedRoutes.length === 0 ? (
        <div
          style={{
            fontSize: 11,
            color: "#e2e8f0",
            textAlign: "center",
            padding: "4px 0",
          }}
        >
          저장된 경로 없음
        </div>
      ) : (
        savedRoutes.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "10px 12px",
              marginBottom: 6,
            }}
          >
            {/* 이름 + 삭제 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: "#1e293b" }}>
                {r.name}
              </span>
              <button
                onClick={() => onDelete(r.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#cbd5e1",
                  padding: 0,
                  lineHeight: 1,
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.target.style.color = "#cbd5e1")}
              >
                ✕
              </button>
            </div>

            {/* 거리 / 시간 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  color: "#2563eb",
                  background: "#eff6ff",
                  borderRadius: 4,
                  padding: "2px 7px",
                }}
              >
                {formatDist(r.distance)}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  background: "#f1f5f9",
                  borderRadius: 4,
                  padding: "2px 7px",
                }}
              >
                {formatTime(r.duration)}
              </span>
              <span
                style={{ fontSize: 11, color: "#cbd5e1", marginLeft: "auto" }}
              >
                {r.savedAt}
              </span>
            </div>

            {/* 불러오기 버튼 */}
            <button
              onClick={() => onLoad(r)}
              style={{
                width: "100%",
                padding: "6px 0",
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                color: "#64748b",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#2563eb";
                e.target.style.color = "#2563eb";
                e.target.style.background = "#eff6ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.color = "#64748b";
                e.target.style.background = "transparent";
              }}
            >
              ↩ 불러오기
            </button>
          </div>
        ))
      )}
    </div>
  );
}
