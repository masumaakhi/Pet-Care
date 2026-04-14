// src/pages/admin/AdminPlatformAlertsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, Heart, LifeBuoy, DollarSign, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import rescueService from "../../utils/rescueService";
import { formatCurrency } from "../../utils/donationHelpers";

export default function AdminPlatformAlertsPage() {
  const [summary, setSummary] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await rescueService.getNotifications();
      if (res.data?.success) setNotifications(res.data.data || []);
    } catch (_) {}
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [sRes] = await Promise.all([api.get("/dashboard/admin-summary")]);
        if (cancelled) return;
        if (sRes.data?.success) setSummary(sRes.data.data);
        await loadNotifications();
      } catch (e) {
        if (!cancelled) toast.error(e.response?.data?.message || "Could not load alerts");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const markAllRead = async () => {
    try {
      await rescueService.markAllNotificationsRead();
      await loadNotifications();
      toast.success("All notifications marked read");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed");
    }
  };

  const queueCards = summary
    ? [
        {
          label: "Pending rescues",
          value: summary.pendingRescues,
          to: "/admin/rescues",
          icon: LifeBuoy,
          urgent: summary.pendingRescues > 0,
        },
        {
          label: "Active rescue missions",
          value: summary.activeRescueMissions,
          to: "/admin/rescues/map",
          icon: AlertTriangle,
          urgent: false,
        },
        {
          label: "Adoption listings pending review",
          value: summary.pendingAdoptions,
          to: "/admin/adoptions",
          icon: Heart,
          urgent: summary.pendingAdoptions > 0,
        },
        {
          label: "Donations pending",
          value: `${summary.pendingDonationsCount} (${formatCurrency(summary.pendingDonationsAmount || 0)})`,
          to: "/admin/donations",
          icon: DollarSign,
          urgent: summary.pendingDonationsCount > 0,
        },
      ]
    : [];

  return (
    <div className="min-h-screen pt-8 pb-14 px-4 sm:px-6 lg:px-10 relative">
      <div
        className="pointer-events-none absolute top-1/3 right-0 w-[600px] h-[600px]
        bg-gradient-to-bl from-[#8b6b4c]/20 to-transparent rounded-full blur-[120px] opacity-50"
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">Alerts & queue</h1>
            <p className="text-[#6b7d67] mt-2 font-medium">
              Work queues that need attention, plus your personal notification inbox.
            </p>
          </motion.div>
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#8b6b4c]/35 bg-white/70 text-[#2f3e2c] text-sm font-bold hover:bg-white transition"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all notifications read
          </button>
        </div>

        {loading ? (
          <p className="text-[#6b7d67] py-16 text-center">Loading…</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {queueCards.map((c) => (
                <Link
                  key={c.label}
                  to={c.to}
                  className={`rounded-2xl p-5 border backdrop-blur-xl transition hover:shadow-lg ${
                    c.urgent
                      ? "bg-amber-50/80 border-amber-200/80"
                      : "bg-white/65 border-[#8b6b4c]/25"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${c.urgent ? "bg-amber-200/60 text-amber-900" : "bg-[#e4efe0] text-[#2f3e2c]"}`}
                    >
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#6b7d67] uppercase tracking-wider">{c.label}</p>
                      <p className="text-2xl font-black text-[#2f3e2c] mt-1">{c.value}</p>
                      <p className="text-xs text-[#5f7d5a] font-bold mt-2">Open →</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="rounded-3xl border border-[#8b6b4c]/30 bg-white/55 backdrop-blur-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#8b6b4c]/20 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#5f7d5a]" />
                <h2 className="font-black text-[#2f3e2c]">Your notifications</h2>
              </div>
              <div className="divide-y divide-[#8b6b4c]/15 max-h-[480px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-8 text-center text-[#6b7d67] text-sm">No notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-6 py-4 ${n.isRead ? "bg-transparent" : "bg-emerald-50/40"}`}
                    >
                      <p className="font-bold text-[#2f3e2c]">{n.title}</p>
                      <p className="text-sm text-[#6b7d67] mt-1">{n.message}</p>
                      <p className="text-[10px] text-[#6b7d67] mt-2 font-semibold uppercase tracking-wide">
                        {n.type} · {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <p className="text-xs text-[#6b7d67] mt-6 text-center">
              Rescue dispatch notifications also appear in the nav bell; opening the bell clears the badge until new
              alerts arrive.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
