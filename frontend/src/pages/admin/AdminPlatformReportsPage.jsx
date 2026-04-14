// src/pages/admin/AdminPlatformReportsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  PieChart,
  Heart,
  Shield,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { formatCurrency } from "../../utils/donationHelpers";

export default function AdminPlatformReportsPage() {
  const [dash, setDash] = useState(null);
  const [donStats, setDonStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [dRes, donRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/donations/admin/stats").catch(() => ({ data: {} })),
        ]);
        if (cancelled) return;
        if (dRes.data?.success) setDash(dRes.data.data);
        if (donRes.data?.success) setDonStats(donRes.data.data);
      } catch (e) {
        if (!cancelled) toast.error(e.response?.data?.message || "Could not load reports data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const users = dash?.metrics?.users;
  const pets = dash?.metrics?.pets;
  const health = dash?.metrics?.health;

  const exportDonationsCsv = async () => {
    try {
      const res = await api.get("/donations/admin/export", { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV download started");
    } catch (e) {
      toast.error("Export failed (admin only)");
    }
  };

  const cards = [
    {
      title: "Donation analytics",
      desc: "Revenue split, top campaigns, monthly gross.",
      to: "/admin/donations/reports",
      icon: PieChart,
      color: "from-[#8b6b4c]/40 to-[#5f7d5a]/30",
    },
    {
      title: "Donation ledger",
      desc: "All transactions, filters, mark paid.",
      to: "/admin/donations",
      icon: FileSpreadsheet,
      color: "from-[#7fa37a]/40 to-[#5f7d5a]/30",
    },
    {
      title: "Rescue analytics",
      desc: "Mission volume, response trends, map data.",
      to: "/admin/rescues/analytics",
      icon: BarChart3,
      color: "from-[#5f7d5a]/40 to-[#7fa37a]/30",
    },
    {
      title: "Rescue operations",
      desc: "Active requests, assignments, duplicates.",
      to: "/admin/rescues",
      icon: Shield,
      color: "from-[#a18463]/40 to-[#8b6b4c]/30",
    },
    {
      title: "Adoption pipeline",
      desc: "Pending listings and applications overview.",
      to: "/admin/adoptions",
      icon: Heart,
      color: "from-[#7fa37a]/35 to-[#a18463]/25",
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-14 px-4 sm:px-6 lg:px-10 relative">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[880px] h-[880px]
        bg-gradient-to-br from-[#7fa37a]/25 via-[#5f7d5a]/15 to-[#8b6b4c]/20 rounded-full blur-[160px] opacity-60"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">Platform reports</h1>
          <p className="text-[#6b7d67] mt-2 font-medium max-w-2xl">
            Central hub for analytics and exports. Deep-dive modules open in dedicated pages.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-12 py-20 text-center text-[#6b7d67] font-medium">Loading snapshot…</div>
        ) : (
          <>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl p-5 bg-white/60 border border-[#8b6b4c]/25 backdrop-blur-xl">
                <p className="text-xs font-black text-[#6b7d67] uppercase tracking-wider">Users</p>
                <p className="text-2xl font-black text-[#2f3e2c] mt-1">{users?.total ?? "—"}</p>
              </div>
              <div className="rounded-2xl p-5 bg-white/60 border border-[#8b6b4c]/25 backdrop-blur-xl">
                <p className="text-xs font-black text-[#6b7d67] uppercase tracking-wider">Pets</p>
                <p className="text-2xl font-black text-[#2f3e2c] mt-1">{pets?.total ?? "—"}</p>
              </div>
              <div className="rounded-2xl p-5 bg-white/60 border border-[#8b6b4c]/25 backdrop-blur-xl">
                <p className="text-xs font-black text-[#6b7d67] uppercase tracking-wider">Health records</p>
                <p className="text-2xl font-black text-[#2f3e2c] mt-1">{health?.total ?? "—"}</p>
              </div>
              <div className="rounded-2xl p-5 bg-white/60 border border-[#8b6b4c]/25 backdrop-blur-xl">
                <p className="text-xs font-black text-[#6b7d67] uppercase tracking-wider">Total raised (paid)</p>
                <p className="text-2xl font-black text-[#5f7d5a] mt-1">
                  {donStats != null ? formatCurrency(donStats.totalDonations || 0) : "—"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportDonationsCsv}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2f3e2c] text-white text-sm font-bold hover:opacity-90 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export donations CSV
              </button>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {cards.map((c, i) => (
                <motion.div
                  key={c.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={c.to}
                    className="group flex gap-4 p-6 rounded-3xl bg-gradient-to-br from-white/80 via-[#e5e3df]/60 to-white/40
                    border border-[#8b6b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:shadow-[0_28px_80px_rgba(95,125,90,0.2)] transition"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-[#2f3e2c] shrink-0`}
                    >
                      <c.icon className="w-7 h-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-black text-[#2f3e2c] group-hover:text-[#5f7d5a] transition flex items-center gap-2">
                        {c.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                      </h2>
                      <p className="text-sm text-[#6b7d67] mt-1 font-medium">{c.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
