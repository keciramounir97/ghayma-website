import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import {
  LayoutDashboard,
  ShoppingBag,
  BookOpen,
  Truck,
  UserPen,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Bell,
  ExternalLink,
  Feather,
  Cloud,
  Sparkles,
  LayoutTemplate,
  PanelBottom,
  Home as HomeIcon,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sliders,
  Globe
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import AdminToastContainer from "./AdminToastContainer.jsx";
import OrderTicketModal from "./OrderTicketModal.jsx";
import MessageTicketModal from "./MessageTicketModal.jsx";
import WilayaTicketModal from "./WilayaTicketModal.jsx";

export default function AdminLayout({ children }) {
  const {
    lang,
    setLang,
    dark,
    setDark,
    t,
    adminUser,
    setAdminUser,
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    notifOpen,
    setNotifOpen,
    orders,
    books,
    messages,
    deliveryEnabled,
    addToast
  } = useAdminContext();

  const location = useLocation();
  const navigate = useNavigate();
  const isRtl = lang === "ar";
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const navItems = [
    { to: "/", label: t.nav.overview, icon: LayoutDashboard },
    {
      to: "/orders",
      label: t.nav.orders,
      icon: ShoppingBag,
      badge: orders.filter((o) => o.status === "pending").length
    },
    { to: "/books", label: t.nav.books, icon: BookOpen, badge: books.length },
    {
      to: "/delivery",
      label: t.nav.delivery,
      icon: Truck,
      badge: deliveryEnabled ? "ON ✓" : "OFF",
      badgeColor: deliveryEnabled ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
    },
    {
      to: "/settings",
      label: t.nav.settings || "Paramètres & Livraison",
      icon: Sliders,
      badge: deliveryEnabled ? "✓" : "○"
    },
    { to: "/home-hero", label: t.nav.homeHero, icon: Sparkles },
    { to: "/about", label: t.nav.about, icon: UserPen },
    { to: "/home-sections", label: t.nav.homeSections, icon: LayoutTemplate },
    { to: "/footer", label: t.nav.footer, icon: PanelBottom },
    {
      to: "/messages",
      label: t.nav.messages,
      icon: MessageSquare,
      badge: messages.filter((m) => !m.read).length
    }
  ];

  const currentNav =
    navItems.find((item) =>
      item.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.to)
    ) || navItems[0];

  const liveNotifications = useMemo(() => {
    const list = [];
    orders.slice(0, 5).forEach((o) => {
      list.push({
        id: "ord-" + o.id,
        title: `${o.clientName} — ${o.bookTitle}`,
        sub: `${o.wilayaLabel || o.wilayaNameFr} • ${o.totalPrice} DZD`,
        unread: o.status === "pending",
        to: "/orders"
      });
    });
    messages.slice(0, 5).forEach((m) => {
      list.push({
        id: "msg-" + m.id,
        title: `${m.name}: ${m.subject || "Message"}`,
        sub: m.message,
        unread: !m.read,
        to: "/messages"
      });
    });
    return list;
  }, [orders, messages]);

  const unreadCount = liveNotifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    setAdminUser(null);
    addToast("Logged out successfully");
    navigate("/login");
  };

  // Shared Sidebar Content for Desktop & Mobile Drawer
  const renderSidebarContent = (isMobileDrawer = false) => {
    const collapsed = !isMobileDrawer && sidebarCollapsed;
    return (
      <div className="h-full flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Fixed Non-Wrapping Brand Header */}
          <div className="h-18 sm:h-20 px-4 sm:px-5 flex items-center justify-between border-b border-rose-500/10 shrink-0">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 shrink-0 select-none overflow-hidden group"
            >
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-[2px] shadow-md shadow-rose-500/25 group-hover:scale-105 transition-all shrink-0">
                <div
                  className={`w-full h-full rounded-[14px] flex items-center justify-center relative overflow-hidden ${
                    dark ? "bg-gradient-to-b from-[#1b1022] to-[#120917]" : "bg-gradient-to-b from-white to-rose-50/50"
                  }`}
                >
                  <Cloud className="w-5 h-5 text-rose-400/30 fill-rose-300/25 absolute -bottom-0.5" />
                  <Feather className="w-4 h-4 text-rose-500 -rotate-12 relative z-10 drop-shadow-xs" />
                  <Sparkles className="w-2.5 h-2.5 text-amber-400 absolute top-1 right-1 animate-pulse" />
                </div>
              </div>
              {!collapsed && (
                <div className="flex flex-col leading-none whitespace-nowrap">
                  <div className="flex items-center gap-1.5" dir="ltr">
                    <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                      ghayma_rd
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold border border-rose-500/25">
                      غيمة
                    </span>
                  </div>
                  <span className="text-[10px] text-rose-500/80 font-bold tracking-wider uppercase mt-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span>Admin Studio</span>
                  </span>
                </div>
              )}
            </Link>

            {isMobileDrawer ? (
              <IconButton
                onClick={() => setSidebarOpen(false)}
                sx={{ color: "#f43f5e", bgcolor: "rgba(244,63,94,0.1)" }}
              >
                <X className="w-5 h-5" />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                size="small"
                sx={{ color: "#f43f5e" }}
              >
                {collapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </IconButton>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 sm:p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);

              const linkNode = (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center ${
                    collapsed ? "justify-center px-2" : "justify-between px-3.5"
                  } py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25"
                      : dark
                      ? "text-rose-100/75 hover:bg-rose-950/50 hover:text-white"
                      : "text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && item.badge !== undefined && item.badge !== null && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        active
                          ? "bg-white/25 text-white"
                          : item.badgeColor || "bg-rose-500/15 text-rose-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );

              return collapsed ? (
                <Tooltip key={item.to} title={item.label} placement="right">
                  {linkNode}
                </Tooltip>
              ) : (
                linkNode
              );
            })}
          </nav>

          {/* Dedicated Theme & Language Controls Inside Mobile Hamburger Sidebar */}
          {isMobileDrawer && (
            <div className="px-3 sm:px-4 pb-2">
              <div
                className={`p-3.5 rounded-2xl border space-y-3 ${
                  dark
                    ? "bg-[#211429]/90 border-rose-900/50"
                    : "bg-rose-50/70 border-rose-200/70"
                }`}
              >
                {/* Language Switcher in Sidebar */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    <Globe className="w-3.5 h-3.5" />
                    <span>
                      {lang === "ar"
                        ? "اللغة / Language"
                        : lang === "fr"
                        ? "Langue de l'interface"
                        : "Interface Language"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { code: "fr", label: "Français" },
                      { code: "ar", label: "العربية" },
                      { code: "en", label: "English" }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          addToast(`Language: ${l.label}`);
                        }}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          lang === l.code
                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/25"
                            : dark
                            ? "bg-[#160d1c] text-rose-200/80 hover:bg-rose-950"
                            : "bg-white text-slate-700 hover:bg-rose-100/60"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Switcher in Sidebar */}
                <div className="pt-1 border-t border-rose-500/10 flex items-center justify-between">
                  <span className="text-xs font-bold opacity-85">
                    {lang === "ar"
                      ? "المظهر (داكن / فاتح)"
                      : lang === "fr"
                      ? "Apparence (Clair / Sombre)"
                      : "Theme Appearance"}
                  </span>
                  <button
                    onClick={() => setDark((d) => !d)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dark
                        ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                        : "bg-white text-rose-600 border border-rose-200 shadow-xs"
                    }`}
                  >
                    {dark ? (
                      <>
                        <Sun className="w-4 h-4" />
                        <span>{lang === "ar" ? "نهاري" : "Light"}</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        <span>{lang === "ar" ? "ليلي" : "Dark"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 sm:p-4 border-t border-rose-500/10 space-y-2.5 shrink-0">
          <a
            href="https://ghayma-rd-books.web.app"
            target="_blank"
            rel="noreferrer"
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              dark
                ? "border-rose-900/60 text-rose-200 hover:bg-rose-950"
                : "border-rose-200 text-rose-600 hover:bg-rose-50"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span>{t.nav.viewLiveSite}</span>}
          </a>

          <div
            className={`p-3 rounded-2xl flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } ${dark ? "bg-[#211429]" : "bg-rose-50/80"}`}
          >
            {!collapsed && (
              <div className="truncate pe-2">
                <div className="text-xs font-bold truncate">
                  {adminUser?.email}
                </div>
                <div className="text-[10px] text-rose-500 font-semibold">
                  @ghayma_rd • Super Admin
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              title={t.nav.logout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/15 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      dir={t.dir}
      className={`min-h-screen flex transition-colors duration-300 overflow-x-hidden ${
        dark ? "bg-[#110b15] text-rose-50" : "bg-[#fdf8fa] text-slate-800"
      }`}
    >
      <AdminToastContainer />
      <OrderTicketModal />
      <MessageTicketModal />
      <WilayaTicketModal />

      {/* Desktop Retractable Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-e transition-all duration-300 ${
          sidebarCollapsed ? "w-22" : "w-72"
        } ${
          dark
            ? "bg-[#170e1d] border-rose-950/70"
            : "bg-white border-rose-100 shadow-sm"
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile & Tablet Material UI Retractable Hamburger Drawer */}
      <Drawer
        anchor={isRtl ? "right" : "left"}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "86vw", sm: 330 },
            maxWidth: 350,
            bgcolor: dark ? "#170e1d" : "#ffffff",
            color: dark ? "#fff1f2" : "#1e293b",
            borderRadius: isRtl ? "24px 0 0 24px" : "0 24px 24px 0"
          }
        }}
      >
        <div dir={t.dir} className="h-full">
          {renderSidebarContent(true)}
        </div>
      </Drawer>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Material AppBar */}
        <header
          className={`sticky top-0 z-30 h-16 sm:h-20 px-3 sm:px-8 border-b backdrop-blur-xl flex items-center justify-between gap-2 sm:gap-4 ${
            dark
              ? "bg-[#160e1c]/90 border-rose-950/70"
              : "bg-white/90 border-rose-100"
          }`}
        >
          {/* Left: Hamburger + Fixed Mobile Brand + Breadcrumbs */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <IconButton
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin menu"
              className="lg:!hidden"
              sx={{
                color: "#f43f5e",
                bgcolor: "rgba(244,63,94,0.1)",
                borderRadius: "14px",
                width: 40,
                height: 40
              }}
            >
              <Menu className="w-5 h-5" />
            </IconButton>

            {/* Compact non-wrapping logo on mobile header */}
            <Link
              to="/"
              className="flex lg:hidden items-center gap-2 shrink-0 whitespace-nowrap group"
            >
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-[1.5px] shadow-sm shrink-0">
                <div
                  className={`w-full h-full rounded-[9px] flex items-center justify-center relative overflow-hidden ${
                    dark ? "bg-[#1b1022]" : "bg-white"
                  }`}
                >
                  <Cloud className="w-4 h-4 text-rose-400/30 fill-rose-300/25 absolute -bottom-0.5" />
                  <Feather className="w-3.5 h-3.5 text-rose-500 -rotate-12 relative z-10" />
                </div>
              </div>
              <div className="flex items-center gap-1" dir="ltr">
                <span className="font-editorial text-base font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  ghayma_rd
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-500 font-bold">
                  Studio
                </span>
              </div>
            </Link>

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm truncate"
            >
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-1.5 font-medium opacity-75 hover:opacity-100 hover:text-rose-500"
              >
                <HomeIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Admin</span>
              </Link>
              <ChevronIcon className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <span className="font-bold text-rose-500 truncate">
                {currentNav.label}
              </span>
            </nav>
          </div>

          {/* Right Controls: Live Sync Badge, Desktop Language & Theme, Notification Bell */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Live Sync</span>
            </span>

            {/* Language Switcher — Desktop Only (On Mobile it is inside the Hamburger Sidebar) */}
            <div
              className={`hidden lg:flex items-center rounded-full p-1 border text-xs font-bold ${
                dark
                  ? "bg-[#22152b] border-rose-900/50"
                  : "bg-rose-50 border-rose-200/70"
              }`}
            >
              {["fr", "ar", "en"].map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setLang(code);
                    addToast(`Language: ${code.toUpperCase()}`);
                  }}
                  className={`px-2.5 py-1 rounded-full uppercase transition-all cursor-pointer ${
                    lang === code
                      ? "bg-rose-500 text-white shadow-sm"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Theme Switcher — Desktop Only (On Mobile it is inside the Hamburger Sidebar) */}
            <div className="hidden lg:block">
              <IconButton
                onClick={() => setDark((d) => !d)}
                sx={{
                  color: dark ? "#fcd34d" : "#e11d48",
                  bgcolor: dark ? "#22152b" : "#fff1f2",
                  border: dark
                    ? "1px solid rgba(136,19,55,0.5)"
                    : "1px solid #fecdd3",
                  width: 40,
                  height: 40
                }}
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </IconButton>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <IconButton
                onClick={() => setNotifOpen(!notifOpen)}
                sx={{
                  color: dark ? "#fecdd3" : "#e11d48",
                  bgcolor: dark ? "#22152b" : "#fff1f2",
                  border: dark
                    ? "1px solid rgba(136,19,55,0.5)"
                    : "1px solid #fecdd3",
                  width: { xs: 38, sm: 40 },
                  height: { xs: 38, sm: 40 }
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
                  <div className="font-bold text-sm pb-3 mb-3 border-b border-rose-500/15 flex items-center justify-between">
                    <span>Notifications ({liveNotifications.length})</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-xs text-rose-500 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {liveNotifications.length === 0 ? (
                      <p className="text-xs opacity-60 text-center py-6">
                        No notifications yet
                      </p>
                    ) : (
                      liveNotifications.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            navigate(item.to);
                            setNotifOpen(false);
                          }}
                          className={`w-full text-start p-3 rounded-2xl text-xs transition-colors cursor-pointer ${
                            dark
                              ? "bg-[#281931] hover:bg-rose-950"
                              : "bg-rose-50/70 hover:bg-rose-100/70"
                          }`}
                        >
                          <div className="font-bold text-rose-500 truncate">
                            {item.title}
                          </div>
                          <div className="opacity-75 truncate mt-0.5">
                            {item.sub}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
