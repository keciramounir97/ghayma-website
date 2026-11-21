import React from "react";
import Card from "@mui/material/Card";
import { Check, Trash2, MessageSquare, Mail } from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { markMessageRead, deleteMessageFromFirestore } from "../firebase.js";

export default function MessagesPage() {
  const {
    t,
    dark,
    messages,
    addToast,
    setSelectedMessageTicket
  } = useAdminContext();

  return (
    <Card
      elevation={dark ? 5 : 2}
      sx={{
        borderRadius: "28px",
        bgcolor: dark ? "#1a1121" : "#ffffff"
      }}
      className="border border-rose-500/20 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold">
          {t.messages.title}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 mt-1">
          {t.messages.subtitle}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="py-12 text-center opacity-60 text-sm">
          {t.messages.noMessages}
        </div>
      ) : (
        <>
          {/* ================================================================ */}
          {/* MOBILE & TABLET VIEW: Interactive Cards (Tap for Ticket Modal)   */}
          {/* ================================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMessageTicket(m)}
                className={`p-4 rounded-2xl border-2 transition-all active:scale-[0.98] cursor-pointer space-y-2.5 ${
                  !m.read
                    ? "border-rose-500 bg-rose-500/5"
                    : dark
                    ? "bg-[#23152c] border-rose-900/50"
                    : "bg-rose-50/40 border-rose-200/70"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <MessageSquare className="w-4 h-4 text-rose-500" />
                    <span>{m.name}</span>
                  </div>
                  {!m.read && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      Nouveau
                    </span>
                  )}
                </div>

                <div className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{m.contactInfo}</span>
                </div>

                <div className="text-xs font-bold">{m.subject}</div>
                <p className="text-xs opacity-80 line-clamp-2">{m.message}</p>

                <div className="pt-2 border-t border-rose-500/15 flex items-center justify-between text-[11px] opacity-70">
                  <span>
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleDateString()
                      : "Aujourd'hui"}
                  </span>
                  <span className="text-rose-500 font-bold">
                    Ouvrir Ticket →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ================================================================ */}
          {/* DESKTOP VIEW: Full Material Table                                */}
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
                  <th className="py-3.5 px-3 text-start">
                    {t.messages.senderCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.messages.contactCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.messages.subjectCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.messages.messageCol}
                  </th>
                  <th className="py-3.5 px-3 text-start">
                    {t.messages.dateCol}
                  </th>
                  <th className="py-3.5 px-3 text-end">
                    {t.messages.actionsCol}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-500/10">
                {messages.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMessageTicket(m)}
                    className={`hover:bg-rose-500/5 transition-colors cursor-pointer ${
                      !m.read ? "bg-rose-500/5 font-medium" : ""
                    }`}
                  >
                    <td className="py-4 px-3 font-bold">{m.name}</td>
                    <td className="py-4 px-3 text-rose-500 font-semibold">
                      {m.contactInfo}
                    </td>
                    <td className="py-4 px-3">{m.subject}</td>
                    <td className="py-4 px-3 max-w-md truncate">{m.message}</td>
                    <td className="py-4 px-3 text-xs opacity-65">
                      {m.createdAt
                        ? new Date(m.createdAt).toLocaleString()
                        : "Just now"}
                    </td>
                    <td
                      className="py-4 px-3 text-end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-1.5">
                        {!m.read && (
                          <button
                            onClick={async () => {
                              await markMessageRead(m.id, true);
                              addToast("Message marked as read");
                            }}
                            title="Mark as read"
                            className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            await deleteMessageFromFirestore(m.id);
                            addToast("Message deleted");
                          }}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

