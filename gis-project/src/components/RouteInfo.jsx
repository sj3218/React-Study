export default function RouteInfo({ info }) {
  if (!info) return null;

  const km = (info.distance / 1000).toFixed(1);
  const min = Math.round(info.duration / 60);
  const hour = Math.floor(min / 60);
  const remainMin = min % 60;
  const timeStr = hour > 0 ? `${hour}시간 ${remainMin}분` : `${min}분`;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 30,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "white",
        borderRadius: 12,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        padding: "12px 24px",
        display: "flex",
        gap: 24,
        alignItems: "center",
        fontSize: 15,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>거리</div>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{km} km</div>
      </div>
      <div style={{ width: 1, height: 36, background: "#eee" }} />
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>
          예상 시간
        </div>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{timeStr}</div>
      </div>
    </div>
  );
}
