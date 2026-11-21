import React from "react";
import Card from "@mui/material/Card";
import { Cookie, Settings, ShieldCheck, RefreshCw } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function CookiePolicyPage() {
  const { lang, dark } = useAppContext();
  const isAr = lang === "ar";

  const handleOpenCookieModal = () => {
    if (typeof window !== "undefined" && window.__openGhaymaCookieSettings) {
      window.__openGhaymaCookieSettings();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
          <Cookie className="w-4 h-4" />
          <span>{isAr ? "دليل ملفات تعريف الارتباط" : "Politique des Cookies & Traceurs"}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
          {isAr ? "ملفات تعريف الارتباط — غيمة (ghayma_rd)" : "Politique des Cookies — Ghayma RD"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 max-w-xl mx-auto">
          {isAr
            ? "شرح مفصل لكيفية استخدام ملفات تعريف الارتباط والتخزين المحلي لضمان أفضل تجربة لكِ."
            : "Transparence complète sur les traceurs et données locales stockées sur votre appareil."}
        </p>
      </div>

      <Card
        elevation={dark ? 4 : 2}
        sx={{
          borderRadius: "28px",
          bgcolor: dark ? "#191021" : "#ffffff",
          p: { xs: 3, sm: 5 }
        }}
        className="border border-rose-500/20 space-y-6 text-sm text-slate-700 dark:text-rose-100 leading-relaxed"
      >
        <section className="space-y-2.5 pb-5 border-b border-rose-500/15">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>{isAr ? "1. ما هي ملفات تعريف الارتباط المستخدمة؟" : "1. Catégories de cookies utilisées"}</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                {isAr ? "أ) ملفات ضرورية وأساسية (Strictement Nécessaires) :" : "a) Cookies strictement nécessaires :"}
              </span>
              <p>
                {isAr
                  ? "تُستخدم لحفظ أمان الموقع، جلسات الدخول للمشتركين، ورمز تفضيلات الخصوصية. لا يمكن تعطيلها لضمان عمل الموقع."
                  : "Assurent la sécurité, la conservation de la session connectée et le stockage de vos consentements."}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                {isAr ? "ب) التفضيلات والتخصيص (Préférences) :" : "b) Cookies de personnalisation :"}
              </span>
              <p>
                {isAr
                  ? "تُستخدم لحفظ تفضيل اللغة (العربية، الفرنسية، الإنجليزية)، وتفعيل الوضع المظلم أو الفاتح، وموقع الولاية لمواقيت الصلاة."
                  : "Mémorisent votre choix de langue, mode sombre/clair et ville sélectionnée pour les horaires de prières."}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                {isAr ? "ج) لا يوجد أي تتبع إعلاني خارجي :" : "c) Zéro traceur publicitaire intrusif :"}
              </span>
              <p>
                {isAr
                  ? "موقع غيمة خالٍ تماماً من إعلانات الأطراف الثالثة وملفات تتبع السلوك التجاري."
                  : "Le site Ghayma RD ne contient aucune régie publicitaire tierce ni profilage commercial."}
              </p>
            </div>
          </div>
        </section>

        {/* Change Consent Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-rose-50">
              {isAr ? "تعديل تفضيلات ملفات تعريف الارتباط" : "Modifier vos préférences de cookies"}
            </h4>
            <p className="text-xs text-slate-600 dark:text-rose-200/80">
              {isAr
                ? "يمكنكِ إعادة فتح نافذة الخيارات وتعديل موافقتكِ في أي وقت."
                : "Vous pouvez rouvrir le panneau de consentement pour adapter vos choix."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCookieModal}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-2 shrink-0 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>{isAr ? "فتح إعدادات الكوكيز" : "Paramètres des Cookies"}</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
