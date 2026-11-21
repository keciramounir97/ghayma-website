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
  Trophy,
  Bell,
  BellRing,
  Plus,
  Trash2,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  Lock,
  UserCheck
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import {
  recordChallengeClick,
  recordChallengeView,
  joinChallengeSubscription,
  reactToChallengePost
} from "../firebase.js";
import { WILAYAS_69 } from "../data/wilayas.js";

// Real-time Countdown Hook
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
  const {
    lang,
    t,
    dark,
    challenges,
    challengePosts,
    analytics,
    currentUser,
    setAuthModalOpen,
    addToast
  } = useAppContext();

  // Primary active challenge: Praying Fajr until end of November
  const primaryChallenge = useMemo(() => {
    return (
      challenges.find((c) => c.id === "fajr-prayer-nov-2026") ||
      challenges[0] || {
        id: "fajr-prayer-nov-2026",
        title: "تحدي صلاة الفجر في وقتها حتى نهاية نوفمبر 🤲✨",
        titleFr: "Défi Prière du Fajr à l'Heure jusqu'à la fin Novembre ✨",
        titleEn: "Fajr Prayer on Time Challenge until End of November ✨",
        endDate: "2026-11-30T23:59:59.000Z",
        habits: [
          "الاستيقاظ 15 دقيقة قبل أذان الفجر ⏰",
          "صلاة ركعتي سنة الفجر 🕊️",
          "أداء فريضة الفجر في وقتها بخشوع 🤲",
          "قراءة أذكار الصباح والسكينة 🌸",
          "10 دقائق قراءة وتدبر 📖"
        ]
      }
    );
  }, [challenges]);

  const countdown = useCountdown(primaryChallenge.endDate || "2026-11-30T23:59:59.000Z");

  // Track completed days in the November calendar (1 to 30)
  const [completedDays, setCompletedDays] = useState(() => {
    try {
      const key = `ghayma_fajr_days_${currentUser?.id || "guest"}`;
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  });

  // User's custom daily tasks and routines
  const [userRoutines, setUserRoutines] = useState(() => {
    try {
      const key = `ghayma_user_routines_${currentUser?.id || "guest"}`;
      return JSON.parse(
        localStorage.getItem(key) ||
          JSON.stringify([
            { id: "r-1", text: "شرب كوب ماء دافئ مع ليمون 🍋", done: true },
            { id: "r-2", text: "الاستماع إلى سورة يس أو مريم 🎧", done: false },
            { id: "r-3", text: "تدوين فكرة واحدة ألهمتني اليوم ✍️", done: false }
          ])
      );
    } catch {
      return [];
    }
  });

  const [newRoutineText, setNewRoutineText] = useState("");
  const [selectedWilayaPrayer, setSelectedWilayaPrayer] = useState("Alger");

  // Prayer times state
  const [prayerTimes, setPrayerTimes] = useState({
    Fajr: "05:42",
    Sunrise: "07:15",
    Dhuhr: "12:35",
    Asr: "15:20",
    Maghrib: "17:40",
    Isha: "19:05"
  });
  const [loadingPrayer, setLoadingPrayer] = useState(false);

  // Push notifications state
  const [pushEnabled, setPushEnabled] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission === "granted";
    }
    return false;
  });

  // Track joined challenges
  const [isJoined, setIsJoined] = useState(() => {
    return localStorage.getItem(`ghayma_joined_${primaryChallenge.id}`) === "true";
  });

  // Fetch Prayer Times from Aladhan API with reliable fallback
  useEffect(() => {
    let isMounted = true;
    setLoadingPrayer(true);
    fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        selectedWilayaPrayer
      )}&country=Algeria&method=3`
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data?.data?.timings) {
          setPrayerTimes(data.data.timings);
        }
      })
      .catch((err) => {
        console.warn("Aladhan API fallback:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingPrayer(false);
      });
    return () => {
      isMounted = false;
    };
  }, [selectedWilayaPrayer]);

  // Record page view
  useEffect(() => {
    if (primaryChallenge?.id) {
      recordChallengeView(primaryChallenge.id);
    }
  }, [primaryChallenge]);

  // Toggle calendar days
  const toggleDayCompletion = (dayNumber) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setCompletedDays((prev) => {
      const next = { ...prev, [dayNumber]: !prev[dayNumber] };
      const key = `ghayma_fajr_days_${currentUser?.id || "guest"}`;
      localStorage.setItem(key, JSON.stringify(next));
      if (next[dayNumber]) {
        addToast(
          lang === "ar"
            ? `أحسنتِ يا ${currentUser.name}! تم تسجيل إنجاز اليوم ${dayNumber} من صلاة الفجر بنجاح 🌸`
            : `Bravo ${currentUser.name} ! Jour ${dayNumber} validé avec succès pour le Fajr 🌸`
        );
      }
      return next;
    });
  };

  // Add custom routine
  const handleAddRoutine = (e) => {
    e.preventDefault();
    if (!newRoutineText.trim()) return;
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const newR = {
      id: "r-" + Date.now(),
      text: newRoutineText.trim(),
      done: false
    };
    const updated = [...userRoutines, newR];
    setUserRoutines(updated);
    setNewRoutineText("");
    const key = `ghayma_user_routines_${currentUser?.id || "guest"}`;
    localStorage.setItem(key, JSON.stringify(updated));
    addToast(
      lang === "ar"
        ? "تمت إضافة روتينكِ الشخصي إلى القائمة اليومية ✨"
        : "Nouvelle routine personnelle ajoutée avec succès ✨"
    );
  };

  const toggleRoutine = (id) => {
    const updated = userRoutines.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    setUserRoutines(updated);
    const key = `ghayma_user_routines_${currentUser?.id || "guest"}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const deleteRoutine = (id) => {
    const updated = userRoutines.filter((r) => r.id !== id);
    setUserRoutines(updated);
    const key = `ghayma_user_routines_${currentUser?.id || "guest"}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  // Request Web Push Notifications
  const handleRequestPush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      addToast("Les notifications ne sont pas supportées sur ce navigateur", "error");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushEnabled(true);
        addToast(
          lang === "ar"
            ? "تم تفعيل التنبيهات بنجاح! ستصلكِ إشعارات صلاة الفجر والروتين الصباحي 🔔✨"
            : "Notifications activées ! Vous recevrez les rappels doux du Fajr et des routines 🔔✨"
        );
        new Notification("Ghayma ✨ غيمة", {
          body:
            lang === "ar"
              ? "أهلاً بكِ في تحدي صلاة الفجر حتى نهاية نوفمبر 🌸 تم تفعيل التنبيهات!"
              : "Bienvenue dans le défi Prière du Fajr ! Rappels activés avec amour 🌸",
          icon: "/images/book-front.jpg"
        });
      } else {
        addToast("Autorisation des notifications refusée", "error");
      }
    } catch (e) {
      console.warn("Notification permission error:", e);
    }
  };

  const handleTestNotification = () => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Ghayma ✨ Rappel Fajr & Sérénité", {
        body:
          lang === "ar"
            ? "«الصلاة خير من النوم» 🕊️ قومي إلى ركعتي الفجر واستقبلي بركة الصباح يا رفيقة الغيم ♡"
            : "« La prière vaut mieux que le sommeil » 🕊️ Doux rappel pour préparer votre matinée avec le Fajr ♡",
        icon: "/images/book-front.jpg"
      });
    }
    addToast(
      lang === "ar"
        ? "تم إرسال تنبيه تجريبي لصلاة الفجر بنجاح! 🔔✨"
        : "Rappel de test envoyé avec succès sur votre appareil ! 🔔✨"
    );
  };

  // Join Challenge
  const handleJoinChallenge = async () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setIsJoined(true);
    localStorage.setItem(`ghayma_joined_${primaryChallenge.id}`, "true");
    await joinChallengeSubscription(primaryChallenge.id, {
      name: currentUser.name,
      wilaya: currentUser.wilaya,
      phone: ""
    });
    addToast(
      lang === "ar"
        ? `مبارك انضمامكِ يا ${currentUser.name}! بدأت رحلتكِ مع صلاة الفجر والسكينة 🌸`
        : `Félicitations ${currentUser.name} ! Vous êtes inscrite au Défi Prière du Fajr 🌸`
    );
  };

  // Completed percentage
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / 30) * 100));

  const challengeTitle =
    lang === "ar"
      ? primaryChallenge.titleAr || primaryChallenge.title
      : lang === "fr"
      ? primaryChallenge.titleFr || primaryChallenge.title
      : primaryChallenge.titleEn || primaryChallenge.title;

  const challengeDesc =
    lang === "ar"
      ? primaryChallenge.description || primaryChallenge.descriptionAr
      : lang === "fr"
      ? primaryChallenge.descriptionFr || primaryChallenge.description
      : primaryChallenge.descriptionEn || primaryChallenge.description;

  return (
    <div className="relative min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* CUTE FLOATING GIRLY CHARACTERS & FLOWERS IN BACKGROUND */}
      <div className="absolute top-12 left-6 text-3xl opacity-35 animate-bounce select-none pointer-events-none">
        🌸
      </div>
      <div className="absolute top-36 right-8 text-3xl opacity-30 select-none pointer-events-none">
        🌺
      </div>
      <div className="absolute top-96 left-8 text-2xl opacity-25 select-none pointer-events-none">
        🕊️
      </div>
      <div className="absolute bottom-60 right-10 text-3xl opacity-30 select-none pointer-events-none">
        🌙
      </div>
      <div className="absolute bottom-20 left-10 text-2xl opacity-30 select-none pointer-events-none">
        ✨
      </div>

      {/* TOP HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-amber-500/15 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold border border-rose-500/25 shadow-xs">
          <Moon className="w-4 h-4 text-amber-500" />
          <span>
            {lang === "ar"
              ? "تحدي شهر نوفمبر المبارك مع غيمة"
              : "Le Grand Défi Spirituel de Novembre"}
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-rose-50">
          {challengeTitle}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-rose-200/80 leading-relaxed">
          {challengeDesc}
        </p>

        {/* Global Live Counters */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-rose-200">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <Users className="w-4 h-4 text-rose-500" />
            <span>
              {analytics?.challengeSubscribers || 842}{" "}
              {lang === "ar" ? "مشاركة معنا" : "Participantes"}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>
              {progressPercent}% {lang === "ar" ? "نسبة إنجازكِ" : "Votre Progression"}
            </span>
          </div>
        </div>
      </div>

      {/* AUTHENTICATION GATE (If user is not logged in) */}
      {!currentUser ? (
        <Card
          elevation={dark ? 5 : 3}
          sx={{
            borderRadius: "32px",
            bgcolor: dark ? "#1f1326" : "#ffffff"
          }}
          className="border-2 border-rose-500/30 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 text-white flex items-center justify-center text-3xl shadow-xl shadow-rose-500/30 mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50">
              {lang === "ar"
                ? "مساحة التحديات مخصصة لعضوات مجتمع غيمة 🌸"
                : "Espace Réservé aux Membres de la Communauté Ghayma 🌸"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed max-w-md mx-auto">
              {lang === "ar"
                ? "للمشاركة في تحدي صلاة الفجر، تسجيل تقدمكِ في التقويم، إضافة روتينكِ الخاص وتفعيل التنبيهات، سجلي حسابكِ مجاناً في ثوانٍ معدودة."
                : "Pour participer au défi prière du Fajr, cocher vos jours sur le calendrier, configurer vos routines et recevoir les rappels doux, créez votre compte en 1 clic."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-rose-500/30 hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === "ar"
                  ? "تسجيل الدخول / إنشاء حساب 🌸"
                  : "Connexion / Rejoindre la Communauté 🌸"}
              </span>
            </button>
          </div>
        </Card>
      ) : (
        /* FULL INTERACTIVE MEMBER VIEW */
        <div className="space-y-10 sm:space-y-12">
          {/* USER WELCOME BAR */}
          <div
            className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              dark
                ? "bg-[#1c1223] border-rose-900/60 text-rose-50"
                : "bg-white border-rose-200 text-slate-800 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center text-2xl shadow-md">
                {currentUser.avatar || "🌸"}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                  <span>
                    {lang === "ar"
                      ? `أهلاً بكِ في التحدي يا ${currentUser.name} ✨`
                      : `Bienvenue dans votre Défi, ${currentUser.name} ✨`}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-bold">
                    Membre Actif
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-rose-300/70">
                  {currentUser.wilaya || "Algérie"} • {completedCount}/30 {lang === "ar" ? "أيام منجزة" : "jours complétés"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isJoined ? (
                <button
                  onClick={handleJoinChallenge}
                  className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {lang === "ar" ? "سأشارك في هذا التحدي ✨" : "Je participe au Défi ✨"}
                </button>
              ) : (
                <span className="px-4 py-2 rounded-full bg-emerald-500/15 text-emerald-600 font-extrabold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === "ar" ? "أنتِ مسجلة في التحدي ✓" : "Inscrite au Défi ✓"}</span>
                </span>
              )}
            </div>
          </div>

          {/* REAL-TIME COUNTDOWN CHRONO (FAJR UNTIL END OF NOVEMBER) */}
          <Card
            elevation={dark ? 5 : 2}
            sx={{
              borderRadius: "32px",
              bgcolor: dark ? "#1a1121" : "#ffffff"
            }}
            className="border-2 border-rose-500/30 p-6 sm:p-10 text-center space-y-6 shadow-xl"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                {lang === "ar"
                  ? "العد التنازلي حتى نهاية شهر نوفمبر 2026"
                  : "Compte à Rebours jusqu'à la fin Novembre 2026"}
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
                {lang === "ar"
                  ? "الوقت المتبقي في التحدي المبارك ⏳"
                  : "Temps Restant pour Bâtir votre Routine ⏳"}
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-6 max-w-xl mx-auto">
              {[
                { label: lang === "ar" ? "أيام" : "Jours", val: countdown.days },
                { label: lang === "ar" ? "ساعات" : "Heures", val: countdown.hours },
                { label: lang === "ar" ? "دقائق" : "Minutes", val: countdown.minutes },
                { label: lang === "ar" ? "ثوانٍ" : "Secondes", val: countdown.seconds }
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className={`p-3 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col items-center justify-center transition-all ${
                    dark
                      ? "bg-[#25172e] border-rose-900/60"
                      : "bg-rose-50/70 border-rose-200 shadow-xs"
                  }`}
                >
                  <span className="font-editorial text-2xl sm:text-4xl lg:text-5xl font-black text-rose-600 dark:text-rose-400">
                    {String(unit.val).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-rose-200/70 mt-1">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* PRAYER TIMES & AUTOMATIC NOTIFICATION REMINDERS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Live Prayer Times Card (2 Cols) */}
            <Card
              elevation={dark ? 4 : 2}
              sx={{
                borderRadius: "32px",
                bgcolor: dark ? "#1a1121" : "#ffffff"
              }}
              className="lg:col-span-2 border border-rose-500/20 p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/15">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-500 uppercase">
                      API Aladhan Live
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                      Direct Algérie
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-rose-50">
                    {lang === "ar"
                      ? "مواقيت الصلاة لولايتكِ اليوم 🤲"
                      : "Horaires des Prières pour votre Wilaya 🤲"}
                  </h3>
                </div>

                {/* Wilaya Selector for Prayer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-rose-300">
                    {lang === "ar" ? "الولاية:" : "Wilaya :"}
                  </span>
                  <select
                    value={selectedWilayaPrayer}
                    onChange={(e) => setSelectedWilayaPrayer(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      dark
                        ? "bg-[#25172e] border-rose-900/60 text-white"
                        : "bg-slate-50 border-rose-200 text-slate-800"
                    }`}
                  >
                    {[
                      "Alger",
                      "Oran",
                      "Constantine",
                      "Batna",
                      "Setif",
                      "Annaba",
                      "Tlemcen",
                      "Blida",
                      "Bejaia",
                      "Biskra",
                      "Djelfa",
                      "Ghardaia"
                    ].map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prayer Times Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  {
                    name: lang === "ar" ? "الفجر" : "Fajr",
                    time: prayerTimes.Fajr,
                    icon: Moon,
                    highlight: true
                  },
                  {
                    name: lang === "ar" ? "الشروق" : "Chourouk",
                    time: prayerTimes.Sunrise,
                    icon: Sunrise,
                    highlight: false
                  },
                  {
                    name: lang === "ar" ? "الظهر" : "Dhuhr",
                    time: prayerTimes.Dhuhr,
                    icon: Sun,
                    highlight: false
                  },
                  {
                    name: lang === "ar" ? "العصر" : "Asr",
                    time: prayerTimes.Asr,
                    icon: Sun,
                    highlight: false
                  },
                  {
                    name: lang === "ar" ? "المغرب" : "Maghrib",
                    time: prayerTimes.Maghrib,
                    icon: Sunset,
                    highlight: false
                  },
                  {
                    name: lang === "ar" ? "العشاء" : "Isha",
                    time: prayerTimes.Isha,
                    icon: Moon,
                    highlight: false
                  }
                ].map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        p.highlight
                          ? "bg-gradient-to-b from-rose-500/20 to-pink-500/10 border-2 border-rose-500 text-rose-600 dark:text-rose-300 shadow-md scale-105"
                          : dark
                          ? "bg-[#211428] border-rose-900/50 text-rose-100"
                          : "bg-slate-50/80 border-slate-200 text-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1 opacity-80" />
                      <div className="text-[11px] font-bold">{p.name}</div>
                      <div className="text-sm sm:text-base font-extrabold mt-0.5">
                        {p.time || "--:--"}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prayer Reminder Action */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-600 dark:text-rose-200/80 font-medium">
                  {lang === "ar"
                    ? "✨ نصيحة اليوم: استيقظي 15 دقيقة قبل أذان الفجر لتستمتعي بركعتي السنة والسكينة."
                    : "✨ Astuce : Réveillez-vous 15 min avant l'Adhan pour savourer la Sunnah et le calme de l'aube."}
                </span>

                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>
                    {lang === "ar" ? "تجربة تنبيه الأذان الآن 🔔" : "Tester le Rappel Fajr 🔔"}
                  </span>
                </button>
              </div>
            </Card>

            {/* Browser Push Notification Permission Card (1 Col) */}
            <Card
              elevation={dark ? 4 : 2}
              sx={{
                borderRadius: "32px",
                bgcolor: dark ? "#1a1121" : "#ffffff"
              }}
              className="border border-rose-500/20 p-6 sm:p-8 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-md">
                  <BellRing className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-xl font-bold text-slate-900 dark:text-rose-50">
                  {lang === "ar" ? "التنبيهات على جهازكِ 📲" : "Notifications sur Appareil 📲"}
                </h3>
                <p className="text-xs text-slate-600 dark:text-rose-200/80 leading-relaxed">
                  {lang === "ar"
                    ? "اضغطي على الزر بالأسفل لتفعيل الإشعارات وتلقي رسائل التشجيع والتذكير بصلاة الفجر يومياً."
                    : "Activez les notifications pour recevoir les rappels bienveillants de réveil pour le Fajr et vos routines."}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {!pushEnabled ? (
                  <button
                    type="button"
                    onClick={handleRequestPush}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>
                      {lang === "ar" ? "تفعيل التنبيهات الآن 🔔" : "Activer les Notifications 🔔"}
                    </span>
                  </button>
                ) : (
                  <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>
                      {lang === "ar" ? "التنبيهات مفعلة على جهازكِ ✓" : "Notifications Activées ✓"}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleTestNotification}
                  className="w-full py-2.5 px-3 rounded-2xl border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  {lang === "ar" ? "إرسال إشعار تجريبي 🌸" : "Envoyer une Notification Test 🌸"}
                </button>
              </div>
            </Card>
          </div>

          {/* 30-DAY INTERACTIVE STREAK CALENDAR */}
          <Card
            elevation={dark ? 4 : 2}
            sx={{
              borderRadius: "32px",
              bgcolor: dark ? "#1a1121" : "#ffffff"
            }}
            className="border border-rose-500/20 p-6 sm:p-10 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/15">
              <div className="space-y-1">
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                  {lang === "ar"
                    ? "تقويم أيام شهر نوفمبر التفاعلي (30 يوماً)"
                    : "Calendrier Interactif Jour par Jour (Novembre 30 Jours)"}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50">
                  {lang === "ar"
                    ? "اضغطي على اليوم لتسجيل إنجاز صلاة الفجر ✓"
                    : "Cochez chaque journée de Fajr accomplie ✓"}
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3">
                <div className="w-32 sm:w-44 h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400">
                  {completedCount}/30
                </span>
              </div>
            </div>

            {/* Day by Day Circle Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2.5 sm:gap-3.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const isChecked = !!completedDays[day];
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDayCompletion(day)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer select-none border-2 group ${
                      isChecked
                        ? "bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white border-transparent shadow-lg shadow-rose-500/30 scale-105"
                        : dark
                        ? "bg-[#25172e] border-rose-900/50 text-rose-200 hover:border-rose-500/60"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-300"
                    }`}
                  >
                    <span className="text-sm sm:text-base font-extrabold">{day}</span>
                    <span className="text-[10px] mt-0.5">
                      {isChecked ? "✓" : "○"}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* USER CUSTOM ROUTINES & DAILY TASKS CHECKLIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Habits of the Challenge */}
            <Card
              elevation={dark ? 4 : 2}
              sx={{
                borderRadius: "32px",
                bgcolor: dark ? "#1a1121" : "#ffffff"
              }}
              className="border border-rose-500/20 p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl font-bold text-slate-900 dark:text-rose-50">
                    {lang === "ar" ? "أركان تحدي الفجر الأساسية" : "Piliers du Défi Fajr"}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-rose-300/70">
                    {lang === "ar" ? "الخطوات المقترحة لبداية مباركة" : "Les étapes clés du rituel"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {(primaryChallenge.habits || []).map((habit, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold ${
                      dark
                        ? "bg-[#22142a] border-rose-900/50 text-rose-100"
                        : "bg-rose-50/60 border-rose-200 text-slate-800"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{habit}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Custom User Routines (Add and check custom tasks) */}
            <Card
              elevation={dark ? 4 : 2}
              sx={{
                borderRadius: "32px",
                bgcolor: dark ? "#1a1121" : "#ffffff"
              }}
              className="border border-rose-500/20 p-6 sm:p-8 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-slate-900 dark:text-rose-50">
                        {lang === "ar"
                          ? "روتيناتكِ ومهامكِ الشخصية ✍️"
                          : "Vos Routines & Tâches Personnelles ✍️"}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-rose-300/70">
                        {lang === "ar"
                          ? "أضيفي أهدافكِ الخاصة كل صباح"
                          : "Personnalisez votre to-do list spirituelle"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-500">
                    {userRoutines.filter((r) => r.done).length}/{userRoutines.length}
                  </span>
                </div>

                {/* Routines List */}
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {userRoutines.map((r) => (
                    <div
                      key={r.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
                        r.done
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                          : dark
                          ? "bg-[#22142a] border-rose-900/50 text-rose-100"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleRoutine(r.id)}
                        className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold flex-1 text-start cursor-pointer"
                      >
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                            r.done
                              ? "bg-emerald-500 text-white"
                              : "border-2 border-slate-300 dark:border-rose-800"
                          }`}
                        >
                          {r.done && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={r.done ? "line-through opacity-75" : ""}>
                          {r.text}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteRoutine(r.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Routine Form */}
              <form onSubmit={handleAddRoutine} className="flex gap-2 pt-2 border-t border-rose-500/15">
                <input
                  type="text"
                  placeholder={
                    lang === "ar"
                      ? "أضيفي مهمة جديدة (مثلاً: أذكار الاستيقاظ)..."
                      : "Ajouter une tâche (ex: 5 min de dhikr)..."
                  }
                  value={newRoutineText}
                  onChange={(e) => setNewRoutineText(e.target.value)}
                  className={`flex-1 px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#25172e] border-rose-900/60 text-white"
                      : "bg-slate-50 border-rose-200 text-slate-800"
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors flex items-center gap-1 cursor-pointer shrink-0 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === "ar" ? "إضافة" : "Ajouter"}</span>
                </button>
              </form>
            </Card>
          </div>

          {/* INTERACTIVE PINTEREST-STYLE MOODBOARD FEED FROM GHAYMA_RD */}
          <div className="space-y-6 pt-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                {lang === "ar"
                  ? "يوميات ومنشورات مجتمع غيمة (Pinterest Moodboard)"
                  : "Le Moodboard Pinterest & Posts de ghayma_rd"}
              </span>
              <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
                {lang === "ar"
                  ? "إشراقات وخواطر يومية لطيفة 🌸"
                  : "Inspirations Quotidiennes & Échanges ♡"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {challengePosts.map((post) => {
                const title =
                  lang === "ar"
                    ? post.titleAr || post.titleFr
                    : lang === "fr"
                    ? post.titleFr
                    : post.titleEn || post.titleFr;

                const content =
                  lang === "ar"
                    ? post.contentAr || post.contentFr
                    : lang === "fr"
                    ? post.contentFr
                    : post.contentEn || post.contentFr;

                return (
                  <Card
                    key={post.id}
                    elevation={dark ? 4 : 2}
                    sx={{
                      borderRadius: "28px",
                      bgcolor: dark ? "#1a1121" : "#ffffff",
                      overflow: "hidden"
                    }}
                    className="border border-rose-500/20 hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Post Image */}
                    {post.imageUrl && (
                      <div className="relative h-52 overflow-hidden bg-rose-500/10">
                        <img
                          src={post.imageUrl}
                          alt={title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        {post.sticker && (
                          <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-xl shadow-md">
                            {post.sticker}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-rose-300/70">
                          <span className="font-bold text-rose-500">
                            {post.authorName || "ghayma_rd (R.Dahmane)"}
                          </span>
                          <span>{post.date}</span>
                        </div>

                        <h4 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-rose-50 leading-snug">
                          {title}
                        </h4>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed">
                          {content}
                        </p>
                      </div>

                      {/* Reactions Bar */}
                      <div className="pt-3 border-t border-rose-500/15 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              reactToChallengePost(post.id, "like");
                              addToast("Mention J'aime enregistrée ♡");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5 fill-rose-500" />
                            <span>{post.likesCount || 0}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              reactToChallengePost(post.id, "spark");
                              addToast("Étincelle de motivation envoyée ✨");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
                            <span>{post.sparksCount || 0}</span>
                          </button>
                        </div>

                        <span className="text-[10px] text-slate-400 dark:text-rose-300/60 font-semibold">
                          #ghayma_challenge
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
