// src/pages/admin/AdminSettingsPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Server, Mail, Bell, Wrench } from "lucide-react";
import { toast } from "react-hot-toast";

const STORAGE_KEY = "petcare_admin_settings_v1";

const defaultSettings = {
  supportEmail: "support@petcare.local",
  maintenanceBanner: "",
  notifyOnNewRescue: true,
  notifyOnNewDonation: true,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(defaultSettings);
  const [apiBase, setApiBase] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm((f) => ({ ...f, ...parsed }));
      }
    } catch (_) {}
    setApiBase(process.env.REACT_APP_API_BASE_URL || "http://localhost:5250/api");
  }, []);

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      toast.success("Settings saved locally (demo)");
    } catch {
      toast.error("Could not save");
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-14 px-4 sm:px-6 lg:px-10 relative">
      <div
        className="pointer-events-none absolute -bottom-20 left-1/4 w-[700px] h-[700px]
        bg-gradient-to-tr from-[#7fa37a]/20 to-[#8b6b4c]/15 rounded-full blur-[140px] opacity-50"
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">Settings</h1>
          <p className="text-[#6b7d67] mt-2 font-medium">
            Workspace preferences for this browser. Production apps would persist these on the server.
          </p>
        </motion.div>

        <div className="mt-10 space-y-8">
          <section className="rounded-3xl border border-[#8b6b4c]/30 bg-white/60 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Server className="w-5 h-5 text-[#5f7d5a]" />
              <h2 className="font-black text-[#2f3e2c]">API</h2>
            </div>
            <label className="block text-xs font-bold text-[#6b7d67] uppercase tracking-wider mb-2">
              Frontend API base (read-only)
            </label>
            <input
              readOnly
              value={apiBase}
              className="w-full rounded-xl border border-[#8b6b4c]/25 bg-[#f3f4f3]/80 px-4 py-3 text-sm text-[#2f3e2c] font-mono"
            />
          </section>

          <section className="rounded-3xl border border-[#8b6b4c]/30 bg-white/60 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-[#5f7d5a]" />
              <h2 className="font-black text-[#2f3e2c]">Contact</h2>
            </div>
            <label className="block text-xs font-bold text-[#6b7d67] uppercase tracking-wider mb-2">Support email (UI)</label>
            <input
              value={form.supportEmail}
              onChange={(e) => setForm((f) => ({ ...f, supportEmail: e.target.value }))}
              className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/90 px-4 py-3 text-[#2f3e2c] font-medium"
            />
            <label className="block text-xs font-bold text-[#6b7d67] uppercase tracking-wider mt-4 mb-2">
              Maintenance banner (optional)
            </label>
            <textarea
              rows={2}
              value={form.maintenanceBanner}
              onChange={(e) => setForm((f) => ({ ...f, maintenanceBanner: e.target.value }))}
              placeholder="Shown on admin pages only in a future build…"
              className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/90 px-4 py-3 text-[#2f3e2c] text-sm"
            />
          </section>

          <section className="rounded-3xl border border-[#8b6b4c]/30 bg-white/60 backdrop-blur-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-[#5f7d5a]" />
              <h2 className="font-black text-[#2f3e2c]">Notification preferences (local)</h2>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyOnNewRescue}
                onChange={(e) => setForm((f) => ({ ...f, notifyOnNewRescue: e.target.checked }))}
                className="w-5 h-5 rounded border-[#8b6b4c]/40"
              />
              <span className="text-sm font-bold text-[#2f3e2c]">Highlight new rescue alerts in dashboard copy</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={form.notifyOnNewDonation}
                onChange={(e) => setForm((f) => ({ ...f, notifyOnNewDonation: e.target.checked }))}
                className="w-5 h-5 rounded border-[#8b6b4c]/40"
              />
              <span className="text-sm font-bold text-[#2f3e2c]">Show donation pulse in reports hub</span>
            </label>
          </section>

          <section className="rounded-3xl border border-dashed border-[#8b6b4c]/35 bg-[#f8faf5]/80 p-6 flex gap-3">
            <Wrench className="w-5 h-5 text-[#8b6b4c] shrink-0 mt-0.5" />
            <p className="text-sm text-[#6b7d67] leading-relaxed">
              Role changes, password policy, and billing are managed via your auth provider or future admin APIs. This
              page is safe for demos and local QA.
            </p>
          </section>

          <button
            type="button"
            onClick={save}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl
            bg-gradient-to-r from-[#5f7d5a]/80 via-[#7fa37a]/90 to-[#8b6b4c]/80 text-black/90 font-black border border-[#d6e2d3]/50 shadow-lg hover:shadow-xl transition"
          >
            <Save className="w-5 h-5" />
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
