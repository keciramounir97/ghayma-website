import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { Feather, Cloud, Mail, Lock, Sun, Moon } from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { verifyAdminLogin } from "../firebase.js";
import AdminToastContainer from "../components/AdminToastContainer.jsx";

export default function LoginPage() {
  const {
    lang,
    setLang,
    dark,
    setDark,
    t,
    adminUser,
    setAdminUser,
    addToast
  } = useAdminContext();

  const navigate = useNavigate();
  const [email, setEmail] = useState("ghaymard@admin.dz");
  const [password, setPassword] = useState("adminghaymard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (adminUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await verifyAdminLogin(email, password);
      if (user) {
        setAdminUser(user);
        addToast(t.login.welcomeToast);
        navigate("/", { replace: true });
      } else {
        setError(t.login.invalidCreds);
        addToast(t.login.invalidCreds, "error");
      }
    } catch {
      setError(t.login.invalidCreds);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir={t.dir}
      className={`min-h-screen flex flex-col justify-center items-center p-4 transition-colors ${
        dark
          ? "bg-gradient-to-br from-[#130b18] via-[#1c1024] to-[#110915] text-white"
          : "bg-gradient-to-br from-rose-50 via-[#fff7fa] to-amber-50/50 text-slate-800"
      }`}
    >
      <AdminToastContainer />

      {/* Top Controls */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
        <div
          className={`flex items-center rounded-full p-1 border text-xs font-bold ${
            dark ? "bg-[#22152b] border-rose-900" : "bg-white border-rose-200"
          }`}
        >
          {["fr", "ar", "en"].map((code) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-2.5 py-1 rounded-full uppercase cursor-pointer ${
                lang === code ? "bg-rose-500 text-white" : "opacity-70"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className={`p-2.5 rounded-full border cursor-pointer ${
            dark
              ? "bg-[#22152b] border-rose-900 text-amber-300"
              : "bg-white border-rose-200 text-rose-600"
          }`}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <Card
        elevation={dark ? 10 : 4}
        sx={{
          borderRadius: "32px",
          bgcolor: dark ? "#1b1022" : "#ffffff"
        }}
        className="w-full max-w-md border border-rose-500/25 p-6 sm:p-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="relative w-15 h-15 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-rose-500/30">
            <Cloud className="w-7 h-7 fill-white/25 stroke-[2.2]" />
            <Feather className="w-4 h-4 absolute -bottom-0.5 -right-0.5 text-amber-100 drop-shadow" />
          </div>
          <div className="flex items-center justify-center gap-2 pt-2 whitespace-nowrap">
            <span
              dir="ltr"
              className="font-editorial text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent"
            >
              ghayma_rd
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 font-bold">
              غيمة
            </span>
          </div>
          <h1 className="font-editorial text-lg sm:text-xl font-bold">
            {t.login.title}
          </h1>
          <p className="text-xs sm:text-sm opacity-75">{t.login.subtitle}</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-2">{t.login.email}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ps-11 pe-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#261730] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-2">
              {t.login.password}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ps-11 pe-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  dark
                    ? "bg-[#261730] border-rose-900/60 text-white"
                    : "bg-rose-50/40 border-rose-200 text-slate-800"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-rose-500/30 transition-all cursor-pointer"
          >
            {loading ? t.login.signingIn : t.login.signIn}
          </button>
        </form>

        <div className="text-center text-[11px] opacity-65 pt-2">
          Admin: <strong>ghaymard@admin.dz</strong> • Pass:{" "}
          <strong>adminghaymard</strong>
        </div>
      </Card>
    </div>
  );
}
