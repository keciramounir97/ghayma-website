import React, { useState } from "react";
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
  Eye
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";

export default function SettingsPage() {
  const {
    t,
    lang,
    dark,
    deliveryEnabled,
    toggleDeliveryEnabled,
    wilayas,
    formatDzd
  } = useAdminContext();

  const navigate = useNavigate();
  const [toggling, setToggling] = useState(false);
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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

      {/* Main Feature: Prominent Green Check Button Toggle Card */}
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
            <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
              <button
                type="button"
                onClick={handleToggle}
                disabled={toggling}
                aria-pressed={deliveryEnabled}
                className={`group relative inline-flex items-center gap-3.5 px-6 sm:px-8 py-4 sm:py-5 rounded-3xl font-extrabold text-sm sm:text-base transition-all duration-300 cursor-pointer select-none active:scale-95 disabled:opacity-60 ${
                  deliveryEnabled
                    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-xl shadow-emerald-500/35 hover:shadow-emerald-500/50 hover:from-emerald-600 hover:to-teal-600"
                    : dark
                    ? "bg-[#25172e] hover:bg-[#2f1d3a] text-rose-100 border-2 border-rose-900/60 hover:border-rose-500/50"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-2 border-slate-300 hover:border-emerald-500 shadow-sm"
                }`}
              >
                {/* Visual Check Indicator */}
                <div
                  className={`w-8 h-8 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                    deliveryEnabled
                      ? "bg-white text-emerald-600 shadow-md scale-110"
                      : dark
                      ? "bg-[#180e20] text-rose-300"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {deliveryEnabled ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-600 text-white" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                <div className="text-start leading-tight">
                  <div className="text-xs sm:text-sm font-bold">
                    {deliveryEnabled
                      ? t.settings.btnChecked
                      : t.settings.btnUnchecked}
                  </div>
                  <div
                    className={`text-[11px] font-medium mt-0.5 ${
                      deliveryEnabled
                        ? "text-emerald-100"
                        : "text-slate-500 dark:text-rose-300/70"
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
                      ? "bg-white/30"
                      : dark
                      ? "bg-[#150b1c]"
                      : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-all duration-300 flex items-center justify-center text-[10px] font-black ${
                      deliveryEnabled
                        ? "right-0.5 text-emerald-600"
                        : "left-0.5 text-slate-500"
                    }`}
                  >
                    {deliveryEnabled ? "✓" : "○"}
                  </div>
                </div>
              </button>

              <span className="text-[11px] text-slate-500 dark:text-rose-300/60 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {lang === "ar"
                  ? "التحديث فوري وينعكس مباشرة على الموقع"
                  : "Mise à jour en direct instantanée sur le site public"}
              </span>
            </div>
          </div>

          {/* Detailed Behavior Explanation Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: ACTIVÉ */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                deliveryEnabled
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-400 dark:border-emerald-600/50 text-slate-900 dark:text-emerald-50"
                  : "bg-slate-50/80 dark:bg-[#150d1b] border border-slate-200 dark:border-rose-950/60 text-slate-500 dark:text-rose-300/50 opacity-60"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold text-xs sm:text-sm mb-2 ${
                  deliveryEnabled
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-600 dark:text-rose-300/60"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {lang === "ar"
                    ? "عند التفعيل بالعلامة الخضراء (ACTIVÉ)"
                    : "Lorsque Coché en Vert (ACTIVÉ)"}
                </span>
              </div>
              <ul
                className={`text-xs space-y-1.5 list-disc list-inside ${
                  deliveryEnabled
                    ? "text-slate-700 dark:text-emerald-100"
                    : "text-slate-500 dark:text-rose-300/50"
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
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                !deliveryEnabled
                  ? "bg-rose-50/90 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-700/50 text-slate-900 dark:text-rose-50"
                  : "bg-slate-50/80 dark:bg-[#150d1b] border border-slate-200 dark:border-rose-950/60 text-slate-500 dark:text-rose-300/50 opacity-60"
              }`}
            >
              <div
                className={`flex items-center gap-2 font-bold text-xs sm:text-sm mb-2 ${
                  !deliveryEnabled
                    ? "text-rose-700 dark:text-rose-400"
                    : "text-slate-600 dark:text-rose-300/60"
                }`}
              >
                <Circle className="w-4 h-4 shrink-0" />
                <span>
                  {lang === "ar"
                    ? "عند إلغاء التحديد (معطّل - الوضع الافتراضي)"
                    : lang === "fr"
                    ? "Lorsque Non Coché (DÉSACTIVÉ - Par défaut)"
                    : "When Unchecked (DEACTIVATED - Default)"}
                </span>
              </div>
              <ul
                className={`text-xs space-y-1.5 list-disc list-inside ${
                  !deliveryEnabled
                    ? "text-slate-800 dark:text-rose-100"
                    : "text-slate-500 dark:text-rose-300/50"
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

      {/* LIVE INTERACTIVE SIMULATION OF CLIENT ORDER FORM */}
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
                {t.settings.previewTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-rose-300/70">
                {deliveryEnabled
                  ? t.settings.previewDescActive
                  : t.settings.previewDescInactive}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              deliveryEnabled
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30"
            }`}
          >
            {deliveryEnabled
              ? "✓ Mode Actuel : Tarifs & Choix Actifs"
              : "○ Mode Actuel : Tarifs Masqués (Total sans livraison)"}
          </span>
        </div>

        {/* Mockup Form Display */}
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className={`p-5 sm:p-6 rounded-2xl border space-y-4 max-w-xl mx-auto ${
            dark
              ? "bg-[#1f1427] border-rose-900/60"
              : "bg-rose-50/50 border-rose-200"
          }`}
        >
          <div className="text-xs font-bold text-rose-500 pb-1 border-b border-rose-500/10">
            {lang === "ar"
              ? "معاينة استمارة الطلب لدى الزبائن (Fiche Produit Client)"
              : "Aperçu de la commande chez les clients"}
          </div>

          {/* Simulated Wilaya & Commune */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div
              className={`p-2.5 rounded-xl border ${
                dark
                  ? "bg-[#281833] border-rose-900/60 text-rose-100"
                  : "bg-white border-rose-200 text-slate-800 shadow-xs"
              }`}
            >
              <span className="block text-[11px] font-semibold text-slate-500 dark:text-rose-300/70">
                Wilaya:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                16 - Alger (الجزائر)
              </span>
            </div>
            <div
              className={`p-2.5 rounded-xl border ${
                dark
                  ? "bg-[#281833] border-rose-900/60 text-rose-100"
                  : "bg-white border-rose-200 text-slate-800 shadow-xs"
              }`}
            >
              <span className="block text-[11px] font-semibold text-slate-500 dark:text-rose-300/70">
                Commune:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
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
                  : "bg-emerald-50 border-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>{t.delivery.colAgency}: {sampleWilaya.agency}</span>
                <span className="text-[11px] font-semibold">
                  {lang === "ar" ? "الخيارات ظاهرة للزبون ✓" : "Options visibles ✓"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div
                  className={`p-3 rounded-xl border-2 border-emerald-500 flex items-center justify-between ${
                    dark ? "bg-[#281833]" : "bg-white shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      À la maison
                    </span>
                  </div>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatDzd(sampleWilaya.homePrice)}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between opacity-85 ${
                    dark
                      ? "bg-[#281833] border-rose-900/60"
                      : "bg-white border-rose-200 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-white">
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
              className={`p-3.5 rounded-2xl border border-dashed text-center text-xs ${
                dark
                  ? "border-rose-900/60 bg-rose-950/20 text-rose-200/90"
                  : "border-rose-300 bg-rose-50/70 text-slate-700"
              }`}
            >
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                {lang === "ar"
                  ? "خيارات التوصيل (المنزل / الوكالة) مخفية تماماً عن الزبون"
                  : "Le choix du mode de livraison est masqué"}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-rose-200/80">
                {lang === "ar"
                  ? "لن يُطلب من الزبون الاختيار ولن تُحسب له أي رسوم توصيل."
                  : "Le client n'a pas à choisir et aucun frais de livraison n'est calculé."}
              </span>
            </div>
          )}

          {/* Price Calculation Simulation */}
          <div
            className={`p-3.5 rounded-xl border space-y-1.5 text-xs ${
              dark
                ? "bg-[#281833] border-rose-900/60 text-rose-100"
                : "bg-white border-rose-200 text-slate-800 shadow-xs"
            }`}
          >
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-rose-300/70">
                Sous-total Livre (1 × 1 500 DZD):
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatDzd(1500)}
              </span>
            </div>

            {deliveryEnabled && (
              <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-semibold">
                <span>Frais de Livraison (16 - Alger • À la maison):</span>
                <span>{formatDzd(sampleWilaya.homePrice)}</span>
              </div>
            )}

            <div className="border-t border-rose-500/20 pt-1.5 flex justify-between font-extrabold text-sm text-rose-600 dark:text-rose-400">
              <span>Total à Payer:</span>
              <span>
                {deliveryEnabled
                  ? formatDzd(1500 + Number(sampleWilaya.homePrice))
                  : formatDzd(1500)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
