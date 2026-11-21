import React from "react";
import Card from "@mui/material/Card";
import { FileText, CheckCircle, Scale, ShieldAlert, BookOpen } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function TermsPage() {
  const { lang, dark } = useAppContext();
  const isAr = lang === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
          <Scale className="w-4 h-4" />
          <span>{isAr ? "الشروط والأحكام الرسمية" : "Conditions Générales d'Utilisation & de Vente"}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
          {isAr ? "شروط الاستخدام — كتب غيمة (ghayma_rd)" : "Conditions Générales — Ghayma RD"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 max-w-xl mx-auto">
          {isAr
            ? "شروط واضحة وشفافة تنظم طلبات الكتب والمشاركة في تحديات ومجتمع غيمة."
            : "Règles claires régissant les commandes de livres et l'utilisation de la plateforme."}
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
            <BookOpen className="w-5 h-5 shrink-0" />
            <span>{isAr ? "1. الملكية الفكرية وحقوق المؤلف" : "1. Propriété intellectuelle"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "جميع مؤلفات الكاتبة ghayma_rd (ر. دحمان) (@ghayma_rd)، بما في ذلك كتاب «حياتي بعد الرضا»، والنصوص والمقالات والصور المنشورة، محمية بموجب قوانين الملكية الفكرية وحقوق النشر. يُمنع منعاً باتاً استنساخ أو إعادة نشر أو استغلال أي محتوى دون إذن خطي مسبق."
              : "L'ensemble des œuvres littéraires, textes, extraits et visuels de l'écrivaine ghayma_rd (R.Dahmane) sont protégés par le droit d'auteur. Toute reproduction ou distribution non autorisée est interdite."}
          </p>
        </section>

        <section className="space-y-2.5 pb-5 border-b border-rose-500/15">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{isAr ? "2. طلب الكتب والدفع عند الاستلام" : "2. Commandes et Paiement à la livraison"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "يتم الدفع بالدينار الجزائري (DZD) نقداً عند استلام الطرد (Paiement à la livraison) سواء في المنزل أو لدى وكالة التوصيل. يُرجى التأكد من صحة رقم الهاتف والعنوان لضمان وصول الطلب في أسرع وقت."
              : "Les règlements s'effectuent exclusivement en Dinars Algériens (DZD) en espèces à la réception de votre colis (Cash on Delivery). Veuillez fournir un numéro de téléphone joignable et une adresse exacte."}
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{isAr ? "3. سلوك المستخدم في التحديات والتعليقات" : "3. Respect dans l'espace communautaire"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "مجتمع غيمة مساحة راقية ومحفزة لكل قارئة. يُمنع نشر أي تعليق مسيء أو غير لائق أو إعلاني. يحق لإدارة الموقع حذف أي تعليق مخالف فوراً للحفاظ على طابع الطمأنينة والاحترام."
              : "L'espace communautaire des Défis et des Articles est un lieu bienveillant et respectueux. Tout commentaire inapproprié, offensant ou publicitaire sera immédiatement supprimé."}
          </p>
        </section>
      </Card>
    </div>
  );
}
