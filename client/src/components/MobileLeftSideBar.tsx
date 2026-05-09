"use client"
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { allSurah } from "@/store/fakeApi";
import Link from "next/link";

const MobileLeftSideBar = ({ open, onClose }: any) => {
    const tabs = ["Surah", "Juz", "Page"]
    const pathname = usePathname()
    const [activeTab, setActiveTab] = useState("Surah")
    const [query, setQuery] = useState("")
    return (
        <div
            className={` laptop:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            onClick={onClose}
        >
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-[#171717] shadow-lg z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex max-w-83.25 border-r-2 border-[#171717] h-screen flex-col pt-6 space-y-4">
                    {/* Tab bar */}
                    <div className="flex gap-1 bg-[#171717] rounded-full p-1 mx-6.5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-1.5 text-[16px] font-semibold rounded-full transition-all duration-200 cursor-pointer ${activeTab === tab
                                    ? "bg-[#0d0d0d] text-white shadow"
                                    : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 mx-6.5">
                        <Search size={15} className="text-zinc-500 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search Surah"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-transparent text-sm text-zinc-300 placeholder:text-zinc-600 outline-none w-full"
                        />
                    </div>

                    {/* List */}
                    <div className="space-y-2 overflow-y-auto sideNavbar ">
                        {allSurah?.map((s: any) => {
                            const isActive = pathname === `/${s.surahId}`
                            return (
                                <Link
                                    key={s.surahId}
                                    href={`/${s.surahId}`}
                                    className={`flex items-center gap-3 p-4 mx-6.5 rounded-xl transition-all duration-150 group border border-[#171717] ${isActive
                                        ? "border-[#428038]/50 bg-[#428038]/10"
                                        : "hover:bg-[#428038]/10"
                                        }`}
                                >
                                    {/* Diamond badge */}
                                    <div
                                        className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rotate-45 rounded-md text-md font-bold transition-colors ${isActive
                                            ? "bg-[#428038] text-white"
                                            : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
                                            }`}
                                    >
                                        <span className="-rotate-45">{s.surahId}</span>
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-lg font-semibold leading-tight`}>
                                            {s.english}
                                        </p>
                                        <p className="text-sm text-zinc-500 mt-0.5 truncate">
                                            {s.translation}
                                        </p>
                                    </div>

                                    {/* Arabic */}
                                    <span className={`text-base font-arabic flex-shrink-0 ${isActive ? "text-emerald-400" : "text-zinc-400"
                                        }`}>
                                        {s.name}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </aside>
        </div>
    )
}

export default MobileLeftSideBar