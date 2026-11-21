import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  Sparkles,
  ShoppingBag,
  Feather,
  Truck,
  Award,
  ShieldCheck,
  Star,
  Heart,
  Instagram,
  Quote
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { INITIAL_BOOKS } from "../data/initialData.js";
import BookShowcaseCard from "../components/BookShowcaseCard.jsx";

export default function HomePage() {
  const { lang, t, dark, books, about, homeContent, formatDzd } =
    useAppContext();
  const mainBook = books[0] || INITIAL_BOOKS[0];

  const bookTitle =
    lang === "ar"
      ? mainBook.title
      : lang === "fr"
      ? mainBook.titleFr || mainBook.title
      : mainBook.titleEn || mainBook.title;

  const heroBadge =
    lang === "ar"
      ? homeContent.heroBadgeAr
      : lang === "fr"
      ? homeContent.heroBadgeFr
      : homeContent.heroBadgeEn;
  const heroTitle =
    lang === "ar"
      ? homeContent.heroTitleAr
      : lang === "fr"
      ? homeContent.heroTitleFr
      : homeContent.heroTitleEn;
  const heroSubtitle =
    lang === "ar"
      ? homeContent.heroSubtitleAr
      : lang === "fr"
      ? homeContent.heroSubtitleFr
      : homeContent.heroSubtitleEn;
  const heroBuyBtn =
    lang === "ar"
      ? homeContent.heroBuyBtnAr
      : lang === "fr"
      ? homeContent.heroBuyBtnFr
      : homeContent.heroBuyBtnEn;
  const heroAboutBtn =
    lang === "ar"
      ? homeContent.heroAboutBtnAr
      : lang === "fr"
      ? homeContent.heroAboutBtnFr
      : homeContent.heroAboutBtnEn;

  const trust1 =
    lang === "ar"
      ? homeContent.trust1Ar
      : lang === "fr"
      ? homeContent.trust1Fr
      : homeContent.trust1En;
  const trust2 =
    lang === "ar"
      ? homeContent.trust2Ar
      : lang === "fr"
      ? homeContent.trust2Fr
      : homeContent.trust2En;
  const trust3 =
    lang === "ar"
      ? homeContent.trust3Ar
      : lang === "fr"
      ? homeContent.trust3Fr
      : homeContent.trust3En;

  const booksTag =
    lang === "ar"
      ? homeContent.booksTagAr
      : lang === "fr"
      ? homeContent.booksTagFr
      : homeContent.booksTagEn;
  const booksTitle =
    lang === "ar"
      ? homeContent.booksTitleAr
      : lang === "fr"
      ? homeContent.booksTitleFr
      : homeContent.booksTitleEn;
  const booksSubtitle =
    lang === "ar"
      ? homeContent.booksSubtitleAr
      : lang === "fr"
      ? homeContent.booksSubtitleFr
      : homeContent.booksSubtitleEn;

  const quoteTitle =
    lang === "ar"
      ? homeContent.quoteBannerTitleAr
      : lang === "fr"
      ? homeContent.quoteBannerTitleFr
      : homeContent.quoteBannerTitleEn;
  const quoteText =
    lang === "ar"
      ? homeContent.quoteBannerTextAr
      : lang === "fr"
      ? homeContent.quoteBannerTextFr
      : homeContent.quoteBannerTextEn;

  const testTag =
    lang === "ar"
      ? homeContent.testimonialsTagAr
      : lang === "fr"
      ? homeContent.testimonialsTagFr
      : homeContent.testimonialsTagEn;
  const testTitle =
    lang === "ar"
      ? homeContent.testimonialsTitleAr
      : lang === "fr"
      ? homeContent.testimonialsTitleFr
      : homeContent.testimonialsTitleEn;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* SECTION 1: HERO SECTION */}
      <section
        className={`relative overflow-hidden py-10 sm:py-16 lg:py-24 border-b ${
          dark
            ? "bg-gradient-to-br from-[#190f21] via-[#130c18] to-[#231229] border-rose-950/50"
            : "bg-gradient-to-br from-rose-50/90 via-[#fff7fa] to-amber-50/50 border-rose-100"
        }`}
      >
        <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-rose-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs sm:text-sm font-bold">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{heroBadge || t.hero.badge}</span>
              </div>

              <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.14] tracking-tight">
                {heroTitle || t.hero.title}
              </h1>

              <p
                className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
                  dark ? "text-rose-100/80" : "text-slate-600"
                }`}
              >
                {heroSubtitle || t.hero.subtitle}
              </p>

              <div
                className={`inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 p-3 sm:px-5 rounded-2xl border ${
                  dark
                    ? "bg-[#22142b]/80 border-rose-900/50"
                    : "bg-white/90 border-rose-200/70 shadow-sm"
                }`}
              >
                <span className="font-bold text-rose-500 text-xs sm:text-base">
                  « {bookTitle} »
                </span>
                <span className="opacity-40">|</span>
                <span className="font-extrabold text-sm sm:text-lg">
                  {formatDzd(mainBook.price)}
                </span>
                {mainBook.oldPrice > mainBook.price && (
                  <span className="text-xs line-through opacity-50">
                    {formatDzd(mainBook.oldPrice)}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                <Link
                  to={`/book/${mainBook.id}`}
                  className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{heroBuyBtn || t.hero.buyBtn}</span>
                </Link>

                <Link
                  to="/about"
                  className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base border transition-all ${
                    dark
                      ? "bg-[#24162d] border-rose-800/60 text-rose-100 hover:bg-rose-950"
                      : "bg-white border-rose-200 text-slate-700 hover:border-rose-400 hover:text-rose-600 shadow-sm"
                  }`}
                >
                  <Feather className="w-4 h-4 text-rose-500" />
                  <span>{heroAboutBtn || t.hero.aboutBtn}</span>
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-xl mx-auto lg:mx-0 text-xs font-semibold">
                <div
                  className={`flex items-center justify-center lg:justify-start gap-2 p-2.5 rounded-xl ${
                    dark
                      ? "bg-rose-950/30 text-rose-200"
                      : "bg-rose-100/60 text-rose-900"
                  }`}
                >
                  <Truck className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{trust1 || "69 Wilayas"}</span>
                </div>
                <div
                  className={`flex items-center justify-center lg:justify-start gap-2 p-2.5 rounded-xl ${
                    dark
                      ? "bg-rose-950/30 text-rose-200"
                      : "bg-rose-100/60 text-rose-900"
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{trust2 || t.hero.signedEdition}</span>
                </div>
                <div
                  className={`flex items-center justify-center lg:justify-start gap-2 p-2.5 rounded-xl ${
                    dark
                      ? "bg-rose-950/30 text-rose-200"
                      : "bg-rose-100/60 text-rose-900"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{trust3 || t.hero.paymentOnDelivery}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-xs sm:max-w-md flex items-center justify-center py-4 sm:py-6">
                <div className="relative w-40 sm:w-56 md:w-60 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl translate-x-10 sm:translate-x-16 scale-90 opacity-85 transition-transform duration-500 hover:scale-95 border-2 border-white/40">
                  <img
                    src={
                      homeContent.heroBackImage ||
                      mainBook.backImage ||
                      "/images/book-back.jpg"
                    }
                    alt={`${bookTitle} - Back Cover`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <Link
                  to={`/book/${mainBook.id}`}
                  className="relative z-20 -translate-x-6 sm:-translate-x-10 w-48 sm:w-64 md:w-72 aspect-[2/3] rounded-2xl overflow-hidden book-3d-shadow animate-float border-4 border-white dark:border-rose-950 group"
                >
                  <img
                    src={
                      homeContent.heroFrontImage ||
                      mainBook.coverImage ||
                      "/images/book-front.jpg"
                    }
                    alt={bookTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Chip
                      label={mainBook.badge || "Best Seller ✨"}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 800 }}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: MEET THE AUTHOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <Card
              elevation={dark ? 8 : 4}
              sx={{
                borderRadius: "28px",
                overflow: "hidden",
                border: dark
                  ? "3px solid rgba(136,19,55,0.6)"
                  : "3px solid rgba(254,205,211,0.8)"
              }}
              className="relative aspect-[4/4.2]"
            >
              <img
                src={about.authorImage || "/images/book-spread.jpg"}
                alt={about.authorNameFr}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#1e1224]/95 text-rose-600 dark:text-rose-300 px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {lang === "ar"
                    ? about.badgeAr
                    : lang === "fr"
                    ? about.badgeFr
                    : about.badgeEn}
                </span>
              </div>
            </Card>

            <div
              className={`sm:absolute -bottom-5 ${
                lang === "ar" ? "left-4 sm:left-6" : "right-4 sm:right-6"
              } mt-4 sm:mt-0 p-4 sm:px-6 rounded-2xl shadow-xl border flex items-center justify-center sm:justify-start gap-4 ${
                dark
                  ? "bg-[#22152b] border-rose-800/60 text-white"
                  : "bg-white border-rose-100 text-slate-800"
              }`}
            >
              <div className="flex -space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                  س
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                  م
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">
                  ن
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold mt-0.5">
                  {t.authorSection.avgRating}: {about.statsRating || "4.9/5"}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-start">
            <span className="text-rose-500 font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2">
              <Heart className="w-4 h-4 fill-rose-500" />
              {t.authorSection.tag}
            </span>

            <div className="space-y-2">
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold">
                {lang === "ar"
                  ? about.authorNameAr
                  : lang === "fr"
                  ? about.authorNameFr
                  : about.authorNameEn}{" "}
                <span className="text-rose-500 text-xl sm:text-3xl font-normal">
                  ({about.instagramHandle || "@ghayma_rd"})
                </span>
              </h2>
              <p className="text-xs sm:text-base font-semibold text-amber-600 dark:text-amber-400">
                {lang === "ar"
                  ? about.headlineAr
                  : lang === "fr"
                  ? about.headlineFr
                  : about.headlineEn}
              </p>
            </div>

            <p
              className={`text-xs sm:text-base leading-relaxed whitespace-pre-line ${
                dark ? "text-rose-100/80" : "text-slate-600"
              }`}
            >
              {(lang === "ar"
                ? about.bioAr
                : lang === "fr"
                ? about.bioFr
                : about.bioEn) || about.bioAr}
            </p>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 max-w-lg mx-auto lg:mx-0">
              <div
                className={`p-3 sm:p-4 rounded-2xl border text-center ${
                  dark
                    ? "bg-[#1d1224] border-rose-900/50"
                    : "bg-rose-50/70 border-rose-100"
                }`}
              >
                <div className="text-xl sm:text-3xl font-extrabold text-rose-500">
                  {books.length > 1
                    ? `${books.length}+`
                    : about.statsBooks || "1+"}
                </div>
                <div className="text-[11px] sm:text-xs opacity-75 mt-1 font-medium">
                  {t.authorSection.booksPublished}
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-2xl border text-center ${
                  dark
                    ? "bg-[#1d1224] border-rose-900/50"
                    : "bg-rose-50/70 border-rose-100"
                }`}
              >
                <div className="text-xl sm:text-3xl font-extrabold text-rose-500">
                  {about.statsReaders || "5,000+"}
                </div>
                <div className="text-[11px] sm:text-xs opacity-75 mt-1 font-medium">
                  {t.authorSection.happyReaders}
                </div>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-2xl border text-center ${
                  dark
                    ? "bg-[#1d1224] border-rose-900/50"
                    : "bg-rose-50/70 border-rose-100"
                }`}
              >
                <div className="text-xl sm:text-3xl font-extrabold text-rose-500">
                  {about.statsWilayas || "69"}
                </div>
                <div className="text-[11px] sm:text-xs opacity-75 mt-1 font-medium">
                  {t.authorSection.wilayasCovered}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/about"
                className="px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all"
              >
                {t.authorSection.readMore}
              </Link>
              <Link
                to="/contact"
                className={`px-6 py-3 rounded-full border text-xs sm:text-sm font-bold transition-all ${
                  dark
                    ? "border-rose-800 text-rose-200 hover:bg-rose-950"
                    : "border-rose-200 text-slate-700 hover:bg-rose-50"
                }`}
              >
                {t.nav.contact}
              </Link>
              <a
                href={
                  about.instagramUrl || "https://www.instagram.com/ghayma_rd/"
                }
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-90 transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>{about.instagramHandle || "@ghayma_rd"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: AUTHOR'S BEST BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3.5 py-1.5 rounded-full">
            {booksTag || t.booksSection.tag}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold">
            {booksTitle || t.booksSection.title}
          </h2>
          <p
            className={`text-xs sm:text-base ${
              dark ? "text-rose-200/70" : "text-slate-600"
            }`}
          >
            {booksSubtitle || t.booksSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {books.map((book) => (
            <BookShowcaseCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* SECTION 4: POETIC QUOTE BANNER & READER TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Poetic Quote Banner */}
        <div className="rounded-3xl p-6 sm:p-12 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
          <Quote className="w-12 h-12 text-white/25 mx-auto" />
          <div className="text-xs sm:text-sm uppercase tracking-widest font-bold text-white/90">
            {quoteTitle}
          </div>
          <p className="font-editorial text-xl sm:text-3xl md:text-4xl font-bold max-w-3xl mx-auto leading-relaxed">
            {quoteText}
          </p>
        </div>

        {/* Reader Testimonials Grid */}
        {Array.isArray(homeContent.testimonials) &&
          homeContent.testimonials.length > 0 && (
            <div className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3.5 py-1.5 rounded-full">
                  {testTag}
                </span>
                <h3 className="font-editorial text-2xl sm:text-4xl font-bold">
                  {testTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {homeContent.testimonials.map((rev, idx) => (
                  <Card
                    key={rev.id || idx}
                    elevation={dark ? 5 : 2}
                    sx={{
                      borderRadius: "24px",
                      bgcolor: dark ? "#1a1121" : "#ffffff"
                    }}
                    className="p-5 sm:p-6 border border-rose-500/20 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(Number(rev.rating) || 5)].map((_, s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5 fill-amber-400"
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs sm:text-sm leading-relaxed italic ${
                          dark ? "text-rose-100/85" : "text-slate-600"
                        }`}
                      >
                        «{" "}
                        {lang === "ar"
                          ? rev.textAr
                          : lang === "fr"
                          ? rev.textFr || rev.textAr
                          : rev.textEn || rev.textAr}{" "}
                        »
                      </p>
                    </div>

                    <div className="pt-3 border-t border-rose-500/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-500">{rev.name}</span>
                      <span className="opacity-65">{rev.wilaya}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
      </section>
    </div>
  );
}
