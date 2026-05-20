const API_KEY = import.meta.env.VITE_VWORLD_API_KEY as string;

const WMTS_BASE_URL = "/vworld/req/wmts/1.0.0";
const SEARCH_BASE_URL = "/vworld/req/search";

// ─── 레이어 타입 ───────────────────────────────────────────
export type VWorldLayer =
  | "Base"
  | "white"
  | "midnight"
  | "Hybrid"
  | "Satellite";

const LAYER_CONFIG: Record<
  VWorldLayer,
  { tileType: "png" | "jpeg"; minZoom: number; maxZoom: number }
> = {
  Base: { tileType: "png", minZoom: 6, maxZoom: 19 },
  white: { tileType: "png", minZoom: 6, maxZoom: 18 },
  midnight: { tileType: "png", minZoom: 6, maxZoom: 18 },
  Hybrid: { tileType: "png", minZoom: 6, maxZoom: 19 },
  Satellite: { tileType: "jpeg", minZoom: 6, maxZoom: 19 },
};

// ─── WMTS 에러 타입 ────────────────────────────────────────
export type VWorldExceptionCode =
  | "FileNotFound"
  | "MissingParameterValue"
  | "InvalidParameterValue"
  | "NoApplicableCode";

export interface VWorldError {
  exceptionCode: VWorldExceptionCode;
  locator?: string;
  exceptionText: string;
}

// ─── 검색 타입 ─────────────────────────────────────────────
export type SearchType = "PLACE" | "ADDRESS" | "DISTRICT" | "ROAD";
export type AddressCategory = "ROAD" | "PARCEL";

export interface SearchItem {
  id: string;
  title: string;
  category?: string;
  address: {
    road?: string;
    parcel?: string;
  };
  point: {
    x: string; // 경도
    y: string; // 위도
  };
}

export interface SearchResult {
  status: "OK" | "NOT_FOUND" | "ERROR";
  items: SearchItem[];
  totalCount: number;
}

// ─── WMTS API ─────────────────────────────────────────────

export function getVWorldTileUrl(layer: VWorldLayer = "Base"): string {
  const { tileType } = LAYER_CONFIG[layer];
  return `${WMTS_BASE_URL}/${API_KEY}/${layer}/{z}/{y}/{x}.${tileType}`;
}

export function getVWorldLayerConfig(layer: VWorldLayer) {
  return LAYER_CONFIG[layer];
}

export function parseVWorldError(xmlText: string): VWorldError | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const exception = doc.querySelector("Exception");
  if (!exception) return null;

  return {
    exceptionCode: (exception.getAttribute("exceptionCode") ??
      "NoApplicableCode") as VWorldExceptionCode,
    locator: exception.getAttribute("locator") ?? undefined,
    exceptionText:
      exception.querySelector("ExceptionText")?.textContent?.trim() ??
      "알 수 없는 오류",
  };
}

export function createTileErrorHandler() {
  return async (e: { tile: HTMLImageElement }) => {
    try {
      const res = await fetch(e.tile.src);
      const contentType = res.headers.get("Content-Type") ?? "";
      if (contentType.includes("image")) return;

      const text = await res.text();
      const error = parseVWorldError(text);

      if (error) {
        console.error(
          `[V-World 오류] ${error.exceptionCode}`,
          error.locator ? `(${error.locator})` : "",
          "-",
          error.exceptionText,
        );
      }
    } catch (err) {
      console.error("[V-World] 타일 fetch 실패", err);
    }
  };
}

// ─── 검색 API ─────────────────────────────────────────────

/**
 * V-World 장소/주소 검색
 * @param query 검색 키워드
 * @param type 검색 대상 (PLACE | ADDRESS)
 * @param size 결과 건수 (기본 10, 최소 1, 최대 1000)
 */
export async function searchVWorld(
  query: string,
  type: SearchType = "PLACE",
  size: number = 10,
): Promise<SearchResult> {
  const params = new URLSearchParams({
    service: "search",
    request: "search",
    version: "2.0",
    crs: "EPSG:4326",
    query,
    type,
    format: "json",
    errorFormat: "json",
    size: String(size),
    key: API_KEY,
    ...(type === "ADDRESS" && { category: "ROAD" }),
  });

  const res = await fetch(`${SEARCH_BASE_URL}?${params}`);
  const data = await res.json();

  if (data.status === "ERROR") {
    console.error(
      "[V-World 검색 오류]",
      data.error?.code,
      "-",
      data.error?.text,
    );
    return { status: "ERROR", items: [], totalCount: 0 };
  }

  if (data.status === "NOT_FOUND") {
    return { status: "NOT_FOUND", items: [], totalCount: 0 };
  }

  return {
    status: "OK",
    items: data.result.items as SearchItem[],
    totalCount: Number(data.record.total),
  };
}
