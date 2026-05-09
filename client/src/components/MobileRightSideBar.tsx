"use client";

import { useState } from "react";
import { useSettings } from "@/store/settings";

type Tab = "Translation" | "Reading";

const MobileRightSideBar = ({ open, onClose }: any) => {
  const { arabicSize, translationSize, setArabicFont, setArabicSize, setTranslationSize } = useSettings();
  const [tab, setTab] = useState<Tab>("Translation");
  const [readingOpen, setReadingOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(true);
  return (
    <div
      className={` laptop:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-[#171717] shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-85 h-full border-l-2 border-[#171717] bg-[#0d0d0d] text-sm text-zinc-100 px-6.5 pt-6">

          {/* Tab switcher */}
          <div className="flex bg-[#171717] rounded-full p-1">
            {(["Translation", "Reading"] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-full text-lg font-medium transition-colors cursor-pointer
              ${tab === t ? "bg-black text-white" : "text-white/50"}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Reading Settings */}
          <div className="mt-6.25">
            <button
              onClick={() => setReadingOpen(o => !o)}
              className="w-full flex items-center justify-between py-3 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Reading Settings</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-zinc-500 transition-transform ${readingOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {readingOpen && (
              <div className="px-4 pb-4 pt-1 border-t border-zinc-800 text-zinc-400 text-xs">
                Reading settings coming soon.
              </div>
            )}
          </div>

          {/* Font Settings */}
          <div className="cursor-pointer">
            <button
              onClick={() => setFontOpen(o => !o)}
              className="w-full flex items-center justify-between py-3 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-emerald-400">
                <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">T</div>
                <span className="font-medium">Font Settings</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-zinc-500 transition-transform ${fontOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {fontOpen && (
              <div>
                {/* Arabic Font Size */}
                <div className="py-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Arabic Font Size</span>
                    <span className="text-emerald-400 font-medium">{arabicSize}</span>
                  </div>
                  <input
                    type="range" min={24} max={70} defaultValue={arabicSize}
                    onChange={e => setArabicSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-full"
                  />
                </div>

                {/* Translation Font Size */}
                <div className="py-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Translation Font Size</span>
                    <span className="text-emerald-400 font-medium">{translationSize}</span>
                  </div>
                  <input
                    type="range" min={14} max={40} defaultValue={translationSize}
                    onChange={e => setTranslationSize(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1 rounded-full"
                  />
                </div>

                {/* Arabic Font Face */}
                <div className="py-3">
                  <span className="text-zinc-300 block">Arabic Font Face</span>
                  <div className="relative">
                    <select
                      onChange={e => setArabicFont(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 appearance-none pr-8 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="font-serif">Amiri</option>
                      <option value="font-sans">Scheherazade</option>
                      <option value="font-mono">KFGQ</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-zinc-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Support card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 mt-2">
            <p className="font-semibold text-zinc-100 mb-1">Help spread the knowledge of Islam</p>
            <p className="text-zinc-500 text-xs leading-relaxed mb-4">
              Your regular support helps us reach our religious brothers and sisters with the message of Islam. Join our mission and be part of the big change.
            </p>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold py-2.5 rounded-lg">
              Support Us
            </button>
          </div>

        </div>
      </aside>
    </div>
  )
}

export default MobileRightSideBar