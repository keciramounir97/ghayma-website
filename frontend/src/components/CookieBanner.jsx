import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Cookie, ShieldCheck, X, Settings2, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

const COOKIE_STORAGE_KEY = "ghayma_cookie_consent_v1";

export default function CookieBanner() {
  const { lang, dark, addToast } = useAppContext();
  const [showBanner, setShowBanner] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Preference switches
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    functional: true,
    analytics: false
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!stored) {
        // Show banner after brief delay
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      } else {
        const parsed = JSON.parse(stored);
        setPreferences(parsed.preferences || preferences);
      }
    } catch (_) {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (prefs) => {
    const payload = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      preferences: prefs
    };
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}
    setShowBanner(false);
    setCustomModalOpen(false);
  };

  const handleAcceptAll = () => {
    const all = { essential: true, functional: true, analytics: true };
    setPreferences(all);
    saveConsent(all);
    addToast(
      lang === "ar"
        ? "تم حفظ تفضيلات ملفات تعريف الارتباط 🌸"
        : "Préférences de cookies enregistrées 🌸"
    );
  };

  const handleRejectNonEssential = () => {
    const min = { essential: true, functional: false, analytics: false };
    setPreferences(min);
    saveConsent(min);
    addToast(
      lang === "ar"
        ? "تم تعطيل ملفات تعريف الارتباط غير الضرورية ✨"
        : "Cookies non-essentiels refusés ✨"
    );
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
    addToast(
      lang === "ar"
        ? "تم حفظ اختياراتكِ المخصصة 🌸"
        : "Vos choix personnalisés ont été enregistrés 🌸"
    );
  };

  // Expose function globally so footer / user dropdown can re-open banner
  useEffect(() => {
    window.__openGhaymaCookieSettings = () => setCustomModalOpen(true);
    return () => {
      delete window.__openGhaymaCookieSettings;
    };
  }, []);

  if (!showBanner && !customModalOpen) return null;

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {showBanner && (
        <aside
          role="region"
          aria-label={lang === "ar" ? "إشعار ملفات تعريف الارتباط" : "Gestion des cookies"}
          className="fixed bottom-3 sm:bottom-6 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-bounce-subtle"
        >
          <div
            className={`p-5 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all ${
              dark
                ? "bg-[#1c1223]/95 border-rose-900/60 text-rose-50 shadow-black/40"
                : "bg-white/95 border-rose-200 text-slate-800 shadow-rose-500/10"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Cookie className="w-5 h-5" />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-slate-900 dark:text-rose-100">
                    {lang === "ar"
                      ? "احترام خصوصيتكِ وملفات الارتباط 🌸"
                      : "Respect de votre vie privée ♡"}
                  </h3>
                  <button
                    onClick={() => setShowBanner(false)}
                    aria-label="Fermer"
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-rose-200/80">
                  {lang === "ar"
                    ? "نستخدم ملفات تعريف الارتباط الأساسية لضمان عمل السلة ومواقيت الصلاة والتفضيلات (الوضع الليلي واللغة) بأمان تام."
                    : "Nous utilisons des cookies strictement nécessaires et des préférences locales (langue, thème, prières) pour vous offrir une expérience fluide et sécurisée."}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    {lang === "ar" ? "قبول الكل" : "Tout accepter"}
                  </button>

                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="px-3.5 py-2 rounded-full border border-rose-500/30 text-rose-600 dark:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {lang === "ar" ? "رفض الاختياري" : "Refuser non-essentiels"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomModalOpen(true)}
                    className="px-2.5 py-2 text-[11px] text-slate-500 dark:text-rose-300 hover:text-rose-600 underline font-medium cursor-pointer"
                  >
                    {lang === "ar" ? "تخصيص ⚙️" : "Personnaliser"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Customize Preferences Modal */}
      <Dialog
        open={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "28px",
            bgcolor: dark ? "#191021" : "#ffffff",
            color: dark ? "#fff1f2" : "#0f172a",
            p: 1
          }
        }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-rose-500/15 pb-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-rose-500" />
            <span className="font-editorial text-lg sm:text-xl font-bold">
              {lang === "ar"
                ? "تخصيص ملفات تعريف الارتباط والخصوصية"
                : "Personnalisation des Cookies & Confidentialité"}
            </span>
          </div>
          <button
            onClick={() => setCustomModalOpen(false)}
            aria-label="Fermer"
            className="p-1 rounded-full text-slate-400 hover:text-rose-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogTitle>

        <DialogContent className="space-y-4 pt-4">
          <p className="text-xs text-slate-600 dark:text-rose-200/80 leading-relaxed">
            {lang === "ar"
              ? "يمكنكِ اختيار الفئات التي ترغبين في تفعيلها. يتم حفظ اختياركِ دائماً ويمكنكِ تغييره في أي وقت من أسفل الصفحة."
              : "Vous pouvez choisir les catégories à activer. Votre choix est mémorisé et modifiable à tout moment depuis le pied de page."}
          </p>

          <div className="space-y-3">
            {/* Essential */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                dark ? "bg-[#22152b] border-rose-900/50" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="pr-2">
                <div className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-rose-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{lang === "ar" ? "ملفات أساسية (إلزامية)" : "Cookies Essentiels (Obligatoires)"}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-rose-300/70 mt-0.5">
                  {lang === "ar"
                    ? "ضرورية لتشغيل جلسة المستخدم، استمارة الطلب والأمان وحفظ التفضيلات."
                    : "Indispensables au fonctionnement du panier, sessions et sécurité."}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 px-2.5 py-1 rounded-full bg-emerald-500/10 shrink-0">
                Toujours actif
              </span>
            </div>

            {/* Functional / Preferences */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                dark ? "bg-[#22152b] border-rose-900/50" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="pr-2">
                <div className="text-xs font-bold text-slate-900 dark:text-rose-100">
                  {lang === "ar" ? "تفضيلات المستخدم (الوضع واللغة والروتين)" : "Cookies de Préférences"}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-rose-300/70 mt-0.5">
                  {lang === "ar"
                    ? "لحفظ لغتكِ المفضلة، تفعيل الوضع الداكن/الفاتح، وتثبيت مهام الروتين."
                    : "Mémorisation de la langue, du mode clair/sombre et des streaks."}
                </p>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.functional}
                    onChange={(e) =>
                      setPreferences({ ...preferences, functional: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label=""
                className="!m-0"
              />
            </div>

            {/* Analytics */}
            <div
              className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                dark ? "bg-[#22152b] border-rose-900/50" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="pr-2">
                <div className="text-xs font-bold text-slate-900 dark:text-rose-100">
                  {lang === "ar" ? "إحصائيات مجهولة الهوية" : "Mesure d'Audience Anonyme"}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-rose-300/70 mt-0.5">
                  {lang === "ar"
                    ? "تساعدنا على معرفة عدد الزائرات لتحسين سرعة وأداء الموقع دون تتبع شخصي."
                    : "Comptabilisation anonyme des visites pour améliorer la rapidité."}
                </p>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label=""
                className="!m-0"
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className="border-t border-rose-500/15 p-3 flex justify-between">
          <button
            type="button"
            onClick={handleRejectNonEssential}
            className="px-4 py-2 rounded-full border border-slate-300 dark:border-rose-900/50 text-xs font-bold text-slate-700 dark:text-rose-200 hover:bg-slate-100 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            {lang === "ar" ? "رفض غير الضروري" : "Refuser tout"}
          </button>
          <button
            type="button"
            onClick={handleSaveCustom}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md hover:from-rose-600 hover:to-pink-600 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "حفظ التفضيلات" : "Enregistrer mes choix"}</span>
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
