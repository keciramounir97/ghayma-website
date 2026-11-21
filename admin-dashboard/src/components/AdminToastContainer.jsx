import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";

export default function AdminToastContainer() {
  const { toasts, dark, removeToast } = useAdminContext();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-xs sm:max-w-sm w-full px-3 pointer-events-none"
    >
      {toasts.map((toast) => {
        const isError = toast.type === "error";
        const isInfo = toast.type === "info";
        const IconComponent = isError ? AlertCircle : isInfo ? Info : CheckCircle2;

        return (
          <div
            key={toast.id}
            onDoubleClick={() => removeToast && removeToast(toast.id)}
            title="Double-cliquez pour fermer ou appuyez sur ✕"
            className={`pointer-events-auto group relative flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-300 select-none cursor-pointer ${
              dark
                ? isError
                  ? "bg-rose-950/95 border-rose-600 text-rose-50"
                  : isInfo
                  ? "bg-purple-950/95 border-purple-600 text-purple-50"
                  : "bg-[#23142b]/95 border-rose-500/40 text-rose-50 shadow-rose-950/50"
                : isError
                ? "bg-rose-50 border-rose-300 text-rose-950"
                : isInfo
                ? "bg-purple-50 border-purple-200 text-purple-950"
                : "bg-white/95 border-rose-200 text-slate-800 shadow-rose-100/70"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <IconComponent
                className={`w-5 h-5 shrink-0 ${
                  isError ? "text-rose-600" : isInfo ? "text-purple-500" : "text-rose-500"
                }`}
              />
              <span className="text-xs sm:text-sm font-semibold leading-tight line-clamp-2">
                {toast.message}
              </span>
            </div>

            {/* Direct Close Button on Body */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeToast && removeToast(toast.id);
              }}
              title="Fermer la notification"
              aria-label="Fermer"
              className={`p-1 rounded-xl transition-all shrink-0 cursor-pointer ${
                dark
                  ? "text-rose-300/70 hover:text-white hover:bg-rose-900/50"
                  : "text-slate-400 hover:text-slate-800 hover:bg-rose-100"
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
