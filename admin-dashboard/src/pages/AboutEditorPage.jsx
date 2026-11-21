import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Save,
  Upload,
  Eye,
  Monitor,
  Smartphone,
  Feather,
  Instagram
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { saveAboutToFirestore, compressImageFile } from "../firebase.js";

export default function AboutEditorPage() {
  const { t, lang, dark, about, addToast } = useAdminContext();
  const [form, setForm] = useState(about);
  const [saving, setSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState(lang || "ar");
  const [previewDevice, setPreviewDevice] = useState("desktop");

  useEffect(() => {
    setForm(about);
  }, [about]);

  const handlePhotoUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 720, 0.82);
      setForm((prev) => ({ ...prev, [field]: dataUrl }));
      addToast("Author image uploaded & optimized ✨");
    } catch {
      addToast("Error uploading image", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAboutToFirestore(form);
      addToast(t.about.savedToast);
    } catch {
      addToast("Error saving About page", "error");
    } finally {
      setSaving(false);
    }
  };

  const getPreviewField = (prefix) => {
    if (previewLang === "ar") return form[`${prefix}Ar`];
    if (previewLang === "fr") return form[`${prefix}Fr`];
    return form[`${prefix}En`];
  };

  return (
    <div className="space-y-6">
      {/* LIVE INTERACTIVE PREVIEW OF MEET THE AUTHOR SECTION */}
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
                  ? "معاينة حية ومباشرة — قسم الكاتبة (L'Écrivaine ghayma_rd)"
                  : "Aperçu en Direct (Live Preview) — Section L'Écrivaine (ghayma_rd)"}
              </h3>
              <p className="text-[11px] opacity-65">
                {lang === "ar"
                  ? "شاهدي كيف يظهر قسم الكاتبة في الصفحة الرئيسية وصفحة الكاتبة"
                  : "Prévisualisez la section L'Écrivaine en temps réel sur mobile et ordinateur"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Author Section Preview */}
        <div
          dir={previewLang === "ar" ? "rtl" : "ltr"}
          className={`mx-auto transition-all duration-300 rounded-3xl border p-5 sm:p-8 ${
            previewDevice === "mobile" ? "max-w-[390px]" : "w-full"
          } ${
            dark
              ? "bg-gradient-to-r from-[#1f1327] via-[#261730] to-[#1a1022] border-rose-900/50 text-rose-50"
              : "bg-gradient-to-r from-rose-50/90 via-pink-50/60 to-amber-50/50 border-rose-100 text-slate-800"
          }`}
        >
          <div
            className={`grid grid-cols-1 ${
              previewDevice === "mobile" ? "" : "lg:grid-cols-12"
            } gap-6 items-center`}
          >
            <div
              className={`${
                previewDevice === "mobile" ? "" : "lg:col-span-5"
              } flex justify-center`}
            >
              <div className="relative">
                <img
                  src={form.authorImage || "/images/book-spread.jpg"}
                  alt="Author Preview"
                  className="w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-3xl shadow-xl border-4 border-white dark:border-rose-950"
                />
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow">
                  <Instagram className="w-3.5 h-3.5" />
                  <span dir="ltr">{form.instagramHandle || "@ghayma_rd"}</span>
                </div>
              </div>
            </div>

            <div
              className={`${
                previewDevice === "mobile"
                  ? "text-center"
                  : "lg:col-span-7 text-start"
              } space-y-3`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold">
                <Feather className="w-3.5 h-3.5" />
                <span>
                  {previewLang === "ar"
                    ? form.authorNameAr
                    : form.authorNameFr}
                </span>
              </div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold">
                {getPreviewField("headline")}
              </h3>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed whitespace-pre-line line-clamp-4">
                {getPreviewField("bio")}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div
                  className={`p-2.5 rounded-2xl border text-center ${
                    dark
                      ? "bg-[#191020] border-rose-900/40"
                      : "bg-white border-rose-100"
                  }`}
                >
                  <div className="font-editorial text-base font-bold text-rose-500">
                    {form.statsBooks || "1+"}
                  </div>
                  <div className="text-[10px] opacity-65">Books</div>
                </div>
                <div
                  className={`p-2.5 rounded-2xl border text-center ${
                    dark
                      ? "bg-[#191020] border-rose-900/40"
                      : "bg-white border-rose-100"
                  }`}
                >
                  <div className="font-editorial text-base font-bold text-rose-500">
                    {form.statsReaders || "5,000+"}
                  </div>
                  <div className="text-[10px] opacity-65">Readers</div>
                </div>
                <div
                  className={`p-2.5 rounded-2xl border text-center ${
                    dark
                      ? "bg-[#191020] border-rose-900/40"
                      : "bg-white border-rose-100"
                  }`}
                >
                  <div className="font-editorial text-base font-bold text-rose-500">
                    {form.statsRating || "4.9/5"}
                  </div>
                  <div className="text-[10px] opacity-65">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* EDITOR FORM */}
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
                {t.about.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-75 mt-1">
                {t.about.subtitle}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs sm:text-sm font-bold shadow-lg cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>{t.about.saveBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Author Name (AR)
              </label>
              <input
                type="text"
                value={form.authorNameAr || ""}
                onChange={(e) =>
                  setForm({ ...form, authorNameAr: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Author Name (FR)
              </label>
              <input
                type="text"
                value={form.authorNameFr || ""}
                onChange={(e) =>
                  setForm({ ...form, authorNameFr: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Instagram Handle
              </label>
              <input
                type="text"
                value={form.instagramHandle || ""}
                onChange={(e) =>
                  setForm({ ...form, instagramHandle: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                value={form.instagramUrl || ""}
                onChange={(e) =>
                  setForm({ ...form, instagramUrl: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Headline (Arabic)
              </label>
              <input
                type="text"
                value={form.headlineAr || ""}
                onChange={(e) =>
                  setForm({ ...form, headlineAr: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Headline (French)
              </label>
              <input
                type="text"
                value={form.headlineFr || ""}
                onChange={(e) =>
                  setForm({ ...form, headlineFr: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Headline (English)
              </label>
              <input
                type="text"
                value={form.headlineEn || ""}
                onChange={(e) =>
                  setForm({ ...form, headlineEn: e.target.value })
                }
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Biography Content (Arabic)
              </label>
              <textarea
                rows={6}
                value={form.bioAr || ""}
                onChange={(e) => setForm({ ...form, bioAr: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                Biography Content (French)
              </label>
              <textarea
                rows={6}
                value={form.bioFr || ""}
                onChange={(e) => setForm({ ...form, bioFr: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">
                Biography Content (English)
              </label>
              <textarea
                rows={6}
                value={form.bioEn || ""}
                onChange={(e) => setForm({ ...form, bioEn: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-4">
              <img
                src={form.authorImage || "/images/book-spread.jpg"}
                alt="Author"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Portrait</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, "authorImage")}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={form.authorImage || ""}
                  onChange={(e) =>
                    setForm({ ...form, authorImage: e.target.value })
                  }
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                    dark
                      ? "bg-[#25172e] border-rose-900 text-white"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">Books</label>
                <input
                  type="text"
                  value={form.statsBooks || "1+"}
                  onChange={(e) =>
                    setForm({ ...form, statsBooks: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                    dark
                      ? "bg-[#25172e] border-rose-900 text-white"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Readers</label>
                <input
                  type="text"
                  value={form.statsReaders || "5,000+"}
                  onChange={(e) =>
                    setForm({ ...form, statsReaders: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                    dark
                      ? "bg-[#25172e] border-rose-900 text-white"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Rating</label>
                <input
                  type="text"
                  value={form.statsRating || "4.9/5"}
                  onChange={(e) =>
                    setForm({ ...form, statsRating: e.target.value })
                  }
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${
                    dark
                      ? "bg-[#25172e] border-rose-900 text-white"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                />
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
