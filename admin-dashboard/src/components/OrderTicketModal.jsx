import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {
  X,
  Phone,
  MapPin,
  Home as HomeIcon,
  Building2,
  Truck,
  Trash2,
  Printer,
  CheckCircle2,
  Clock,
  PackageCheck,
  Ban,
  Receipt,
  Copy
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { updateOrderStatus, deleteOrderFromFirestore } from "../firebase.js";

export default function OrderTicketModal() {
  const {
    t,
    dark,
    selectedOrderTicket,
    setSelectedOrderTicket,
    formatDzd,
    addToast
  } = useAdminContext();

  const [updating, setUpdating] = useState(false);

  if (!selectedOrderTicket) return null;

  const ord = selectedOrderTicket;
  const ticketRef = `#CMD-${String(ord.id || "0001")
    .slice(-6)
    .toUpperCase()}`;

  const statusOptions = [
    {
      id: "pending",
      label: t.orders.statusPending,
      icon: Clock,
      color: "bg-amber-500/15 text-amber-500 border-amber-500/30"
    },
    {
      id: "confirmed",
      label: t.orders.statusConfirmed,
      icon: CheckCircle2,
      color: "bg-blue-500/15 text-blue-500 border-blue-500/30"
    },
    {
      id: "shipped",
      label: t.orders.statusShipped,
      icon: Truck,
      color: "bg-purple-500/15 text-purple-500 border-purple-500/30"
    },
    {
      id: "delivered",
      label: t.orders.statusDelivered,
      icon: PackageCheck,
      color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
    },
    {
      id: "cancelled",
      label: t.orders.statusCancelled,
      icon: Ban,
      color: "bg-rose-500/15 text-rose-500 border-rose-500/30"
    }
  ];

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await updateOrderStatus(ord.id, newStatus);
      setSelectedOrderTicket({ ...ord, status: newStatus });
      addToast(`Statut mis à jour : ${newStatus.toUpperCase()} ✨`);
    } catch {
      addToast("Erreur lors de la mise à jour", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    await deleteOrderFromFirestore(ord.id);
    setSelectedOrderTicket(null);
    addToast("Commande supprimée");
  };

  return (
    <Dialog
      open={Boolean(selectedOrderTicket)}
      onClose={() => setSelectedOrderTicket(null)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: dark ? "#1a1021" : "#fffafb",
          color: dark ? "#fff1f2" : "#1e293b",
          overflow: "hidden",
          m: { xs: 1.5, sm: 3 },
          border: dark
            ? "2px solid rgba(244,63,94,0.35)"
            : "2px solid rgba(244,63,94,0.25)"
        }
      }}
    >
      <div dir={t.dir} className="relative">
        {/* Top Ticket Header Banner */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest opacity-90 font-bold">
                  TICKET DE COMMANDE • GHAYMA_RD
                </div>
                <div className="font-mono text-lg sm:text-xl font-black">
                  {ticketRef}
                </div>
              </div>
            </div>

            <IconButton
              onClick={() => setSelectedOrderTicket(null)}
              sx={{ color: "#ffffff", bgcolor: "rgba(255,255,255,0.2)" }}
            >
              <X className="w-5 h-5" />
            </IconButton>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
            <span>
              {ord.createdAt
                ? new Date(ord.createdAt).toLocaleString()
                : "Aujourd'hui"}
            </span>
            <Chip
              label={(ord.status || "pending").toUpperCase()}
              size="small"
              sx={{
                bgcolor: "#ffffff",
                color: "#e11d48",
                fontWeight: 900,
                fontSize: "0.7rem"
              }}
            />
          </div>
        </div>

        {/* Perforated Receipt Edge Effect */}
        <div className="relative h-4 flex items-center justify-between overflow-hidden px-2 -my-2 z-10">
          <div
            className={`w-5 h-5 rounded-full -ms-4 ${
              dark ? "bg-[#110b15]" : "bg-slate-900/40"
            }`}
          />
          <div className="flex-1 border-b-2 border-dashed border-rose-400/50 mx-2" />
          <div
            className={`w-5 h-5 rounded-full -me-4 ${
              dark ? "bg-[#110b15]" : "bg-slate-900/40"
            }`}
          />
        </div>

        {/* Ticket Body Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 1. Ordered Book Card */}
          <div
            className={`p-4 rounded-2xl border flex items-center gap-4 ${
              dark
                ? "bg-[#24162e] border-rose-900/50"
                : "bg-white border-rose-100 shadow-sm"
            }`}
          >
            <img
              src={ord.bookCover || "/images/book-front.jpg"}
              alt={ord.bookTitle}
              className="w-16 h-22 rounded-xl object-cover shadow-md border border-rose-500/20 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold uppercase text-rose-500">
                Livre Commandé
              </div>
              <div className="font-editorial text-lg sm:text-xl font-bold truncate">
                {ord.bookTitle}
              </div>
              <div className="text-xs opacity-80 mt-1">
                Quantité: <strong className="text-rose-500">x{ord.quantity || 1}</strong>{" "}
                • Prix unitaire: <strong>{formatDzd(ord.bookUnitPrice || 1500)}</strong>
              </div>
              {ord.notes && (
                <div className="mt-1.5 text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-medium">
                  💌 Dédicace / Note: {ord.notes}
                </div>
              )}
            </div>
          </div>

          {/* 2. Client & 1-Tap Phone Actions */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              dark
                ? "bg-[#24162e] border-rose-900/50"
                : "bg-white border-rose-100 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase opacity-60 font-bold">
                  Client(e)
                </div>
                <div className="text-sm sm:text-base font-extrabold">
                  {ord.clientName}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(ord.clientPhone || "");
                    addToast("Numéro copié !");
                  }}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  title="Copier le numéro"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`tel:${ord.clientPhone}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{ord.clientPhone}</span>
                </a>
              </div>
            </div>

            <div className="border-t border-rose-500/10 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="opacity-60 block">Wilaya & Commune (69):</span>
                  <span className="font-bold block text-sm">
                    {ord.wilayaLabel}
                  </span>
                  <span className="font-semibold text-rose-500 block">
                    Baladiya: {ord.baladiya}
                  </span>
                  <span className="opacity-80 block mt-0.5">{ord.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                {ord.deliveryMethod === "home" ? (
                  <HomeIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                ) : (
                  <Building2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="opacity-60 block">Mode de Livraison:</span>
                  <span className="font-bold block text-sm text-rose-500">
                    {ord.deliveryMethod === "home"
                      ? t.orders.homeBadge
                      : t.orders.agencyBadge}
                  </span>
                  <span className="font-semibold block mt-0.5">
                    Agence: {ord.deliveryAgency || "Yalidine Express"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Receipt Financial Breakdown (DZD) */}
          <div
            className={`p-4 rounded-2xl border-2 border-dashed space-y-2 text-xs sm:text-sm ${
              dark
                ? "bg-[#160d1c] border-rose-800/50"
                : "bg-rose-50/70 border-rose-300"
            }`}
          >
            <div className="flex justify-between">
              <span className="opacity-75">Sous-total Livres:</span>
              <span className="font-bold">
                {formatDzd(
                  ord.subtotal || (ord.bookUnitPrice || 1500) * (ord.quantity || 1)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">
                Frais de Livraison ({ord.deliveryAgency}):
              </span>
              <span className="font-bold">{formatDzd(ord.deliveryFee || 0)}</span>
            </div>
            <div className="border-t border-rose-500/20 pt-2 flex justify-between items-center text-base sm:text-lg font-black text-rose-500">
              <span>TOTAL À PAYER (DZD):</span>
              <span>{formatDzd(ord.totalPrice)}</span>
            </div>
          </div>

          {/* 4. Mobile-Friendly 1-Tap Status Manipulation Grid */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider opacity-75">
              Manipuler le statut de la commande :
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {statusOptions.map((st) => {
                const Icon = st.icon;
                const isCurrent = (ord.status || "pending") === st.id;
                return (
                  <button
                    key={st.id}
                    disabled={updating}
                    onClick={() => handleStatusUpdate(st.id)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25 scale-[1.02]"
                        : `${st.color} hover:opacity-90`
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Ticket Footer Actions (Print & Delete) */}
          <div className="pt-3 border-t border-rose-500/15 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                dark
                  ? "border-rose-800 text-rose-200 hover:bg-rose-950"
                  : "border-rose-200 text-slate-700 hover:bg-rose-50"
              }`}
            >
              <Printer className="w-4 h-4 text-rose-500" />
              <span>Imprimer Ticket</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold transition-colors cursor-pointer"
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

