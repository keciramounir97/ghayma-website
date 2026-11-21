import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext.jsx";

export default function ToastContainer() {
  const { toasts, dark } = useAppContext();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full px-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
            dark
              ? "bg-[#24152c]/95 border-rose-500/40 text-rose-50"
              : "bg-white/95 border-rose-200 text-slate-800"
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

