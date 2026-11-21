import React, { useState, useMemo } from "react";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import {
  Search,
  Home as HomeIcon,
  Building2,
  Trash2,
  Receipt,
  Phone,
  MapPin,
  Sparkles
} from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { updateOrderStatus, deleteOrderFromFirestore } from "../firebase.js";

export default function OrdersPage({ previewLimit = null }) {
  const {
    t,
    dark,
    orders,
    formatDzd,
    addToast,
    setSelectedOrderTicket
  } = useAdminContext();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const list = orders.filter((o) => {
      if (statusFilter !== "all" && (o.status || "pending") !== statusFilter)
        return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (o.clientName || "").toLowerCase().includes(q) ||
        (o.clientPhone || "").toLowerCase().includes(q) ||
        (o.bookTitle || "").toLowerCase().includes(q) ||
        (o.wilayaLabel || "").toLowerCase().includes(q) ||
        (o.baladiya || "").toLowerCase().includes(q)
      );
    });
    return previewLimit ? list.slice(0, previewLimit) : list;
  }, [orders, search, statusFilter, previewLimit]);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    addToast(`Statut mis à jour : ${newStatus}`);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/15 text-blue-500 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/15 text-purple-500 border-purple-500/30";
      case "delivered":
        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
      case "cancelled":
        return "bg-rose-500/15 text-rose-500 border-rose-500/30";
      default:
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    }
  };

  return (
    <Card
      elevation={dark ? 6 : 2}
      sx={{
        borderRadius: "28px",
        bgcolor: dark ? "#1a1121" : "#ffffff"
      }}
      className="border border-rose-500/20 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6"
    >
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
              {t.orders.title}
            </h2>
            {filtered.length > 0 && (
              <button
                onClick={() => setSelectedOrderTicket(filtered[0])}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Ticket #1</span>
              </button>
            )}
          </div>
          <p className="text-xs sm:text-sm opacity-75 mt-1">
            {t.orders.subtitle}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-rose-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.orders.searchPlaceholder}
            className={`w-full ps-10 pe-4 py-2.5 rounded-full border text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 ${
              dark
                ? "bg-[#25172e] border-rose-900/60 text-white"
                : "bg-rose-50/50 border-rose-200 text-slate-800"
            }`}
          />
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {[
          { id: "all", label: t.orders.filterAll },
          { id: "pending", label: t.orders.statusPending },
          { id: "confirmed", label: t.orders.statusConfirmed },
          { id: "shipped", label: t.orders.statusShipped },
          { id: "delivered", label: t.orders.statusDelivered },
          { id: "cancelled", label: t.orders.statusCancelled }
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setStatusFilter(st.id)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              statusFilter === st.id
                ? "bg-rose-500 text-white shadow-sm"
                : dark
                ? "bg-[#24162d] text-rose-200/75 hover:text-white"
                : "bg-rose-50 text-slate-600 hover:bg-rose-100"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center opacity-60 text-sm">
          {t.orders.noOrders}
        </div>
      ) : (
        <>
          {/* ================================================================ */}
          {/* MOBILE & TABLET VIEW: Interactive Cards (Tap to open Ticket Modal) */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {filtered.map((ord, idx) => {
              const ticketCode = `#CMD-${String(ord.id || idx + 1)
                .slice(-5)
                .toUpperCase()}`;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderTicket(ord)}
                  className={`p-4 rounded-2xl border-2 transition-all active:scale-[0.98] cursor-pointer space-y-3 ${
                    dark
                      ? "bg-[#23152c] border-rose-900/60 hover:border-rose-500"
                      : "bg-rose-50/40 border-rose-200/80 hover:border-rose-400 shadow-sm"
                  }`}
                >
                  {/* Card Top Header: Ticket Number + Status Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-500/15">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-mono text-xs font-extrabold flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5" />
                        {ticketCode}
                      </span>
                      {idx === 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                          Dernière ✨
                        </span>
                      )}
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadgeStyle(
                        ord.status
                      )}`}
                    >
                      {(ord.status || "pending").toUpperCase()}
                    </span>
                  </div>

                  {/* Book + Client Summary */}
                  <div className="flex items-center gap-3">
                    <img
                      src={ord.bookCover || "/images/book-front.jpg"}
                      alt={ord.bookTitle}
                      className="w-14 h-20 rounded-xl object-cover shadow shrink-0 border border-rose-500/20"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="font-bold text-sm text-rose-500 truncate">
                        {ord.bookTitle} (x{ord.quantity || 1})
                      </div>
                      <div className="font-extrabold text-sm truncate">
                        {ord.clientName}
                      </div>
                      <div className="text-xs opacity-80 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-rose-500" />
                        <span>{ord.clientPhone}</span>
                      </div>
                      <div className="text-xs opacity-80 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">
                          {ord.wilayaLabel} — {ord.baladiya}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Delivery Type + Total DZD + Tap Hint */}
                  <div className="pt-2 border-t border-rose-500/15 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ord.deliveryMethod === "home"
                          ? "bg-rose-500/15 text-rose-500"
                          : "bg-amber-500/15 text-amber-500"
                      }`}
                    >
                      {ord.deliveryMethod === "home" ? (
                        <HomeIcon className="w-3 h-3" />
                      ) : (
                        <Building2 className="w-3 h-3" />
                      )}
                      <span>
                        {ord.deliveryMethod === "home"
                          ? "À la maison"
                          : "À l'agence"}
                      </span>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-rose-500">
                        {formatDzd(ord.totalPrice)}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-500 text-[11px] font-bold">
                        Ouvrir Ticket →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================================================================ */}
          {/* DESKTOP VIEW: Full Material Data Table (Click row for Ticket)    */}
          {/* ================================================================ */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-start border-collapse text-sm">
              <thead>
                <tr
                  className={`border-b text-[11px] uppercase tracking-wider ${
                    dark
                      ? "border-rose-900/60 text-rose-300/70"
                      : "border-rose-100 text-slate-500"
                  }`}
                >
                  <th className="py-3.5 px-3 text-start">Ticket</th>
                  <th className="py-3.5 px-3 text-start">{t.orders.bookCol}</th>
                  <th className="py-3.5 px-3 text-start">
                    {t.orders.clientCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.orders.locationCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.orders.deliveryCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.orders.totalCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.orders.statusCol}
                  </th>
                  <th className="py-3.5 px-3 text-end">
                    {t.orders.actionsCol}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10">
                {filtered.map((ord, idx) => {
                  const ticketCode = `#CMD-${String(ord.id || idx + 1)
                    .slice(-5)
                    .toUpperCase()}`;
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrderTicket(ord)}
                      className="hover:bg-rose-500/5 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-500 font-mono text-xs font-bold">
                          <Receipt className="w-3.5 h-3.5" />
                          {ticketCode}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={ord.bookCover || "/images/book-front.jpg"}
                            alt={ord.bookTitle}
                            className="w-10 h-14 rounded-lg object-cover shrink-0 border border-rose-500/20"
                          />
                          <div>
                            <div className="font-bold text-rose-500">
                              {ord.bookTitle}
                            </div>
                            <div className="text-xs opacity-75">
                              Qté: <strong>{ord.quantity || 1}</strong> ×{" "}
                              {formatDzd(ord.bookUnitPrice || 1500)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold">{ord.clientName}</div>
                        <a
                          href={`tel:${ord.clientPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-rose-500 font-semibold hover:underline"
                        >
                          {ord.clientPhone}
                        </a>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold">{ord.wilayaLabel}</div>
                        <div className="text-xs opacity-80">
                          Commune: <strong>{ord.baladiya}</strong>
                        </div>
                        <div className="text-xs opacity-65">{ord.address}</div>
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ord.deliveryMethod === "home"
                              ? "bg-rose-500/15 text-rose-500"
                              : "bg-amber-500/15 text-amber-500"
                          }`}
                        >
                          {ord.deliveryMethod === "home" ? (
                            <HomeIcon className="w-3 h-3" />
                          ) : (
                            <Building2 className="w-3 h-3" />
                          )}
                          <span>
                            {ord.deliveryMethod === "home"
                              ? t.orders.homeBadge
                              : t.orders.agencyBadge}
                          </span>
                        </span>
                        <div className="text-xs opacity-75 mt-1">
                          {ord.deliveryAgency} ({formatDzd(ord.deliveryFee)})
                        </div>
                      </td>

                      <td className="py-4 px-3 font-extrabold text-rose-500">
                        {formatDzd(ord.totalPrice)}
                      </td>

                      <td
                        className="py-4 px-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={ord.status || "pending"}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value)
                          }
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                            dark
                              ? "bg-[#25172e] border-rose-900/60 text-white"
                              : "bg-rose-50 border-rose-200 text-slate-800"
                          }`}
                        >
                          <option value="pending">
                            {t.orders.statusPending}
                          </option>
                          <option value="confirmed">
                            {t.orders.statusConfirmed}
                          </option>
                          <option value="shipped">
                            {t.orders.statusShipped}
                          </option>
                          <option value="delivered">
                            {t.orders.statusDelivered}
                          </option>
                          <option value="cancelled">
                            {t.orders.statusCancelled}
                          </option>
                        </select>
                      </td>

                      <td
                        className="py-4 px-3 text-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrderTicket(ord)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold cursor-pointer"
                          >
                            Ticket
                          </button>
                          <button
                            onClick={async () => {
                              await deleteOrderFromFirestore(ord.id);
                              addToast("Order deleted");
                            }}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

