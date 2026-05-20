const API_KEY = import.meta.env.VITE_VWORLD_API_KEY as string;

const WMTS_BASE_URL = "/vworld/req/wmts/1.0.0";

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

// ─── 에러 타입 ────────────────────────────────────────────
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

// ─── 함수 ─────────────────────────────────────────────────

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
