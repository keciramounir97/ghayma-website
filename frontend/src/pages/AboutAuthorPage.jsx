import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import { Feather, Instagram, ExternalLink, BookOpen } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function AboutAuthorPage() {
  const { lang, t, dark, about, books } = useAppContext();

  const authorName =
    lang === "ar"
      ? about.authorNameAr
      : lang === "fr"
      ? about.authorNameFr
      : about.authorNameEn;
  const badge =
    lang === "ar"
      ? about.badgeAr
      : lang === "fr"
      ? about.badgeFr
      : about.badgeEn;
  const headline =
    lang === "ar"
      ? about.headlineAr
      : lang === "fr"
      ? about.headlineFr
      : about.headlineEn;
  const bio =
    lang === "ar" ? about.bioAr : lang === "fr" ? about.bioFr : about.bioEn;
  const quote =
    lang === "ar"
      ? about.quoteAr
      : lang === "fr"
      ? about.quoteFr
      : about.quoteEn;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs sm:text-sm font-bold">
          <Feather className="w-4 h-4" />
          <span>{badge}</span>
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold">
          {authorName}{" "}
          <span className="text-rose-500 text-2xl sm:text-4xl">
            ({about.instagramHandle || "@ghayma_rd"})
          </span>
        </h1>
        <p className="text-sm sm:text-xl font-medium text-amber-600 dark:text-amber-400">
          {headline}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        <div className="lg:col-span-5 space-y-4">
          <Card
            elevation={dark ? 6 : 3}
            sx={{ borderRadius: "28px", overflow: "hidden" }}
            className="border-4 border-rose-200 dark:border-rose-950 aspect-[4/4.4]"
          >
            <img
              src={about.authorImage || "/images/book-spread.jpg"}
              alt={authorName}
              className="w-full h-full object-cover"
            />
          </Card>
          {about.secondaryImage && (
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-rose-200/60 dark:border-rose-950 h-44 sm:h-48">
              <img
                src={about.secondaryImage}
                alt="Book on shelf"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-6">
          <Card
            elevation={dark ? 6 : 2}
            sx={{
              borderRadius: "28px",
              bgcolor: dark ? "#1a1121" : "#ffffff"
            }}
            className="p-5 sm:p-8 border border-rose-500/20 space-y-5"
          >
            <p
              className={`text-xs sm:text-base leading-loose whitespace-pre-line ${
                dark ? "text-rose-100/90" : "text-slate-700"
              }`}
            >
              {bio}
            </p>

            <blockquote
              className={`p-4 sm:p-5 rounded-2xl border-s-4 border-rose-500 font-editorial text-base sm:text-xl italic ${
                dark ? "bg-[#24162d] text-rose-200" : "bg-rose-50/80 text-rose-950"
              }`}
            >
              {quote}
            </blockquote>

            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={about.instagramUrl || "https://www.instagram.com/ghayma_rd/"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>
                  {t.authorSection.followInsta}{" "}
                  {about.instagramHandle || "@ghayma_rd"}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                to={`/book/${books[0]?.id || "hayati-baada-arrida"}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white text-xs sm:text-sm font-bold transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t.hero.buyBtn}</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

