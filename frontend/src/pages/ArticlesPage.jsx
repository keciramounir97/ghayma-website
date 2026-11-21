import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  BookOpen,
  Heart,
  MessageSquare,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Feather,
  Filter
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function ArticlesPage() {
  const { articles, lang, dark, t } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const categories = useMemo(() => {
    const set = new Set();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [articles, selectedCategory]);

  return (
    <div className="relative min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
      {/* Cute Floating Background Petals */}
      <div className="absolute top-10 left-5 text-2xl opacity-40 animate-pulse pointer-events-none select-none">
        🌸
      </div>
      <div className="absolute top-40 right-10 text-3xl opacity-30 pointer-events-none select-none">
        ✨
      </div>
      <div className="absolute bottom-20 left-12 text-2xl opacity-35 pointer-events-none select-none">
        🕊️
      </div>
      <div className="absolute bottom-40 right-8 text-2xl opacity-40 pointer-events-none select-none">
        🌺
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-xs sm:text-sm font-bold border border-rose-500/20 shadow-xs">
          <Feather className="w-4 h-4" />
          <span>
            {lang === "ar"
              ? "يوميات وخواطر غيمة الأدبية"
              : "Le Journal & Articles de ghayma_rd"}
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-rose-50">
          {lang === "ar"
            ? "كلمات من القلب إلى أرواحكن الهادئة 🌸"
            : "Des Mots Doux du Cœur pour Vos Âmes 🌸"}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-rose-200/80 leading-relaxed">
          {lang === "ar"
            ? "مساحة تجمع بين بركة الفجر، أسرار الكتابة، خواطر الرضا، والروتين الصباحي المليء بالسكينة والجمال."
            : "Retrouvez mes réflexions intimes, conseils pour les routines matinales de prière, secrets d'écriture et inspiration quotidienne."}
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105"
                : dark
                ? "bg-[#211429] text-rose-200 hover:bg-rose-950 border border-rose-900/60"
                : "bg-white text-slate-700 hover:bg-rose-50 border border-rose-200 shadow-xs"
            }`}
          >
            {lang === "ar" ? "كل المقالات ✨" : "Tous les Articles ✨"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105"
                  : dark
                  ? "bg-[#211429] text-rose-200 hover:bg-rose-950 border border-rose-900/60"
                  : "bg-white text-slate-700 hover:bg-rose-50 border border-rose-200 shadow-xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredArticles.map((article) => {
          const title =
            lang === "ar"
              ? article.titleAr || article.titleFr
              : lang === "fr"
              ? article.titleFr
              : article.titleEn || article.titleFr;

          const excerpt =
            lang === "ar"
              ? article.excerptAr || article.excerptFr
              : lang === "fr"
              ? article.excerptFr
              : article.excerptEn || article.excerptFr;

          return (
            <Card
              key={article.id}
              elevation={dark ? 4 : 2}
              sx={{
                borderRadius: "28px",
                bgcolor: dark ? "#1a1121" : "#ffffff",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
              className="border border-rose-500/20 hover:border-rose-500/50 hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Cover Image */}
              <div className="relative h-56 sm:h-60 overflow-hidden bg-rose-500/10">
                <img
                  src={article.coverImage || "/images/book-front.jpg"}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Category Chip */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/90 dark:bg-slate-900/90 text-rose-600 dark:text-rose-400 backdrop-blur-md shadow-md">
                    {article.category || "Inspiration"}
                  </span>
                </div>

                {/* Read Time */}
                <div className="absolute bottom-4 left-4 text-white text-[11px] font-bold flex items-center gap-1.5 drop-shadow-md">
                  <Clock className="w-3.5 h-3.5 text-rose-300" />
                  <span>{article.readTime || "5 min"}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-rose-300/70">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="font-semibold">{article.author}</span>
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-rose-50 group-hover:text-rose-500 transition-colors line-clamp-2">
                    {title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed line-clamp-3">
                    {excerpt}
                  </p>
                </div>

                {/* Card Footer: Likes, Comments & Read More */}
                <div className="pt-4 border-t border-rose-500/15 flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-xs text-slate-500 dark:text-rose-300/70 font-semibold">
                    <span className="flex items-center gap-1 text-rose-500">
                      <Heart className="w-4 h-4 fill-rose-500/30" />
                      <span>{article.likesCount || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{article.commentsCount || 0}</span>
                    </span>
                  </div>

                  <Link
                    to={`/articles/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-all"
                  >
                    <span>{lang === "ar" ? "قراءة المقال" : "Lire la suite"}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
