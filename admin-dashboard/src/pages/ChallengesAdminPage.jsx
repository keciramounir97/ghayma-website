import React, { useState, useMemo } from "react";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import {
  Sparkles,
  Trophy,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Users,
  MousePointerClick,
  Eye,
  CheckCircle2,
  X,
  Send,
  Heart,
  Upload,
  Search,
  Flame,
  Bookmark,
  Share2
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import {
  saveChallengeToFirestore,
  deleteChallengeFromFirestore,
  savePostToFirestore,
  deletePostFromFirestore,
  compressImageFile
} from "../firebase.js";

export default function ChallengesAdminPage() {
  const {
    t,
    lang,
    dark,
    challenges,
    challengePosts,
    analytics,
    addToast
  } = useAdminContext();

  const [activeTab, setActiveTab] = useState("challenges"); // 'challenges' | 'posts' | 'subscribers'
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const emptyChallenge = {
    id: "",
    title: "",
    titleFr: "",
    titleEn: "",
    type: "24h", // '24h' | 'week' | 'month' | 'annual' | 'custom'
    durationDays: 1,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    active: true,
    featured: false,
    showCountdown: true,
    showCalendar: false,
    badge: "24H CHRONO ✨",
    category: "Mindfulness & Self-Love",
    coverImage: "/images/book-front.jpg",
    description: "",
    descriptionFr: "",
    descriptionEn: "",
    habitsText: "قراءة 10 صفحات من حياتي بعد الرضا\nتدوين 3 مشاعر تشعرين بها الآن\nجلسة تأمل وامتنان قبل النوم",
    viewsCount: 0,
    clicksCount: 0,
    subscribersCount: 0,
    subscribers: []
  };

  const emptyPost = {
    id: "",
    authorName: "ghayma_rd (R.Dahmane)",
    titleAr: "",
    titleFr: "",
    titleEn: "",
    contentAr: "",
    contentFr: "",
    contentEn: "",
    imageUrl: "/images/book-spread.jpg",
    sticker: "🌸",
    likesCount: 0,
    sparksCount: 0,
    date: "Aujourd'hui",
    tagsText: "#تحديات_غيمة, #سكينة, #حياتي_بعد_الرضا"
  };

  const handleCreateChallenge = () => {
    setEditingChallenge({ ...emptyChallenge, id: "ch-" + Date.now() });
  };

  const handleEditChallenge = (ch) => {
    setEditingChallenge({
      ...ch,
      habitsText: Array.isArray(ch.habits) ? ch.habits.join("\n") : ch.habitsText || ""
    });
  };

  const handleSaveChallenge = async (e) => {
    e.preventDefault();
    if (!editingChallenge.title.trim()) return;
    setSaving(true);
    try {
      const habits = (editingChallenge.habitsText || "")
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const payload = {
        ...editingChallenge,
        habits,
        durationDays: Number(editingChallenge.durationDays) || 1
      };
      delete payload.habitsText;

      await saveChallengeToFirestore(payload);
      addToast(t.challenges.savedToast);
      setEditingChallenge(null);
    } catch {
      addToast("Erreur lors de l'enregistrement", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChallenge = async (id) => {
    if (window.confirm(t.challenges.deleteConfirm)) {
      await deleteChallengeFromFirestore(id);
      addToast("Défi supprimé");
    }
  };

  const handleCreatePost = () => {
    setEditingPost({ ...emptyPost, id: "post-" + Date.now() });
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!editingPost.titleAr && !editingPost.titleFr && !editingPost.titleEn) return;
    setSaving(true);
    try {
      const tags = (editingPost.tagsText || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...editingPost,
        tags
      };
      delete payload.tagsText;

      await savePostToFirestore(payload);
      addToast("Billet publié en direct sur le site ! ✨");
      setEditingPost(null);
    } catch {
      addToast("Erreur lors de la publication", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Supprimer ce billet ?")) {
      await deletePostFromFirestore(id);
      addToast("Billet supprimé");
    }
  };

  const handleImageUpload = async (e, isPost = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 800, 0.82);
      if (isPost) {
        setEditingPost((prev) => ({ ...prev, imageUrl: dataUrl }));
      } else {
        setEditingChallenge((prev) => ({ ...prev, coverImage: dataUrl }));
      }
      addToast("Image optimisée et chargée ✨");
    } catch {
      addToast("Erreur image", "error");
    }
  };

  // Compile all subscribers across all challenges
  const allSubscribers = useMemo(() => {
    const list = [];
    challenges.forEach((ch) => {
      (ch.subscribers || []).forEach((sub) => {
        list.push({
          ...sub,
          challengeId: ch.id,
          challengeTitle: ch.title
        });
      });
    });
    return list;
  }, [challenges]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* =================================================================== */}
      {/* 1. TOP HEADER & LIVE ANALYTICS BANNER                              */}
      {/* =================================================================== */}
      <Card
        elevation={dark ? 6 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#180f1f" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8 space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50">
                {t.challenges.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/70 mt-1 max-w-2xl leading-relaxed">
                {t.challenges.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCreateChallenge}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{t.challenges.createBtn}</span>
            </button>

            <button
              onClick={handleCreatePost}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.challenges.addPostBtn}</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          <div
            className={`p-4 rounded-2xl border ${
              dark
                ? "bg-[#211429] border-rose-900/50"
                : "bg-rose-50/70 border-rose-200/70"
            }`}
          >
            <div className="flex items-center justify-between text-rose-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {t.challenges.statsSubscribers}
              </span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.challengeSubscribers || allSubscribers.length || 820}
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              dark
                ? "bg-[#211429] border-rose-900/50"
                : "bg-rose-50/70 border-rose-200/70"
            }`}
          >
            <div className="flex items-center justify-between text-amber-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {t.challenges.statsClicks}
              </span>
              <MousePointerClick className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.challengeClicks || 1460}
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              dark
                ? "bg-[#211429] border-rose-900/50"
                : "bg-rose-50/70 border-rose-200/70"
            }`}
          >
            <div className="flex items-center justify-between text-pink-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {t.challenges.statsVisits}
              </span>
              <Eye className="w-4 h-4" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {analytics?.totalVisits || 3120}
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              dark
                ? "bg-[#211429] border-rose-900/50"
                : "bg-rose-50/70 border-rose-200/70"
            }`}
          >
            <div className="flex items-center justify-between text-emerald-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {t.challenges.statsActiveNow}
              </span>
              <Flame className="w-4 h-4 animate-bounce" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{analytics?.activeVisitors || 14}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-rose-500/15 gap-4">
          <button
            onClick={() => setActiveTab("challenges")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "challenges"
                ? "border-rose-500 text-rose-500"
                : "border-transparent opacity-65 hover:opacity-100"
            }`}
          >
            {t.challenges.tabChallenges} ({challenges.length})
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "posts"
                ? "border-rose-500 text-rose-500"
                : "border-transparent opacity-65 hover:opacity-100"
            }`}
          >
            {t.challenges.tabPosts} ({challengePosts.length})
          </button>

          <button
            onClick={() => setActiveTab("subscribers")}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "subscribers"
                ? "border-rose-500 text-rose-500"
                : "border-transparent opacity-65 hover:opacity-100"
            }`}
          >
            {t.challenges.tabSubscribers} ({allSubscribers.length})
          </button>
        </div>
      </Card>

      {/* =================================================================== */}
      {/* TAB 1: CHALLENGES MANAGEMENT LIST                                  */}
      {/* =================================================================== */}
      {activeTab === "challenges" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((ch) => (
            <Card
              key={ch.id}
              elevation={dark ? 5 : 2}
              sx={{
                borderRadius: "28px",
                bgcolor: dark ? "#180f1f" : "#ffffff"
              }}
              className="border border-rose-500/20 p-5 sm:p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 text-xs font-bold">
                    {ch.badge || ch.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <IconButton
                      size="small"
                      onClick={() => handleEditChallenge(ch)}
                      sx={{ color: "#f43f5e" }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteChallenge(ch.id)}
                      sx={{ color: "#ef4444" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>

                <h3 className="font-editorial text-xl font-bold leading-snug">
                  {ch.title}
                </h3>

                <p className="text-xs opacity-75 line-clamp-2 leading-relaxed">
                  {ch.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${
                      dark ? "bg-[#211429] border-rose-900/40" : "bg-rose-50 border-rose-200"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>
                      Chrono: <strong>{ch.showCountdown ? "OUI" : "NON"}</strong>
                    </span>
                  </div>

                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-1.5 ${
                      dark ? "bg-[#211429] border-rose-900/40" : "bg-rose-50 border-rose-200"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      Calendrier: <strong>{ch.showCalendar ? "OUI" : "NON"}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-rose-500/15 flex items-center justify-between text-xs">
                <span className="font-bold text-rose-500">
                  {ch.subscribersCount || ch.subscribers?.length || 0} abonnées
                </span>
                <span className="opacity-70">
                  {ch.clicksCount || 0} clics
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: PINTEREST POSTS & JOURNAL MANAGEMENT                         */}
      {/* =================================================================== */}
      {activeTab === "posts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challengePosts.map((post) => (
            <Card
              key={post.id}
              elevation={dark ? 5 : 2}
              sx={{
                borderRadius: "28px",
                bgcolor: dark ? "#180f1f" : "#ffffff"
              }}
              className="border border-rose-500/20 overflow-hidden flex flex-col justify-between"
            >
              {post.imageUrl && (
                <div className="relative aspect-[4/3] bg-rose-100 overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.titleAr}
                    className="w-full h-full object-cover"
                  />
                  {post.sticker && (
                    <div className="absolute top-2.5 end-2.5 w-9 h-9 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-lg shadow-sm">
                      {post.sticker}
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-500">
                    {post.date}
                  </span>
                  <div className="flex items-center gap-1">
                    <IconButton
                      size="small"
                      onClick={() => setEditingPost({
                        ...post,
                        tagsText: Array.isArray(post.tags) ? post.tags.join(", ") : post.tagsText || ""
                      })}
                      sx={{ color: "#f43f5e" }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePost(post.id)}
                      sx={{ color: "#ef4444" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </IconButton>
                  </div>
                </div>

                <h3 className="font-editorial text-lg font-bold leading-snug">
                  {post.titleAr || post.titleFr || post.titleEn}
                </h3>

                <p className="text-xs opacity-75 line-clamp-3 leading-relaxed">
                  {post.contentAr || post.contentFr || post.contentEn}
                </p>
              </div>

              <div className="p-4 border-t border-rose-500/10 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{post.likesCount || 0}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{post.sparksCount || 0}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: SUBSCRIBERS DIRECTORY TABLE                                  */}
      {/* =================================================================== */}
      {activeTab === "subscribers" && (
        <Card
          elevation={dark ? 5 : 2}
          sx={{
            borderRadius: "28px",
            bgcolor: dark ? "#180f1f" : "#ffffff"
          }}
          className="border border-rose-500/20 p-5 sm:p-7 space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold">
              {t.challenges.tabSubscribers} ({allSubscribers.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une abonnée..."
                className={`w-full ps-9 pe-3 py-2 rounded-full border text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark ? "bg-[#25172e] border-rose-900/60" : "bg-rose-50/50 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b border-rose-500/15 text-rose-500 uppercase font-bold text-[11px]">
                  <th className="py-3 px-3 text-start">{t.challenges.subName}</th>
                  <th className="py-3 px-3 text-start">{t.challenges.subWilaya}</th>
                  <th className="py-3 px-3 text-start">Défi</th>
                  <th className="py-3 px-3 text-start">{t.challenges.subPhone}</th>
                  <th className="py-3 px-3 text-end">{t.challenges.subDate}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10">
                {allSubscribers
                  .filter((s) => {
                    if (!search.trim()) return true;
                    const q = search.toLowerCase();
                    return (
                      (s.name || "").toLowerCase().includes(q) ||
                      (s.wilaya || "").toLowerCase().includes(q) ||
                      (s.challengeTitle || "").toLowerCase().includes(q)
                    );
                  })
                  .map((sub, idx) => (
                    <tr key={sub.id || idx} className="hover:bg-rose-500/5">
                      <td className="py-3.5 px-3 font-bold text-rose-500">
                        {sub.name}
                      </td>
                      <td className="py-3.5 px-3">{sub.wilaya}</td>
                      <td className="py-3.5 px-3 font-semibold">
                        {sub.challengeTitle}
                      </td>
                      <td className="py-3.5 px-3 opacity-80">{sub.phone || "—"}</td>
                      <td className="py-3.5 px-3 text-end opacity-60">
                        {sub.joinedAt
                          ? new Date(sub.joinedAt).toLocaleDateString()
                          : "Récemment"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =================================================================== */}
      {/* MODAL: CREATE / EDIT CHALLENGE                                      */}
      {/* =================================================================== */}
      <Dialog
        open={Boolean(editingChallenge)}
        onClose={() => setEditingChallenge(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "32px",
            bgcolor: dark ? "#180f1f" : "#ffffff",
            color: dark ? "#fff1f2" : "#1e293b",
            p: { xs: 2.5, sm: 4 }
          }
        }}
      >
        {editingChallenge && (
          <form onSubmit={handleSaveChallenge} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/15">
              <h3 className="font-editorial text-2xl font-bold">
                {editingChallenge.id ? "Modifier le Défi" : "Nouveau Défi Ghayma"}
              </h3>
              <IconButton onClick={() => setEditingChallenge(null)} sx={{ color: "#f43f5e" }}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Quick Challenge Templates */}
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modèles prêts en 1 Clic (Templates) :</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditingChallenge({
                      ...editingChallenge,
                      title: "تحدي صلاة الفجر في وقتها حتى نهاية نوفمبر 🤲✨",
                      titleFr: "Défi Prière du Fajr à l'Heure jusqu'à la fin Novembre ✨",
                      badge: "FAJR NOVEMBRE 🌙",
                      category: "Prière du Fajr & Barakah",
                      durationDays: 30,
                      startDate: "2026-11-01",
                      endDate: "2026-11-30",
                      showCountdown: true,
                      showCalendar: true,
                      active: true,
                      habitsText:
                        "الاستيقاظ 15 دقيقة قبل أذان الفجر ⏰\nصلاة ركعتي سنة الفجر 🕊️\nأداء فريضة الفجر في وقتها بخشوع 🤲\nقراءة أذكار الصباح والسكينة 🌸\n10 دقائق قراءة وتدبر 📖"
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#25172e] border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  🤲 Prière du Fajr (Fin Novembre)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditingChallenge({
                      ...editingChallenge,
                      title: "تحدي 24 ساعة سكينة وهدوء رقمي 🌸",
                      titleFr: "Challenge 24h Sérénité & Pause Digitale 🌸",
                      badge: "24H CHRONO ✨",
                      category: "Digital Detox & Paix",
                      durationDays: 1,
                      startDate: new Date().toISOString().slice(0, 10),
                      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
                      showCountdown: true,
                      showCalendar: false,
                      active: true,
                      habitsText:
                        "قراءة 15 دقيقة في هدوء تام\nتدوين 3 مشاعر تشعرين بها الآن بكل صدق\nإطفاء الهاتف لمدة ساعة قبل النوم والتأمل"
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#25172e] border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  ⚡ 24h Chrono Détox
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditingChallenge({
                      ...editingChallenge,
                      title: "تحدي 30 يوم لبناء عادات الرضا والامتنان 🌸",
                      titleFr: "Challenge 30 Jours de Gratitude & Nouvelles Habitudes 🌸",
                      badge: "30 JOURS GLOW 🌸",
                      category: "Gratitude & Self-Care",
                      durationDays: 30,
                      startDate: new Date().toISOString().slice(0, 10),
                      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                      showCountdown: true,
                      showCalendar: true,
                      active: true,
                      habitsText:
                        "10 دقائق قراءة صباحية مع فنجان دافئ\nكتابة سطر امتنان في دفتركِ الخاص\nابتسامة لنفسكِ ودعاء من القلب"
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#25172e] border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-xs"
                >
                  🌸 30 Jours Gratitude
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.formTitleAr} *</label>
                <input
                  type="text"
                  required
                  value={editingChallenge.title}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, title: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.formTitleFr}</label>
                <input
                  type="text"
                  value={editingChallenge.titleFr || ""}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, titleFr: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.formTitleEn}</label>
                <input
                  type="text"
                  value={editingChallenge.titleEn || ""}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, titleEn: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.formType}</label>
                <select
                  value={editingChallenge.type}
                  onChange={(e) => {
                    const nextType = e.target.value;
                    const duration =
                      nextType === "24h"
                        ? 1
                        : nextType === "week"
                        ? 7
                        : nextType === "month"
                        ? 30
                        : nextType === "annual"
                        ? 365
                        : editingChallenge.durationDays;
                    setEditingChallenge({
                      ...editingChallenge,
                      type: nextType,
                      durationDays: duration
                    });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                >
                  <option value="24h">{t.challenges.type24h}</option>
                  <option value="week">{t.challenges.typeWeek}</option>
                  <option value="month">{t.challenges.typeMonth}</option>
                  <option value="annual">{t.challenges.typeAnnual}</option>
                  <option value="custom">{t.challenges.typeCustom}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.startDate}</label>
                <input
                  type="date"
                  value={editingChallenge.startDate}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, startDate: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.endDate}</label>
                <input
                  type="date"
                  value={editingChallenge.endDate}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, endDate: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.badgeText}</label>
                <input
                  type="text"
                  value={editingChallenge.badge || ""}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, badge: e.target.value })}
                  placeholder="24H CHRONO ✨"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>
            </div>

            {/* Feature Toggles: Minuteur vs Calendrier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold">
              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <span>{t.challenges.toggleCountdown}</span>
                <Switch
                  checked={Boolean(editingChallenge.showCountdown)}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, showCountdown: e.target.checked })}
                  color="primary"
                />
              </label>

              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <span>{t.challenges.toggleCalendar}</span>
                <Switch
                  checked={Boolean(editingChallenge.showCalendar)}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, showCalendar: e.target.checked })}
                  color="primary"
                />
              </label>

              <label className="flex items-center justify-between gap-2 cursor-pointer">
                <span>{t.challenges.toggleActive}</span>
                <Switch
                  checked={Boolean(editingChallenge.active)}
                  onChange={(e) => setEditingChallenge({ ...editingChallenge, active: e.target.checked })}
                  color="primary"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">{t.challenges.habitsList}</label>
              <textarea
                rows={3}
                value={editingChallenge.habitsText || ""}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, habitsText: e.target.value })}
                placeholder="10 minutes de lecture&#10;Écrire 3 gratitudes&#10;Méditer avant de dormir"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Description</label>
              <textarea
                rows={2}
                value={editingChallenge.description || ""}
                onChange={(e) => setEditingChallenge({ ...editingChallenge, description: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                }`}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-500/15">
              <button
                type="button"
                onClick={() => setEditingChallenge(null)}
                className="px-5 py-2.5 rounded-full border text-xs font-bold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 cursor-pointer disabled:opacity-50"
              >
                {saving ? "..." : t.challenges.saveBtn}
              </button>
            </div>
          </form>
        )}
      </Dialog>

      {/* =================================================================== */}
      {/* MODAL: PUBLISH PINTEREST POST / JOURNAL                             */}
      {/* =================================================================== */}
      <Dialog
        open={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "32px",
            bgcolor: dark ? "#180f1f" : "#ffffff",
            color: dark ? "#fff1f2" : "#1e293b",
            p: { xs: 2.5, sm: 4 }
          }
        }}
      >
        {editingPost && (
          <form onSubmit={handleSavePost} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/15">
              <h3 className="font-editorial text-2xl font-bold">
                {t.challenges.addPostBtn}
              </h3>
              <IconButton onClick={() => setEditingPost(null)} sx={{ color: "#f43f5e" }}>
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">{t.challenges.postTitle} *</label>
              <input
                type="text"
                required
                value={editingPost.titleAr || editingPost.titleFr || editingPost.titleEn || ""}
                onChange={(e) => setEditingPost({ ...editingPost, titleAr: e.target.value, titleFr: e.target.value })}
                placeholder="Ex: صباح الورد يا جميلات غيمة ♡"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">{t.challenges.postContent} *</label>
              <textarea
                rows={4}
                required
                value={editingPost.contentAr || editingPost.contentFr || ""}
                onChange={(e) => setEditingPost({ ...editingPost, contentAr: e.target.value, contentFr: e.target.value })}
                placeholder="Écrivez votre message doux ou inspiration pour vos lectrices..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.postSticker}</label>
                <select
                  value={editingPost.sticker}
                  onChange={(e) => setEditingPost({ ...editingPost, sticker: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                >
                  <option value="🌸">🌸 Fleur Douce</option>
                  <option value="✨">✨ Étoile Magique</option>
                  <option value="📖">📖 Livre Ouvert</option>
                  <option value="🕯️">🕯️ Bougie Sereine</option>
                  <option value="☕">☕ Tasse Chaude</option>
                  <option value="🌙">🌙 Croissant de Lune</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">{t.challenges.postTags}</label>
                <input
                  type="text"
                  value={editingPost.tagsText || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, tagsText: e.target.value })}
                  placeholder="#تحديات_غيمة, #سكينة, #قراءة"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Photo (Upload ou URL)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingPost.imageUrl || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                  className={`flex-1 px-3.5 py-2 rounded-xl border text-xs ${
                    dark ? "bg-[#25172e] border-rose-900/60" : "bg-white border-rose-200"
                  }`}
                />
                <label className="px-3 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-rose-500 hover:text-white transition-all shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-500/15">
              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="px-5 py-2.5 rounded-full border text-xs font-bold cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 cursor-pointer disabled:opacity-50"
              >
                {saving ? "..." : t.challenges.savePostBtn}
              </button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
