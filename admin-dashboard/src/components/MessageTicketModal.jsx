import React from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { X, Mail, Trash2, Check, MessageSquare } from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { markMessageRead, deleteMessageFromFirestore } from "../firebase.js";

export default function MessageTicketModal() {
  const {
    t,
    dark,
    selectedMessageTicket,
    setSelectedMessageTicket,
    addToast
  } = useAdminContext();

  if (!selectedMessageTicket) return null;
  const msg = selectedMessageTicket;

  return (
    <Dialog
      open={Boolean(selectedMessageTicket)}
      onClose={() => setSelectedMessageTicket(null)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: dark ? "#1a1021" : "#fffafb",
          color: dark ? "#fff1f2" : "#1e293b",
          m: { xs: 1.5, sm: 3 }
        }
      }}
    >
      <div dir={t.dir} className="overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5" />
            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-85 font-bold">
                TICKET MESSAGE CONTACT
              </div>
              <div className="font-bold text-base truncate">{msg.name}</div>
            </div>
          </div>
          <IconButton
            onClick={() => setSelectedMessageTicket(null)}
            sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.2)" }}
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-rose-500 flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {msg.contactInfo}
            </span>
            <span className="opacity-60">
              {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
            </span>
          </div>

          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              dark ? "bg-[#24162e] border-rose-900/50" : "bg-white border-rose-100"
            }`}
          >
            <div className="text-xs font-bold text-rose-500">
              Sujet: {msg.subject || "Message"}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {msg.message}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {!msg.read ? (
              <button
                onClick={async () => {
                  await markMessageRead(msg.id, true);
                  setSelectedMessageTicket({ ...msg, read: true });
                  addToast("Message marqué comme lu ✨");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Marquer comme lu</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-500 font-bold">✓ Déjà lu</span>
            )}

            <button
              onClick={async () => {
                await deleteMessageFromFirestore(msg.id);
                setSelectedMessageTicket(null);
                addToast("Message supprimé");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

