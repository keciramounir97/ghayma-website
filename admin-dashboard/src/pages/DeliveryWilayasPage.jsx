import React, { useState, useMemo } from "react";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  Search,
  Save,
  Home as HomeIcon,
  Building2,
  Edit3,
  CheckCircle2,
  Circle,
  Sliders,
  Sparkles
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { saveDeliveryWilayasToFirestore } from "../firebase.js";

export default function DeliveryWilayasPage() {
  const {
    t,
    lang,
    dark,
    wilayas,
    setWilayas,
    deliveryEnabled,
    toggleDeliveryEnabled,
    formatDzd,
    addToast,
    setSelectedWilayaTicket
  } = useAdminContext();

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [bulkAgency, setBulkAgency] = useState("Yalidine Express");
  const [bulkHome, setBulkHome] = useState(750);
  const [bulkAgencyPrice, setBulkAgencyPrice] = useState(450);

  const handleWilayaChange = (code, field, value) => {
    setWilayas((prev) =>
      prev.map((w) => (w.code === code ? { ...w, [field]: value } : w))
    );
  };

  const handleBulkApply = () => {
    setWilayas((prev) =>
      prev.map((w) => ({
        ...w,
        agency: bulkAgency || w.agency,
        homePrice: Number(bulkHome) || w.homePrice,
        agencyPrice: Number(bulkAgencyPrice) || w.agencyPrice
      }))
    );
    addToast("Tarifs appliqués aux 69 Wilayas ! Cliquez sur Enregistrer.");
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleDeliveryEnabled();
    } finally {
      setToggling(false);
    }
  };

  const handleSaveAllWilayas = async () => {
    setSaving(true);
    try {
      await saveDeliveryWilayasToFirestore(wilayas, deliveryEnabled);
      addToast(t.delivery.savedToast);
    } catch {
      addToast("Error saving wilaya prices", "error");
    } finally {
      setSaving(false);
    }
  };

  const filteredWilayas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return wilayas;
    return wilayas.filter(
      (w) =>
        w.code.toLowerCase().includes(q) ||
        w.nameFr.toLowerCase().includes(q) ||
        w.nameAr.toLowerCase().includes(q) ||
        (w.agency || "").toLowerCase().includes(q)
    );
  }, [wilayas, search]);

  return (
    <div className="space-y-6">
      {/* Top Header + Save All Button */}
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
      >
        <div className="space-y-1 max-w-2xl">
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
            {t.delivery.title}
          </h2>
          <p className="text-xs sm:text-sm opacity-75">{t.delivery.subtitle}</p>
        </div>

        <button
          onClick={handleSaveAllWilayas}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-500/30 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? t.delivery.saving : t.delivery.saveAllBtn}</span>
        </button>
      </Card>

      {/* Green Check Activation Banner (Controls whether this page and client delivery fees are active) */}
      <Card
        elevation={dark ? 6 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1e1327" : "#ffffff"
        }}
        className={`border-2 p-5 sm:p-6 transition-all duration-300 ${
          deliveryEnabled
            ? "border-emerald-500/50 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent"
            : "border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              {deliveryEnabled ? (
                <Chip
                  icon={<CheckCircle2 className="w-3.5 h-3.5 !text-emerald-500" />}
                  label={
                    lang === "ar"
                      ? "الصفحة والأسعار مفعلة للزبائن (Coché Vert ✓)"
                      : "Page & Tarifs ACTIVÉS pour les clients (Coché Vert ✓)"
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
                  label={
                    lang === "ar"
                      ? "الصفحة والأسعار معطلة حالياً عن الزبائن"
                      : "Page & Tarifs DÉSACTIVÉS pour les clients"
                  }
                  size="small"
                  sx={{
                    bgcolor: "rgba(245, 158, 11, 0.15)",
                    color: "#f59e0b",
                    fontWeight: 800,
                    border: "1px solid rgba(245, 158, 11, 0.3)"
                  }}
                />
              )}
              <span className="text-xs opacity-75 font-medium">
                {lang === "ar" ? "إعدادات المتجر" : "Paramètres"}
              </span>
            </div>

            <h3 className="font-editorial text-lg sm:text-xl font-bold text-slate-900 dark:text-rose-50">
              {deliveryEnabled
                ? lang === "ar"
                  ? "خيارات التوصيل (المنزل / الوكالة) ظاهرة الآن للزبائن وتُحسب في المجموع ✓"
                  : "Les tarifs et choix de livraison sont actuellement visibles pour les clients ✓"
                : lang === "ar"
                ? "أسعار التوصيل مخفية عن الزبائن ولن تُحسب في المجموع الكلي ○"
                : "Les tarifs sont actuellement masqués aux clients et aucun frais n'est ajouté ○"}
            </h3>

            <p className="text-xs text-slate-600 dark:text-rose-200/80 leading-relaxed">
              {deliveryEnabled
                ? lang === "ar"
                  ? "الزبائن يختارون في الاستمارة بين التوصيل للمنزل أو استلام من الوكالة مع احتساب السعر في المجموع. يمكنكِ التعطيل بالنقر على الزر الأخضر."
                  : "Les clients peuvent choisir entre « À la maison » et « À l'agence ». Si vous décochez, les options seront masquées."
                : lang === "ar"
                ? "استمارة الطلب لدى الزبائن لا تحتوي حالياً على اختيار للمنزل أو للوكالة ولا يُحسب أي سعر توصيل. اضغطي على الزر لوضع علامة صح خضراء والتفعيل."
                : "Le formulaire client ne contient aucun choix de livraison et n'ajoute aucun frais au total. Cliquez sur le bouton pour cocher en vert et activer."}
            </p>
          </div>

          {/* GREEN CHECK TOGGLE BUTTON */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={toggling}
            className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-300 cursor-pointer select-none active:scale-95 shrink-0 ${
              deliveryEnabled
                ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600"
                : dark
                ? "bg-[#25172e] hover:bg-[#2f1d3a] text-rose-100 border-2 border-rose-900/60 hover:border-rose-500/50"
                : "bg-slate-50 hover:bg-slate-100 text-slate-900 border-2 border-slate-300 hover:border-emerald-500 shadow-sm"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ${
                deliveryEnabled
                  ? "bg-white text-emerald-600 shadow-sm"
                  : dark
                  ? "bg-[#180e20] text-rose-300"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {deliveryEnabled ? (
                <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>

            <div className="text-start">
              <div>
                {deliveryEnabled
                  ? lang === "ar"
                    ? "مفعّل (علامة خضراء ✓)"
                    : "ACTIVÉ (Coché Vert ✓)"
                  : lang === "ar"
                  ? "اضغطي للتفعيل بعلامة خضراء"
                  : "Cocher en vert pour activer"}
              </div>
              <div className="text-[10px] opacity-80 font-normal">
                {deliveryEnabled
                  ? lang === "ar"
                    ? "اضغطي للتعطيل"
                    : "Cliquez pour désactiver"
                  : lang === "ar"
                  ? "معطل حالياً عن الزبائن"
                  : "Désactivé pour les clients"}
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Bulk Quick Fill Bar */}
      <div
        className={`rounded-3xl border p-4 sm:p-6 ${
          dark
            ? "bg-[#21142a] border-rose-900/50"
            : "bg-rose-50/70 border-rose-200/70"
        }`}
      >
        <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3">
          {t.delivery.bulkTitle}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1">
              {t.delivery.bulkAgency}
            </label>
            <input
              type="text"
              value={bulkAgency}
              onChange={(e) => setBulkAgency(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold ${
                dark
                  ? "bg-[#170e1e] border-rose-900 text-white"
                  : "bg-white border-rose-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              {t.delivery.bulkHome}
            </label>
            <input
              type="number"
              value={bulkHome}
              onChange={(e) => setBulkHome(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold ${
                dark
                  ? "bg-[#170e1e] border-rose-900 text-white"
                  : "bg-white border-rose-200"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              {t.delivery.bulkStopDesk}
            </label>
            <input
              type="number"
              value={bulkAgencyPrice}
              onChange={(e) => setBulkAgencyPrice(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold ${
                dark
                  ? "bg-[#170e1e] border-rose-900 text-white"
                  : "bg-white border-rose-200"
              }`}
            />
          </div>

          <button
            type="button"
            onClick={handleBulkApply}
            className="py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer"
          >
            {t.delivery.applyAllBtn}
          </button>
        </div>
      </div>

      {/* Main 69 Wilayas Container */}
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-4 sm:p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.delivery.searchWilaya}
              className={`w-full ps-10 pe-4 py-2.5 rounded-full border text-xs ${
                dark
                  ? "bg-[#25172e] border-rose-900/60 text-white"
                  : "bg-rose-50/50 border-rose-200"
              }`}
            />
          </div>

          <button
            onClick={handleSaveAllWilayas}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.delivery.saveAllBtn}</span>
          </button>
        </div>

        {/* ================================================================ */}
        {/* MOBILE & TABLET VIEW: Interactive Cards (Tap to open Wilaya Modal) */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
          {filteredWilayas.map((w) => (
            <div
              key={w.code}
              onClick={() => setSelectedWilayaTicket(w)}
              className={`p-4 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer space-y-2.5 ${
                dark
                  ? "bg-[#24162e] border-rose-900/60 hover:border-rose-500"
                  : "bg-rose-50/40 border-rose-200/80 hover:border-rose-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center">
                    {w.code}
                  </span>
                  <div>
                    <div className="font-bold text-sm">{w.nameFr}</div>
                    <div className="text-[11px] opacity-70">{w.nameAr}</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg">
                  <Edit3 className="w-3 h-3" />
                  <span>Modifier</span>
                </span>
              </div>

              <div className="text-xs opacity-80">
                Agence: <strong>{w.agency || "Yalidine Express"}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <HomeIcon className="w-3 h-3" /> Maison:
                  </span>
                  <span>{formatDzd(w.homePrice)}</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Agence:
                  </span>
                  <span>{formatDzd(w.agencyPrice)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================================================================ */}
        {/* DESKTOP VIEW: Full 69 Wilayas Editable Table                     */}
        {/* ================================================================ */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-start border-collapse text-sm">
            <thead>
              <tr
                className={`border-b text-[11px] uppercase tracking-wider ${
                  dark
                    ? "border-rose-900/60 text-rose-300/70"
                    : "border-rose-100 text-slate-500"
                }`}
              >
                <th className="py-3 px-3 text-start">{t.delivery.colCode}</th>
                <th className="py-3 px-3 text-start">{t.delivery.colWilaya}</th>
                <th className="py-3 px-3 text-start">{t.delivery.colAgency}</th>
                <th className="py-3 px-3 text-start">
                  {t.delivery.colHomePrice}
                </th>
                <th className="py-3 px-3 text-start">
                  {t.delivery.colAgencyPrice}
                </th>
                <th className="py-3 px-3 text-center">
                  {t.delivery.colActive}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-500/10">
              {filteredWilayas.map((w) => (
                <tr
                  key={w.code}
                  className="hover:bg-rose-500/5 transition-colors"
                >
                  <td className="py-3 px-3 font-extrabold text-rose-500">
                    {w.code}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold">{w.nameFr}</div>
                    <div className="text-xs opacity-70">{w.nameAr}</div>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={w.agency || ""}
                      onChange={(e) =>
                        handleWilayaChange(w.code, "agency", e.target.value)
                      }
                      className={`w-full max-w-[200px] px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                        dark
                          ? "bg-[#25172e] border-rose-900/60 text-white"
                          : "bg-rose-50/40 border-rose-200"
                      }`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={w.homePrice}
                        onChange={(e) =>
                          handleWilayaChange(
                            w.code,
                            "homePrice",
                            Number(e.target.value)
                          )
                        }
                        className={`w-28 px-3 py-1.5 rounded-xl border text-xs font-extrabold text-rose-500 ${
                          dark
                            ? "bg-[#25172e] border-rose-900/60"
                            : "bg-rose-50/40 border-rose-200"
                        }`}
                      />
                      <span className="text-[11px] opacity-60">DZD</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={w.agencyPrice}
                        onChange={(e) =>
                          handleWilayaChange(
                            w.code,
                            "agencyPrice",
                            Number(e.target.value)
                          )
                        }
                        className={`w-28 px-3 py-1.5 rounded-xl border text-xs font-extrabold text-amber-500 ${
                          dark
                            ? "bg-[#25172e] border-rose-900/60"
                            : "bg-rose-50/40 border-rose-200"
                        }`}
                      />
                      <span className="text-[11px] opacity-60">DZD</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={w.active !== false}
                      onChange={(e) =>
                        handleWilayaChange(w.code, "active", e.target.checked)
                      }
                      className="accent-rose-500 w-4 h-4 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

