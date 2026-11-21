import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Save,
  Upload,
  Sparkles,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Eye,
  Smartphone,
  Monitor
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { saveHomeToFirestore, compressImageFile } from "../firebase.js";

export default function HeroEditorPage() {
  const { lang, dark, homeContent, books, formatDzd, addToast } =
    useAdminContext();
  const [form, setForm] = useState(homeContent);
  const [saving, setSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState(lang || "ar");
  const [previewDevice, setPreviewDevice] = useState("desktop");

  useEffect(() => {
    setForm(homeContent);
  }, [homeContent]);

  const featuredBook = books.find((b) => b.featured) || books[0];

  const handleImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 760, 0.84);
      setForm((prev) => ({ ...prev, [field]: dataUrl }));
      addToast("Hero image uploaded & optimized ✨");
    } catch {
      addToast("Error uploading image", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHomeToFirestore(form);
      addToast(
        lang === "ar"
          ? "تم حفظ وتحديث قسم الواجهة الرئيسية (Hero) بنجاح!"
          : "Section Hero enregistrée et mise à jour en direct !"
      );
    } catch {
      addToast("Error saving Hero section", "error");
    } finally {
      setSaving(false);
    }
  };

  const getPreviewField = (prefix) => {
    if (previewLang === "ar") return form[`${prefix}Ar`];
    if (previewLang === "fr") return form[`${prefix}Fr`];
    return form[`${prefix}En`];
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
    dark
      ? "bg-[#25172e] border-rose-900/60 text-white"
      : "bg-rose-50/40 border-rose-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      {/* LIVE PREVIEW CARD */}
      <Card
        elevation={dark ? 6 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/25 p-4 sm:p-6 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-rose-500/15">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                {lang === "ar"
                  ? "معاينة حية ومباشرة — قسم واجهة الموقع (Hero Section)"
                  : "Aperçu en Direct (Live Preview) — Section Hero Accueil"}
              </h3>
              <p className="text-[11px] opacity-65">
                {lang === "ar"
                  ? "أي تعديل تكتبينه في الأسفل يظهر هنا فوراً قبل الحفظ"
                  : "Toutes vos modifications ci-dessous s'affichent instantanément ici"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview Language Switcher */}
            <div
              className={`flex items-center rounded-full p-1 border text-xs font-bold ${
                dark
                  ? "bg-[#24162d] border-rose-900/50"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              {["ar", "fr", "en"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setPreviewLang(code)}
                  className={`px-2.5 py-1 rounded-full uppercase cursor-pointer ${
                    previewLang === code
                      ? "bg-rose-500 text-white"
                      : "opacity-70"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Preview Device Toggle */}
            <div
              className={`flex items-center rounded-full p-1 border text-xs font-bold ${
                dark
                  ? "bg-[#24162d] border-rose-900/50"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1.5 rounded-full cursor-pointer ${
                  previewDevice === "desktop"
                    ? "bg-rose-500 text-white"
                    : "opacity-70"
                }`}
                title="Desktop Preview"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1.5 rounded-full cursor-pointer ${
                  previewDevice === "mobile"
                    ? "bg-rose-500 text-white"
                    : "opacity-70"
                }`}
                title="Mobile Phone Preview"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Hero Section Render */}
        <div
          dir={previewLang === "ar" ? "rtl" : "ltr"}
          className={`mx-auto transition-all duration-300 rounded-3xl border overflow-hidden p-5 sm:p-8 ${
            previewDevice === "mobile" ? "max-w-[390px]" : "w-full"
          } ${
            dark
              ? "bg-gradient-to-br from-[#160e1c] via-[#1f1227] to-[#130c18] border-rose-900/50 text-rose-50"
              : "bg-gradient-to-br from-[#fff9fb] via-[#fff1f5] to-[#fef6e4]/50 border-rose-200 text-slate-800"
          }`}
        >
          <div
            className={`grid grid-cols-1 ${
              previewDevice === "mobile" ? "" : "lg:grid-cols-12"
            } gap-6 items-center`}
          >
            <div
              className={`${
                previewDevice === "mobile"
                  ? "text-center"
                  : "lg:col-span-7 text-start"
              } space-y-4`}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{getPreviewField("heroBadge")}</span>
              </div>

              <h1
                className={`font-editorial ${
                  previewDevice === "mobile"
                    ? "text-2xl"
                    : "text-2xl sm:text-4xl"
                } font-bold leading-tight`}
              >
                {getPreviewField("heroTitle")}
              </h1>

              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                {getPreviewField("heroSub")}
              </p>

              <div
                className={`flex flex-wrap items-center ${
                  previewDevice === "mobile"
                    ? "justify-center"
                    : "justify-start"
                } gap-2.5 pt-1`}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{getPreviewField("heroPrimaryBtn")}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border ${
                    dark
                      ? "bg-[#221529] border-rose-800 text-rose-100"
                      : "bg-white border-rose-200 text-slate-700"
                  }`}
                >
                  <span>{getPreviewField("heroSecondaryBtn")}</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-rose-500/15 text-[11px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{getPreviewField("trust1")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{getPreviewField("trust2")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="truncate">{getPreviewField("trust3")}</span>
                </div>
              </div>
            </div>

            <div
              className={`${
                previewDevice === "mobile" ? "" : "lg:col-span-5"
              } flex justify-center`}
            >
              <div className="relative w-44 sm:w-52">
                <div
                  className={`relative rounded-2xl p-2 border shadow-xl ${
                    dark
                      ? "bg-[#22152b] border-rose-900/60"
                      : "bg-white border-rose-100"
                  }`}
                >
                  <img
                    src={
                      form.heroFrontImage ||
                      featuredBook?.coverImage ||
                      "/images/book-front.jpg"
                    }
                    alt="Hero Preview"
                    className="w-full h-56 object-cover rounded-xl"
                  />
                  <div className="mt-2 flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold truncate">
                      {featuredBook?.titleAr || "حياتي بعد الرضا"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                      {formatDzd(featuredBook?.priceDzd || 1500)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* EDITOR FORM CARD */}
      <Card
        elevation={dark ? 5 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#1a1121" : "#ffffff"
        }}
        className="border border-rose-500/20 p-5 sm:p-8"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/15 pb-5">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
                {lang === "ar"
                  ? "تعديل قسم واجهة الصفحة الرئيسية (Hero Section)"
                  : "Modifier la Section Hero de la Page d'Accueil"}
              </h2>
              <p className="text-xs sm:text-sm opacity-75 mt-1">
                {lang === "ar"
                  ? "تحكمي في الشارة العلوية، العنوان الرئيسي، الوصف، الأزرار، وصور الكتاب ثلاثية الأبعاد."
                  : "Personnalisez le badge, le titre principal, le sous-titre, les boutons d'action et les images Hero."}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>
                {saving
                  ? "Saving..."
                  : lang === "ar"
                  ? "حفظ ونشر الواجهة"
                  : "Enregistrer & Publier"}
              </span>
            </button>
          </div>

          {/* Hero Badge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Badge (العربية)
              </label>
              <input
                type="text"
                value={form.heroBadgeAr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroBadgeAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Badge (Français)
              </label>
              <input
                type="text"
                value={form.heroBadgeFr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroBadgeFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Badge (English)
              </label>
              <input
                type="text"
                value={form.heroBadgeEn || ""}
                onChange={(e) =>
                  setForm({ ...form, heroBadgeEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Hero Main Title */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Title (العربية)
              </label>
              <textarea
                rows={2}
                value={form.heroTitleAr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroTitleAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Title (Français)
              </label>
              <textarea
                rows={2}
                value={form.heroTitleFr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroTitleFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Title (English)
              </label>
              <textarea
                rows={2}
                value={form.heroTitleEn || ""}
                onChange={(e) =>
                  setForm({ ...form, heroTitleEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Hero Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Subtitle (العربية)
              </label>
              <textarea
                rows={4}
                value={form.heroSubAr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroSubAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Subtitle (Français)
              </label>
              <textarea
                rows={4}
                value={form.heroSubFr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroSubFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Hero Subtitle (English)
              </label>
              <textarea
                rows={4}
                value={form.heroSubEn || ""}
                onChange={(e) =>
                  setForm({ ...form, heroSubEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Primary Button (AR)
              </label>
              <input
                type="text"
                value={form.heroPrimaryBtnAr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroPrimaryBtnAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Primary Button (FR)
              </label>
              <input
                type="text"
                value={form.heroPrimaryBtnFr || ""}
                onChange={(e) =>
                  setForm({ ...form, heroPrimaryBtnFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Primary Button (EN)
              </label>
              <input
                type="text"
                value={form.heroPrimaryBtnEn || ""}
                onChange={(e) =>
                  setForm({ ...form, heroPrimaryBtnEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* 3 Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-rose-500/10">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Trust Badge 1 (AR / FR)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Arabic"
                  value={form.trust1Ar || ""}
                  onChange={(e) =>
                    setForm({ ...form, trust1Ar: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="French"
                  value={form.trust1Fr || ""}
                  onChange={(e) =>
                    setForm({ ...form, trust1Fr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Trust Badge 2 (AR / FR)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Arabic"
                  value={form.trust2Ar || ""}
                  onChange={(e) =>
                    setForm({ ...form, trust2Ar: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="French"
                  value={form.trust2Fr || ""}
                  onChange={(e) =>
                    setForm({ ...form, trust2Fr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Trust Badge 3 (AR / FR)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Arabic"
                  value={form.trust3Ar || ""}
                  onChange={(e) =>
                    setForm({ ...form, trust3Ar: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="French"
                  value={form.trust3Fr || ""}
                  onChange={(e) =>
                    setForm({ ...form, trust3Fr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Hero Images Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-rose-500/10">
            <div className="flex items-center gap-4">
              <img
                src={form.heroFrontImage || "/images/book-front.jpg"}
                alt="Hero Front"
                className="w-20 h-24 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Hero Front Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "heroFrontImage")}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={form.heroFrontImage || ""}
                  onChange={(e) =>
                    setForm({ ...form, heroFrontImage: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={form.heroBackImage || "/images/book-back.jpg"}
                alt="Hero Back"
                className="w-20 h-24 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Hero Back Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "heroBackImage")}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={form.heroBackImage || ""}
                  onChange={(e) =>
                    setForm({ ...form, heroBackImage: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

