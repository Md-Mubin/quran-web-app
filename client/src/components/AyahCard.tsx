"use client";
import { useSettings } from "@/store/settings";

type AyahCardProps = {
  ayah: any;
  isPlaying: boolean;
  activeWordId: any | null;
  onPlayToggle: () => void;
  onPlayWord: any;
};

const AyahCard = ({ ayah, isPlaying, activeWordId, onPlayToggle, onPlayWord }: AyahCardProps) => {
  const { arabicSize, translationSize, arabicFont } = useSettings();

  const translation = ayah.translations[0]?.translation ?? "";
  const translatorName = ayah.translations[0]?.name?.toUpperCase() ?? "";

  return (
    <div className="flex items-end gap-7 border-b-2 border-[#171717] py-6 p-9 w-full max-w-full">

      {/* Left — reference + actions */}
      <div className="flex flex-col items-center gap-2 ">
        <span className="text-sm font-semibold text-emerald-500">
          {ayah.surahId}:{ayah.ayahId}
        </span>

        <button onClick={onPlayToggle} title={isPlaying ? "Pause" : "Play"}
          className="p-2 hover:bg-[#171717] rounded-full cursor-pointer duration-200">
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="18" viewBox="0 0 12 14" fill="none" className=""><path d="M2.04297 1.71094L2.04297 12.3776M10.042 1.71094L10.042 12.3776" stroke="currentColor" stroke-width="2.66667" stroke-linecap="round"></path></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className=""><path d="M3 9.00004V6.33004C3 3.01504 5.3475 1.65754 8.22 3.31504L10.5375 4.65004L12.855 5.98504C15.7275 7.64254 15.7275 10.3575 12.855 12.015L10.5375 13.35L8.22 14.685C5.3475 16.3425 3 14.985 3 11.67V9.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          )}
        </button>

        <button title="Word by word" className="p-2 hover:bg-[#171717] rounded-full cursor-pointer duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </button>

        <button title="Bookmark" className="p-2 hover:bg-[#171717] rounded-full cursor-pointer duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        <button title="More" className="p-2 hover:bg-[#171717] rounded-full cursor-pointer duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Right — arabic + translation */}
      <div className="flex flex-col w-full max-w-full">
        <p className={`text-right mb-6 ${arabicFont} flex flex-wrap`}
          style={{ fontSize: arabicSize }} dir="rtl">
          {ayah.wbws.map((wbw: any) => (
            <span key={wbw.wordId} onClick={() => onPlayWord(wbw)} title={wbw.translation}
              className={`cursor-pointer transition-colors duration-100
                ${activeWordId === wbw.wordId ? "text-emerald-400" : "text-white hover:text-emerald-300"}`}>
              {wbw.uthmani}
            </span>
          ))}
        </p>

        {translatorName && (
          <p className="text-xs tracking-widest text-zinc-500 mb-1 uppercase">{translatorName}</p>
        )}
        <p className="text-zinc-300 leading-relaxed" style={{ fontSize: translationSize }}>
          {translation}
        </p>
      </div>
    </div>
  );
};

export default AyahCard;