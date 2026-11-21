import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-5 max-w-md mx-auto">
        <span className="font-editorial text-7xl sm:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
          404
        </span>
        <h1 className="font-editorial text-2xl font-bold text-slate-900 dark:text-rose-50">
          Page Introuvable dans l'Admin
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80">
          L'URL demandée n'existe pas dans le panneau d'administration de Ghayma RD.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md hover:from-rose-600 hover:to-pink-600 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tableau de bord</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
