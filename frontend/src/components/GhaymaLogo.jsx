import React from "react";
import { Link } from "react-router-dom";
import { Feather, Sparkles, Cloud, Heart } from "lucide-react";

export default function GhaymaLogo({ dark, onClick, subtitle, size = "md", showSubtitle = true }) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <Link
      to="/"
      onClick={onClick}
      className="inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0 select-none transition-transform active:scale-98"
    >
      {/* Girly Shimmering Cloud + Golden Feather Emblem */}
      <div
        className={`relative rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-[2px] shadow-md shadow-rose-500/25 group-hover:shadow-rose-500/40 group-hover:scale-105 transition-all shrink-0 ${
          isSm ? "w-8 h-8 rounded-xl" : isLg ? "w-12 h-12 rounded-3xl p-[2.5px]" : "w-10 h-10 sm:w-11 sm:h-11"
        }`}
      >
        <div
          className={`w-full h-full flex items-center justify-center relative overflow-hidden transition-colors ${
            isSm ? "rounded-[10px]" : isLg ? "rounded-[22px]" : "rounded-[14px]"
          } ${dark ? "bg-gradient-to-b from-[#1b1022] to-[#120917]" : "bg-gradient-to-b from-white to-rose-50/50"}`}
        >
          {/* Soft background glow & cloud */}
          <Cloud
            className={`text-rose-400/25 fill-rose-300/20 absolute -bottom-1 -left-1 ${
              isSm ? "w-5 h-5" : isLg ? "w-8 h-8" : "w-6 h-6"
            }`}
          />
          {/* Golden/Rose Feather */}
          <Feather
            className={`text-rose-500 -rotate-12 relative z-10 drop-shadow-sm group-hover:rotate-0 transition-transform ${
              isSm ? "w-4 h-4" : isLg ? "w-6 h-6" : "w-5 h-5"
            }`}
          />
          {/* Twinkling star */}
          <Sparkles
            className={`text-amber-400 absolute top-1 right-1 animate-pulse drop-shadow-xs ${
              isSm ? "w-2.5 h-2.5" : isLg ? "w-3.5 h-3.5" : "w-3 h-3"
            }`}
          />
        </div>
      </div>

      {/* Brand Typography — Symmetrically Aligned & Non-Wrapping */}
      <div className="flex flex-col justify-center leading-tight whitespace-nowrap">
        <div className="flex items-center gap-1.5" dir="ltr">
          <span
            className={`font-editorial font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent group-hover:brightness-110 transition-all ${
              isSm ? "text-lg" : isLg ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            ghayma_rd
          </span>
          <span
            className={`px-2 py-0.5 rounded-full font-bold shadow-xs flex items-center gap-1 border ${
              dark
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-rose-50 text-rose-600 border-rose-200"
            } ${isSm ? "text-[9px]" : "text-[10px] sm:text-[11px]"}`}
          >
            <span>غيمة</span>
            <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
          </span>
        </div>

        {showSubtitle && (
          <span
            className={`font-semibold tracking-wide truncate max-w-[170px] sm:max-w-none transition-colors ${
              isSm ? "text-[9px]" : "text-[10px] sm:text-[11px]"
            } ${dark ? "text-rose-200/75" : "text-slate-500"}`}
          >
            {subtitle || "رميساء دحمان • L'Écrivaine"}
          </span>
        )}
      </div>
    </Link>
  );
}
