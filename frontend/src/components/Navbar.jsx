import React from "react";
import { Link, useLocation } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
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
  Globe
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
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
    addToast
  } = useAppContext();

  const location = useLocation();
  const unreadCount = notifications.filter((n) => n.unread).length;
  const isRtl = lang === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const navLinks = [
    { to: "/", label: t.nav.home, icon: HomeIcon },
    { to: "/books", label: t.nav.books, icon: BookOpen },
    { to: "/about", label: t.nav.about, icon: Feather },
    { to: "/contact", label: t.nav.contact, icon: Mail }
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

          {/* Center: Desktop Navigation Pills */}
          <nav className="hidden lg:flex items-center gap-1.5">
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
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                      : dark
                      ? "text-rose-100/80 hover:text-white hover:bg-rose-950/50"
                      : "text-slate-700 hover:text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Desktop Language & Theme (Hidden on mobile so they live cleanly inside the Hamburger Drawer!) + Notifications + Order CTA */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop-only Language Switcher */}
            <div
              className={`hidden lg:flex items-center rounded-full p-1 border text-xs font-bold ${
                dark
                  ? "bg-[#211529] border-rose-900/50"
                  : "bg-rose-50/80 border-rose-200/70"
              }`}
            >
              {["ar", "fr", "en"].map((code) => (
                <button
                  key={code}
                  onClick={() => handleLanguageSwitch(code)}
                  className={`px-2.5 py-1 rounded-full uppercase transition-all cursor-pointer ${
                    lang === code
                      ? "bg-rose-500 text-white shadow-sm"
                      : dark
                      ? "text-rose-200/70 hover:text-white"
                      : "text-slate-600 hover:text-rose-600"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Desktop-only Theme Toggle */}
            <div className="hidden lg:block">
              <IconButton
                onClick={handleThemeToggle}
                aria-label="Toggle theme"
                sx={{
                  color: dark ? "#fcd34d" : "#e11d48",
                  bgcolor: dark ? "#211529" : "#fff1f2",
                  border: dark
                    ? "1px solid rgba(136,19,55,0.5)"
                    : "1px solid #fecdd3",
                  width: 40,
                  height: 40
                }}
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </IconButton>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <IconButton
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  markAllNotificationsRead();
                }}
                aria-label="Notifications"
                sx={{
                  color: dark ? "#fecdd3" : "#e11d48",
                  bgcolor: dark ? "#211529" : "#fff1f2",
                  border: dark
                    ? "1px solid rgba(136,19,55,0.5)"
                    : "1px solid #fecdd3",
                  width: 40,
                  height: 40
                }}
              >
                <Badge badgeContent={unreadCount} color="primary">
                  <Bell className="w-4 h-4" />
                </Badge>
              </IconButton>

              {notifOpen && (
                <div
                  className={`absolute ${
                    isRtl ? "left-0" : "right-0"
                  } mt-3 w-76 sm:w-96 rounded-3xl shadow-2xl border p-4 z-50 ${
                    dark
                      ? "bg-[#1d1224] border-rose-900/60 text-rose-50"
                      : "bg-white border-rose-100 text-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-500/15">
                    <span className="font-bold text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4 text-rose-500" />
                      {t.notifications.title}
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-rose-500 hover:underline cursor-pointer"
                    >
                      {t.notifications.clearAll}
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-center py-6 opacity-60">
                      {t.notifications.empty}
                    </p>
                  ) : (
                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            dark ? "bg-[#281931]" : "bg-rose-50/70"
                          }`}
                        >
                          <p className="font-medium">
                            {lang === "ar"
                              ? n.textAr
                              : lang === "fr"
                              ? n.textFr
                              : n.textEn}
                          </p>
                          <span className="text-[10px] opacity-60 mt-1 block">
                            {n.time}
                          </span>
                        </div>
                      ))}
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
