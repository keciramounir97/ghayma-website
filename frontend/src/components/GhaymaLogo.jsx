import React from "react";
import { Link } from "react-router-dom";
import { Feather, Sparkles, Cloud } from "lucide-react";

export default function GhaymaLogo({ dark, onClick, subtitle }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0 select-none"
    >
      {/* Girly Cloud + Feather Emblem */}
      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 p-[2px] shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform shrink-0">
        <div
          className={`w-full h-full rounded-[14px] flex items-center justify-center relative overflow-hidden ${
            dark ? "bg-[#1b1122]" : "bg-white"
          }`}
        >
          <Cloud className="w-6 h-6 text-rose-400/30 fill-rose-300/25 absolute -bottom-0.5" />
          <Feather className="w-5 h-5 text-rose-500 -rotate-12 relative z-10" />
          <Sparkles className="w-3 h-3 text-amber-400 absolute top-1.5 right-1.5 animate-pulse" />
        </div>
      </div>

      {/* Brand Typography — Never wraps or clips on mobile */}
      <div className="flex flex-col justify-center leading-tight whitespace-nowrap">
        <div className="flex items-center gap-1.5" dir="ltr">
          <span className="font-editorial text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            ghayma_rd
          </span>
          <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-rose-500/12 text-rose-500 font-bold border border-rose-500/25">
            غيمة
          </span>
        </div>
        <span
          className={`text-[10px] sm:text-[11px] font-semibold tracking-wide truncate max-w-[165px] sm:max-w-none ${
            dark ? "text-rose-200/75" : "text-slate-500"
          }`}
        >
          {subtitle || "رميساء دحمان • L'Écrivaine"}
        </span>
      </div>
    </Link>
  );
}
