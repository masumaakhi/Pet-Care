// src/pages/admin/AdminDashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';

/**
 * Admin Dashboard (UI Only)
 * React + Tailwind + Glass theme (Signin/Signup style follow)
 * - Top summary cards
 * - Charts (simple SVG)
 * - Live Alerts
 * - Quick Actions
 * - Recent Activity
 * - System Health & KPI
 */

export default function AdminDashboard() {
  const [range, setRange] = useState("7d"); // "7d" | "30d"
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dashboard/stats?range=${range === '7d' ? 7 : 30}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    if (!data) return {
      users: { total: 0, owners: 0, adopters: 0, vets: 0, volunteers: 0 },
      pets: { total: 0, registered: 0, adoptable: 0, adopted: 0 },
      adoptionRequests: { total: 0, pending: 0, approved: 0, rejected: 0 },
      rescueRequests: { total: 0, active: 0, completed: 0, emergency: 0 },
      donations: { today: 0, month: 0, total: 0, todayDisplay: 0 },
      kpi: { adoptionSuccess: 0, rescueSuccess: 0, avgRescueResponseMin: 0, volunteerScore: 0 }
    };

    const m = data.metrics;
    return {
      users: {
        total: m.users.total || 0,
        owners: m.users.owner || 0,
        adopters: m.users.user || 0,
        vets: m.users.vet || 0,
        volunteers: m.users.volunteer || 0,
      },
      pets: {
        total: m.pets.total || 0,
        registered: m.pets.approved || 0,
        adoptable: m.pets.approved || 0,
        adopted: m.pets.adopted || 0,
      },
      adoptionRequests: {
        total: m.adoptions?.total || 0,
        pending: m.adoptions?.pending || 0,
        approved: m.adoptions?.approved || 0,
        rejected: m.adoptions?.rejected || 0,
      },
      rescueRequests: {
        total: m.rescues?.total || 0,
        active: m.rescues?.active || 0,
        completed: m.rescues?.completed || 0,
        emergency: m.rescues?.emergency || 0,
      },
      donations: {
        today: m.donations?.today || 0,
        month: m.donations?.month || 0,
        total: m.donations?.total || 0,
        todayDisplay: m.donations?.today || 0,
      },
      kpi: {
        adoptionSuccess: m.kpi?.adoptionSuccess || 0,
        rescueSuccess: m.kpi?.rescueSuccess || 0,
        avgRescueResponseMin: m.kpi?.avgRescueResponseMin || 0,
        volunteerScore: m.kpi?.volunteerScore || 0,
      },
    };
  }, [data]);

  const chartData = useMemo(() => {
    if (!data?.analytics) return [];
    
    // Format dates for display
    return data.analytics.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-8 pt-[6rem] pb-[4rem] flex items-center justify-center">
        <div className="text-[#2f3e2c] text-lg font-medium">
          Synchronizing analytics...
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative pt-6 pb-10"
    >
      {/* Background Glow (same vibe as signin/signup) */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2
  w-[900px] h-[900px]
  bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
  rounded-full blur-[170px] opacity-60"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Admin Dashboard
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Overview of users, pets, adoption, rescue, and system health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <RangeToggle value={range} onChange={setRange} />

            <button
              className="px-4 py-2.5 rounded-xl bg-white/60
              border border-[#8b6b4c]/40 backdrop-blur-xl
              text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition"
              onClick={() => alert("Search UI only (backend later).")}
            >
              🔍 Search
            </button>

            <button
              className="px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              border border-[#d6e2d3]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
              onClick={() => alert("Notifications UI only (backend later).")}
            >
              🔔 Alerts
            </button>
          </div>
        </motion.div>

        {/* Top Summary Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <GlassCard className="p-5">
            <CardTitle icon="👥" title="Total Users" />
            <div className="flex items-end justify-between gap-4 mt-2">
              <div>
                <div className="text-3xl font-extrabold text-[#2f3e2c]">
                  {formatNumber(metrics.users.total)}
                </div>
                <p className="text-[#6b7d67] text-sm mt-1">
                  Owners / Adopters / Vets / Volunteers
                </p>
              </div>

              <div className="text-sm text-[#2f3e2c] space-y-1">
                <StatLine label="Owners" value={metrics.users.owners} />
                <StatLine label="Adopters" value={metrics.users.adopters} />
                <StatLine label="Vets" value={metrics.users.vets} />
                <StatLine label="Volunteers" value={metrics.users.volunteers} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <CardTitle icon="🐾" title="Total Pets" />
            <div className="flex items-end justify-between gap-4 mt-2">
              <div>
                <div className="text-3xl font-extrabold text-[#2f3e2c]">
                  {formatNumber(metrics.pets.total)}
                </div>
                <p className="text-[#6b7d67] text-sm mt-1">
                  Registered • Adoptable • Adopted
                </p>
              </div>

              <div className="text-sm text-[#2f3e2c] space-y-1">
                <StatLine label="Registered" value={metrics.pets.registered} />
                <StatLine label="Adoptable" value={metrics.pets.adoptable} accent="ok" />
                <StatLine label="Adopted" value={metrics.pets.adopted} accent="warn" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <CardTitle icon="💰" title="Donations" />
            <div className="flex items-end justify-between gap-4 mt-2">
              <div>
                <div className="text-3xl font-extrabold text-[#2f3e2c]">
                  ${formatNumber(metrics.donations.todayDisplay)}
                </div>
                <p className="text-[#6b7d67] text-sm mt-1">
                  Today • This Month • Total
                </p>
              </div>

              <div className="text-sm text-[#2f3e2c] space-y-1">
                <StatLine label="Today" value={`$${formatNumber(metrics.donations.today)}`} />
                <StatLine label="This Month" value={`$${formatNumber(metrics.donations.month)}`} />
                <StatLine label="Total" value={`$${formatNumber(metrics.donations.total)}`} />
              </div>
            </div>

            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5f7d5a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5f7d5a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#2f3e2c" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Middle Row: Adoption + Rescue + Alerts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <GlassCard className="p-5 lg:col-span-1">
            <CardTitle icon="🏠" title="Adoption Requests" />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-3xl font-extrabold text-[#2f3e2c]">{metrics.adoptionRequests.total}</div>
              <div className="text-sm text-[#2f3e2c] space-y-1">
                <StatLine label="Pending" value={metrics.adoptionRequests.pending} />
                <StatLine label="Approved" value={metrics.adoptionRequests.approved} accent="ok" />
                <StatLine label="Rejected" value={metrics.adoptionRequests.rejected} accent="danger" />
              </div>
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="adoptions" fill="#5f7d5a" opacity={0.6} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5 lg:col-span-1">
            <CardTitle icon="🚨" title="Rescue Requests" />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-3xl font-extrabold text-[#2f3e2c]">{metrics.rescueRequests.total}</div>
              <div className="text-sm text-[#2f3e2c] space-y-1">
                <StatLine label="Active" value={metrics.rescueRequests.active} />
                <StatLine label="Completed" value={metrics.rescueRequests.completed} accent="ok" />
                <StatLine label="Emergency" value={metrics.rescueRequests.emergency} accent="danger" />
              </div>
            </div>
            <div className="mt-4 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rescues" fill="#8b6b4c" opacity={0.6} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-5 lg:col-span-1">
            <CardTitle icon="🔔" title="Live Alerts" />
            <div className="mt-4 space-y-3">
              <AlertItem
                tone="danger"
                title="Emergency rescue cases"
                desc="Emergency!"
                meta="2 ongoing"
              />
              <AlertItem
                tone="warn"
                title="Reported abuse/cruelty cases"
                desc="Pending review"
                meta="3 reports"
              />
              <AlertItem
                tone="info"
                title="Pending adoption approvals"
                desc="Needs admin action"
                meta="6 pending"
              />
              <AlertItem
                tone="ok"
                title="Unverified vets/shelters"
                desc="Verification required"
                meta="4 awaiting"
              />
            </div>
          </GlassCard>
        </div>

        {/* Bottom Row: Analytics + Map + Actions/Activity */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Analytics */}
          <GlassCard className="p-5 lg:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <CardTitle icon="📈" title="Analytics" />
              <button
                className="px-4 py-2 rounded-xl bg-white/55 border border-[#8b6b4c]/35
                text-[#2f3e2c] font-semibold hover:bg-white/70 hover:shadow-md transition"
                onClick={() => alert("View full analytics (backend later).")}
              >
                View Details →
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <SmallChartCard title="User Growth" subtitle={range === "7d" ? "Last 7 days" : "Last 30 days"}>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="users" stroke="#5f7d5a" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </SmallChartCard>
              <SmallChartCard title="Adoption Trend" subtitle="Recent adoptions">
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="adoptions" fill="#5f7d5a" opacity={0.7} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SmallChartCard>
              <SmallChartCard title="Rescue Trend" subtitle="Recent cases">
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rescues" fill="#8b6b4c" opacity={0.7} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SmallChartCard>
            </div>

            <div className="mt-5 grid sm:grid-cols-4 gap-4">
              <KpiChip label="Adoption success rate" value={`${metrics.kpi.adoptionSuccess}%`} />
              <KpiChip label="Rescue success rate" value={`${metrics.kpi.rescueSuccess}%`} />
              <KpiChip label="Avg rescue response" value={`${metrics.kpi.avgRescueResponseMin} min`} />
              <KpiChip label="Volunteer score" value={`${metrics.kpi.volunteerScore}%`} />
            </div>

            <div className="mt-5 rounded-3xl overflow-hidden border border-[#8b6b4c]/35 bg-white/45 backdrop-blur-xl">
              {/* Map placeholder */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#2f3e2c]">🗺️ Heatmap / Map View</div>
                  <div className="text-sm text-[#6b7d67]">Where rescue/adoption is happening most</div>
                </div>
                <button
                  className="px-4 py-2 rounded-xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition duration-300"
                  onClick={() => alert("Open full map (backend later).")}
                >
                  View Full Map →
                </button>
              </div>
              <div className="h-56 bg-gradient-to-br from-black/5 via-white/30 to-black/5 flex items-center justify-center text-[#6b7d67]">
                Map Preview (UI Placeholder)
              </div>
            </div>
          </GlassCard>

          {/* Right Column: Quick Actions + Activity + System Health */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-5">
              <CardTitle icon="🗂️" title="Quick Actions" />
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <ActionBtn label="🚨 Manage Rescues" to="/admin/rescues" />
                <ActionBtn label="🗺️ View Rescue Map" to="/admin/rescues/map" />
                <ActionBtn label="📊 Rescue Analytics" to="/admin/rescues/analytics" />
                <ActionBtn label="👯 Duplicate Reports" to="/admin/rescues/duplicates" />
                <ActionBtn label="🔔 Transmission Logs" to="/admin/rescues/notifications" />
                <ActionBtn label="👥 Manage Users" to="/admin/users" />
                <ActionBtn label="🗄️ Manage All Data" to="/admin/data" />
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <CardTitle icon="🕒" title="Recent Activity" />
              <div className="mt-4 space-y-3">
                {data?.activity && data.activity.length > 0 ? (
                  data.activity.map((act, idx) => (
                    <ActivityItem 
                      key={idx} 
                      title={act.title} 
                      meta={new Date(act.time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} 
                    />
                  ))
                ) : (
                  <ActivityItem title="No recent activity found" meta="Check back later" />
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <CardTitle icon="🛡️" title="System Health & Security" />
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <HealthChip title="Server / API status" value="Online" />
                <HealthChip title="Downtime" value="0.2%" />
                <HealthChip title="Failed logins" value="2 recent" />
                <HealthChip title="System alerts" value="1 warning" />
              </div>

              <div className="mt-4 rounded-2xl bg-white/50 border border-[#8b6b4c]/30 p-4">
                <div className="font-bold text-[#2f3e2c]">🔐 Admin Log</div>
                <p className="text-sm text-[#6b7d67] mt-1">
                  Track who changed what (UI only now, backend later).
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- UI Helpers ------------------------- */

function GlassCard({ className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-3xl
      bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
      backdrop-blur-2xl border border-[#8b6b4c]/45
      shadow-[0_25px_80px_rgba(0,0,0,0.12)]
      ${className}`}
    >
      {children}
    </motion.div>
  );
}

function CardTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <h3 className="font-bold text-[#2f3e2c]">{title}</h3>
    </div>
  );
}

function StatLine({ label, value, accent }) {
  const dot =
    accent === "ok"
      ? "bg-emerald-500/70"
      : accent === "warn"
        ? "bg-amber-500/70"
        : accent === "danger"
          ? "bg-rose-500/70"
          : "bg-[#5f7d5a]/60";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
        <span className="text-[#4e5f4a]">{label}</span>
      </div>
      <span className="font-semibold text-[#2f3e2c]">{value}</span>
    </div>
  );
}

function RangeToggle({ value, onChange }) {
  return (
    <div className="p-1 rounded-2xl bg-white/55 border border-[#8b6b4c]/35 backdrop-blur-xl flex">
      <button
        onClick={() => onChange("7d")}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${value === "7d"
            ? "bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c] text-black/75 shadow"
            : "text-[#2f3e2c] hover:bg-white/60"
          }`}
      >
        7 days
      </button>
      <button
        onClick={() => onChange("30d")}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${value === "30d"
            ? "bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c] text-black/75 shadow"
            : "text-[#2f3e2c] hover:bg-white/60"
          }`}
      >
        30 days
      </button>
    </div>
  );
}

function AlertItem({ tone = "info", title, desc, meta }) {
  const badge =
    tone === "danger"
      ? "bg-rose-500/15 border-rose-500/30 text-rose-700"
      : tone === "warn"
        ? "bg-amber-500/15 border-amber-500/30 text-amber-800"
        : tone === "ok"
          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-800"
          : "bg-sky-500/15 border-sky-500/30 text-sky-800";

  return (
    <div
      className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30
      hover:bg-white/70 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-[#2f3e2c]">{title}</div>
          <div className="text-sm text-[#6b7d67] mt-1">{desc}</div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${badge}`}>
          {tone.toUpperCase()}
        </span>
      </div>
      <div className="text-xs text-[#6b7d67] mt-2">{meta}</div>
    </div>
  );
}

function SmallChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl p-4 bg-white/55 border border-[#8b6b4c]/30 backdrop-blur-xl">
      <div className="font-bold text-[#2f3e2c]">{title}</div>
      <div className="text-xs text-[#6b7d67]">{subtitle}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function KpiChip({ label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30 backdrop-blur-xl">
      <div className="text-xs text-[#6b7d67]">{label}</div>
      <div className="text-lg font-extrabold text-[#2f3e2c] mt-1">{value}</div>
    </div>
  );
}

function ActivityItem({ title, meta }) {
  return (
    <div className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30">
      <div className="font-semibold text-[#2f3e2c]">{title}</div>
      <div className="text-xs text-[#6b7d67] mt-1">{meta}</div>
    </div>
  );
}

function ActionBtn({ label, onClick, to }) {
  const content = (
    <div className="py-3 px-4 rounded-2xl text-left
      bg-gradient-to-r from-[#5f7d5a]/45 via-[#7fa37a]/55 to-[#8b6b4c]/40
      border border-[#d6e2d3]
      text-black/75 font-semibold
      hover:scale-[1.02] hover:shadow-lg transition duration-300 w-full">
      {label}
    </div>
  );

  if (to) {
    return <Link to={to} className="block w-full">{content}</Link>;
  }

  return (
    <button onClick={onClick} className="block w-full">
      {content}
    </button>
  );
}

function HealthChip({ title, value }) {
  return (
    <div className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30 backdrop-blur-xl">
      <div className="text-xs text-[#6b7d67]">{title}</div>
      <div className="text-lg font-extrabold text-[#2f3e2c] mt-1">{value}</div>
    </div>
  );
}

/* ------------------------- Charts (simple SVG) ------------------------- */

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl bg-white/80 backdrop-blur-md border border-[#8b6b4c]/30 p-2 shadow-lg text-xs">
        <div className="font-bold text-[#2f3e2c] mb-1">{data.displayDate}</div>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-[#6b7d67] capitalize">{entry.name}:</span>
            <span className="font-bold text-[#2f3e2c]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/* ------------------------- Utils ------------------------- */

function formatNumber(n) {
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
}

function toast(msg) {
  // replace later with your toaster (react-hot-toast etc.)
  alert(msg);
}
