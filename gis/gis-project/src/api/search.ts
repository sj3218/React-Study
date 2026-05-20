const API_KEY = import.meta.env.VITE_VWORLD_API_KEY as string;
const SEARCH_BASE_URL = '/vworld/req/search';

// ─── 요청 타입 ────────────────────────────────────────────
type AddressCategory = 'ROAD' | 'PARCEL';
type DistrictCategory = 'L1' | 'L2' | 'L3' | 'L4';
type BBox = `${number},${number},${number},${number}`;

interface BaseSearchParams
{
    query: string;
    size?: number; // 1~1000, 기본 10
    page?: number; // 기본 1
    bbox?: BBox;
    crs?: string; // 기본 EPSG:4326
}

export type SearchParams =
    | (BaseSearchParams & { type: 'PLACE'; category?: string })
    | (BaseSearchParams & { type: 'ADDRESS'; category: AddressCategory })
    | (BaseSearchParams & { type: 'DISTRICT'; category: DistrictCategory })
    | (BaseSearchParams & { type: 'ROAD' });

// ─── 공통 응답 래퍼 ───────────────────────────────────────
interface Response_Search
{
    service: {
        name: string;
        version: string;
        operation: string;
        time: string;
    };
    status: 'OK' | 'NOT_FOUND' | 'ERROR';
    record: {
        total: number;
        current: number;
    };
    page: {
        total: number;
        current: number;
        size: number;
    };
}

// ─── type별 응답 item ──────────────────────────────────────────
export interface PlaceItem
{
    id: string;
    title: string;
    category: string;
    address: {
        road?: string;
        parcel?: string;
    };
    point: {
        x: string; // 경도 (lng)
        y: string; // 위도 (lat)
    };
}

export interface AddressItem
{
    id: string;
    address: {
        zipcode?: string;
        category: string;
        road?: string;
        parcel?: string;
        bldnm?: string;
        bldnmdc?: string;
    };
    point: {
        x: string;
        y: string;
    };
}

export interface DistrictItem
{
    id: string;
    title: string;
    geometry?: string;
    point: {
        x: string;
        y: string;
    };
}

export interface RoadItem
{
    id: string;
    title: string;
    district?: string;
    geometry?: string;
}

// ─── 최종 응답 타입 ───────────────────────────────────────
export interface PlaceResponse extends Response_Search
{
    result: { crs: string; type: string; items: PlaceItem[] };
}
export interface AddressResponse extends Response_Search
{
    result: { crs: string; type: string; items: AddressItem[] };
}
export interface DistrictResponse extends Response_Search
{
    result: { crs: string; type: string; items: DistrictItem[] };
}
export interface RoadResponse extends Response_Search
{
    result: { crs: string; type: string; items: RoadItem[] };
}

export interface SearchResultError
{
    status: 'NOT_FOUND' | 'ERROR';
}

// ─── 에러 타입 ────────────────────────────────────────────
type SearchErrorCode =
    | 'PARAM_REQUIRED'
    | 'INVALID_TYPE'
    | 'INVALID_RANGE'
    | 'INVALID_KEY'
    | 'INCORRECT_KEY'
    | 'UNAVAILABLE_KEY'
    | 'OVER_REQUEST_LIMIT'
    | 'SYSTEM_ERROR'
    | 'UNKNOWN_ERROR';

interface SearchError
{
    level: number;
    code: SearchErrorCode;
    text: string;
}

