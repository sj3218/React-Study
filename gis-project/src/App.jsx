import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import useRoute from "./hooks/useRoute";
import useGeoJson from "./hooks/useGeoJson";
import useTileLayer from "./hooks/useTileLayer"; // ✅

export default function App() {
  const hook = useRoute();
  const geo = useGeoJson();
  const tile = useTileLayer(); // ✅

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8f9fc" }}>
      <Sidebar
        mode={hook.mode}
        start={hook.start}
        end={hook.end}
        info={hook.info}
        loading={hook.loading}
        onReset={hook.reset}
        onSearch={hook.setMarker}
        layers={geo.layers}
        onFileLoad={geo.loadFile}
        onToggleLayer={geo.toggleLayer}
        onRemoveLayer={geo.removeLayer}
        savedRoutes={hook.savedRoutes}
        onSaveRoute={hook.saveRoute}
        onLoadRoute={hook.loadRoute}
        onDeleteSaved={hook.deleteSaved}
        currentTile={tile.current}
        onTileChange={tile.setCurrent}
      />
      <Map hook={hook} layers={geo.layers} tileLayer={tile.layer} />
    </div>
  );
}
