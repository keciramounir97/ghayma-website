import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function BreadcrumbsBar() {
  const { lang, t, dark, books } = useAppContext();
  const location = useLocation();
  const path = location.pathname;

  if (path === "/") return null;

  const isRtl = lang === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const segments = [];
  if (path.startsWith("/books")) {
    segments.push({ label: t.breadcrumbs.books, to: "/books" });
  } else if (path.startsWith("/book/")) {
    const id = path.split("/book/")[1];
    const found = books.find((b) => b.id === id);
    const bookTitle = found
      ? lang === "ar"
        ? found.title
        : lang === "fr"
        ? found.titleFr || found.title
        : found.titleEn || found.title
      : id;
    segments.push({ label: t.breadcrumbs.books, to: "/books" });
    segments.push({ label: bookTitle, to: path });
  } else if (path.startsWith("/about")) {
    segments.push({ label: t.breadcrumbs.about, to: "/about" });
  } else if (path.startsWith("/challenges")) {
    segments.push({ label: t.breadcrumbs.challenges || "Défis Ghayma", to: "/challenges" });
  } else if (path.startsWith("/contact")) {
    segments.push({ label: t.breadcrumbs.contact, to: "/contact" });
  }

  return (
    <div
      aria-label="Breadcrumb"
      className={`border-b transition-colors ${
        dark
          ? "bg-[#1a1120]/80 border-rose-950/60 text-rose-200/80"
          : "bg-rose-50/70 border-rose-100 text-slate-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center gap-2 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-medium hover:text-rose-500 transition-colors"
        >
          <HomeIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>{t.breadcrumbs.home}</span>
        </Link>
        {segments.map((seg, idx) => (
          <React.Fragment key={seg.to}>
            <ChevronIcon className="w-3.5 h-3.5 opacity-50 shrink-0" />
            {idx === segments.length - 1 ? (
              <span className="font-semibold text-rose-500 truncate max-w-[200px] sm:max-w-md">
                {seg.label}
              </span>
            ) : (
              <Link
                to={seg.to}
                className="hover:text-rose-500 transition-colors font-medium"
              >
                {seg.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

