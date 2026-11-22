import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  Sparkles,
  Truck,
  Instagram,
  Sun,
  Moon,
  Bell,
  ShoppingBag,
  Menu,
  X,
  Home as HomeIcon,
  BookOpen,
  Feather,
  Mail,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Globe,
  User,
  LogOut,
  Settings,
  Shield,
  Trash2,
  AlertTriangle,
  Heart
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { deleteUserAccountAndData } from "../firebase.js";
import GhaymaLogo from "./GhaymaLogo.jsx";

export default function Navbar() {
  const {
    lang,
    setLang,
    dark,
    setDark,
    t,
    books,
    about,
    footerContent,
    drawerOpen,
    setDrawerOpen,
    notifOpen,
    setNotifOpen,
    notifications,
    markAllNotificationsRead,
    clearNotifications,
    currentUser,
    setAuthModalOpen,
    logoutUser,
    addToast
  } = useAppContext();

  const location = useLocation();
  const unreadCount = notifications.filter((n) => n.unread).length;
  const isRtl = lang === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const [discoverDropdownOpen, setDiscoverDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const discoverRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (discoverRef.current && !discoverRef.current.contains(event.target)) {
        setDiscoverDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    setDeletingAccount(true);
    try {
      await deleteUserAccountAndData(currentUser.id || currentUser.email);
      logoutUser();
      setDeleteConfirmOpen(false);
      setUserDropdownOpen(false);
      addToast(
        lang === "ar"
          ? "تم مسح حسابكِ وبياناتكِ نهائياً بنجاح 🌸"
          : "Votre compte et vos données ont été définitivement supprimés 🌸"
      );
    } catch (_) {
      addToast("Erreur lors de la suppression du compte");
    } finally {
      setDeletingAccount(false);
    }
  };

  const navLinks = [
    { to: "/", label: t.nav.home, icon: HomeIcon },
    { to: "/books", label: t.nav.books, icon: BookOpen },
    {
      to: "/articles",
      label: lang === "ar" ? "المقالات والخواطر" : "Articles",
      icon: Feather
    },
    { to: "/challenges", label: t.nav.challenges, icon: Sparkles },
    { to: "/about", label: t.nav.about, icon: Feather },
    { to: "/contact", label: t.nav.contact, icon: Mail }
  ];

  const discoverMenuItems = [
    {
      to: "/challenges",
      label: lang === "ar" ? "التحديات 🌸" : "Défis 🌸",
      desc: lang === "ar" ? "تحدي الفجر، روتين يومي ومجتمع غيمة" : "Routine spirituelle, calendrier & communauté"
    },
    {
      to: "/articles",
      label: lang === "ar" ? "المقالات 🪶" : "Articles 🪶",
      desc: lang === "ar" ? "خواطر وتأملات وجدانية دافئة" : "Écrits et pensées littéraires"
    },
    {
      to: "/delivery",
      label: lang === "ar" ? "التوصيل 🚚" : "Livraison 🚚",
      desc: lang === "ar" ? "أسعار التوصيل لـ 69 ولاية جزائرية" : "Tarifs à domicile et agence (69 Wilayas)"
    },
    {
      to: "/about",
      label: lang === "ar" ? "عن الكاتبة 🌸" : "À propos 🌸",
      desc: lang === "ar" ? "سيرة ghayma_rd ومسيرتها الأدبية" : "Biographie et parcours de l'auteure"
    }
  ];

  const handleLanguageSwitch = (code) => {
    setLang(code);
    addToast(
      code === "ar"
        ? "تم تغيير اللغة إلى العربية 🌸"
        : code === "fr"
        ? "Langue changée en Français 🌸"
        : "Language switched to English 🌸"
    );
  };

  const handleThemeToggle = () => {
    setDark((d) => !d);
    addToast(
      !dark
        ? lang === "ar"
          ? "تم تفعيل الوضع الليلي ✨"
          : "Mode sombre activé ✨"
        : lang === "ar"
        ? "تم تفعيل الوضع النهاري 🌸"
        : "Mode clair activé 🌸"
    );
  };

  const ribbonText =
    lang === "ar"
      ? footerContent?.ribbonTextAr || "توصيل لجميع 69 ولاية جزائرية"
      : lang === "fr"
      ? footerContent?.ribbonTextFr || "Livraison 69 Wilayas d'Algérie"
      : footerContent?.ribbonTextEn || "Delivery across all 69 Wilayas of Algeria";

  const logoSub =
    lang === "ar"
      ? footerContent?.brandSubAr
      : lang === "fr"
      ? footerContent?.brandSubFr
      : footerContent?.brandSubEn;

  return (
    <>
      {/* Top Announcement Ribbon */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-[11px] sm:text-xs py-2 px-3 sm:px-6 text-center font-medium shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{ribbonText}</span>
          </span>
          <span className="hidden sm:inline opacity-60">•</span>
          <a
            href={about.instagramUrl || "https://www.instagram.com/ghayma_rd/"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-2 font-bold hover:opacity-90"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>{about.instagramHandle || "@ghayma_rd"}</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
          dark
            ? "bg-[#160e1b]/95 border-rose-950/70 shadow-lg shadow-black/20"
            : "bg-white/95 border-rose-100 shadow-sm shadow-rose-500/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile Hamburger Button + Fixed Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <IconButton
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:!hidden"
              sx={{
                color: dark ? "#fecdd3" : "#e11d48",
                bgcolor: dark ? "rgba(244,63,94,0.14)" : "rgba(244,63,94,0.09)",
                border: dark
                  ? "1px solid rgba(244,63,94,0.3)"
                  : "1px solid rgba(244,63,94,0.2)",
                borderRadius: "14px",
                width: 40,
                height: 40,
                flexShrink: 0
              }}
            >
              <Menu className="w-5 h-5" />
            </IconButton>

            <GhaymaLogo dark={dark} subtitle={logoSub} />
          </div>

          {/* Center: Desktop Navigation with Dropdown to Save Space */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                location.pathname === "/"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : dark
                  ? "text-rose-100/80 hover:text-white hover:bg-rose-950/50"
                  : "text-slate-700 hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" />
              <span>{t.nav.home}</span>
            </Link>

            <Link
              to="/books"
              className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                location.pathname.startsWith("/book")
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : dark
                  ? "text-rose-100/80 hover:text-white hover:bg-rose-950/50"
                  : "text-slate-700 hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.nav.books}</span>
            </Link>

            {/* DÉCOUVRIR DROPDOWN (Défis, Articles, Livraison, À propos) */}
            <div className="relative" ref={discoverRef}>
              <button
                type="button"
                onClick={() => setDiscoverDropdownOpen(!discoverDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all cursor-pointer ${
                  location.pathname === "/articles" ||
                  location.pathname === "/challenges" ||
                  location.pathname === "/about" ||
                  location.pathname === "/delivery"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                    : dark
                    ? "text-rose-100/80 hover:text-white hover:bg-rose-950/50"
                    : "text-slate-700 hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === "ar" ? "استكشفي" : "Découvrir"}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${
                    discoverDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {discoverDropdownOpen && (
                <div
                  className={`absolute ${
                    isRtl ? "right-0" : "left-0"
                  } mt-2 w-72 rounded-3xl shadow-2xl border p-3 z-50 backdrop-blur-xl animate-fade-in ${
                    dark
                      ? "bg-[#1d1224]/95 border-rose-900/60 text-rose-50"
                      : "bg-white/95 border-rose-100 text-slate-800"
                  }`}
                >
                  <div className="space-y-1">
                    {discoverMenuItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setDiscoverDropdownOpen(false)}
                        className={`block p-3 rounded-2xl transition-all ${
                          location.pathname === item.to
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold"
                            : dark
                            ? "hover:bg-rose-950/50 text-rose-100/90"
                            : "hover:bg-rose-50 text-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-rose-300/70 mt-0.5">
                          {item.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold transition-all ${
                location.pathname === "/contact"
                  ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                  : dark
                  ? "text-rose-100/80 hover:text-white hover:bg-rose-950/50"
                  : "text-slate-700 hover:text-rose-600 hover:bg-rose-50"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{t.nav.contact}</span>
            </Link>
          </nav>

          {/* Right Controls: Unified User Command Center Dropdown + Order CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* UNIFIED USER COMMAND CENTER DROPDOWN (Logged in & Guests) */}
            <div className="relative" ref={userDropdownRef}>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    if (!userDropdownOpen) markAllNotificationsRead();
                  }}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer shrink-0"
                  aria-label="Espace Membre"
                >
                  <span className="relative w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {currentUser.avatar || "🌸"}
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1d1224]" />
                    )}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-rose-100 hidden md:inline max-w-[80px] xl:max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-rose-500 transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    if (!userDropdownOpen) markAllNotificationsRead();
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 transition-all cursor-pointer shrink-0 shadow-xs"
                  aria-label="Mon Espace"
                >
                  <span className="relative flex items-center justify-center">
                    <User className="w-4 h-4 text-rose-500" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#1d1224]" />
                    )}
                  </span>
                  <span className="text-xs font-bold hidden sm:inline">
                    {lang === "ar" ? "حسابي 🌸" : "Mon Espace 🌸"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-rose-500 transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* Rich User Account & Command Hub Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className={`absolute ${
                    isRtl ? "left-0" : "right-0"
                  } mt-3 w-80 sm:w-96 rounded-3xl shadow-2xl border p-4 z-50 backdrop-blur-xl animate-fade-in ${
                    dark
                      ? "bg-[#1d1224]/98 border-rose-900/60 text-rose-50"
                      : "bg-white/98 border-rose-100 text-slate-800"
                  }`}
                >
                  {/* 1. Member Profile or Guest Welcome Card */}
                  {currentUser ? (
                    <div className="flex items-center gap-3 pb-3 mb-3 border-b border-rose-500/15">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                        {currentUser.avatar || "🌸"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-rose-300/70 truncate">
                          {currentUser.email || "Membre Ghayma"}
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-0.5">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>{lang === "ar" ? "قارئة غيمة الوفية ♡" : "Lectrice Ghayma ♡"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pb-3 mb-3 border-b border-rose-500/15 space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center text-xl shadow-md shrink-0">
                          🌸
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white">
                            {lang === "ar" ? "أهلاً بكِ في غيمة ✨" : "Bienvenue chez Ghayma ✨"}
                          </div>
                          <div className="text-[10px] text-rose-500 font-semibold">
                            {lang === "ar" ? "خصم 5% للأعضاء المسجلين 🎁" : "-5% de remise pour les membres 🎁"}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setAuthModalOpen(true);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "تسجيل الدخول / إنشاء حساب 🌸" : "Connexion / Inscription 🌸"}</span>
                      </button>
                    </div>
                  )}

                  {/* 2. Quick Command Bar: Shop Icon + Theme Icon + Language Switcher */}
                  <div
                    className={`p-2.5 rounded-2xl border mb-3 flex items-center justify-between gap-2 ${
                      dark ? "bg-[#25172e] border-rose-900/50" : "bg-rose-50/70 border-rose-200/60"
                    }`}
                  >
                    {/* Shop Shortcut */}
                    <Link
                      to="/books"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-500/15 transition-all cursor-pointer"
                      title={lang === "ar" ? "المتجر والكتب" : "Boutique & Livres"}
                    >
                      <ShoppingBag className="w-4 h-4 text-rose-500" />
                      <span className="text-[11px]">{lang === "ar" ? "المتجر" : "Boutique"}</span>
                    </Link>

                    <div className="h-5 w-px bg-rose-500/20" />

                    {/* Theme Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setDark((prev) => !prev)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-rose-200 hover:bg-rose-500/15 transition-all cursor-pointer"
                      title={lang === "ar" ? "تبديل المظهر" : "Changer de thème"}
                    >
                      {dark ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-indigo-500" />
                      )}
                      <span className="text-[11px]">
                        {dark ? (lang === "ar" ? "نهاري" : "Clair") : (lang === "ar" ? "ليلي" : "Sombre")}
                      </span>
                    </button>

                    <div className="h-5 w-px bg-rose-500/20" />

                    {/* Language Switcher Buttons */}
                    <div className="flex items-center gap-1">
                      {["ar", "fr", "en"].map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleLanguageSwitch(code)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                            lang === code
                              ? "bg-rose-500 text-white shadow-xs"
                              : dark
                              ? "text-rose-200/70 hover:text-white"
                              : "text-slate-600 hover:text-rose-600"
                          }`}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Integrated Notification Center */}
                  <div
                    className={`p-3 rounded-2xl border mb-3 space-y-2 ${
                      dark ? "bg-[#25172e]/60 border-rose-900/50" : "bg-white border-rose-200/70"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-rose-500/15">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-rose-100">
                        <Bell className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.notifications.title}</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[9px] font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={clearNotifications}
                          className="text-[10px] font-semibold text-rose-500 hover:underline cursor-pointer"
                        >
                          {t.notifications.clearAll}
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-[11px] text-center py-2.5 opacity-60">
                        {t.notifications.empty}
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2 rounded-xl text-[11px] leading-relaxed transition-all ${
                              dark ? "bg-[#1c1223] text-rose-100" : "bg-rose-50/70 text-slate-800"
                            }`}
                          >
                            <p className="font-medium">
                              {lang === "ar" ? n.textAr : lang === "fr" ? n.textFr : n.textEn}
                            </p>
                            <span className="text-[9px] opacity-60 mt-0.5 block">
                              {n.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Quick Navigation Links */}
                  <div className="space-y-1 text-xs">
                    <Link
                      to="/challenges"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                        dark ? "hover:bg-rose-950/60" : "hover:bg-rose-50"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{lang === "ar" ? "تحدياتي وروتيني اليومي" : "Mes Défis & Routines"}</span>
                    </Link>

                    <Link
                      to="/articles"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                        dark ? "hover:bg-rose-950/60" : "hover:bg-rose-50"
                      }`}
                    >
                      <Feather className="w-3.5 h-3.5 text-rose-500" />
                      <span>{lang === "ar" ? "المقالات والخواطر" : "Articles & Réflexions"}</span>
                    </Link>

                    <Link
                      to="/delivery"
                      onClick={() => setUserDropdownOpen(false)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                        dark ? "hover:bg-rose-950/60" : "hover:bg-rose-50"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{lang === "ar" ? "أسعار وتوصيل 69 ولاية" : "Livraison 69 Wilayas"}</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (window.__openGhaymaCookieSettings) {
                          window.__openGhaymaCookieSettings();
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-start cursor-pointer ${
                        dark ? "hover:bg-rose-950/60" : "hover:bg-rose-50"
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === "ar" ? "إعدادات الخصوصية والكوكيز" : "Cookies & Confidentialité"}</span>
                    </button>

                    {currentUser && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setDeleteConfirmOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl transition-all text-start text-red-500 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "حذف حسابي وبياناتي (RGPD)" : "Supprimer mon compte (RGPD)"}</span>
                      </button>
                    )}
                  </div>

                  {/* 5. Logout Button (If logged in) */}
                  {currentUser && (
                    <div className="pt-2 mt-2 border-t border-rose-500/15">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logoutUser();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{lang === "ar" ? "تسجيل الخروج" : "Se déconnecter"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order CTA Button */}
            <Link
              to={`/book/${books[0]?.id || "hayati-baada-arrida"}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/25 transition-all shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">{t.nav.orderNow}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ACCOUNT DELETION CONFIRMATION DIALOG (GDPR / PRIVACY - PROMPT ONE #20 & PROMPT AUDIT) */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => !deletingAccount && setDeleteConfirmOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            bgcolor: dark ? "#1a1022" : "#ffffff",
            color: dark ? "#fff1f2" : "#0f172a",
            maxWidth: 420,
            p: 1
          }
        }}
      >
        <DialogTitle className="flex items-center gap-2 text-red-500 border-b border-rose-500/15 pb-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span className="font-editorial text-lg font-bold">
            {lang === "ar"
              ? "حذف الحساب والبيانات نهائياً (RGPD)"
              : "Suppression définitive du compte"}
          </span>
        </DialogTitle>
        <DialogContent className="pt-4 space-y-3 text-xs leading-relaxed">
          <p>
            {lang === "ar"
              ? "هل أنتِ متأكدة من رغبتكِ في مسح حسابكِ؟ سيتم مسح روتينكِ اليومي، وسجلاتكِ، وتعليقاتكِ نهائياً من قاعدة البيانات وفقاً للائحة حماية البيانات الشخصية."
              : "Cette action est irréversible. Vos routines, votre participation aux défis et vos données seront supprimées de manière sécurisée conformément au RGPD."}
          </p>
        </DialogContent>
        <DialogActions className="border-t border-rose-500/15 p-3 flex justify-between">
          <button
            type="button"
            disabled={deletingAccount}
            onClick={() => setDeleteConfirmOpen(false)}
            className="px-4 py-2 rounded-full border border-slate-300 dark:border-rose-900/50 text-xs font-bold text-slate-700 dark:text-rose-200 hover:bg-slate-100 cursor-pointer"
          >
            {lang === "ar" ? "إلغاء" : "Annuler"}
          </button>
          <button
            type="button"
            disabled={deletingAccount}
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all disabled:opacity-50"
          >
            {deletingAccount
              ? lang === "ar"
                ? "جارٍ الحذف..."
                : "Suppression..."
              : lang === "ar"
              ? "نعم، حذف نهائي"
              : "Confirmer la suppression"}
          </button>
        </DialogActions>
      </Dialog>

      {/* ==================================================================== */}
      {/* RETRACTABLE HAMBURGER DRAWER (With Theme & Language Controls Inside) */}
      {/* ==================================================================== */}
      <Drawer
        anchor={isRtl ? "right" : "left"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "86vw", sm: 350 },
            maxWidth: 360,
            bgcolor: dark ? "#160e1d" : "#fffafb",
            color: dark ? "#fff1f2" : "#1e293b",
            borderRadius: isRtl ? "24px 0 0 24px" : "0 24px 24px 0",
            p: 0
          }
        }}
      >
        <div
          dir={t.dir}
          className="h-full flex flex-col justify-between p-5 overflow-y-auto"
        >
          <div className="space-y-5">
            {/* Drawer Header with Logo & Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-rose-500/15">
              <GhaymaLogo
                dark={dark}
                subtitle={logoSub}
                onClick={() => setDrawerOpen(false)}
              />
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: "#f43f5e", bgcolor: "rgba(244,63,94,0.1)" }}
              >
                <X className="w-5 h-5" />
              </IconButton>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const active =
                  item.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                      active
                        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                        : dark
                        ? "text-rose-100 hover:bg-rose-950/60"
                        : "text-slate-700 hover:bg-rose-100/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronIcon className="w-4 h-4 opacity-60" />
                  </Link>
                );
              })}
            </div>

            <Divider sx={{ borderColor: "rgba(244,63,94,0.15)" }} />

            {/* Mobile Member Profile / Login */}
            {currentUser ? (
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  dark ? "bg-[#21142b] border-rose-900/50" : "bg-white border-rose-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                    {currentUser.avatar || "🌸"}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-rose-50">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-rose-500 font-semibold">
                      {lang === "ar" ? "عضوة في مجتمع غيمة ✨" : "Membre Ghayma ✨"}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setDrawerOpen(false);
                  }}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-amber-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <User className="w-4 h-4 text-rose-500" />
                <span>
                  {lang === "ar"
                    ? "تسجيل الدخول / إنشاء حساب جديد 🌸"
                    : "Connexion / Créer un Compte 🌸"}
                </span>
              </button>
            )}

            {/* Dedicated Mobile Theme & Language Settings Box inside Hamburger Sidebar */}
            <div
              className={`p-4 rounded-2xl border space-y-4 ${
                dark
                  ? "bg-[#21142b] border-rose-900/50"
                  : "bg-rose-50/80 border-rose-200/70"
              }`}
            >
              {/* Language Switcher inside Drawer */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                  <Globe className="w-3.5 h-3.5" />
                  <span>
                    {lang === "ar"
                      ? "اللغة • Langue"
                      : lang === "fr"
                      ? "Langue du site"
                      : "Website Language"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: "ar", label: "العربية" },
                    { code: "fr", label: "Français" },
                    { code: "en", label: "English" }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleLanguageSwitch(item.code)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        lang === item.code
                          ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                          : dark
                          ? "bg-[#160d1d] text-rose-200/80 hover:text-white border border-rose-900/40"
                          : "bg-white text-slate-700 hover:text-rose-600 border border-rose-200/60"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Switcher Button inside Drawer */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                  {dark ? (
                    <Moon className="w-3.5 h-3.5" />
                  ) : (
                    <Sun className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {lang === "ar"
                      ? "مظهر الموقع • Thème"
                      : lang === "fr"
                      ? "Thème d'affichage"
                      : "Appearance Theme"}
                  </span>
                </div>
                <button
                  onClick={handleThemeToggle}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    dark
                      ? "bg-[#160d1d] border-rose-800/60 text-amber-300"
                      : "bg-white border-rose-200 text-slate-700 shadow-sm"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {dark ? (
                      <>
                        <Moon className="w-4 h-4 text-amber-300" />
                        <span>
                          {lang === "ar"
                            ? "الوضع الليلي (Dark)"
                            : "Mode Sombre (Dark)"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-4 h-4 text-rose-500" />
                        <span>
                          {lang === "ar"
                            ? "الوضع النهاري (White)"
                            : "Mode Clair (White)"}
                        </span>
                      </>
                    )}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[10px]">
                    {lang === "ar" ? "تبديل" : "Changer"}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Order CTA in Drawer */}
            <Link
              to={`/book/${books[0]?.id || "hayati-baada-arrida"}`}
              onClick={() => setDrawerOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-500/25"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.nav.orderNow}</span>
            </Link>
          </div>

          {/* Drawer Footer */}
          <div className="pt-4 mt-4 border-t border-rose-500/15 space-y-2.5">
            <a
              href={about.instagramUrl || "https://www.instagram.com/ghayma_rd/"}
              target="_blank"
              rel="noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold border ${
                dark
                  ? "bg-[#22152c] border-rose-900/50 text-rose-200"
                  : "bg-rose-50 border-rose-200 text-rose-600"
              }`}
            >
              <Instagram className="w-4 h-4 text-rose-500" />
              <span>Instagram {about.instagramHandle || "@ghayma_rd"}</span>
            </a>
          </div>
        </div>
      </Drawer>
    </>
  );
}
