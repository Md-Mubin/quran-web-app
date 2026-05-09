"use client";
import { create } from "zustand"
import { persist } from "zustand/middleware"
type State = {
    arabicFont: string
    arabicSize: number
    translationSize: number
    setArabicFont: (v: string) => void
    setArabicSize: (v: number) => void
    setTranslationSize: (v: number) => void
}
export const useSettings = create<State>()(
    persist(
        (set) => ({
            arabicFont: "font-serif",
            arabicSize: 30,
            translationSize: 18,
            setArabicFont: (v) =>
                set({ arabicFont: v }),
            setArabicSize: (v) =>
                set({ arabicSize: v }),
            setTranslationSize: (v) =>
                set({ translationSize: v }),
        }),
        {
            name: "quran-settings",
        }
    )
)