import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import {
  Sparkles,
  Heart,
  Lock,
  Mail,
  User,
  MapPin,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

const AVATAR_OPTIONS = ["🌸", "🌺", "✨", "🌙", "📖", "☕", "🕊️", "🪞"];

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, loginUser, registerUser, dark, lang, addToast } = useAppContext();
  const [tab, setTab] = useState("register"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wilaya, setWilaya] = useState("16 - Alger (الجزائر)");
  const [avatar, setAvatar] = useState("🌸");
  const [loading, setLoading] = useState(false);

  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (tab === "register") {
        const newUser = {
          id: "usr-" + Date.now(),
          name: name.trim() || (lang === "ar" ? "قارئة غيمة" : "Lectrice Ghayma"),
          email: email.trim() || `lectrice_${Date.now()}@ghayma.dz`,
          wilaya,
          avatar,
          createdAt: new Date().toISOString()
        };
        registerUser(newUser);
        addToast(
          lang === "ar"
            ? `أهلاً بكِ يا ${newUser.name} في مجتمع غيمة 🌸 تم إنشاء حسابكِ بنجاح!`
            : `Bienvenue ${newUser.name} dans la communauté Ghayma ! 🌸 Compte créé avec succès.`
        );
      } else {
        const loggedUser = {
          id: "usr-" + Date.now(),
          name: name.trim() || (email ? email.split("@")[0] : "Lectrice Ghayma"),
          email: email.trim(),
          wilaya,
          avatar,
          createdAt: new Date().toISOString()
        };
        loginUser(loggedUser);
        addToast(
          lang === "ar"
            ? `مرحباً بعودتكِ يا ${loggedUser.name} ✨`
            : `Ravi de vous revoir ${loggedUser.name} ✨`
        );
      }
      setLoading(false);
      setAuthModalOpen(false);
    }, 400);
  };

  const handleGuestQuickStart = () => {
    const quickUser = {
      id: "usr-" + Date.now(),
      name: lang === "ar" ? "رفيقة الغيم 🌸" : "Lectrice Privilégiée 🌸",
      email: `lectrice_${Math.floor(Math.random() * 9000 + 1000)}@ghayma.dz`,
      wilaya: "16 - Alger (الجزائر)",
      avatar: "🌸",
      createdAt: new Date().toISOString()
    };
    loginUser(quickUser);
    addToast(
      lang === "ar"
        ? "تم تسجيل الدخول السريع كعضوة في مجتمع غيمة! استمتعي بالتحديات ✨"
        : "Connexion rapide réussie ! Vous avez accès à tous les défis Ghayma ✨"
    );
    setAuthModalOpen(false);
  };

  return (
    <Dialog
      open={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: "24px", sm: "32px" },
          bgcolor: dark ? "#190f22" : "#ffffff",
          color: dark ? "#fff1f2" : "#0f172a",
          border: dark ? "1px solid rgba(244,63,94,0.3)" : "1px solid #fecdd3",
          overflow: "hidden"
        }
      }}
    >
      <div className="relative p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Girly Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 text-white shadow-lg shadow-rose-500/25 text-2xl mx-auto">
            {avatar}
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
            {lang === "ar" ? "انضمي إلى عائلة غيمة ✨" : "Rejoins l'Univers Ghayma ✨"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rose-200/70 max-w-sm mx-auto">
            {lang === "ar"
              ? "أنشئي حسابكِ للوصول إلى التحديات التفاعلية، التعليق، التفاعل مع المنشورات ومتابعة روتينكِ الصباحي."
              : "Créez votre compte pour accéder aux défis interactifs, commenter, liker les articles et suivre vos routines quotidiennes."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-rose-500/10 p-1 mb-6 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === "register"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
            }`}
          >
            {lang === "ar" ? "حساب جديد 🌸" : "Créer un Compte 🌸"}
          </button>
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              tab === "login"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                : "text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
            }`}
          >
            {lang === "ar" ? "تسجيل الدخول" : "Se Connecter"}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "register" && (
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-rose-200">
                {lang === "ar" ? "اسمكِ أو لقبكِ الأدبي *" : "Votre Prénom ou Pseudo *"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={lang === "ar" ? "مثال: مريم أو زهرة الغيم" : "Ex: Sarah, Amina..."}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full ps-10 pe-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    dark
                      ? "bg-[#25172d] border-rose-900/60 text-white placeholder-rose-300/40"
                      : "bg-slate-50 border-rose-200 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-rose-200">
              {lang === "ar" ? "البريد الإلكتروني *" : "Adresse Email *"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="lectrice@ghayma.dz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ps-10 pe-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172d] border-rose-900/60 text-white placeholder-rose-300/40"
                    : "bg-slate-50 border-rose-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-rose-200">
              {lang === "ar" ? "كلمة المرور *" : "Mot de Passe *"}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ps-10 pe-4 py-3 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#25172d] border-rose-900/60 text-white placeholder-rose-300/40"
                    : "bg-slate-50 border-rose-200 text-slate-900 placeholder-slate-400"
                }`}
              />
            </div>
          </div>

          {tab === "register" && (
            <div>
              <label className="block text-xs font-bold mb-2 text-slate-700 dark:text-rose-200">
                {lang === "ar" ? "اختاري أيقونة حسابكِ 🌸" : "Choisissez votre Avatar 🌸"}
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                      avatar === av
                        ? "bg-rose-500 text-white scale-110 shadow-md shadow-rose-500/30"
                        : dark
                        ? "bg-[#25172d] border border-rose-900/60 hover:bg-[#301c3b]"
                        : "bg-slate-100 hover:bg-rose-100 border border-slate-200"
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <span>
              {loading
                ? lang === "ar"
                  ? "جاري التحميل..."
                  : "Chargement..."
                : tab === "register"
                ? lang === "ar"
                  ? "تأكيد والانضمام إلى التحديات ✨"
                  : "Confirmer & Rejoindre les Défis ✨"
                : lang === "ar"
                ? "تسجيل الدخول إلى حسابي"
                : "Se Connecter à mon Espace"}
            </span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Guest Start */}
        <div className="pt-4 mt-4 border-t border-rose-500/15 text-center">
          <button
            type="button"
            onClick={handleGuestQuickStart}
            className="text-xs font-bold text-rose-500 dark:text-rose-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {lang === "ar"
                ? "دخول فوري بضغطة زر واحدة (عضوية سريعة) ⚡"
                : "Accès Instantané en 1 Clic (Sans attente) ⚡"}
            </span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
