import { Polyline } from "react-leaflet";

export default function RoutePolyline({ route }) {
  if (!route) return null;
  return (
    <Polyline positions={route} pathOptions={{ color: "#4A90E2", weight: 5 }} />
  );
}
