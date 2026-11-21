import React, { useState, useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  Sparkles,
  Clock,
  Calendar,
  Flame,
  Heart,
  CheckCircle2,
  Users,
  MousePointerClick,
  Share2,
  X,
  Check,
  Send,
  Eye,
  BookOpen,
  Coffee,
  Bookmark,
  Smile,
  Trophy
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import {
  recordChallengeClick,
  recordChallengeView,
  joinChallengeSubscription,
  reactToChallengePost
} from "../firebase.js";
import { WILAYAS_69 } from "../data/wilayas.js";

// Helper hook for real-time countdown
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target) {
    if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      total: diff
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export default function GhaymaChallengesPage() {
  const { lang, t, dark, challenges, challengePosts, analytics, addToast } =
    useAppContext();

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedChallengeToJoin, setSelectedChallengeToJoin] = useState(null);
  const [joinName, setJoinName] = useState("");
  const [joinWilaya, setJoinWilaya] = useState("16 - Alger");
  const [joinPhone, setJoinPhone] = useState("");
  const [joining, setJoining] = useState(false);

  // Local storage streak of completed days per challenge
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ghayma_completed_days") || "{}");
    } catch {
      return {};
    }
  });

  // Track joined challenges locally
  const [joinedChallenges, setJoinedChallenges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ghayma_joined_challenges") || "[]");
    } catch {
      return [];
    }
  });

  // Record page views
  useEffect(() => {
    challenges.forEach((ch) => {
      recordChallengeView(ch.id);
    });
  }, [challenges]);

  const toggleDayCompletion = (challengeId, dayNumber) => {
    setCompletedDays((prev) => {
      const challengeDays = prev[challengeId] || [];
      const isAlready = challengeDays.includes(dayNumber);
      const nextDays = isAlready
        ? challengeDays.filter((d) => d !== dayNumber)
        : [...challengeDays, dayNumber];
      const next = { ...prev, [challengeId]: nextDays };
      localStorage.setItem("ghayma_completed_days", JSON.stringify(next));
      if (!isAlready) {
        addToast(
          lang === "ar"
            ? `أحسنتِ يا بطلة! أنجزتِ اليوم ${dayNumber} من التحدي 🌸`
            : `Bravo ! Jour ${dayNumber} validé avec succès 🌸`
        );
      }
      return next;
    });
  };

  const handleOpenJoin = (challenge) => {
    recordChallengeClick(challenge.id);
    setSelectedChallengeToJoin(challenge);
  };

  const handleConfirmJoin = async (e) => {
    e.preventDefault();
    if (!joinName.trim()) return;
    setJoining(true);
    try {
      await joinChallengeSubscription(selectedChallengeToJoin.id, {
        name: joinName.trim(),
        wilaya: joinWilaya,
        phone: joinPhone.trim()
      });
      const nextJoined = [...new Set([...joinedChallenges, selectedChallengeToJoin.id])];
      setJoinedChallenges(nextJoined);
      localStorage.setItem("ghayma_joined_challenges", JSON.stringify(nextJoined));
      addToast(
        lang === "ar"
          ? `مبروك انضمامكِ لتحدي «${selectedChallengeToJoin.title}» يا جميلة! 🌸`
          : `Félicitations pour votre inscription au défi ! 🌸`
      );
      setSelectedChallengeToJoin(null);
      setJoinName("");
      setJoinPhone("");
    } catch (err) {
      console.error(err);
      addToast("Erreur lors de l'inscription", "error");
    } finally {
      setJoining(false);
    }
  };

  const handlePostReact = async (postId, type) => {
    await reactToChallengePost(postId, type);
    addToast(type === "spark" ? "Brillant ! ✨" : "Merci pour votre amour ♡");
  };

  const filteredChallenges = useMemo(() => {
    if (activeFilter === "all") return challenges;
    return challenges.filter((c) => c.type === activeFilter);
  }, [challenges, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* =================================================================== */}
      {/* GIRLY HERO & MOTIVATION BANNER                                      */}
      {/* =================================================================== */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-12 text-center space-y-5 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white shadow-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
          <span>{t.challengesPage.tag}</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-black max-w-3xl mx-auto tracking-tight drop-shadow-sm">
          {t.challengesPage.title}
        </h1>

        <p className="text-xs sm:text-base max-w-2xl mx-auto text-white/90 leading-relaxed font-medium">
          {t.challengesPage.subtitle}
        </p>

        {/* Live Community Counters Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold">
          <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-200" />
            <span>
              {analytics?.challengeSubscribers || 820}+ {t.challengesPage.subscribersCount}
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-rose-200" />
            <span>
              {analytics?.challengeClicks || 1460}+ {t.challengesPage.clicksCount}
            </span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-200" />
            <span>
              {analytics?.totalVisits || 3120}+ {t.challengesPage.viewsCount}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FILTER BUTTONS                                                      */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {[
          { id: "all", label: t.challengesPage.filterAll },
          { id: "24h", label: t.challengesPage.filter24h },
          { id: "month", label: t.challengesPage.filterMonth },
          { id: "annual", label: t.challengesPage.filterAnnual }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setActiveFilter(btn.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none active:scale-95 ${
              activeFilter === btn.id
                ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/30 scale-105"
                : dark
                ? "bg-[#211429] text-rose-200/80 hover:text-white hover:bg-rose-950/60 border border-rose-900/50"
                : "bg-rose-50/90 text-slate-700 hover:text-rose-600 hover:bg-rose-100 border border-rose-200/60"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* =================================================================== */}
      {/* CHALLENGES CARDS GRID                                               */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {filteredChallenges.map((ch) => (
          <ChallengeCard
            key={ch.id}
            challenge={ch}
            lang={lang}
            t={t}
            dark={dark}
            isJoined={joinedChallenges.includes(ch.id)}
            completedDays={completedDays[ch.id] || []}
            onToggleDay={(day) => toggleDayCompletion(ch.id, day)}
            onOpenJoin={() => handleOpenJoin(ch)}
          />
        ))}
      </div>

      {/* =================================================================== */}
      {/* PINTEREST-STYLE INTERACTIVE BLOG / MOODBOARD POSTS FROM GHAYMA_RD   */}
      {/* =================================================================== */}
      <div className="pt-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3.5 py-1.5 rounded-full">
            Pinterest Vibes ✨
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold">
            {t.challengesPage.blogTitle}
          </h2>
          <p className={`text-xs sm:text-sm ${dark ? "text-rose-200/75" : "text-slate-600"}`}>
            {t.challengesPage.blogSubtitle}
          </p>
        </div>

        {/* Masonry-Style Pinterest Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {challengePosts.map((post) => {
            const postTitle =
              lang === "ar"
                ? post.titleAr || post.title
                : lang === "fr"
                ? post.titleFr || post.titleAr || post.title
                : post.titleEn || post.titleAr || post.title;

            const postContent =
              lang === "ar"
                ? post.contentAr || post.content
                : lang === "fr"
                ? post.contentFr || post.contentAr || post.content
                : post.contentEn || post.contentAr || post.content;

            return (
              <Card
                key={post.id}
                elevation={dark ? 6 : 2}
                sx={{
                  borderRadius: "28px",
                  bgcolor: dark ? "#190f20" : "#ffffff"
                }}
                className="border border-rose-500/20 overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300"
              >
                <div>
                  {/* Photo with Sticker Badge */}
                  {post.imageUrl && (
                    <div className="relative aspect-[4/3] overflow-hidden bg-rose-100">
                      <img
                        src={post.imageUrl}
                        alt={postTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {post.sticker && (
                        <div className="absolute top-3 end-3 w-10 h-10 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-xl shadow-md">
                          {post.sticker}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-rose-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        {post.authorName || "ghayma_rd (R.Dahmane)"}
                      </span>
                      <span className="opacity-70 text-[11px] font-normal">
                        {post.date || "Aujourd'hui"}
                      </span>
                    </div>

                    <h3 className="font-editorial text-xl sm:text-2xl font-bold leading-snug">
                      {postTitle}
                    </h3>

                    <p
                      className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                        dark ? "text-rose-100/80" : "text-slate-600"
                      }`}
                    >
                      {postContent}
                    </p>

                    {/* Hashtags pills */}
                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                              dark
                                ? "bg-rose-950/60 text-rose-300 border border-rose-900/60"
                                : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Interactive Hearts & Sparks */}
                <div className="p-4 sm:px-6 border-t border-rose-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePostReact(post.id, "like")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 text-xs font-bold transition-all cursor-pointer active:scale-95"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500 group-hover:fill-white" />
                      <span>{post.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={() => handlePostReact(post.id, "spark")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-500 text-xs font-bold transition-all cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-amber-400 group-hover:fill-white" />
                      <span>{post.sparksCount || 0}</span>
                    </button>
                  </div>

                  <span className="text-[11px] font-semibold opacity-65 flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-rose-400" />
                    <span>Ghayma Vibes</span>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* JOIN CHALLENGE INTERACTIVE MODAL                                    */}
      {/* =================================================================== */}
      <Dialog
        open={Boolean(selectedChallengeToJoin)}
        onClose={() => setSelectedChallengeToJoin(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "32px",
            bgcolor: dark ? "#190f20" : "#ffffff",
            color: dark ? "#fff1f2" : "#1e293b",
            p: { xs: 2.5, sm: 3.5 }
          }
        }}
      >
        {selectedChallengeToJoin && (
          <form onSubmit={handleConfirmJoin} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/15">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm sm:text-base">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{t.challengesPage.joinModalTitle}</span>
              </div>
              <IconButton
                onClick={() => setSelectedChallengeToJoin(null)}
                size="small"
                sx={{ color: "#f43f5e" }}
              >
                <X className="w-4 h-4" />
              </IconButton>
            </div>

            <p className="text-xs opacity-80 leading-relaxed">
              {t.challengesPage.joinModalSubtitle}
            </p>

            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{selectedChallengeToJoin.title}</span>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {t.challengesPage.nameLabel} *
              </label>
              <input
                type="text"
                required
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Ex: Sara / أميرة الرضا..."
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-white border-rose-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {t.challengesPage.wilayaLabel} *
              </label>
              <select
                value={joinWilaya}
                onChange={(e) => setJoinWilaya(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-white border-rose-200 text-slate-800"
                }`}
              >
                {WILAYAS_69.map((w) => (
                  <option key={w.code} value={`${w.code} - ${w.nameFr}`}>
                    {w.code} - {w.nameFr} ({w.nameAr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {t.challengesPage.phoneLabel}
              </label>
              <input
                type="text"
                value={joinPhone}
                onChange={(e) => setJoinPhone(e.target.value)}
                placeholder="0550... / @instagram"
                className={`w-full px-4 py-2.5 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-white border-rose-200 text-slate-800"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={joining}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {joining ? "..." : t.challengesPage.confirmJoinBtn}
            </button>
          </form>
        )}
      </Dialog>
    </div>
  );
}

// =====================================================================
// INDIVIDUAL CHALLENGE CARD WITH CHRONO & INTERACTIVE CALENDAR
// =====================================================================
function ChallengeCard({
  challenge,
  lang,
  t,
  dark,
  isJoined,
  completedDays,
  onToggleDay,
  onOpenJoin
}) {
  const title =
    lang === "ar"
      ? challenge.title
      : lang === "fr"
      ? challenge.titleFr || challenge.title
      : challenge.titleEn || challenge.title;

  const desc =
    lang === "ar"
      ? challenge.description
      : lang === "fr"
      ? challenge.descriptionFr || challenge.description
      : challenge.descriptionEn || challenge.description;

  const countdown = useCountdown(challenge.endDate);
  const totalDays = Number(challenge.durationDays) || (challenge.type === "24h" ? 1 : 30);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    return Array.from({ length: Math.min(totalDays, 31) }, (_, i) => i + 1);
  }, [totalDays]);

  const streakPercent = Math.round(
    ((completedDays.length || 0) / Math.max(calendarDays.length, 1)) * 100
  );

  return (
    <Card
      elevation={dark ? 6 : 2}
      sx={{
        borderRadius: "32px",
        bgcolor: dark ? "#190f20" : "#ffffff"
      }}
      className="border-2 border-rose-500/20 p-5 sm:p-7 space-y-6 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-rose-500/10"
    >
      {/* Top Header: Badge + Category */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-500/15">
        <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] font-extrabold tracking-wider shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-200" />
          <span>{challenge.badge || "CHALLENGE ✨"}</span>
        </span>

        <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {challenge.startDate} → {challenge.endDate}
          </span>
        </span>
      </div>

      {/* Main Title & Description */}
      <div className="space-y-2">
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight">
          {title}
        </h2>
        <p
          className={`text-xs sm:text-sm leading-relaxed ${
            dark ? "text-rose-100/80" : "text-slate-600"
          }`}
        >
          {desc}
        </p>
      </div>

      {/* =============================================================== */}
      {/* 1. CHRONO / LIVE COUNTDOWN MINUTEUR (If enabled)                */}
      {/* =============================================================== */}
      {challenge.showCountdown && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border text-center space-y-3 ${
            dark
              ? "bg-[#25162e] border-rose-900/60 text-white"
              : "bg-rose-50/70 border-rose-200 text-slate-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>{t.challengesPage.countdownTitle}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto" dir="ltr">
            {[
              { val: countdown.days, unit: t.challengesPage.days },
              { val: countdown.hours, unit: t.challengesPage.hours },
              { val: countdown.minutes, unit: t.challengesPage.minutes },
              { val: countdown.seconds, unit: t.challengesPage.seconds }
            ].map((box, i) => (
              <div
                key={i}
                className={`py-2 sm:py-3 rounded-xl border flex flex-col items-center justify-center ${
                  dark ? "bg-[#180e20] border-rose-800/40" : "bg-white border-rose-200 shadow-xs"
                }`}
              >
                <span className="font-mono text-xl sm:text-2xl font-black text-rose-500">
                  {String(box.val).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold opacity-65 uppercase mt-0.5">
                  {box.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 2. INTERACTIVE CALENDAR WITH CHECKABLE DAYS (If enabled)        */}
      {/* =============================================================== */}
      {challenge.showCalendar && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
            dark
              ? "bg-[#25162e] border-rose-900/60"
              : "bg-rose-50/70 border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-500">
              <Calendar className="w-4 h-4" />
              <span>{t.challengesPage.calendarTitle}</span>
            </div>
            <span className="text-xs font-extrabold text-rose-500 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
              {streakPercent}% {lang === "ar" ? "مكتمل" : "Accompli"}
            </span>
          </div>

          <p className="text-[11px] opacity-75">
            {t.challengesPage.calendarSubtitle}
          </p>

          {/* Interactive Day Pills */}
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2 pt-1">
            {calendarDays.map((dayNum) => {
              const isDone = completedDays.includes(dayNum);
              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => onToggleDay(dayNum)}
                  className={`aspect-square rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer active:scale-90 ${
                    isDone
                      ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 scale-105"
                      : dark
                      ? "bg-[#180e20] text-rose-200/80 hover:bg-rose-900/40 border border-rose-900/50"
                      : "bg-white text-slate-700 hover:bg-rose-100 border border-rose-200"
                  }`}
                  title={`Jour ${dayNum}`}
                >
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{dayNum}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 3. DAILY HABITS / PROMPTS CHECKLIST                             */}
      {/* =============================================================== */}
      {Array.isArray(challenge.habits) && challenge.habits.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-500 block">
            {t.challengesPage.habitsTitle}
          </span>
          <div className="space-y-1.5">
            {challenge.habits.map((habit, idx) => (
              <div
                key={idx}
                className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
                  dark ? "bg-[#1f1326] border-rose-950" : "bg-white border-rose-100 shadow-xs"
                }`}
              >
                <div className="w-5 h-5 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
                  <Heart className="w-3 h-3 fill-rose-500" />
                </div>
                <span>{habit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 4. JOIN BUTTON & SUBSCRIBERS / CLICKS STATS                    */}
      {/* =============================================================== */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-rose-500/15">
        <div className="flex items-center gap-3 text-xs opacity-80">
          <span className="flex items-center gap-1 font-semibold text-rose-500">
            <Users className="w-3.5 h-3.5" />
            <span>
              {challenge.subscribersCount || challenge.subscribers?.length || 0}{" "}
              {t.challengesPage.subscribersCount}
            </span>
          </span>

          <span className="flex items-center gap-1 opacity-70">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-500" />
            <span>{challenge.clicksCount || 0} clics</span>
          </span>
        </div>

        {isJoined ? (
          <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-xs border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.challengesPage.alreadyJoined}</span>
          </div>
        ) : (
          <button
            onClick={onOpenJoin}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.challengesPage.joinBtn}</span>
          </button>
        )}
      </div>
    </Card>
  );
}
