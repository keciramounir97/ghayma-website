import React from "react";
import Card from "@mui/material/Card";
import { RotateCcw, PackageCheck, Truck, Clock, AlertCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function RefundPolicyPage() {
  const { lang, dark } = useAppContext();
  const isAr = lang === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
          <RotateCcw className="w-4 h-4" />
          <span>{isAr ? "سياسة الاستبدال والتحقق" : "Politique de Retour & Échange"}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
          {isAr ? "سياسة الاستبدال والإرجاع — كتب غيمة" : "Politique de Retour & Échange — Ghayma RD"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 max-w-xl mx-auto">
          {isAr
            ? "حرصاً منا على رضاكِ الكامل وتجربة قراءة مبهجة ومضمونة."
            : "Conditions claires et transparentes adaptées au paiement à la livraison en Algérie."}
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
            <PackageCheck className="w-5 h-5 shrink-0" />
            <span>{isAr ? "1. معاينة الطرد عند الاستلام" : "1. Vérification du colis à la livraison"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "نظراً لأن جميع الطلبات تتم بنظام الدفع عند الاستلام (Cash on Delivery)، يحق للزبونة معاينة حالة الطرد الخارجية مع عامل التوصيل قبل السداد."
              : "Les commandes étant réglées à la livraison (Cash on Delivery), nous vous encourageons à vérifier le bon état extérieur du colis lors de la remise par le livreur."}
          </p>
        </section>

        <section className="space-y-2.5 pb-5 border-b border-rose-500/15">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 shrink-0" />
            <span>{isAr ? "2. استبدال النسخ التالفة أو عيوب الطباعة" : "2. Échange en cas de défaut d'impression"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "في حال وجود أي عيب طباعة غير متوقع (صفحات بيضاء، غلاف ممزق أثناء الشحن)، نلتزم باستبدال النسخة بنسخة جديدة وسليمة مجاناً خلال 48 ساعة من تاريخ الاستلام."
              : "Si votre livre présente un défaut d'impression avéré ou a été endommagé durant le transport, nous procédons à son échange gratuit contre un exemplaire neuf sous 48 heures ouvrées."}
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Clock className="w-5 h-5 shrink-0" />
            <span>{isAr ? "3. إجراءات طلب الاستبدال" : "3. Démarche pour demander un échange"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "يكفي إرسال صورة للعيب مع رقم الطلب عبر واتساب أو إنستغرام @ghayma_rd، وسيقوم فريقنا بالتنسيق الفوري معكِ لاستبدال كتابكِ بكل سرور."
              : "Il vous suffit d'envoyer une photo du défaut ainsi que vos coordonnées à contact@ghaymard.dz ou sur notre Instagram @ghayma_rd pour prise en charge immédiate."}
          </p>
        </section>
      </Card>
    </div>
  );
}
