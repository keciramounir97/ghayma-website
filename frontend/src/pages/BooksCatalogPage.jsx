import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import BookShowcaseCard from "../components/BookShowcaseCard.jsx";

export default function BooksCatalogPage() {
  const { t, dark, books } = useAppContext();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books.filter(
      (b) =>
        (b.title || "").toLowerCase().includes(q) ||
        (b.titleFr || "").toLowerCase().includes(q) ||
        (b.titleEn || "").toLowerCase().includes(q) ||
        (b.description || "").toLowerCase().includes(q)
    );
  }, [books, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3 sm:space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3.5 py-1.5 rounded-full">
          {t.booksSection.tag}
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold">
          {t.booksSection.title}
        </h1>
        <p className={`text-xs sm:text-base ${dark ? "text-rose-200/75" : "text-slate-600"}`}>
          {t.booksSection.subtitle}
        </p>

        <div className="relative max-w-md mx-auto pt-2">
          <Search className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.booksSection.searchPlaceholder}
            className={`w-full ps-11 pe-4 py-3 rounded-full border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              dark
                ? "bg-[#1d1224] border-rose-900/60 text-white placeholder:text-rose-300/40"
                : "bg-white border-rose-200 text-slate-800 placeholder:text-slate-400 shadow-sm"
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {filtered.map((book) => (
          <BookShowcaseCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

