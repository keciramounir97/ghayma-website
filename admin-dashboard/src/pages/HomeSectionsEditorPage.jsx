import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Save,
  Eye,
  Monitor,
  Smartphone,
  BookOpen,
  Quote,
  Star,
  Plus,
  Trash2
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { saveHomeToFirestore } from "../firebase.js";

export default function HomeSectionsEditorPage() {
  const { lang, dark, homeContent, addToast } = useAdminContext();
  const [form, setForm] = useState(homeContent);
  const [saving, setSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState(lang || "ar");
  const [previewDevice, setPreviewDevice] = useState("desktop");

  useEffect(() => {
    setForm(homeContent);
  }, [homeContent]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHomeToFirestore(form);
      addToast(
        lang === "ar"
          ? "تم حفظ وتحديث جميع أقسام الصفحة الرئيسية وآراء القراء بنجاح!"
          : "Sections de l'accueil et avis lectrices enregistrés en direct !"
      );
    } catch {
      addToast("Error saving sections", "error");
    } finally {
      setSaving(false);
    }
  };

  const getPreviewField = (prefix) => {
    if (previewLang === "ar") return form[`${prefix}Ar`];
    if (previewLang === "fr") return form[`${prefix}Fr`];
    return form[`${prefix}En`];
  };

  const handleTestimonialChange = (index, field, value) => {
    const list = [...(form.testimonials || [])];
    list[index] = { ...list[index], [field]: value };
    setForm({ ...form, testimonials: list });
  };

  const addTestimonial = () => {
    const newItem = {
      id: "rev-" + Date.now(),
      name: "قارئة جديدة",
      wilaya: "الجزائر العاصمة (16)",
      stars: 5,
      textAr: "كتاب رائع ومؤثر جداً، أنصح كل فتاة بقراءته!",
      textFr: "Un livre magnifique et très touchant, je le recommande vivement !",
      textEn: "A wonderful and deeply touching book, highly recommended!"
    };
    setForm({
      ...form,
      testimonials: [...(form.testimonials || []), newItem]
    });
  };

  const removeTestimonial = (index) => {
    const list = (form.testimonials || []).filter((_, i) => i !== index);
    setForm({ ...form, testimonials: list });
  };

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm ${
    dark
      ? "bg-[#25172e] border-rose-900/60 text-white"
      : "bg-rose-50/40 border-rose-200 text-slate-800"
  }`;

  return (
    <div className="space-y-6">
      {/* LIVE INTERACTIVE PREVIEW CARD */}
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
                  ? "معاينة حية ومباشرة — أقسام الكتب، الاقتباس، وآراء القارئات"
                  : "Aperçu en Direct (Live Preview) — Sections Livres, Citation & Avis"}
              </h3>
              <p className="text-[11px] opacity-65">
                {lang === "ar"
                  ? "معاينة فورية لجميع الأقسام الأخرى في الصفحة الرئيسية"
                  : "Prévisualisation en temps réel des autres sections de la page d'accueil"}
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

        {/* Live Render of Sections */}
        <div
          dir={previewLang === "ar" ? "rtl" : "ltr"}
          className={`mx-auto transition-all duration-300 space-y-5 ${
            previewDevice === "mobile" ? "max-w-[390px]" : "w-full"
          }`}
        >
          {/* 1. Books Section Header Preview */}
          <div
            className={`p-5 rounded-3xl border text-center space-y-2 ${
              dark
                ? "bg-[#150d1b] border-rose-950 text-rose-50"
                : "bg-rose-50/40 border-rose-100 text-slate-800"
            }`}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{getPreviewField("booksSectionBadge")}</span>
            </div>
            <p className="text-xs sm:text-sm opacity-80 max-w-xl mx-auto">
              {getPreviewField("booksSectionSub")}
            </p>
          </div>

          {/* 2. Poetic Quote Banner Preview */}
          <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-6 sm:p-8 text-white text-center shadow-lg space-y-2">
            <Quote className="w-7 h-7 mx-auto opacity-80" />
            <p className="font-editorial text-lg sm:text-2xl font-bold leading-relaxed">
              {getPreviewField("quoteBannerText")}
            </p>
            <div className="text-xs font-semibold text-amber-100">
              {getPreviewField("quoteBannerAuthor")}
            </div>
          </div>

          {/* 3. Testimonials Preview */}
          <div
            className={`p-5 rounded-3xl border space-y-4 ${
              dark
                ? "bg-[#150d1b] border-rose-950 text-rose-50"
                : "bg-rose-50/40 border-rose-100 text-slate-800"
            }`}
          >
            <div className="text-center space-y-1">
              <span className="text-[11px] px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 font-bold">
                {getPreviewField("testimonialsBadge")}
              </span>
              <h4 className="font-editorial text-lg sm:text-xl font-bold pt-1">
                {getPreviewField("testimonialsTitle")}
              </h4>
            </div>

            <div
              className={`grid grid-cols-1 ${
                previewDevice === "mobile" ? "" : "md:grid-cols-3"
              } gap-3`}
            >
              {(form.testimonials || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    dark
                      ? "bg-[#1e1226] border-rose-900/50"
                      : "bg-white border-rose-100"
                  }`}
                >
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: Number(item.stars) || 5 }).map(
                      (_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      )
                    )}
                  </div>
                  <p className="text-xs italic opacity-85">
                    "
                    {previewLang === "ar"
                      ? item.textAr
                      : previewLang === "fr"
                      ? item.textFr
                      : item.textEn}
                    "
                  </p>
                  <div className="pt-1 border-t border-rose-500/10 flex items-center justify-between text-[11px]">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-rose-500 font-semibold">
                      {item.wilaya}
                    </span>
                  </div>
                </div>
              ))}
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
        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/15 pb-5">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
                {lang === "ar"
                  ? "تعديل أقسام الصفحة الرئيسية الأخرى وآراء القراء"
                  : "Modifier les Sections de l'Accueil & Avis des Lectrices"}
              </h2>
              <p className="text-xs sm:text-sm opacity-75 mt-1">
                {lang === "ar"
                  ? "عدّلي ترويسة قسم الكتب، لافتة الاقتباس الأدبي، وبطاقات آراء القارئات."
                  : "Personnalisez l'en-tête des livres, la bannière de citation et les témoignages clients."}
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
                  ? "حفظ وتحديث الأقسام"
                  : "Enregistrer les Sections"}
              </span>
            </button>
          </div>

          {/* 1. BOOKS SHOWCASE HEADER */}
          <div className="space-y-4">
            <h3 className="font-editorial text-lg font-bold text-rose-500">
              1. {lang === "ar" ? "ترويسة قسم الكتب (Books Showcase Header)" : "En-tête de la Section Livres"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">
                  Badge (العربية)
                </label>
                <input
                  type="text"
                  value={form.booksSectionBadgeAr || ""}
                  onChange={(e) =>
                    setForm({ ...form, booksSectionBadgeAr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Badge (Français)
                </label>
                <input
                  type="text"
                  value={form.booksSectionBadgeFr || ""}
                  onChange={(e) =>
                    setForm({ ...form, booksSectionBadgeFr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Badge (English)
                </label>
                <input
                  type="text"
                  value={form.booksSectionBadgeEn || ""}
                  onChange={(e) =>
                    setForm({ ...form, booksSectionBadgeEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">
                  Subtitle (العربية)
                </label>
                <textarea
                  rows={2}
                  value={form.booksSectionSubAr || ""}
                  onChange={(e) =>
                    setForm({ ...form, booksSectionSubAr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Subtitle (Français)
                </label>
                <textarea
                  rows={2}
                  value={form.booksSectionSubFr || ""}
                  onChange={(e) =>
                    setForm({ ...form, booksSectionSubFr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Subtitle (English)
                </label>
                <textarea
                  rows={2}
                  value={form.booksSectionSubEn || ""}
                  onChange={(e) =>
                    setForm({ ...form, booksSectionSubEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 2. POETIC QUOTE BANNER */}
          <div className="space-y-4 pt-4 border-t border-rose-500/15">
            <h3 className="font-editorial text-lg font-bold text-rose-500">
              2. {lang === "ar" ? "لافتة الاقتباس الأدبي (Quote Banner)" : "Bannière de Citation Poétique"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">
                  Quote Text (العربية)
                </label>
                <textarea
                  rows={3}
                  value={form.quoteBannerTextAr || ""}
                  onChange={(e) =>
                    setForm({ ...form, quoteBannerTextAr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Quote Text (Français)
                </label>
                <textarea
                  rows={3}
                  value={form.quoteBannerTextFr || ""}
                  onChange={(e) =>
                    setForm({ ...form, quoteBannerTextFr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Quote Text (English)
                </label>
                <textarea
                  rows={3}
                  value={form.quoteBannerTextEn || ""}
                  onChange={(e) =>
                    setForm({ ...form, quoteBannerTextEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">
                  Quote Signature (العربية)
                </label>
                <input
                  type="text"
                  value={form.quoteBannerAuthorAr || ""}
                  onChange={(e) =>
                    setForm({ ...form, quoteBannerAuthorAr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Quote Signature (Français)
                </label>
                <input
                  type="text"
                  value={form.quoteBannerAuthorFr || ""}
                  onChange={(e) =>
                    setForm({ ...form, quoteBannerAuthorFr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Quote Signature (English)
                </label>
                <input
                  type="text"
                  value={form.quoteBannerAuthorEn || ""}
                  onChange={(e) =>
                    setForm({ ...form, quoteBannerAuthorEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 3. READER TESTIMONIALS */}
          <div className="space-y-4 pt-4 border-t border-rose-500/15">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-editorial text-lg font-bold text-rose-500">
                3. {lang === "ar" ? "قسم آراء القارئات (Testimonials)" : "Avis & Témoignages des Lectrices"}
              </h3>
              <button
                type="button"
                onClick={addTestimonial}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {lang === "ar" ? "إضافة رأي قارئة جديد" : "Ajouter un avis"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">
                  Section Title (العربية)
                </label>
                <input
                  type="text"
                  value={form.testimonialsTitleAr || ""}
                  onChange={(e) =>
                    setForm({ ...form, testimonialsTitleAr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Section Title (Français)
                </label>
                <input
                  type="text"
                  value={form.testimonialsTitleFr || ""}
                  onChange={(e) =>
                    setForm({ ...form, testimonialsTitleFr: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">
                  Section Title (English)
                </label>
                <input
                  type="text"
                  value={form.testimonialsTitleEn || ""}
                  onChange={(e) =>
                    setForm({ ...form, testimonialsTitleEn: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-4">
              {(form.testimonials || []).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className={`p-4 rounded-2xl border space-y-3 ${
                    dark
                      ? "bg-[#21142a] border-rose-900/50"
                      : "bg-rose-50/30 border-rose-200/70"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <input
                        type="text"
                        placeholder="Reader Name"
                        value={item.name || ""}
                        onChange={(e) =>
                          handleTestimonialChange(idx, "name", e.target.value)
                        }
                        className={inputClass}
                      />
                      <input
                        type="text"
                        placeholder="Wilaya"
                        value={item.wilaya || ""}
                        onChange={(e) =>
                          handleTestimonialChange(idx, "wilaya", e.target.value)
                        }
                        className={inputClass}
                      />
                      <select
                        value={item.stars || 5}
                        onChange={(e) =>
                          handleTestimonialChange(
                            idx,
                            "stars",
                            Number(e.target.value)
                          )
                        }
                        className={inputClass}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} Stars ⭐
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestimonial(idx)}
                      className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <textarea
                      rows={2}
                      placeholder="Review in Arabic"
                      value={item.textAr || ""}
                      onChange={(e) =>
                        handleTestimonialChange(idx, "textAr", e.target.value)
                      }
                      className={inputClass}
                    />
                    <textarea
                      rows={2}
                      placeholder="Review in French"
                      value={item.textFr || ""}
                      onChange={(e) =>
                        handleTestimonialChange(idx, "textFr", e.target.value)
                      }
                      className={inputClass}
                    />
                    <textarea
                      rows={2}
                      placeholder="Review in English"
                      value={item.textEn || ""}
                      onChange={(e) =>
                        handleTestimonialChange(idx, "textEn", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

