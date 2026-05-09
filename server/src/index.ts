import http, { IncomingMessage, ServerResponse } from "http";

const PORT    = process.env.PORT ?? 8000;
const API_URL = "https://quranmazid.com/api/v1/graphql";
const AUDIO_API = "https://api.qurancdn.com/api/qdc/audio/reciters/7/audio_files";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type ScriptType      = "uthmani" | "indopak" | "simple";
type WbwLanguageEnum = "en" | "bn" | "ur" | "hi" | "id" | "tr";

interface SurahParams {
  surahId:       number;
  languageId?:   WbwLanguageEnum;
  translations?: string[];
  cursor?:       number;
  limit?:        number;
  script?:       ScriptType;
}

interface Wbw {
  audio:       string;
  translation: string;
  wordId:      string;
  arabic_text: string;
  uthmani:     string;
}

interface Translation {
  id:          string;
  name:        string;
  translation: string;
  languageId:  string;
}

interface Ayah {
  ayahId:       number;
  surahId:      number;
  page:         number;
  wbws:         Wbw[];
  translations: Translation[];
}

interface Surah {
  surahId: number;
  ayahs:   Ayah[];
}

interface SurahApiResponse {
  data?:   { surah: Surah };
  errors?: { message: string }[];
}

interface SuccessResponse {
  success: true;
  data:    Surah;
}

interface ErrorResponse {
  success?: false;
  error:    string;
}

type RouteResponse = SuccessResponse | ErrorResponse;

const SURAH_QUERY = `
  query Surah(
    $surahId: Int!
    $languageId: WbwLanguageEnum!
    $translations: [ID]!
    $limit: Int
    $cursor: Int
    $script: ScriptType
  ) {
    surah(surahId: $surahId, limit: $limit, cursor: $cursor) {
      surahId
      ayahs {
        ayahId
        surahId
        page
        wbws(languageId: $languageId, script: $script) {
          audio
          translation
          wordId
          arabic_text
          uthmani
        }
        translations(translations: $translations) {
          id
          name
          translation
          languageId
        }
      }
    }
  }
`;

// ──────────────────────────────────────────────
// Controllers
// ──────────────────────────────────────────────
async function fetchAudio(chapterId: number) {
  if (!chapterId) throw new Error("chapterId is required");

  const res = await fetch(
    `${AUDIO_API}?chapter=${chapterId}&segments=true`,
    { headers: { "Content-Type": "application/json" } }
  );

  if (!res.ok) throw new Error(`Upstream error: ${res.status} ${res.statusText}`);

  const json = await res.json();
  const file = json?.audio_files?.[0];
  if (!file) throw new Error("No audio file returned");

  return file;
}

async function fetchSurah({
  surahId,
  languageId   = "en",
  translations = ["23"],
  cursor       = 0,
  limit,
  script       = "uthmani",
}: SurahParams): Promise<Surah> {
  if (!surahId) throw new Error("surahId is required");

  const variables: Omit<SurahParams, "limit"> & { limit?: number } = {
    surahId,
    languageId,
    translations,
    cursor,
    script,
    ...(limit !== undefined && { limit }),
  };

  const res = await fetch(API_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ query: SURAH_QUERY, variables, operationName: "Surah" }),
  });

  if (!res.ok) throw new Error(`Upstream error: ${res.status} ${res.statusText}`);

  const json: SurahApiResponse = await res.json();
  if (json.errors?.length) throw new Error(`GraphQL: ${json.errors.map(e => e.message).join(", ")}`);
  if (!json.data) throw new Error("No data returned from API");

  return json.data.surah;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
function readBody(req: IncomingMessage): Promise<Partial<SurahParams>> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk: Buffer) => (raw += chunk));
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error("Invalid JSON body")); }
    });
    req.on("error", reject);
  });
}

function send(res: ServerResponse, statusCode: number, payload: RouteResponse | ErrorResponse): void {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type":                 "application/json",
    "Content-Length":               Buffer.byteLength(body),
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(body);
}

// ──────────────────────────────────────────────
// Server
// ──────────────────────────────────────────────
const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const method = req.method?.toUpperCase();

  if (method === "OPTIONS") return send(res, 204, { error: "" });

  if (method === "POST" && pathname === "/audio") {
    let body: { chapterId?: number };
    try { body = await readBody(req) as { chapterId?: number }; }
    catch (err) { return send(res, 400, { error: (err as Error).message }); }

    if (!body.chapterId) return send(res, 400, { error: "chapterId is required" });

    try {
      const data = await fetchAudio(body.chapterId);
      return send(res, 200, { success: true, data });
    } catch (err) {
      return send(res, 500, { success: false, error: (err as Error).message });
    }
  }

  if (method === "POST" && pathname === "/surah") {
    let body: Partial<SurahParams>;
    try { body = await readBody(req); }
    catch (err) { return send(res, 400, { error: (err as Error).message }); }

    if (!body.surahId) return send(res, 400, { error: "surahId is required" });

    try {
      const data = await fetchSurah(body as SurahParams);
      return send(res, 200, { success: true, data });
    } catch (err) {
      return send(res, 500, { success: false, error: (err as Error).message });
    }
  }

  return send(res, 404, { error: `Route not found: ${method} ${pathname}` });
});

server.listen(PORT, () => {
  console.log(`✅  Server running → http://localhost:${PORT}`);
  console.log(`   POST /surah  { surahId, languageId, translations, cursor, limit, script }`);
});