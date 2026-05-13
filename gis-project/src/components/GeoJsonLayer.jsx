import { GeoJSON } from "react-leaflet";

export default function GeoJsonLayer({ layers }) {
  return layers
    .filter((l) => l.visible)
    .map((layer) => (
      <GeoJSON
        key={layer.id}
        data={layer.data}
        style={{
          color: layer.color,
          weight: 2,
          opacity: 0.9,
          fillColor: layer.color,
          fillOpacity: 0.15,
        }}
        pointToLayer={(feature, latlng) => {
          // 포인트 타입은 원으로 표시
          const L = window.L;
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: layer.color,
            color: "#fff",
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.9,
          });
        }}
        onEachFeature={(feature, leafletLayer) => {
          if (feature.properties) {
            const props = Object.entries(feature.properties)
              .filter(([, v]) => v !== null)
              .slice(0, 6) // 최대 6개 속성만
              .map(
                ([k, v]) =>
                  `<tr><td style="color:#94a3b8;padding:2px 8px 2px 0;font-size:11px">${k}</td><td style="font-size:11px">${v}</td></tr>`,
              )
              .join("");
            if (props) {
              leafletLayer.bindPopup(
                `<table style="font-family:monospace;min-width:160px">${props}</table>`,
              );
            }
          }
        }}
      />
    ));
}
