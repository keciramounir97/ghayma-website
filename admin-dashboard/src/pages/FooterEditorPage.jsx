import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import {
  Save,
  Eye,
  Monitor,
  Smartphone,
  Cloud,
  Feather,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  Sparkles
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { saveFooterToFirestore } from "../firebase.js";

export default function FooterEditorPage() {
  const { lang, dark, footerContent, addToast } = useAdminContext();
  const [form, setForm] = useState(footerContent);
  const [saving, setSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState(lang || "ar");
  const [previewDevice, setPreviewDevice] = useState("desktop");

  useEffect(() => {
    setForm(footerContent);
  }, [footerContent]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFooterToFirestore(form);
      addToast(
        lang === "ar"
          ? "تم حفظ وتحديث معلومات الفوتر والشريط العلوي في الموقع مباشرة!"
          : "Informations du pied de page (Footer) mises à jour en direct !"
      );
    } catch {
      addToast("Error saving Footer settings", "error");
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
      {/* LIVE INTERACTIVE PREVIEW OF TOP RIBBON & FOOTER */}
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
                  ? "معاينة حية ومباشرة — الفوتر والشريط الإعلاني العلوي (Footer & Ribbon)"
                  : "Aperçu en Direct (Live Preview) — Pied de Page & Ruban d'Annonce"}
              </h3>
              <p className="text-[11px] opacity-65">
                {lang === "ar"
                  ? "شاهدي شكل الفوتر مباشرة على الهاتف والحاسوب أثناء التعديل"
                  : "Prévisualisez le pied de page en temps réel sur mobile et ordinateur"}
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

        {/* Live Render of Top Ribbon + Footer */}
        <div
          dir={previewLang === "ar" ? "rtl" : "ltr"}
          className={`mx-auto transition-all duration-300 rounded-3xl border overflow-hidden ${
            previewDevice === "mobile" ? "max-w-[390px]" : "w-full"
          } ${
            dark
              ? "bg-[#110a15] border-rose-950/60 text-rose-50"
              : "bg-rose-50/70 border-rose-100 text-slate-800"
          }`}
        >
          {/* Top Ribbon Preview */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white text-[11px] sm:text-xs py-2 px-3 text-center font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{getPreviewField("ribbonText")}</span>
          </div>

          {/* Footer Content Preview */}
          <div className="p-5 sm:p-8 space-y-6">
            <div
              className={`grid grid-cols-1 ${
                previewDevice === "mobile" ? "" : "md:grid-cols-3"
              } gap-6`}
            >
              {/* Brand Column */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 whitespace-nowrap">
                  <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-sm shrink-0">
                    <Cloud className="w-4 h-4 fill-white/25 stroke-[2.2]" />
                    <Feather className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-amber-100" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        dir="ltr"
                        className="font-editorial text-lg font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent"
                      >
                        ghayma_rd
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold">
                        غيمة
                      </span>
                    </div>
                    <div className="text-[10px] opacity-65">
                      {getPreviewField("brandSubtitle")}
                    </div>
                  </div>
                </div>
                <p className="text-xs opacity-75 leading-relaxed">
                  {getPreviewField("description")}
                </p>
              </div>

              {/* Contact Info Column */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-rose-500 uppercase tracking-wider">
                  {previewLang === "ar" ? "معلومات التواصل" : "Contact & Infos"}
                </h4>
                <div className="flex items-center gap-2 opacity-80">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{getPreviewField("address")}</span>
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span dir="ltr">{form.phone}</span>
                </div>
                <div className="flex items-center gap-2 opacity-80">
                  <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span dir="ltr">{form.email}</span>
                </div>
              </div>

              {/* Instagram CTA Column */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                  Instagram
                </h4>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow">
                  <Instagram className="w-3.5 h-3.5" />
                  <span dir="ltr">{form.instagramHandle || "@ghayma_rd"}</span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] opacity-75">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{getPreviewField("madeWithLove")}</span>
              </div>
              <div>{getPreviewField("copyright")}</div>
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
                {lang === "ar"
                  ? "تعديل معلومات الفوتر والشريط العلوي (Footer Settings)"
                  : "Modifier les Informations du Pied de Page (Footer)"}
              </h2>
              <p className="text-xs sm:text-sm opacity-75 mt-1">
                {lang === "ar"
                  ? "تحكمي في الشريط الإعلاني العلوي، وصف الفوتر، الهاتف، البريد، العنوان، وحقوق النشر."
                  : "Modifiez le ruban d'annonce supérieur, la description, l'email, le téléphone, l'adresse et les droits d'auteur."}
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
                  ? "حفظ وتحديث الفوتر"
                  : "Enregistrer le Footer"}
              </span>
            </button>
          </div>

          {/* Top Announcement Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Top Ribbon Text (العربية)
              </label>
              <input
                type="text"
                value={form.ribbonTextAr || ""}
                onChange={(e) =>
                  setForm({ ...form, ribbonTextAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Top Ribbon Text (Français)
              </label>
              <input
                type="text"
                value={form.ribbonTextFr || ""}
                onChange={(e) =>
                  setForm({ ...form, ribbonTextFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Top Ribbon Text (English)
              </label>
              <input
                type="text"
                value={form.ribbonTextEn || ""}
                onChange={(e) =>
                  setForm({ ...form, ribbonTextEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Brand Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Logo Subtitle (العربية)
              </label>
              <input
                type="text"
                value={form.brandSubtitleAr || ""}
                onChange={(e) =>
                  setForm({ ...form, brandSubtitleAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Logo Subtitle (Français)
              </label>
              <input
                type="text"
                value={form.brandSubtitleFr || ""}
                onChange={(e) =>
                  setForm({ ...form, brandSubtitleFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Logo Subtitle (English)
              </label>
              <input
                type="text"
                value={form.brandSubtitleEn || ""}
                onChange={(e) =>
                  setForm({ ...form, brandSubtitleEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Footer Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Footer Description (العربية)
              </label>
              <textarea
                rows={3}
                value={form.descriptionAr || ""}
                onChange={(e) =>
                  setForm({ ...form, descriptionAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Footer Description (Français)
              </label>
              <textarea
                rows={3}
                value={form.descriptionFr || ""}
                onChange={(e) =>
                  setForm({ ...form, descriptionFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Footer Description (English)
              </label>
              <textarea
                rows={3}
                value={form.descriptionEn || ""}
                onChange={(e) =>
                  setForm({ ...form, descriptionEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Contact & Social Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className={inputClass}
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
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Address / Location (العربية)
              </label>
              <input
                type="text"
                value={form.addressAr || ""}
                onChange={(e) =>
                  setForm({ ...form, addressAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Address / Location (Français)
              </label>
              <input
                type="text"
                value={form.addressFr || ""}
                onChange={(e) =>
                  setForm({ ...form, addressFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Address / Location (English)
              </label>
              <input
                type="text"
                value={form.addressEn || ""}
                onChange={(e) =>
                  setForm({ ...form, addressEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Made With Love & Copyright */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Signature Text (العربية)
              </label>
              <input
                type="text"
                value={form.madeWithLoveAr || ""}
                onChange={(e) =>
                  setForm({ ...form, madeWithLoveAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Signature Text (Français)
              </label>
              <input
                type="text"
                value={form.madeWithLoveFr || ""}
                onChange={(e) =>
                  setForm({ ...form, madeWithLoveFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Signature Text (English)
              </label>
              <input
                type="text"
                value={form.madeWithLoveEn || ""}
                onChange={(e) =>
                  setForm({ ...form, madeWithLoveEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Copyright Text (العربية)
              </label>
              <input
                type="text"
                value={form.copyrightAr || ""}
                onChange={(e) =>
                  setForm({ ...form, copyrightAr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Copyright Text (Français)
              </label>
              <input
                type="text"
                value={form.copyrightFr || ""}
                onChange={(e) =>
                  setForm({ ...form, copyrightFr: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">
                Copyright Text (English)
              </label>
              <input
                type="text"
                value={form.copyrightEn || ""}
                onChange={(e) =>
                  setForm({ ...form, copyrightEn: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}

