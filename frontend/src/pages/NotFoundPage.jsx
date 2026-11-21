import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Home, BookOpen, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function NotFoundPage() {
  const { lang } = useAppContext();
  const isAr = lang === "ar";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <div className="relative inline-block">
          <span className="font-editorial text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400">
            404
          </span>
          <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">
            🌸
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50">
            {isAr ? "الصفحة غير موجودة بين السطور ♡" : "Cette page s'est envolée parmi les nuages ♡"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed">
            {isAr
              ? "يبدو أن الرابط الذي تبحثين عنه قد تغيّر أو لم يعد متاحاً. دعينا نعود معاً إلى صفحة البداية الهادئة."
              : "L'adresse demandée n'existe pas ou a été déplacée. Retrouvez le chemin de la sérénité en revenant à l'accueil."}
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? "العودة للرئيسية" : "Retour à l'Accueil"}</span>
          </Link>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-rose-500/30 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 text-xs sm:text-sm font-bold transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isAr ? "تصفح الكتب" : "Découvrir les Livres"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
