import React from "react";
import Card from "@mui/material/Card";
import { ShieldCheck, Lock, Eye, Database, Trash2, Mail, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function PrivacyPolicyPage() {
  const { lang, dark } = useAppContext();
  const isAr = lang === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8" dir={isAr ? "rtl" : "ltr"}>
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>{isAr ? "الشفافية وحماية البيانات الشخصية" : "Politique de Confidentialité & RGPD"}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-slate-900 dark:text-rose-50">
          {isAr ? "سياسة الخصوصية — غيمة (ghayma_rd)" : "Politique de Confidentialité — Ghayma RD"}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/80 max-w-xl mx-auto">
          {isAr
            ? "نحن نحترم خصوصيتكِ ونلتزم بحماية كل معلومة تشاركينها معنا بكل أمانة وشفافية."
            : "Dernière mise à jour : Novembre 2026. Nous nous engageons à protéger vos données personnelles avec rigueur et transparence."}
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
        {/* Section 1 */}
        <section className="space-y-2.5 pb-5 border-b border-rose-500/15">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Database className="w-5 h-5 shrink-0" />
            <span>{isAr ? "1. البيانات التي نجمعها ولماذا" : "1. Données collectées et finalités"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "نجمع فقط المعلومات الضرورية لمعالجة طلبات الكتب والتواصل:"
              : "Nous collectons uniquement les informations nécessaires au traitement de vos commandes de livres et à l'interaction sur notre plateforme :"}
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm ps-2">
            <li>
              <strong>{isAr ? "طلبات الشراء والتوصيل :" : "Commandes de livres :"}</strong>{" "}
              {isAr
                ? "الاسم، رقم الهاتف، الولاية (من بين 69 ولاية)، الدائرة، البلدية والعنوان الكامل لتسليم الطرد والدفع عند الاستلام."
                : "Nom, téléphone, Wilaya, Daïra, Commune et adresse pour l'expédition avec paiement à la livraison (Cash on Delivery)."}
            </li>
            <li>
              <strong>{isAr ? "حساب العضوية والتحديات :" : "Espace membre & Défis :"}</strong>{" "}
              {isAr
                ? "الاسم المستعار، الملصق الرمزي (الأفاتار)، البريد الإلكتروني، وقائمة الروتين اليومي التي تكتبينها بنفسكِ."
                : "Pseudo, avatar emoji, e-mail et routines quotidiennes personnalisées pour le suivi du streak."}
            </li>
            <li>
              <strong>{isAr ? "رسائل الاتصال والملاحظات :" : "Formulaire de contact :"}</strong>{" "}
              {isAr
                ? "الاسم، البريد الإلكتروني، ونص رسالتكِ للرد على استفساراتكِ بأفضل شكل."
                : "Nom, e-mail et contenu de votre message pour répondre à vos demandes."}
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-2.5 pb-5 border-b border-rose-500/15">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Lock className="w-5 h-5 shrink-0" />
            <span>{isAr ? "2. معالجة وتخزين البيانات بأمان" : "2. Sécurité et stockage"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "يتم حفظ البيانات في قواعد بيانات Google Firebase المؤمنة بقواعد أمان صارمة (Firestore Security Rules). لا نقوم ببيع أو تأجير أو مشاركة بياناتكِ الشخصية مع أي طرف ثالث لأغراض إعلانية على الإطلاق."
              : "Vos données sont hébergées sur Google Firebase Firestore avec des règles de sécurité strictes. Nous ne vendons, ne louons et ne transférons jamais vos données à des tiers publicitaires."}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-2.5 pb-5 border-b border-rose-500/15">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Trash2 className="w-5 h-5 shrink-0" />
            <span>{isAr ? "3. حق الحذف والنسيان (RGPD / GDPR)" : "3. Vos droits et suppression de compte"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "يحق لكِ في أي وقت مراجعة بياناتكِ أو تعديلها، أو حذف حسابكِ وجميع تعليقاتكِ وروتينكِ نهائياً بنقرة واحدة من خلال قائمة المستخدم («حذف حسابي وبياناتي») أو عبر مراسلتنا مباشرة."
              : "Vous disposez d'un droit total d'accès, de rectification et de suppression définitive de vos données. Vous pouvez déclencher la suppression complète de vos données directement depuis votre menu profil (« Supprimer mon compte & mes données »)."}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-2.5">
          <h2 className="font-editorial text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <Mail className="w-5 h-5 shrink-0" />
            <span>{isAr ? "4. التواصل والاستفسارات" : "4. Contact et réclamations"}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed">
            {isAr
              ? "لأي استفسار بخصوص سياسة الخصوصية، يرجى مراسلتنا عبر البريد الإلكتروني: contact@ghaymard.dz أو عبر حساب الإنستغرام الرسمي @ghayma_rd."
              : "Pour toute question relative à vos données personnelles, écrivez-nous à contact@ghaymard.dz ou via notre compte Instagram @ghayma_rd."}
          </p>
        </section>
      </Card>
    </div>
  );
}
