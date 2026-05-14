import { useEffect } from "react";
import { Marker, Popup, MapContainer, TileLayer, useMap } from "react-leaflet";
import { startIcon, endIcon } from "../utils/icons";
import ClickHandler from "./ClickHandler";
import RoutePolyline from "./RoutePolyline";
import GeoJsonLayer from "./GeoJsonLayer";

function FlyTo({ start, end }) {
  const map = useMap();
  useEffect(() => {
    if (start && end) {
      map.fitBounds(
        [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ],
        { padding: [60, 60] },
      );
    } else if (start) {
      map.flyTo([start.lat, start.lng], 14);
    } else if (end) {
      map.flyTo([end.lat, end.lng], 14);
    }
  }, [start, end]);
  return null;
}

export default function Map({ hook, layers, tileLayer }) {
  // ✅ tileLayer 추가
  const { start, end, route, handleMapClick, updateMarker } = hook;

  return (
    <div style={{ flex: 1 }}>
      <MapContainer
        center={[35.8714, 128.6014]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* ✅ key로 강제 리렌더링해서 타일 교체 */}
        <TileLayer
          key={tileLayer.url}
          attribution={tileLayer.attribution}
          url={tileLayer.url}
        />
        <ClickHandler onMapClick={handleMapClick} />
        <FlyTo start={start} end={end} />
        <GeoJsonLayer layers={layers} />

        {start && (
          <Marker
            position={start}
            icon={startIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                updateMarker("start", e.target.getLatLng());
              },
            }}
          >
            <Popup>
              🟢 출발지
              <br />
              {start.lat.toFixed(5)}, {start.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}
        {end && (
          <Marker
            position={end}
            icon={endIcon}
            draggable={true}
            eventHandlers={{
              dragend(e) {
                updateMarker("end", e.target.getLatLng());
              },
            }}
          >
            <Popup>
              🔴 도착지
              <br />
              {end.lat.toFixed(5)}, {end.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}

        <RoutePolyline route={route} />
      </MapContainer>
    </div>
  );
}
