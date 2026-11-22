import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  Truck,
  Search,
  Home as HomeIcon,
  Building2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Mail,
  MapPin,
  Clock,
  Package,
  HeartHandshake
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { WILAYAS_69 } from "../data/wilayas.js";

export default function DeliveryPage() {
  const {
    deliveryEnabled,
    wilayas,
    lang,
    dark,
    formatDzd
  } = useAppContext();

  const navigate = useNavigate();
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [search, setSearch] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("all");

  const effectiveWilayas = useMemo(() => {
    return Array.isArray(wilayas) && wilayas.length > 0 ? wilayas : WILAYAS_69;
  }, [wilayas]);

  const agencies = useMemo(() => {
    const set = new Set();
    effectiveWilayas.forEach((w) => {
      if (w.agency) set.add(w.agency);
    });
    return Array.from(set);
  }, [effectiveWilayas]);

  const filteredWilayas = useMemo(() => {
    const q = search.trim().toLowerCase();
    return effectiveWilayas.filter((w) => {
      if (selectedAgency !== "all" && w.agency !== selectedAgency) return false;
      if (!q) return true;
      return (
        String(w.code).includes(q) ||
        (w.nameFr || "").toLowerCase().includes(q) ||
        (w.nameAr || "").toLowerCase().includes(q) ||
        (w.agency || "").toLowerCase().includes(q)
      );
    });
  }, [effectiveWilayas, search, selectedAgency]);

  // =========================================================================
  // CASE 1: DEACTIVATED BY OWNER FOR TECHNICAL REASONS
  // =========================================================================
  if (!deliveryEnabled) {
    return (
      <div className="relative min-h-[75vh] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
        {/* Floating Background Petals */}
        <div className="absolute top-10 left-6 text-3xl opacity-30 select-none pointer-events-none">
          🌸
        </div>
        <div className="absolute top-28 right-8 text-2xl opacity-25 select-none pointer-events-none">
          ✨
        </div>
        <div className="absolute bottom-16 left-10 text-2xl opacity-30 select-none pointer-events-none">
          🕊️
        </div>

        <Card
          elevation={dark ? 6 : 2}
          sx={{
            borderRadius: { xs: "28px", sm: "36px" },
            bgcolor: dark ? "#1a1022" : "#ffffff",
            overflow: "hidden"
          }}
          className="border-2 border-rose-500/25 p-6 sm:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-xl"
        >
          {/* Girly Icon Container */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-pink-500/20 text-rose-500 flex items-center justify-center border-2 border-rose-500/30 shadow-lg shadow-rose-500/15">
            <Truck className="w-10 h-10 text-rose-500" />
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
              !
            </span>
          </div>

          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>
                {lang === "ar"
                  ? "صفحة معطّلة مؤقتاً لأسباب تقنية"
                  : lang === "en"
                  ? "Page Temporarily Deactivated for Technical Reasons"
                  : "Page Temporairement Désactivée pour Raisons Techniques"}
              </span>
            </span>
          </div>

          {/* Main Headings */}
          <div className="space-y-3">
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
              {lang === "ar"
                ? "أسعار وطرق التوصيل معطلة حالياً من قبل الإدارة 🌸"
                : lang === "en"
                ? "Delivery Rates Temporarily Deactivated by Owner 🌸"
                : "Tarifs de Livraison Temporairement Désactivés par la Propriétaire 🌸"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed max-w-lg mx-auto">
              {lang === "ar"
                ? "تم تعطيل صفحة واختيار أسعار التوصيل مؤقتاً من قبل الكاتبة والإدارة لأسباب تقنية وتحديث اتفاقيات التوصيل لكافة 69 ولاية. يمكنكِ مع ذلك إتمام طلب كتابكِ مباشرة عبر المتجر دون احتساب رسوم توصيل إضافية في الوقت الحالي!"
                : lang === "en"
                ? "This page has been temporarily deactivated by the owner for technical maintenance and network updates across all 69 Wilayas. You can still order your book directly with standard shipping!"
                : "Cette page et le calculateur des frais de livraison ont été temporairement désactivés par l'auteure et l'administration pour des raisons techniques et de mise à niveau de notre réseau logistique dans les 69 wilayas. Vous pouvez néanmoins commander votre livre directement sans frais supplémentaires pour le moment !"}
            </p>
          </div>

          {/* Reassurance Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-start">
            <div
              className={`p-3.5 rounded-2xl border ${
                dark
                  ? "bg-[#25172e] border-rose-900/60 text-rose-100"
                  : "bg-rose-50/60 border-rose-200 text-slate-800"
              }`}
            >
              <Package className="w-4 h-4 text-rose-500 mb-1.5" />
              <div className="font-extrabold text-xs">
                {lang === "ar" ? "توصيل لكافة 69 ولاية" : "69 Wilayas couvertes"}
              </div>
              <div className="text-[11px] opacity-75 mt-0.5">
                {lang === "ar" ? "شحن آمن ومضمون" : "Expédition sécurisée"}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                dark
                  ? "bg-[#25172e] border-rose-900/60 text-rose-100"
                  : "bg-rose-50/60 border-rose-200 text-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1.5" />
              <div className="font-extrabold text-xs">
                {lang === "ar" ? "الدفع عند الاستلام" : "Paiement à la livraison"}
              </div>
              <div className="text-[11px] opacity-75 mt-0.5">
                {lang === "ar" ? "بالدينار الجزائري (DZD)" : "En Dinars (DZD)"}
              </div>
            </div>

            <div
              className={`p-3.5 rounded-2xl border ${
                dark
                  ? "bg-[#25172e] border-rose-900/60 text-rose-100"
                  : "bg-rose-50/60 border-rose-200 text-slate-800"
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-pink-500 mb-1.5" />
              <div className="font-extrabold text-xs">
                {lang === "ar" ? "خدمة زبونات متميزة" : "Service lectrices 7j/7"}
              </div>
              <div className="text-[11px] opacity-75 mt-0.5">
                {lang === "ar" ? "إجابة على كل استفسار" : "À votre écoute ♡"}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/book/hayaty-baad-ar-rida"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/25 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {lang === "ar"
                  ? "اطلبي كتاب «حياتي بعد الرضا» الآن 🌸"
                  : "Commander le livre maintenant 🌸"}
              </span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-rose-500/30 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 font-bold text-xs sm:text-sm transition-all"
            >
              <Mail className="w-4 h-4" />
              <span>{lang === "ar" ? "تواصلي معنا" : "Nous Contacter"}</span>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // =========================================================================
  // CASE 2: ACTIVATED - FULL 69 WILAYAS RATES EXPLORER
  // =========================================================================
  return (
    <div className="relative min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 sm:space-y-10">
      {/* Decorative Floating Elements */}
      <div className="absolute top-12 left-5 text-3xl opacity-35 select-none pointer-events-none">
        🌸
      </div>
      <div className="absolute top-44 right-8 text-2xl opacity-25 select-none pointer-events-none">
        🚚
      </div>
      <div className="absolute bottom-24 left-10 text-2xl opacity-30 select-none pointer-events-none">
        ✨
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-extrabold border border-rose-500/20 shadow-xs">
          <Truck className="w-4 h-4" />
          <span>
            {lang === "ar"
              ? "توصيل سريع وآمن لجميع 69 ولاية جزائرية 🇩🇿"
              : "Livraison dans les 69 Wilayas d'Algérie 🇩🇿"}
          </span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-rose-50">
          {lang === "ar"
            ? "أسعار وطرق التوصيل الرسمية 🌸"
            : "Tarifs & Modes de Livraison Officiels 🌸"}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 leading-relaxed max-w-2xl mx-auto">
          {lang === "ar"
            ? "اكتشفي أسعار التوصيل المعتمدة لكتاب «حياتي بعد الرضا» مع خياري التوصيل لباب منزلكِ أو الاستلام من أقرب وكالة ومكتب لولايتكِ بالدينار الجزائري (DZD)."
            : "Consultez les tarifs de livraison à domicile ou en agence pour l'ensemble des 69 wilayas. Les frais sont calculés automatiquement lors de votre commande."}
        </p>
      </div>

      {/* Search and Agency Filters */}
      <Card
        elevation={dark ? 4 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-4 sm:p-6 space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "ar"
                  ? "ابحثي باسم الولاية، الرقم (مثلاً: 16 Alger)، أو الشركة..."
                  : "Rechercher par wilaya, code (ex: 16), ou agence..."
              }
              className={`w-full ps-10 pe-4 py-2.5 rounded-full border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                dark
                  ? "bg-[#25172d] border-rose-900/60 text-white placeholder-rose-300/40"
                  : "bg-slate-50 border-rose-200 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          {/* Agency Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setSelectedAgency("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedAgency === "all"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                  : dark
                  ? "bg-[#25172e] text-rose-200 border border-rose-900/60"
                  : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              {lang === "ar" ? "كل الشركات ✨" : "Toutes les agences ✨"}
            </button>
            {agencies.map((ag) => (
              <button
                key={ag}
                onClick={() => setSelectedAgency(ag)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedAgency === ag
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                    : dark
                    ? "bg-[#25172e] text-rose-200 border border-rose-900/60"
                    : "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {ag}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-rose-300/70 font-semibold flex items-center justify-between">
          <span>
            {lang === "ar"
              ? `عرض ${filteredWilayas.length} ولاية من أصل ${effectiveWilayas.length}`
              : `Affichage de ${filteredWilayas.length} wilayas sur ${effectiveWilayas.length}`}
          </span>
          <span className="text-[11px] text-rose-500">
            {lang === "ar" ? "أسعار محدثة ومضبوطة بالدينار الجزائري (DZD)" : "Prix en Dinar Algérien (DZD)"}
          </span>
        </div>
      </Card>

      {/* 69 Wilayas Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredWilayas.map((wilaya) => (
          <Card
            key={wilaya.code}
            elevation={dark ? 3 : 1}
            sx={{
              borderRadius: "24px",
              bgcolor: dark ? "#1a1122" : "#ffffff",
              display: "flex",
              flexDirection: "column"
            }}
            className="border border-rose-500/20 hover:border-rose-500/50 hover:shadow-xl transition-all duration-300 p-4 sm:p-5 space-y-3.5 group"
          >
            {/* Header: Code + Wilaya Name */}
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-rose-500/15">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/25">
                  {wilaya.code}
                </span>
                <div className="min-w-0">
                  <div className="font-extrabold text-sm truncate text-slate-900 dark:text-rose-50">
                    {wilaya.nameFr}
                  </div>
                  <div className="text-xs text-rose-500 font-bold truncate">
                    {wilaya.nameAr}
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                {wilaya.agency || "Yalidine"}
              </span>
            </div>

            {/* Prices Breakdown */}
            <div className="space-y-2 text-xs">
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  dark
                    ? "bg-[#24152d] border-rose-900/40 text-rose-100"
                    : "bg-rose-50/50 border-rose-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <HomeIcon className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-semibold">
                    {lang === "ar" ? "للمنزل (À domicile):" : "À la maison :"}
                  </span>
                </div>
                <span className="font-black text-rose-600 dark:text-rose-400">
                  {formatDzd(wilaya.homePrice || 600)}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  dark
                    ? "bg-[#24152d] border-rose-900/40 text-rose-100"
                    : "bg-rose-50/50 border-rose-100 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold">
                    {lang === "ar" ? "للوكالة (Bureau):" : "À l'agence :"}
                  </span>
                </div>
                <span className="font-black text-amber-600 dark:text-amber-400">
                  {formatDzd(wilaya.agencyPrice || 400)}
                </span>
              </div>
            </div>

            {/* Order Action Button */}
            <div className="pt-1 mt-auto">
              <button
                type="button"
                onClick={() => navigate(`/book/hayaty-baad-ar-rida`)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer group-hover:scale-[1.02]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "طلب لهذه الولاية" : "Commander ici"}</span>
                <ArrowIcon className="w-3 h-3 ms-1" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filteredWilayas.length === 0 && (
        <div className="text-center py-12 space-y-2 opacity-70">
          <Truck className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm font-bold">
            {lang === "ar" ? "لم يتم العثور على ولايات مطابقة لبحثكِ" : "Aucune wilaya ne correspond à votre recherche"}
          </p>
        </div>
      )}
    </div>
  );
}
