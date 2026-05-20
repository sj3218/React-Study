import { useEffect, useRef } from 'react';
import { useMapEvents, Marker, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { reverseGeocode } from '../api/geocoder';
import {
    getRoute,
    formatDistance,
    formatDuration,
    type LatLng,
    type Route,
} from '../api/routing';

// ─── 마커 아이콘 ──────────────────────────────────────────
const originIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    tooltipAnchor: [12, -28],
});

const destinationIcon = new L.Icon({
    iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    tooltipAnchor: [12, -28],
});

// ─── 경로 색상 ────────────────────────────────────────────
const ROUTE_COLORS = ['#3b82f6', '#f97316', '#22c55e'];

// ─── 타입 ─────────────────────────────────────────────────
export interface MarkerPoint
{
    latlng: LatLng;
    address: string; // 도로명 or 지번
}

interface Props
{
    mode: 'origin' | 'destination';
    origin: MarkerPoint | null;
    destination: MarkerPoint | null;
    routes: Route[];
    selectedRouteIndex: number;
    onOriginChange: (point: MarkerPoint) => void;
    onDestinationChange: (point: MarkerPoint) => void;
    onRoutesChange: (routes: Route[]) => void;
    onSelectedRouteChange: (index: number) => void;
}

// ─── 지도 클릭 핸들러 ─────────────────────────────────────
function MapClickHandler({
    mode,
    origin,
    destination,
    onOriginChange,
    onDestinationChange,
    onRoutesChange,
    onSelectedRouteChange,
}: Omit<Props, 'routes' | 'selectedRouteIndex'>)
{
    useMapEvents({
        async click(e)
        {
            const { lat, lng } = e.latlng;

            // 역지오코딩
            const geo = await reverseGeocode(lng, lat);
            const address = geo.road ?? geo.parcel ?? '주소 없음';
            const point: MarkerPoint = { latlng: { lat, lng }, address };

            if (mode === 'origin')
            {
                onOriginChange(point);
            }
            else
            {
                onDestinationChange(point);
            }

            // 출발지·도착지 둘 다 있으면 경로 요청
            const newOrigin = mode === 'origin' ? point : origin;
            const newDest = mode === 'destination' ? point : destination;

            if (newOrigin && newDest)
            {
                const result = await getRoute(newOrigin.latlng, newDest.latlng);
                if (result.status === 'OK')
                {
                    onRoutesChange(result.routes);
                    onSelectedRouteChange(0);
                }
            }
        },
    });

    return null;
}

// ─── 메인 컴포넌트 ────────────────────────────────────────
export default function RouteMap({
    mode,
    origin,
    destination,
    routes,
    selectedRouteIndex,
    onOriginChange,
    onDestinationChange,
    onRoutesChange,
    onSelectedRouteChange,
}: Props)
{
    return (
        <>
            <MapClickHandler
                mode={mode}
                origin={origin}
                destination={destination}
                onOriginChange={onOriginChange}
                onDestinationChange={onDestinationChange}
                onRoutesChange={onRoutesChange}
                onSelectedRouteChange={onSelectedRouteChange}
            />

            {/* 출발지 마커 */}
            {origin && (
                <Marker
                    position={[origin.latlng.lat, origin.latlng.lng]}
                    icon={originIcon}
                >
                    <Tooltip permanent direction="right" offset={[10, -20]}>
                        <div className="text-xs">
                            <span className="font-bold text-green-600">
                                출발
                            </span>
                            <br />
                            {origin.address}
                        </div>
                    </Tooltip>
                </Marker>
            )}

            {/* 도착지 마커 */}
            {destination && (
                <Marker
                    position={[destination.latlng.lat, destination.latlng.lng]}
                    icon={destinationIcon}
                >
                    <Tooltip permanent direction="right" offset={[10, -20]}>
                        <div className="text-xs">
                            <span className="font-bold text-red-600">도착</span>
                            <br />
                            {destination.address}
                        </div>
                    </Tooltip>
                </Marker>
            )}

            {/* 경로 Polyline - 선택 안 된 경로 먼저 그리고 선택된 경로 위에 그림 */}
            {routes.map((route, i) =>
            {
                const positions = route.coordinates.map(
                    ([lng, lat]) => [lat, lng] as [number, number]
                );
                const isSelected = i === selectedRouteIndex;
                return (
                    <Polyline
                        key={i}
                        positions={positions}
                        pathOptions={{
                            color: ROUTE_COLORS[i % ROUTE_COLORS.length],
                            weight: isSelected ? 6 : 3,
                            opacity: isSelected ? 0.9 : 0.4,
                        }}
                        eventHandlers={{
                            click: () => onSelectedRouteChange(i),
                        }}
                    >
                        <Tooltip sticky>
                            <div className="text-xs">
                                <p className="font-bold">
                                    {i === 0 ? '최단 경로' : `대안 경로 ${i}`}
                                </p>
                                <p>
                                    {formatDistance(route.distance)} ·{' '}
                                    {formatDuration(route.duration)}
                                </p>
                            </div>
                        </Tooltip>
                    </Polyline>
                );
            })}
        </>
    );
}
