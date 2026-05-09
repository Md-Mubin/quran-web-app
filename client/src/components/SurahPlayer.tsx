"use client";

import { useRef, useState } from "react";
import AyahCard from "./AyahCard";

type Props = {
    ayahs: any;
    audioFile: any;
    timingMap: any;
};

export default function SurahPlayer({ ayahs, audioFile, timingMap }: Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const surahId = ayahs[0]?.surahId;

    const [playingAyahId, setPlayingAyahId] = useState<number | null>(null);
    const [activeWordId, setActiveWordId] = useState<number | null>(null);

    // ── Find ayah + word at current ms ──────────────────────
    function getStateAtMs(ms: number): { ayahId: number; wordId: number | null } | null {
        for (const ayah of ayahs) {
            const vt = timingMap[`${surahId}:${ayah.ayahId}`];
            if (!vt || ms < vt.timestamp_from || ms >= vt.timestamp_to) continue;

            for (const [wordIdx, start, end] of vt.segments) {
                if (ms >= start && ms < end) {
                    return { ayahId: ayah.ayahId, wordId: ayah.wbws[wordIdx - 1]?.wordId ?? null };
                }
            }
            return { ayahId: ayah.ayahId, wordId: null };
        }
        return null;
    }

    // ── RAF loop ─────────────────────────────────────────────
    function tick() {
        const audio = audioRef.current;
        if (!audio) return;

        const state = getStateAtMs(audio.currentTime * 1000);
        if (state) {
            setPlayingAyahId(state.ayahId);
            setActiveWordId(state.wordId);
        }

        rafRef.current = requestAnimationFrame(tick);
    }

    // ── Stop ─────────────────────────────────────────────────
    function stop() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
        setPlayingAyahId(null);
        setActiveWordId(null);
    }

    // ── Play from a specific ayah ─────────────────────────────
    function playFromAyah(ayahId: number) {
        stop();
        const vt = timingMap[`${surahId}:${ayahId}`];
        if (!vt) return;

        const audio = new Audio(audioFile.audio_url);
        audioRef.current = audio;

        const startSec = vt.timestamp_from / 1000;

        const startPlay = () => {
            audio.play()
                .then(() => { rafRef.current = requestAnimationFrame(tick); })
                .catch(stop);
        };

        if (startSec === 0) {
            // currentTime is already 0 — seeked won't fire, play directly
            startPlay();
        } else {
            audio.currentTime = startSec;
            audio.addEventListener("seeked", startPlay, { once: true });
        }

        audio.onended = stop;
        audio.addEventListener("error", stop, { once: true });
    }

    // ── Play single word ──────────────────────────────────────
    function playWord(ayah: any, wbw: any) {
        stop();
        const vt = timingMap[`${surahId}:${ayah.ayahId}`];
        const seg = vt?.segments.find(([idx]: any) => idx === wbw.wordId);
        if (!seg) return;

        const audio = new Audio(audioFile.audio_url);
        audioRef.current = audio;
        audio.currentTime = seg[1] / 1000;

        audio.addEventListener("seeked", () => {
            audio.play().catch(stop);
            setPlayingAyahId(ayah.ayahId);
            setActiveWordId(wbw.wordId);

            setTimeout(() => {
                audio.pause();
                audioRef.current = null;
                setPlayingAyahId(null);
                setActiveWordId(null);
            }, seg[2] - seg[1]);
        }, { once: true });
    }

    return (
        <>
            {ayahs?.map((ayah: any) => (
                <AyahCard
                    key={ayah.ayahId}
                    ayah={ayah}
                    isPlaying={playingAyahId === ayah.ayahId}
                    activeWordId={playingAyahId === ayah.ayahId ? activeWordId : null}
                    onPlayToggle={() =>
                        playingAyahId === ayah.ayahId ? stop() : playFromAyah(ayah.ayahId)
                    }
                    onPlayWord={(wbw: any) => playWord(ayah, wbw)}
                />
            ))}
        </>
    );
}