import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import {
  ShoppingBag,
  Sparkles,
  BookOpen,
  MessageSquare,
  Truck,
  UserPen,
  LayoutTemplate,
  PanelBottom,
  Sliders,
  Trophy
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import OrdersPage from "./OrdersPage.jsx";

export default function OverviewPage() {
  const {
    t,
    lang,
    dark,
    orders,
    books,
    messages,
    wilayas,
    deliveryEnabled,
    formatDzd
  } = useAdminContext();
  const navigate = useNavigate();

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.status !== "cancelled")
        .reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0),
    [orders]
  );

  const activeWilayasCount = wilayas.filter((w) => w.active !== false).length;

  const kpiCards = [
    {
      label: t.stats.totalOrders,
      value: orders.length,
      icon: ShoppingBag,
      color: "from-rose-500 to-pink-500",
      to: "/orders"
    },
    {
      label: t.stats.totalRevenue,
      value: formatDzd(totalRevenue),
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      to: "/orders"
    },
    {
      label: t.stats.totalBooks,
      value: books.length,
      icon: BookOpen,
      color: "from-pink-500 to-purple-500",
      to: "/books"
    },
    {
      label: t.stats.unreadMessages,
      value: messages.length,
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-500",
      to: "/messages"
    },
    {
      label: t.stats.activeWilayas,
      value: `${activeWilayasCount} / 69`,
      icon: Truck,
      color: "from-violet-500 to-rose-500",
      to: "/delivery"
    }
  ];

  const sectionEditorShortcuts = [
    {
      title: t.nav.challenges || "Défis & Blog Ghayma",
      desc:
        lang === "ar"
          ? "أنشئي تحديات 24 ساعة وشهرية، تابعي المشتركات وإحصائيات النقرات واليوميات التفاعلية."
          : "Gérez les défis 24h, mensuels, le compte à rebours, le calendrier et le blog Pinterest.",
      icon: Trophy,
      to: "/challenges"
    },
    {
      title: t.nav.settings || "Paramètres & Frais de Livraison",
      desc: deliveryEnabled
        ? lang === "ar"
          ? "أسعار وطرق التوصيل مفعلة حالياً للزبائن (Coché Vert ✓)"
          : "Tarifs et choix de livraison activés pour les clients (Coché Vert ✓)"
        : lang === "ar"
        ? "أسعار التوصيل معطلة حالياً عن الزبائن (Désactivé ○)"
        : "Tarifs de livraison désactivés pour les clients (Désactivé ○)",
      icon: Sliders,
      to: "/settings"
    },
    {
      title: t.nav.homeHero,
      desc:
        lang === "ar"
          ? "عدّلي العنوان الرئيسي، الأزرار، وصورة الكتاب ثلاثية الأبعاد مع معاينة حية."
          : "Modifiez le titre Hero, les boutons et les images 3D avec aperçu en direct.",
      icon: Sparkles,
      to: "/home-hero"
    },
    {
      title: t.nav.about,
      desc: t.about.subtitle,
      icon: UserPen,
      to: "/about"
    },
    {
      title: t.nav.homeSections,
      desc:
        lang === "ar"
          ? "عدّلي ترويسة الكتب، لافتة الاقتباس الأدبي، وآراء القارئات مع معاينة حية."
          : "Modifiez la bannière de citation et les avis des lectrices avec aperçu en direct.",
      icon: LayoutTemplate,
      to: "/home-sections"
    },
    {
      title: t.nav.footer,
      desc:
        lang === "ar"
          ? "عدّلي الشريط العلوي، وصف الفوتر، الهاتف، البريد، وروابط إنستغرام مع معاينة حية."
          : "Modifiez le ruban d'annonce et toutes les informations du Footer avec aperçu.",
      icon: PanelBottom,
      to: "/footer"
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 5 Symmetric Material KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {kpiCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Card
              key={i}
              elevation={dark ? 5 : 2}
              onClick={() => navigate(c.to)}
              sx={{
                borderRadius: "24px",
                bgcolor: dark ? "#1a1121" : "#ffffff",
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-3px)" }
              }}
              className="p-4 sm:p-5 border border-rose-500/20 text-start"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-md mb-3 sm:mb-4`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-lg sm:text-2xl font-extrabold truncate">
                {c.value}
              </div>
              <div className="text-[11px] sm:text-xs opacity-70 font-medium mt-1">
                {c.label}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Live Preview Section Editors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectionEditorShortcuts.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              elevation={dark ? 4 : 1}
              sx={{
                borderRadius: "24px",
                bgcolor: dark ? "#1a1121" : "#ffffff"
              }}
              className="p-5 border border-rose-500/20 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-sm flex items-center gap-2 text-rose-500">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <button
                onClick={() => navigate(item.to)}
                className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow cursor-pointer"
              >
                {lang === "ar" ? "فتح المحرر + المعاينة" : "Ouvrir + Live Preview"}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Latest Orders Section (Table on Desktop + Interactive Ticket Cards on Mobile) */}
      <OrdersPage previewLimit={5} />
    </div>
  );
}
