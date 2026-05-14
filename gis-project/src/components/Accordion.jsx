import { useState } from "react";

export default function Accordion({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid #f1f5f9" }}>
      {/* 헤더 */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#94a3b8",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontSize: 12,
            color: "#cbd5e1",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {/* 컨텐츠 */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 1000 : 0,
          transition: "max-height 0.25s ease",
        }}
      >
        <div style={{ padding: "0 20px 16px" }}>{children}</div>
      </div>
    </div>
  );
}