// ─── 응답 파싱 ────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArray<T>(raw: any): T[]
{
    if (!raw) return [];
    return Array.isArray(raw) ? raw : [raw];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseMeta(data: any): Response_Search
{
    return {
        service: {
            name: data.service.name,
            version: data.service.version,
            operation: data.service.operation,
            time: data.service.time,
        },
        status: data.status,
        record: {
            total: Number(data.record.total),
            current: Number(data.record.current),
        },
        page: {
            total: Number(data.page.total),
            current: Number(data.page.current),
            size: Number(data.page.size),
        },
    };
}

// ─── 함수 오버로드 시그니처 ───────────────────────────────
export async function searchVWorld(
    params: BaseSearchParams & { type: 'PLACE'; category?: string }
): Promise<PlaceResponse | SearchResultError>;
export async function searchVWorld(
    params: BaseSearchParams & { type: 'ADDRESS'; category: AddressCategory }
): Promise<AddressResponse | SearchResultError>;
export async function searchVWorld(
    params: BaseSearchParams & { type: 'DISTRICT'; category: DistrictCategory }
): Promise<DistrictResponse | SearchResultError>;
export async function searchVWorld(
    params: BaseSearchParams & { type: 'ROAD' }
): Promise<RoadResponse | SearchResultError>;

// ─── 함수 구현 ────────────────────────────────────────────
export async function searchVWorld(
    params: SearchParams
): Promise<
    | PlaceResponse
    | AddressResponse
    | DistrictResponse
    | RoadResponse
    | SearchResultError
>
{
    const {
        query,
        type,
        size = 10,
        page = 1,
        bbox,
        crs = 'EPSG:4326',
    } = params;

    const urlParams = new URLSearchParams({
        service: 'search',
        version: '2.0',
        request: 'search',
        key: API_KEY,
        format: 'json',
        errorFormat: 'json',
        size: String(size),
        page: String(page),
        query,
        type,
        crs,
    });

    if (bbox)
    {
        urlParams.set('bbox', bbox);
    }
    if ('category' in params && params.category)
    {
        urlParams.set('category', params.category);
    }

    const res = await fetch(`${SEARCH_BASE_URL}?${urlParams}`);
    const data = await res.json();
    const response = data.response;

    if (response.status === 'ERROR')
    {
        const error = response.error as SearchError;
        console.error(`[V-World 검색 오류] ${error.code} - ${error.text}`);
        return { status: 'ERROR' };
    }

    if (response.status === 'NOT_FOUND')
    {
        return { status: 'NOT_FOUND' };
    }
    console.log('raw response:', JSON.stringify(response, null, 2));
    const meta = parseMeta(response);
    const rawItems = response.result?.items ?? [];

    switch (type)
    {
        case 'PLACE':
            return {
                ...meta,
                result: {
                    crs: response.result.crs,
                    type: response.result.type,
                    items: toArray<PlaceItem>(rawItems).map((item) => ({
                        id: item.id,
                        title: item.title,
                        category: item.category ?? '',
                        address: {
                            road: item.address?.road,
                            parcel: item.address?.parcel,
                        },
                        point: item.point,
                    })),
                },
            };

        case 'ADDRESS':
            return {
                ...meta,
                result: {
                    crs: response.result.crs,
                    type: response.result.type,
                    items: toArray<AddressItem>(rawItems).map((item) => ({
                        id: item.id,
                        address: {
                            zipcode: item.address?.zipcode,
                            category: item.address?.category ?? '',
                            road: item.address?.road,
                            parcel: item.address?.parcel,
                            bldnm: item.address?.bldnm,
                            bldnmdc: item.address?.bldnmdc,
                        },
                        point: item.point,
                    })),
                },
            };

        case 'DISTRICT':
            return {
                ...meta,
                result: {
                    crs: response.result.crs,
                    type: response.result.type,
                    items: toArray<DistrictItem>(rawItems).map((item) => ({
                        id: item.id,
                        title: item.title,
                        geometry: item.geometry,
                        point: item.point,
                    })),
                },
            };

        case 'ROAD':
            return {
                ...meta,
                result: {
                    crs: response.result.crs,
                    type: response.result.type,
                    items: toArray<RoadItem>(rawItems).map((item) => ({
                        id: item.id,
                        title: item.title,
                        district: item.district,
                        geometry: item.geometry,
                    })),
                },
            };
    }
}
