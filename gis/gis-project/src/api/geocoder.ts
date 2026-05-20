const API_KEY = import.meta.env.VITE_VWORLD_API_KEY as string;
const GEOCODER_BASE_URL = '/vworld/req/address';

// ─── 요청 타입 ────────────────────────────────────────────
export type AddressType = 'PARCEL' | 'ROAD' | 'BOTH';

// ─── 응답 타입 ────────────────────────────────────────────
interface GeocoderService
{
    name: string;
    version: string;
    operation: string;
    time: string;
}

interface GeocoderInput
{
    point: { x: string; y: string };
    crs: string;
    type: string;
}

interface AddressStructure
{
    level0: string; // 국가
    level1: string; // 시·도
    level2: string; // 시·군·구
    level3: string; // (일반구)구
    level4L: string; // (도로)도로명 / (지번)법정읍·면·동
    level4LC: string; //(도로)도로코드, (지번)법정읍·면·동 코드
    level4A: string; // (도로)행정읍·면·동
    level4AC: string; //(도로)행정읍·면·동 코드, (지번)지원안함
    level5: string; // (도로)길 / (지번)번지
    detail: string; // 상세주소
}

interface AddressResultItem
{
    zipcode?: string;
    type: 'road' | 'parcel'; // 실제 응답은 소문자로 옴
    text: string;
    structure: AddressStructure;
}

interface GeocoderResponse
{
    service: GeocoderService;
    status: 'OK' | 'NOT_FOUND' | 'ERROR';
    input?: GeocoderInput;
    result?: AddressResultItem | AddressResultItem[];
    error?: {
        level: number;
        code: string;
        text: string;
    };
}

export interface ReverseGeocodeResult
{
    status: 'OK' | 'NOT_FOUND' | 'ERROR';
    road?: string; // 도로명 주소
    parcel?: string; // 지번 주소
    zipcode?: string;
    structure?: AddressStructure;
}

// ─── 함수 ─────────────────────────────────────────────────

/**
 * 좌표 → 주소 변환 (역지오코딩)
 * @param lng 경도 (x)
 * @param lat 위도 (y)
 * @param type 주소 유형 (기본: BOTH)
 */
export async function reverseGeocode(
    lng: number,
    lat: number,
    type: AddressType = 'BOTH'
): Promise<ReverseGeocodeResult>
{
    const params = new URLSearchParams({
        service: 'address',
        request: 'GetAddress',
        version: '2.0',
        crs: 'EPSG:4326',
        point: `${lng},${lat}`,
        type,
        format: 'json',
        errorFormat: 'json',
        zipcode: 'true',
        key: API_KEY,
    });

    try
    {
        const res = await fetch(`${GEOCODER_BASE_URL}?${params}`);
        const data = await res.json();
        const response = data.response as GeocoderResponse;

        if (response.status === 'NOT_FOUND')
        {
            return { status: 'NOT_FOUND' };
        }

        if (response.status === 'ERROR')
        {
            console.error(
                '[V-World 역지오코딩 오류]',
                response.error?.code,
                '-',
                response.error?.text
            );
            return { status: 'ERROR' };
        }

        // 결과가 1건이면 객체, 2건이면 배열로 올 수 있음
        const results = Array.isArray(response.result)
            ? response.result
            : response.result
              ? [response.result]
              : [];

        let road: string | undefined;
        let parcel: string | undefined;
        let zipcode: string | undefined;
        let structure: AddressStructure | undefined;

        for (const item of results)
        {
            if (item.type === 'road')
            {
                road = item.text;
                zipcode = item.zipcode;
                structure = item.structure;
            }
            if (item.type === 'parcel')
            {
                parcel = item.text;
                if (!zipcode) zipcode = item.zipcode;
                if (!structure) structure = item.structure;
            }
        }

        return { status: 'OK', road, parcel, zipcode, structure };
    }
    catch (err)
    {
        console.error('[V-World 역지오코딩] fetch 실패', err);
        return { status: 'ERROR' };
    }
}
