import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import { Instagram, MapPin, Mail, Send, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";
import { createContactMessage } from "../firebase.js";
import { checkRateLimit } from "../utils/rateLimiter.js";

export default function ContactPage() {
  const { lang, t, dark, about, addToast, addNotification } = useAppContext();

  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !contactInfo.trim() || !message.trim()) return;

    if (!consent) {
      addToast(
        lang === "ar"
          ? "يرجى الموافقة على سياسة الخصوصية للمتابعة"
          : "Veuillez accepter la politique de confidentialité pour envoyer votre message"
      );
      return;
    }

    const rateCheck = checkRateLimit("message");
    if (!rateCheck.allowed) {
      addToast(rateCheck.message);
      return;
    }

    setSending(true);
    try {
      await createContactMessage({
        name: name.trim(),
        contactInfo: contactInfo.trim(),
        subject: subject.trim() || "رسالة من الموقع",
        message: message.trim()
      });
      addToast(t.contactPage.successToast);
      addNotification(
        `تم إرسال رسالتكِ بنجاح إلى ghayma_rd (ر. دحمان) 💌`,
        `Votre message a été envoyé avec succès à ghayma_rd (R.Dahmane) 💌`,
        `Your message was sent to ghayma_rd (R.Dahmane) 💌`
      );
      setName("");
      setContactInfo("");
      setSubject("");
      setMessage("");
      setConsent(false);
    } catch (err) {
      console.error("Contact error:", err);
      addToast("Error sending message", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3.5 py-1.5 rounded-full">
          {t.contactPage.tag}
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-bold">
          {t.contactPage.title}
        </h1>
        <p className={`text-xs sm:text-base ${dark ? "text-rose-200/75" : "text-slate-600"}`}>
          {t.contactPage.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 text-white shadow-xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
              {t.contactPage.instagramCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              {t.contactPage.instagramCardDesc}
            </p>
            <a
              href={about.instagramUrl || "https://www.instagram.com/ghayma_rd/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-rose-600 font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform"
            >
              <Instagram className="w-4 h-4" />
              <span>{about.instagramHandle || "@ghayma_rd"}</span>
            </a>
          </div>

          <Card
            elevation={dark ? 5 : 2}
            sx={{
              borderRadius: "28px",
              bgcolor: dark ? "#1a1121" : "#ffffff"
            }}
            className="border border-rose-500/20 p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs opacity-60">Location</div>
                <div className="text-xs sm:text-sm font-bold">
                  {lang === "ar"
                    ? about.locationAr
                    : lang === "fr"
                    ? about.locationFr
                    : about.locationEn}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs opacity-60">Instagram / Direct</div>
                <div className="text-xs sm:text-sm font-bold">
                  {about.instagramHandle || "@ghayma_rd"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card
          elevation={dark ? 6 : 3}
          sx={{
            borderRadius: "28px",
            bgcolor: dark ? "#1a1121" : "#ffffff"
          }}
          className="lg:col-span-7 border border-rose-500/20 p-5 sm:p-8 lg:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-2">
                  {t.contactPage.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.contactPage.namePlaceholder}
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#25172e] border-rose-900/60 text-white"
                      : "bg-rose-50/40 border-rose-200 text-slate-800"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">
                  {t.contactPage.emailPhoneLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder={t.contactPage.emailPhonePlaceholder}
                  className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#25172e] border-rose-900/60 text-white"
                      : "bg-rose-50/40 border-rose-200 text-slate-800"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2">
                {t.contactPage.subjectLabel}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t.contactPage.subjectPlaceholder}
                className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200 text-slate-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-2">
                {t.contactPage.messageLabel} *
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contactPage.messagePlaceholder}
                className={`w-full px-4 py-3 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200 text-slate-800"
                }`}
              />
            </div>

            {/* Explicit Consent Control (Prompt One Requirement #6) */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="contactConsent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-rose-300 text-rose-500 focus:ring-rose-400 cursor-pointer"
              />
              <label htmlFor="contactConsent" className="text-xs text-slate-600 dark:text-rose-200/80 cursor-pointer leading-relaxed">
                {lang === "ar" ? (
                  <>
                    أوافق على معالجة اسمي وبريدي الإلكتروني للإجابة على رسالتي وفقاً لـ{" "}
                    <Link to="/privacy" target="_blank" className="text-rose-500 underline font-semibold">
                      سياسة الخصوصية
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    J'accepte que mes coordonnées soient traitées pour répondre à ma demande conformément à la{" "}
                    <Link to="/privacy" target="_blank" className="text-rose-500 underline font-semibold">
                      Politique de Confidentialité
                    </Link>
                    .
                  </>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-base shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? t.contactPage.sending : t.contactPage.sendBtn}</span>
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

