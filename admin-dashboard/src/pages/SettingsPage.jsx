import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  Sliders,
  CheckCircle2,
  Circle,
  Truck,
  Home as HomeIcon,
  Building2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Eye,
  Percent,
  Save,
  Tag,
  UserCheck,
  Check
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";

export default function SettingsPage() {
  const {
    t,
    lang,
    dark,
    deliveryEnabled,
    toggleDeliveryEnabled,
    memberDiscount,
    updateMemberDiscount,
    wilayas,
    formatDzd
  } = useAdminContext();

  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const [savingDiscount, setSavingDiscount] = useState(false);
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [discountForm, setDiscountForm] = useState(() => ({
    enabled: memberDiscount?.enabled !== false,
    discountPercent: memberDiscount?.discountPercent ?? 5,
    bannerTextFr:
      memberDiscount?.bannerTextFr ||
      "Remise membre connecté de 5% appliquée sur votre commande ! 🌸",
    bannerTextAr:
      memberDiscount?.bannerTextAr ||
      "تم تطبيق خصم 5% الخاص بعضوات مجتمع غيمة على طلبكِ! ✨",
    bannerTextEn:
      memberDiscount?.bannerTextEn ||
      "5% logged-in member discount applied to your order! 🌸"
  }));

  useEffect(() => {
    if (memberDiscount) {
      setDiscountForm({
        enabled: memberDiscount.enabled !== false,
        discountPercent: memberDiscount.discountPercent ?? 5,
        bannerTextFr:
          memberDiscount.bannerTextFr ||
          "Remise membre connecté de 5% appliquée sur votre commande ! 🌸",
        bannerTextAr:
          memberDiscount.bannerTextAr ||
          "تم تطبيق خصم 5% الخاص بعضوات مجتمع غيمة على طلبكِ! ✨",
        bannerTextEn:
          memberDiscount.bannerTextEn ||
          "5% logged-in member discount applied to your order! 🌸"
      });
    }
  }, [memberDiscount]);

  const sampleWilaya = wilayas[15] || {
    code: "16",
    nameFr: "Alger",
    nameAr: "الجزائر",
    agency: "Yalidine Express",
    homePrice: 600,
    agencyPrice: 400
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleDeliveryEnabled();
    } finally {
      setToggling(false);
    }
  };

  const handleSaveDiscount = async (e) => {
    e?.preventDefault?.();
    setSavingDiscount(true);
    try {
      await updateMemberDiscount(discountForm);
    } finally {
      setSavingDiscount(false);
    }
  };

  // Preview Calculations
  const previewUnitPrice = 1500;
  const previewSubtotal = previewUnitPrice * 1;
  const previewDiscountAmount = discountForm.enabled
    ? Math.round(previewSubtotal * (Number(discountForm.discountPercent || 5) / 100))
    : 0;
  const previewDiscountedSubtotal = previewSubtotal - previewDiscountAmount;
  const previewDeliveryFee = deliveryEnabled ? Number(sampleWilaya.homePrice) || 600 : 0;
  const previewTotal = previewDiscountedSubtotal + previewDeliveryFee;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-rose-500/25 shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-slate-900 dark:text-rose-50">
              {t.settings.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/70 mt-1">
              {t.settings.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/delivery")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all cursor-pointer self-start md:self-auto"
        >
          <Truck className="w-4 h-4" />
          <span>{t.settings.goToWilayasBtn}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </button>
      </Card>

      {/* ======================================================== */}
      {/* 1. SECTION: MEMBER DISCOUNT CONFIGURATION (5% Default) */}
      {/* ======================================================== */}
      <Card
        elevation={dark ? 6 : 2}
        sx={{
          borderRadius: "32px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className={`border-2 transition-all duration-300 p-6 sm:p-10 ${
          discountForm.enabled
            ? "border-pink-500/50 shadow-xl shadow-pink-500/10"
            : "border-slate-300 dark:border-rose-900/60"
        }`}
      >
        <form onSubmit={handleSaveDiscount} className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-rose-500/15">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  {lang === "ar"
                    ? "مكافأة العضوات المسجلات (Remise Membre)"
                    : "Remise & Avantages Membres Connectés"}
                </span>
                {discountForm.enabled ? (
                  <Chip
                    icon={<CheckCircle2 className="w-3.5 h-3.5 !text-emerald-500" />}
                    label={
                      lang === "ar"
                        ? `مفعل (${discountForm.discountPercent}%)`
                        : `Actif (${discountForm.discountPercent}%)`
                    }
                    size="small"
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.15)",
                      color: "#10b981",
                      fontWeight: 800,
                      border: "1px solid rgba(16, 185, 129, 0.3)"
                    }}
                  />
                ) : (
                  <Chip
                    icon={<Circle className="w-3.5 h-3.5 !text-amber-500" />}
                    label={lang === "ar" ? "معطّل" : "Désactivé"}
                    size="small"
                    sx={{
                      bgcolor: dark ? "#2c1a35" : "#fef3c7",
                      color: dark ? "#fde68a" : "#b45309",
                      fontWeight: 800
                    }}
                  />
                )}
              </div>

              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-rose-50 flex items-center gap-2">
                <Tag className="w-6 h-6 text-rose-500" />
                <span>
                  {lang === "ar"
                    ? `تحديد نسبة الخصم للعضوات (${discountForm.discountPercent}%) والنص الترويجي`
                    : `Remise Spéciale Membres Connectés (${discountForm.discountPercent}%) & Texte du Formulaire`}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed">
                {lang === "ar"
                  ? "تحصل كل زائرة تسجل دخولها أو تنشئ حساباً على خصم فوري بنسبة محددة (افتراضياً 5%) عند طلب الكتاب. الزائرات غير المسجلات يمكنهن الطلب بحرية بالسعر الأصلي دون إجبارهن على التسجيل."
                  : "Chaque lectrice qui crée un compte ou se connecte bénéficie d'une remise exclusive (5% par défaut) sur sa commande. Les visiteuses non connectées peuvent continuer de commander librement au prix normal."}
              </p>
            </div>

            {/* Quick Toggle Button for Member Discount */}
            <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setDiscountForm((f) => ({ ...f, enabled: !f.enabled }))
                }
                className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer ${
                  discountForm.enabled
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30"
                    : dark
                    ? "bg-[#25172e] text-rose-300 border border-rose-900"
                    : "bg-slate-100 text-slate-700 border border-slate-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs ${
                    discountForm.enabled
                      ? "bg-white text-rose-600 shadow-sm"
                      : "bg-slate-300 text-slate-700"
                  }`}
                >
                  {discountForm.enabled ? "✓" : "○"}
                </div>
                <span>
                  {discountForm.enabled
                    ? lang === "ar"
                      ? "الخصم مفعّل للزبائن ✓"
                      : "Remise Membre ACTIVÉE ✓"
                    : lang === "ar"
                    ? "الخصم معطّل حالياً ○"
                    : "Remise Membre DÉSACTIVÉE ○"}
                </span>
              </button>
            </div>
          </div>

          {/* Form Fields: Percentage & Custom Texts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-rose-200 mb-1.5 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-rose-500" />
                <span>
                  {lang === "ar"
                    ? "نسبة الخصم المئوية (Pourcentage %)"
                    : "Taux de Remise (%)"}
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountForm.discountPercent}
                  onChange={(e) =>
                    setDiscountForm((f) => ({
                      ...f,
                      discountPercent: Math.max(
                        0,
                        Math.min(100, Number(e.target.value) || 0)
                      )
                    }))
                  }
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-black focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#24152d] border-rose-900 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
                <span className="absolute end-4 top-1/2 -translate-y-1/2 font-extrabold text-sm text-rose-500">
                  %
                </span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-rose-200 mb-1.5">
                {lang === "ar"
                  ? "نص الإعلان الذي تراه الزبونة في استمارة الطلب (بالفرنسية - FR)"
                  : "Texte affiché dans le formulaire (Français)"}
              </label>
              <input
                type="text"
                value={discountForm.bannerTextFr}
                onChange={(e) =>
                  setDiscountForm((f) => ({ ...f, bannerTextFr: e.target.value }))
                }
                placeholder="Ex: Remise membre connecté de 5% appliquée sur votre commande ! 🌸"
                className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#24152d] border-rose-900 text-white"
                    : "bg-slate-50 border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-rose-200 mb-1.5 text-right">
                  نص الإعلان الترويجي في الاستمارة (بالعربية - AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={discountForm.bannerTextAr}
                  onChange={(e) =>
                    setDiscountForm((f) => ({ ...f, bannerTextAr: e.target.value }))
                  }
                  placeholder="مثال: تم تطبيق خصم 5% الخاص بعضوات مجتمع غيمة على طلبكِ! ✨"
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#24152d] border-rose-900 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-rose-200 mb-1.5">
                  Promotional Banner Text in Order Form (English - EN)
                </label>
                <input
                  type="text"
                  value={discountForm.bannerTextEn}
                  onChange={(e) =>
                    setDiscountForm((f) => ({ ...f, bannerTextEn: e.target.value }))
                  }
                  placeholder="Ex: 5% logged-in member discount applied to your order! 🌸"
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#24152d] border-rose-900 text-white"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-500/15">
            <button
              type="submit"
              disabled={savingDiscount}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>
                {savingDiscount
                  ? lang === "ar"
                    ? "جاري الحفظ..."
                    : "Enregistrement..."
                  : lang === "ar"
                  ? "حفظ إعدادات الخصم والنصوص"
                  : "Enregistrer la remise membre"}
              </span>
            </button>
          </div>
        </form>
      </Card>

      {/* ======================================================== */}
      {/* 2. SECTION: DELIVERY TOGGLE CARD (THE GREEN CHECK BUTTON) */}
      {/* ======================================================== */}
      <Card
        elevation={dark ? 6 : 2}
        sx={{
          borderRadius: "32px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className={`border-2 transition-all duration-300 p-6 sm:p-10 ${
          deliveryEnabled
            ? "border-emerald-500/50 shadow-xl shadow-emerald-500/10"
            : "border-rose-500/20"
        }`}
      >
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-rose-500/15">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-500">
                  {lang === "ar"
                    ? "التحكم في خيارات التوصيل للزبائن"
                    : "Contrôle des Tarifs & Modes de Livraison"}
                </span>
                {deliveryEnabled ? (
                  <Chip
                    icon={<CheckCircle2 className="w-3.5 h-3.5 !text-emerald-500" />}
                    label={t.settings.statusActive}
                    size="small"
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.15)",
                      color: "#10b981",
                      fontWeight: 800,
                      border: "1px solid rgba(16, 185, 129, 0.3)"
                    }}
                  />
                ) : (
                  <Chip
                    icon={<Circle className="w-3.5 h-3.5 !text-amber-500" />}
                    label={t.settings.statusInactive}
                    size="small"
                    sx={{
                      bgcolor: dark ? "#2c1a35" : "#fef3c7",
                      color: dark ? "#fde68a" : "#b45309",
                      fontWeight: 800,
                      border: dark
                        ? "1px solid rgba(245, 158, 11, 0.2)"
                        : "1px solid #fde68a"
                    }}
                  />
                )}
              </div>

              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-slate-900 dark:text-rose-50">
                {t.settings.deliveryCardTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed">
                {t.settings.deliveryCardDesc}
              </p>
            </div>

            {/* THE GREEN CHECK BUTTON */}
            <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
              <button
                type="button"
                onClick={handleToggle}
                disabled={toggling}
                aria-pressed={deliveryEnabled}
                className={`group relative inline-flex items-center gap-3.5 px-6 sm:px-8 py-4 sm:py-5 rounded-3xl font-extrabold text-sm sm:text-base transition-all duration-300 cursor-pointer select-none active:scale-95 disabled:opacity-60 ${
                  deliveryEnabled
                    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/35 hover:shadow-emerald-500/50"
                    : dark
                    ? "bg-[#24152e] hover:bg-[#2e1b3a] text-rose-100 border-2 border-rose-800/60"
                    : "bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 shadow-sm"
                }`}
              >
                {/* Visual Check Indicator */}
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                    deliveryEnabled
                      ? "bg-white text-emerald-600 shadow-md scale-110"
                      : dark
                      ? "bg-[#180e20] text-rose-300"
                      : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {deliveryEnabled ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                <div className="text-start leading-tight">
                  <div
                    className={`text-xs sm:text-sm font-bold ${
                      deliveryEnabled
                        ? "text-white"
                        : dark
                        ? "text-rose-100"
                        : "text-slate-900"
                    }`}
                  >
                    {deliveryEnabled
                      ? t.settings.btnChecked
                      : t.settings.btnUnchecked}
                  </div>
                  <div
                    className={`text-[11px] font-medium mt-0.5 ${
                      deliveryEnabled
                        ? "text-emerald-100"
                        : dark
                        ? "text-rose-300/80"
                        : "text-slate-600"
                    }`}
                  >
                    {deliveryEnabled
                      ? lang === "ar"
                        ? "اضغطي لإلغاء التحديد والتعطيل"
                        : "Cliquez pour décocher et désactiver"
                      : lang === "ar"
                      ? "اضغطي لوضع علامة صح خضراء والتفعيل"
                      : "Cliquez pour cocher en vert et activer"}
                  </div>
                </div>

                {/* Tactile Toggle Pill */}
                <div
                  className={`w-12 h-6 rounded-full transition-colors relative ms-1 hidden sm:block ${
                    deliveryEnabled
                      ? "bg-emerald-700/60"
                      : dark
                      ? "bg-[#140b1b] border border-rose-900/60"
                      : "bg-slate-300 border border-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-all duration-300 flex items-center justify-center text-[10px] font-black ${
                      deliveryEnabled
                        ? "right-0.5 text-emerald-600"
                        : "left-0.5 text-slate-600"
                    }`}
                  >
                    {deliveryEnabled ? "✓" : "○"}
                  </div>
                </div>
              </button>

              <span className="text-[11px] text-slate-600 dark:text-rose-300/70 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {lang === "ar"
                  ? "التحديث فوري وينعكس مباشرة على الموقع"
                  : "Mise à jour en direct instantanée sur le site public"}
              </span>
            </div>
          </div>

          {/* Detailed Behavior Explanation Box (FIXED HIGH-CONTRAST COLORS IN WHITE & DARK MODE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: ACTIVÉ */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                deliveryEnabled
                  ? dark
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/20"
                    : "bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs"
                  : dark
                  ? "bg-[#1d1225] border-rose-900/40 text-rose-100"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-black text-sm mb-2.5 ${
                  deliveryEnabled
                    ? dark
                      ? "text-emerald-300"
                      : "text-emerald-800"
                    : dark
                    ? "text-rose-200"
                    : "text-slate-900"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${
                    deliveryEnabled
                      ? "text-emerald-500"
                      : dark
                      ? "text-rose-400"
                      : "text-slate-500"
                  }`}
                />
                <span>
                  {lang === "ar"
                    ? "عند التفعيل بالعلامة الخضراء (ACTIVÉ)"
                    : "Lorsque Coché en Vert (ACTIVÉ)"}
                </span>
              </div>
              <ul
                className={`text-xs space-y-2 list-disc list-inside leading-relaxed font-semibold ${
                  deliveryEnabled
                    ? dark
                      ? "text-emerald-100"
                      : "text-emerald-950"
                    : dark
                    ? "text-rose-100/90"
                    : "text-slate-700"
                }`}
              >
                <li>
                  {lang === "ar"
                    ? "تظهر خيارات «توصيل للمنزل (À la maison)» و «استلام من الوكالة (À l'agence)» في استمارة الطلب."
                    : "Les options « À la maison » et « À l'agence » s'affichent sur le formulaire client."}
                </li>
                <li>
                  {lang === "ar"
                    ? "تظهر أسعار التوصيل لكل ولاية وتُحسب تلقائياً في المجموع الكلي للدفع."
                    : "Les tarifs de livraison de chaque wilaya sont calculés et ajoutés au total de la commande."}
                </li>
                <li>
                  {lang === "ar"
                    ? "تكون صفحة «أسعار التوصيل 69 ولاية» مفعلة بالكامل."
                    : "La page « Tarifs 69 Wilayas » est active pour les clients."}
                </li>
              </ul>
            </div>

            {/* Card 2: DÉSACTIVÉ */}
            <div
              className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                !deliveryEnabled
                  ? dark
                    ? "bg-rose-950/40 border-rose-500 text-rose-100 shadow-md shadow-rose-950/20"
                    : "bg-rose-50/90 border-rose-400 text-rose-950 shadow-xs"
                  : dark
                  ? "bg-[#1d1225] border-rose-900/40 text-rose-100"
                  : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-black text-sm mb-2.5 ${
                  !deliveryEnabled
                    ? dark
                      ? "text-rose-300"
                      : "text-rose-800"
                    : dark
                    ? "text-rose-200"
                    : "text-slate-900"
                }`}
              >
                <Circle
                  className={`w-4 h-4 shrink-0 ${
                    !deliveryEnabled
                      ? "text-rose-500"
                      : dark
                      ? "text-rose-400"
                      : "text-slate-500"
                  }`}
                />
                <span>
                  {lang === "ar"
                    ? "عند إلغاء التحديد (معطّل - الوضع الافتراضي)"
                    : "Lorsque Non Coché (DÉSACTIVÉ - Par défaut)"}
                </span>
              </div>
              <ul
                className={`text-xs space-y-2 list-disc list-inside leading-relaxed font-semibold ${
                  !deliveryEnabled
                    ? dark
                      ? "text-rose-100"
                      : "text-rose-950"
                    : dark
                    ? "text-rose-100/90"
                    : "text-slate-700"
                }`}
              >
                <li>
                  {lang === "ar"
                    ? "يتم إخفاء خيارات التوصيل للمنزل أو الوكالة تماماً من استمارة الزبون."
                    : "Le choix entre « À la maison » et « À l'agence » est totalement masqué aux clients."}
                </li>
                <li>
                  {lang === "ar"
                    ? "لا تظهر خانة «تكلفة التوصيل» في المجموع الكلي (المبلغ = سعر الكتاب × الكمية فقط)."
                    : "Aucun tarif de livraison n'apparaît dans le calcul du total (Total = Prix livre × Qté)."}
                </li>
                <li>
                  {lang === "ar"
                    ? "تبقى صفحة الأسعار في لوحة التحكم معطلة عن الزبائن حتى تقومي بتفعيلها مجدداً."
                    : "La page des tarifs reste désactivée pour les clients jusqu'à votre réactivation."}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* ======================================================== */}
      {/* 3. SECTION: LIVE INTERACTIVE SIMULATION OF CLIENT ORDER */}
      {/* ======================================================== */}
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-rose-500/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-rose-50">
                {lang === "ar"
                  ? "معاينة حية ومباشرة لاستمارة الزبونة مع الخصم والتوصيل"
                  : "Aperçu en Direct de l'Impact sur la Fiche Client"}
              </h3>
              <p className="text-[11px] text-slate-600 dark:text-rose-300/70">
                {deliveryEnabled
                  ? "Mode Actuel : Tarifs de livraison calculés et choix visibles"
                  : "Mode Actuel : Tarifs Masqués (Total net sans livraison)"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                deliveryEnabled
                  ? dark
                    ? "bg-emerald-950/60 text-emerald-200 border-emerald-800"
                    : "bg-emerald-100 text-emerald-900 border-emerald-300"
                  : dark
                  ? "bg-rose-950/60 text-rose-200 border-rose-800"
                  : "bg-rose-100 text-rose-900 border-rose-300"
              }`}
            >
              {deliveryEnabled
                ? "✓ Livraison Active"
                : "○ Livraison Masquée"}
            </span>

            {discountForm.enabled && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-pink-100 dark:bg-pink-950/60 text-pink-900 dark:text-pink-200 border border-pink-300 dark:border-pink-800">
                🏷️ Remise Membre {discountForm.discountPercent}% Active
              </span>
            )}
          </div>
        </div>

        {/* Mockup Form Display (FIXED CONTRAST INPUTS) */}
        <div
          dir={isRtl ? "rtl" : "ltr"}
          style={{
            backgroundColor: dark ? "#1a1122" : "#ffffff",
            borderColor: dark ? "rgba(244,63,94,0.3)" : "#fecdd3"
          }}
          className="p-5 sm:p-6 rounded-2xl border-2 space-y-4 max-w-xl mx-auto shadow-sm"
        >
          <div className="text-xs font-bold text-rose-600 dark:text-rose-400 pb-1 border-b border-rose-500/15 flex items-center justify-between">
            <span>
              {lang === "ar"
                ? "معاينة استمارة الطلب لدى الزبائن (Fiche Produit Client)"
                : "Aperçu de la commande chez les clients"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
              Simulation Live
            </span>
          </div>

          {/* Member Discount Badge on Client Form */}
          {discountForm.enabled ? (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border-2 border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                  %{discountForm.discountPercent}
                </span>
                <span className="text-[11px] sm:text-xs">
                  {lang === "ar"
                    ? discountForm.bannerTextAr
                    : discountForm.bannerTextFr}
                </span>
              </div>
              <Chip
                size="small"
                label={`${discountForm.discountPercent}% OFF`}
                sx={{
                  bgcolor: "#10b981",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "10px"
                }}
              />
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-rose-950/20 text-slate-600 dark:text-rose-300/70 text-xs text-center border border-dashed border-slate-300 dark:border-rose-900/60 font-medium">
              {lang === "ar"
                ? "الخصم معطل حالياً (الزبائن يشترون بالسعر العادي دون تخفيض)"
                : "Remise membre désactivée (achat au prix standard)"}
            </div>
          )}

          {/* Simulated Wilaya & Commune with Guaranteed Contrast */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              className={`p-3 rounded-xl border-2 shadow-xs transition-colors ${
                dark
                  ? "bg-[#23152d] border-rose-800/60 text-white"
                  : "bg-rose-50/70 border-rose-200 text-slate-900"
              }`}
            >
              <span
                className={`block text-[11px] font-bold ${
                  dark ? "text-rose-300" : "text-rose-700"
                }`}
              >
                Wilaya:
              </span>
              <span
                className={`font-black text-xs sm:text-sm ${
                  dark ? "text-white" : "text-slate-950"
                }`}
              >
                16 - Alger (الجزائر)
              </span>
            </div>
            <div
              className={`p-3 rounded-xl border-2 shadow-xs transition-colors ${
                dark
                  ? "bg-[#23152d] border-rose-800/60 text-white"
                  : "bg-rose-50/70 border-rose-200 text-slate-900"
              }`}
            >
              <span
                className={`block text-[11px] font-bold ${
                  dark ? "text-rose-300" : "text-rose-700"
                }`}
              >
                Commune:
              </span>
              <span
                className={`font-black text-xs sm:text-sm ${
                  dark ? "text-white" : "text-slate-950"
                }`}
              >
                Bab El Oued
              </span>
            </div>
          </div>

          {/* Conditional Delivery Options on Client Site */}
          {deliveryEnabled ? (
            <div
              className={`space-y-2 p-3 rounded-2xl border ${
                dark
                  ? "bg-emerald-950/30 border-emerald-700/50"
                  : "bg-emerald-50 border border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <span>{t.delivery.colAgency}: {sampleWilaya.agency}</span>
                <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400">
                  {lang === "ar" ? "الخيارات ظاهرة للزبون ✓" : "Options visibles ✓"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-3 rounded-xl border-2 border-emerald-500 flex items-center justify-between ${
                    dark ? "bg-[#24152d]" : "bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-950 dark:text-white">
                      À la maison
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                    {formatDzd(sampleWilaya.homePrice)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    dark
                      ? "bg-[#24152d] border-rose-900/60 opacity-85"
                      : "bg-white border-slate-200 text-slate-800 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-950 dark:text-white">
                      À l'agence
                    </span>
                  </div>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {formatDzd(sampleWilaya.agencyPrice)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`p-3.5 rounded-2xl border-2 border-dashed text-center text-xs ${
                dark
                  ? "border-amber-600/50 bg-amber-950/30 text-amber-100"
                  : "border-amber-300 bg-amber-50/70 text-slate-900"
              }`}
            >
              <span className="font-extrabold text-amber-900 dark:text-amber-300 block mb-0.5 text-xs sm:text-sm">
                {lang === "ar"
                  ? "خيارات التوصيل (المنزل / الوكالة) مخفية تماماً عن الزبون"
                  : "Le choix du mode de livraison est masqué"}
              </span>
              <span className="text-[11px] text-amber-800 dark:text-amber-200 font-medium">
                {lang === "ar"
                  ? "لن يُطلب من الزبون الاختيار ولن تُحسب له أي رسوم توصيل."
                  : "Le client n'a pas à choisir et aucun frais de livraison n'est calculé."}
              </span>
            </div>
          )}

          {/* Price Calculation Simulation */}
          <div
            className={`p-4 rounded-xl border-2 space-y-2 text-xs transition-colors ${
              dark
                ? "bg-[#23152d] border-rose-800/60"
                : "bg-rose-50/50 border-rose-200"
            }`}
          >
            <div className="flex justify-between">
              <span className="text-slate-700 dark:text-rose-200 font-medium">
                Sous-total Livre (1 × {formatDzd(previewUnitPrice)}):
              </span>
              <span className="font-bold text-slate-950 dark:text-white">
                {formatDzd(previewSubtotal)}
              </span>
            </div>

            {discountForm.enabled && previewDiscountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-extrabold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Remise Membre Connecté (-{discountForm.discountPercent}%):</span>
                </span>
                <span>- {formatDzd(previewDiscountAmount)}</span>
              </div>
            )}

            {deliveryEnabled && (
              <div className="flex justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                <span>Frais de Livraison (16 - Alger • À la maison):</span>
                <span>{formatDzd(previewDeliveryFee)}</span>
              </div>
            )}

            <div className="border-t border-rose-500/20 pt-2 flex justify-between font-black text-sm sm:text-base text-rose-600 dark:text-rose-400">
              <span>Total Net à Payer:</span>
              <span>{formatDzd(previewTotal)}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
