import { MapContainer, TileLayer } from "react-leaflet";
import { Map as LeafletMap } from "leaflet";
import {
  getVWorldTileUrl,
  getVWorldLayerConfig,
  createTileErrorHandler,
} from "../api/wmts";

const LAYER = "Base";
const { minZoom, maxZoom } = getVWorldLayerConfig(LAYER);
const tileErrorHandler = createTileErrorHandler();

const seoulPosition: [number, number] = [37.5665, 126.978];
const daeguPosition: [number, number] = [35.8722, 128.6025];

interface Props {
  mapRef: React.RefObject<LeafletMap | null>;
}

export default function Map({ mapRef }: Props) {
  return (
    <MapContainer
      center={daeguPosition}
      zoom={13}
      minZoom={minZoom}
      maxZoom={maxZoom}
      className="w-full h-full"
      ref={mapRef}
    >
      <TileLayer
        url={getVWorldTileUrl(LAYER)}
        attribution="© V-World"
        minZoom={minZoom}
        maxZoom={maxZoom}
        eventHandlers={{ tileerror: tileErrorHandler }}
      />
    </MapContainer>
  );
}
