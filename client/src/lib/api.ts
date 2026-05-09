import { Surah, SurahParams } from "./types";
import { AudioFile } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// ──────────────────────────────────────────────
// Core
// ──────────────────────────────────────────────
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function post<T>(endpoint: string, body: unknown): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ──────────────────────────────────────────────
// Quran
// ──────────────────────────────────────────────
export function fetchAudio(chapterId: number): Promise<{ success: boolean; data: AudioFile }> {
  return post("/audio", { chapterId });
}

export function fetchSurah(params: SurahParams): Promise<{ success: boolean; data: Surah }> {
  return post("/surah", params);
}