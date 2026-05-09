"use client";

import { useState } from "react";

type searchBarProps = {
    ayahs: {
        number: number
        arabic: string
        translation: string
        audio: string
    }[]
}

const SearchBar = ({ ayahs }: searchBarProps) => {
    const [search, setSearch] = useState("")
    const filtered = ayahs.filter((a: any) =>
        a.translation
            .toLowerCase()
            .includes(search.toLowerCase())
    )
    return (
        <div>
            <input
                placeholder="Search Ayah"
                className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded w-full text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                onChange={(e: any) => setSearch(e.target.value)}
            />
            <div>
                {filtered.map((a: any) => (
                    <div key={a.number}>
                        {a.translation}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchBar