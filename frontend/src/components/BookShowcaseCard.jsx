import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import { Star, ShoppingBag } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function BookShowcaseCard({ book }) {
  const { lang, t, dark, formatDzd } = useAppContext();

  const title =
    lang === "ar"
      ? book.title
      : lang === "fr"
      ? book.titleFr || book.title
      : book.titleEn || book.title;
  const subtitle =
    lang === "ar"
      ? book.subtitle
      : lang === "fr"
      ? book.subtitleFr || book.subtitle
      : book.subtitleEn || book.subtitle;
  const desc =
    lang === "ar"
      ? book.description
      : lang === "fr"
      ? book.descriptionFr || book.description
      : book.descriptionEn || book.description;

  return (
    <Card
      elevation={dark ? 6 : 2}
      sx={{
        borderRadius: "28px",
        bgcolor: dark ? "#1a1121" : "#ffffff",
        border: dark
          ? "1px solid rgba(136,19,55,0.45)"
          : "1px solid rgba(254,205,211,0.8)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: dark
            ? "0 20px 38px rgba(244,63,94,0.15)"
            : "0 20px 38px rgba(244,63,94,0.12)"
        }
      }}
      className="p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-7"
    >
      <Link
        to={`/book/${book.id}`}
        className="w-40 sm:w-44 md:w-48 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-lg group relative"
      >
        <img
          src={book.coverImage || "/images/book-front.jpg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {book.badge && (
          <div className="absolute top-2.5 left-2.5">
            <Chip
              label={book.badge}
              size="small"
              color="primary"
              sx={{ fontWeight: 800, fontSize: "0.68rem" }}
            />
          </div>
        )}
      </Link>

      <div className="flex-1 space-y-2.5 sm:space-y-3 text-center sm:text-start w-full">
        <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
          {[...Array(5)].map((_, idx) => (
            <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
          <span className="text-xs font-bold text-rose-500 ms-1">
            ({book.rating || "4.9"})
          </span>
        </div>

        <Link to={`/book/${book.id}`} className="block group">
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold group-hover:text-rose-500 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm font-medium text-rose-500">{subtitle}</p>

        <div className="flex items-baseline justify-center sm:justify-start gap-3 pt-1">
          <span className="text-xl sm:text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {formatDzd(book.price)}
          </span>
          {book.oldPrice > book.price && (
            <span className="text-xs sm:text-sm line-through opacity-50">
              {formatDzd(book.oldPrice)}
            </span>
          )}
        </div>

        <p
          className={`text-xs sm:text-sm line-clamp-3 leading-relaxed ${
            dark ? "text-rose-100/75" : "text-slate-600"
          }`}
        >
          {desc}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <Link
            to={`/book/${book.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.booksSection.viewDetails}</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}

