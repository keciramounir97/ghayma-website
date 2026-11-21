import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { X, Truck, Save, Home as HomeIcon, Building2 } from "lucide-react";
import { useAdminContext } from "../context/AdminContext.jsx";
import { saveDeliveryWilayasToFirestore } from "../firebase.js";

export default function WilayaTicketModal() {
  const {
    t,
    dark,
    wilayas,
    setWilayas,
    selectedWilayaTicket,
    setSelectedWilayaTicket,
    addToast
  } = useAdminContext();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(selectedWilayaTicket);
  }, [selectedWilayaTicket]);

  if (!form) return null;

  const handleSaveOneWilaya = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedList = wilayas.map((w) =>
        w.code === form.code
          ? {
              ...w,
              agency: form.agency,
              homePrice: Number(form.homePrice) || 0,
              agencyPrice: Number(form.agencyPrice) || 0,
              active: form.active !== false
            }
          : w
      );
      setWilayas(updatedList);
      await saveDeliveryWilayasToFirestore(updatedList);
      addToast(`Wilaya ${form.code} - ${form.nameFr} enregistrée ✨`);
      setSelectedWilayaTicket(null);
    } catch {
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={Boolean(selectedWilayaTicket)}
      onClose={() => setSelectedWilayaTicket(null)}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "28px",
          bgcolor: dark ? "#1a1021" : "#fffafb",
          color: dark ? "#fff1f2" : "#1e293b",
          m: { xs: 1.5, sm: 3 }
        }
      }}
    >
      <form onSubmit={handleSaveOneWilaya} dir={t.dir}>
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5" />
            <div>
              <div className="text-[10px] uppercase tracking-widest opacity-90 font-bold">
                TARIF WILAYA #{form.code}
              </div>
              <div className="font-bold text-base">
                {form.nameFr} ({form.nameAr})
              </div>
            </div>
          </div>
          <IconButton
            onClick={() => setSelectedWilayaTicket(null)}
            sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.2)" }}
          >
            <X className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5">
              {t.delivery.colAgency}
            </label>
            <input
              type="text"
              value={form.agency || ""}
              onChange={(e) => setForm({ ...form, agency: e.target.value })}
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold ${
                dark
                  ? "bg-[#25172e] border-rose-900 text-white"
                  : "bg-white border-rose-200"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-bold mb-1.5 text-rose-500">
                <HomeIcon className="w-3.5 h-3.5" />
                <span>À la maison (DZD)</span>
              </label>
              <input
                type="number"
                value={form.homePrice}
                onChange={(e) =>
                  setForm({ ...form, homePrice: Number(e.target.value) })
                }
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-extrabold text-rose-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900"
                    : "bg-white border-rose-200"
                }`}
              />
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-bold mb-1.5 text-amber-500">
                <Building2 className="w-3.5 h-3.5" />
                <span>À l&apos;agence (DZD)</span>
              </label>
              <input
                type="number"
                value={form.agencyPrice}
                onChange={(e) =>
                  setForm({ ...form, agencyPrice: Number(e.target.value) })
                }
                className={`w-full px-4 py-3 rounded-2xl border text-sm font-extrabold text-amber-500 ${
                  dark
                    ? "bg-[#25172e] border-rose-900"
                    : "bg-white border-rose-200"
                }`}
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs font-bold pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-rose-500 w-4 h-4"
            />
            <span>Wilaya Active pour la livraison</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t.delivery.saving : "Enregistrer cette Wilaya"}</span>
          </button>
        </div>
      </form>
    </Dialog>
  );
}

