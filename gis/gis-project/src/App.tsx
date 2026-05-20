import { useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import {
    getVWorldTileUrl,
    getVWorldLayerConfig,
    createTileErrorHandler,
} from './api/wmts';
import { type Route, formatDistance, formatDuration } from './api/routing';
import { type MarkerPoint } from './components/RouteMap';
import RouteMap from './components/RouteMap';
import SearchBar from './components/SearchBar';

const LAYER = 'Base';
const { minZoom, maxZoom } = getVWorldLayerConfig(LAYER);
const tileErrorHandler = createTileErrorHandler();
const daeguPosition: [number, number] = [35.8722, 128.6025];

type SidebarMode = 'search' | 'route';

export default function App()
{
    const mapRef = useRef<LeafletMap | null>(null);
    const [sidebarMode, setSidebarMode] = useState<SidebarMode>('search');
    const [routeMode, setRouteMode] = useState<'origin' | 'destination'>(
        'origin'
    );
    const [origin, setOrigin] = useState<MarkerPoint | null>(null);
    const [destination, setDestination] = useState<MarkerPoint | null>(null);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

    function handleSearchSelect(point: { lat: number; lng: number })
    {
        mapRef.current?.flyTo([point.lat, point.lng], 16, { duration: 1.2 });
    }

    function handleSwap()
    {
        setOrigin(destination);
        setDestination(origin);
        setRoutes([]);
    }

    function handleReset()
    {
        setOrigin(null);
        setDestination(null);
        setRoutes([]);
        setRouteMode('origin');
    }

    return (
        <div className="flex w-screen h-screen bg-gray-100">
            {/* ── 아이콘 네비바 ── */}
            <nav className="flex flex-col items-center w-14 bg-white border-r border-gray-200 py-3 gap-1 shrink-0 z-10">
                <NavButton
                    icon="🗺️"
                    label="지도 홈"
                    active={sidebarMode === 'search'}
                    onClick={() => setSidebarMode('search')}
                />
                <NavButton
                    icon="➡️"
                    label="길찾기"
                    active={sidebarMode === 'route'}
                    onClick={() => setSidebarMode('route')}
                />
            </nav>

            {/* ── 사이드바 ── */}
            <aside className="w-80 bg-white shadow-lg shrink-0 flex flex-col z-10 overflow-hidden">
                {/* 지도 홈 - 검색 */}
                {sidebarMode === 'search' && (
                    <SearchBar onSelect={handleSearchSelect} />
                )}

                {/* 길찾기 */}
                {sidebarMode === 'route' && (
                    <div className="flex flex-col h-full">
                        {/* 교통수단 탭 */}
                        <div className="flex border-b border-gray-200">
                            <button className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-blue-500 border-b-2 border-blue-500">
                                <span>🚗</span> 자동차
                            </button>
                        </div>

                        {/* 입력 영역 */}
                        <div className="p-4">
                            <div className="relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                {/* 출발지 */}
                                <button
                                    onClick={() => setRouteMode('origin')}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                        routeMode === 'origin'
                                            ? 'bg-green-50'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                        <span
                                            className={
                                                origin
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400'
                                            }
                                        >
                                            {origin?.address ?? '출발지 입력'}
                                        </span>
                                    </div>
                                </button>

                                {/* 구분선 + 스왑 버튼 */}
                                <div className="relative border-t border-gray-200">
                                    <button
                                        onClick={handleSwap}
                                        className="absolute right-3 -top-4 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm transition-colors z-10"
                                        title="출발지·도착지 바꾸기"
                                    >
                                        <span className="text-xs">⇅</span>
                                    </button>
                                </div>

                                {/* 도착지 */}
                                <button
                                    onClick={() => setRouteMode('destination')}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                        routeMode === 'destination'
                                            ? 'bg-red-50'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                                        <span
                                            className={
                                                destination
                                                    ? 'text-gray-800'
                                                    : 'text-gray-400'
                                            }
                                        >
                                            {destination?.address ??
                                                '도착지 입력'}
                                        </span>
                                    </div>
                                </button>
                            </div>

                            {/* 버튼 영역 */}
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <span>↺</span> 다시입력
                                </button>
                                <button
                                    onClick={() =>
                                    {
                                        /* 이미 자동으로 경로 계산됨 */
                                    }}
                                    disabled={!origin || !destination}
                                    className="flex-1 py-2 text-xs font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                                >
                                    길찾기 →
                                </button>
                            </div>

                            {/* 모드 안내 */}
                            <p className="mt-3 text-xs text-center text-gray-400">
                                {routeMode === 'origin'
                                    ? '🟢 지도를 클릭해 출발지를 선택하세요'
                                    : '🔴 지도를 클릭해 도착지를 선택하세요'}
                            </p>
                        </div>

                        {/* 경로 결과 */}
                        {routes.length > 0 && (
                            <div className="flex-1 overflow-y-auto border-t border-gray-200 p-4">
                                <p className="text-xs font-bold text-gray-500 mb-3">
                                    경로 목록
                                </p>
                                <div className="space-y-2">
                                    {routes.map((route, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                setSelectedRouteIndex(i)
                                            }
                                            className={`w-full text-left p-3 rounded-xl border transition-all ${
                                                selectedRouteIndex === i
                                                    ? 'border-blue-400 bg-blue-50 shadow-sm'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <p className="text-xs font-bold text-gray-700 mb-0.5">
                                                {i === 0
                                                    ? '🏆 최단 경로'
                                                    : `경로 ${i + 1}`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDistance(route.distance)}{' '}
                                                ·{' '}
                                                {formatDuration(route.duration)}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </aside>

            {/* ── 지도 ── */}
            <div className="flex-1 relative">
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
                    <RouteMap
                        mode={routeMode}
                        origin={origin}
                        destination={destination}
                        routes={routes}
                        selectedRouteIndex={selectedRouteIndex}
                        onOriginChange={(p) =>
                        {
                            setOrigin(p);
                            setRouteMode('destination');
                        }}
                        onDestinationChange={setDestination}
                        onRoutesChange={setRoutes}
                        onSelectedRouteChange={setSelectedRouteIndex}
                    />
                </MapContainer>
            </div>
        </div>
    );
}

// ── 네비 버튼 컴포넌트 ──
function NavButton({
    icon,
    label,
    active,
    onClick,
}: {
    icon: string;
    label: string;
    active: boolean;
    onClick: () => void;
})
{
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-0.5 w-full py-2 px-1 rounded-lg transition-colors ${
                active
                    ? 'bg-blue-50 text-blue-500'
                    : 'text-gray-400 hover:bg-gray-50'
            }`}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}
