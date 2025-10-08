import { normName } from "../utils/normalize";

type WikiSummary = {
  type?: string;                 // "standard" | "disambiguation" | ...
  title?: string;
  thumbnail?: { source: string; width: number; height: number };
  originalimage?: { source: string; width: number; height: number };
  content_urls?: any;
};

// Cache key helper
function cacheKey(name: string) {
  return `wikiImg:${normName(name)}`;
}

// Try page summary first; if it's a disambiguation or missing thumbnail, fallback to search
export async function getWikiImageFor(fullName: string): Promise<string | null> {
  const key = cacheKey(fullName);
  const cached = localStorage.getItem(key);
  if (cached !== null) return cached || null;

  // 1) Try direct summary
  const title = encodeURIComponent(fullName.replace(/\s+/g, "_")); // Marc-André_ter_Stegen
  const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

  try {
    const sumRes = await fetch(sumUrl, { headers: { accept: "application/json" } });
    if (sumRes.ok) {
      const sum: WikiSummary = await sumRes.json();
      const direct =
        sum.originalimage?.source ||
        sum.thumbnail?.source ||
        null;

      // If not a disambiguation and we have an image -> use it
      if (direct && sum.type !== "disambiguation") {
        localStorage.setItem(key, direct);
        return direct;
      }
    }
  } catch { /* ignore and try fallback */ }

  // 2) Fallback: search for best matching page, then hit summary for that title
  try {
    const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
    searchUrl.searchParams.set("action", "query");
    searchUrl.searchParams.set("list", "search");
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("origin", "*"); // CORS
    // Bias towards footballers by appending term
    searchUrl.searchParams.set("srsearch", `${fullName} footballer`);

    const sRes = await fetch(searchUrl.toString(), { headers: { accept: "application/json" } });
    if (sRes.ok) {
      const sJson = await sRes.json();
      const best = sJson?.query?.search?.[0]?.title as string | undefined;
      if (best) {
        const bestUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best)}`;
        const bRes = await fetch(bestUrl, { headers: { accept: "application/json" } });
        if (bRes.ok) {
          const b: WikiSummary = await bRes.json();
          const img =
            b.originalimage?.source ||
            b.thumbnail?.source ||
            null;
          localStorage.setItem(key, img || "");
          return img;
        }
      }
    }
  } catch { /* give up */ }

  localStorage.setItem(key, "");
  return null;
}
