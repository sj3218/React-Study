const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1';

// ─── 타입 ─────────────────────────────────────────────────
export interface LatLng
{
    lat: number;
    lng: number;
}

export interface Route
{
    distance: number; // 전체 거리 (미터)
    duration: number; // 전체 시간 (초)
    coordinates: [number, number][]; // [lng, lat] 배열
}

export interface RoutingResult
{
    status: 'OK' | 'ERROR';
    routes: Route[]; // 첫 번째가 최단경로, 이후가 대안경로
    message?: string;
}

// ─── 함수 ─────────────────────────────────────────────────

/**
 * OSRM 데모 서버로 경로 요청
 * @param origin 출발지
 * @param destination 도착지
 * @param mode 이동 수단 (기본: driving)
 * @param alternatives 대안 경로 수 (기본: 3)
 */
export async function getRoute(
    origin: LatLng,
    destination: LatLng,
    mode: 'driving' | 'walking' | 'cycling' = 'driving',
    alternatives: number = 3
): Promise<RoutingResult>
{
    const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `${OSRM_BASE_URL}/${mode}/${coords}?overview=full&geometries=geojson&alternatives=${alternatives}`;

    try
    {
        const res = await fetch(url);
        const data = await res.json();

        if (data.code !== 'Ok')
        {
            console.error('[OSRM 오류]', data.code, data.message);
            return { status: 'ERROR', routes: [], message: data.message };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routes: Route[] = data.routes.map((route: any) => ({
            distance: route.distance,
            duration: route.duration,
            coordinates: route.geometry.coordinates as [number, number][],
        }));

        return { status: 'OK', routes };
    }
    catch (err)
    {
        console.error('[OSRM] fetch 실패', err);
        return { status: 'ERROR', routes: [], message: '네트워크 오류' };
    }
}

// ─── 유틸 ─────────────────────────────────────────────────

/** 미터 → 사람이 읽기 좋은 거리 문자열 */
export function formatDistance(meters: number): string
{
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
}

/** 초 → 사람이 읽기 좋은 시간 문자열 */
export function formatDuration(seconds: number): string
{
    const min = Math.round(seconds / 60);
    if (min < 60) return `${min}분`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}
