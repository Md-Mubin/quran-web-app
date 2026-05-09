export type ScriptType      = "uthmani" | "indopak" | "simple";
export type WbwLanguageEnum = "en" | "bn" | "ur" | "hi" | "id" | "tr";

export interface SurahParams {
  surahId:      number;
  languageId?:  WbwLanguageEnum;
  translations?: string[];
  cursor?:      number;
  limit?:       number;
  script?:      ScriptType;
}

export interface Wbw {
  audio:       string;
  translation: string;
  wordId:      string;
  arabic_text: string;
  uthmani:     string;
}

export interface Translation {
  id:          string;
  name:        string;
  translation: string;
  languageId:  string;
}

export interface Ayah {
  ayahId:       number;
  surahId:      number;
  page:         number;
  wbws:         Wbw[];
  translations: Translation[];
}

export interface Surah {
  surahId: number;
  ayahs:   Ayah[];
}

// ── Audio ──────────────────────────────────────
export interface VerseTiming {
  verse_key:       string;             // "1:1"
  timestamp_from:  number;             // ms
  timestamp_to:    number;             // ms
  duration:        number;             // ms
  segments:        [number, number, number][]; // [wordIndex(1-based), startMs, endMs]
}

export interface AudioFile {
  audio_url:     string;
  duration:      number;
  verse_timings: VerseTiming[];
}

export interface AudioFilesResponse {
  audioFiles: { audio_files: AudioFile[] };
}