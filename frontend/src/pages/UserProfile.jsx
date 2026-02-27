import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * UserProfile (updated)
 * - Added "Health Hub" + "Emergency First Aid" quick actions
 * - Added "My Pets" + "Health" shortcuts in summary row
 * - Kept your glass theme + tabs
 * - UI only (no API yet)
 */

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  // demo user + stats (replace later with API: GET /users/me)
  const user = useMemo(
    () => ({
      name: "User Name",
      email: "useremail@example.com",
      role: "Pet Owner",
      initial: "U",
      stats: {
        totalPets: 3,
        upcomingSchedules: 5,
        weightLogs: 12,
        dueVaccines: 2,
        activeMeds: 1,
      },
    }),
    []
  );

  return (
    <div className="min-h-screen px-4 sm:px-8 pt-[6rem] pb-[4rem] relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute 
        top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        w-[720px] h-[720px]
        bg-gradient-to-br 
        from-[#7fa37a]/40 
        via-[#5f7d5a]/30 
        to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto
        bg-gradient-to-br 
        from-white/75 via-[#e5e3df]/75 to-[#a18463]/35
        backdrop-blur-2xl rounded-3xl
        border border-[#8b6b4c]/40
        shadow-[0_25px_80px_rgba(0,0,0,0.15)]
        p-6 sm:p-10"
      >
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          {/* Profile Info */}
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full 
              bg-gradient-to-br from-[#7fa37a] to-[#8b6b4c] 
              flex items-center justify-center 
              text-white text-3xl font-bold shadow-lg"
            >
              {user.initial}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2f3e2c]">{user.name}</h2>
              <p className="text-[#6b7d67] text-sm">{user.email}</p>

              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-[#7fa37a]/30 text-[#2f3e2c]">
                {user.role}
              </span>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-start lg:justify-end w-full lg:w-auto">
            <Link
              to="/pets"
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
              text-white font-medium shadow-md 
              hover:scale-[1.02] hover:shadow-lg transition"
            >
              🐾 My Pets
            </Link>

            <Link
              to="/health"
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-[#7fa37a] to-[#8b6b4c]
              text-white font-medium shadow-md 
              hover:scale-[1.02] hover:shadow-lg transition"
            >
              🏥 Health Hub
            </Link>

            <button
              type="button"
              onClick={() => alert("Logout (UI only). Backend later.")}
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-[#8b6b4c] to-[#5f7d5a]
              text-white font-medium shadow-md 
              hover:scale-[1.02] hover:shadow-lg transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Pets"
            value={user.stats.totalPets}
            accent="text-[#5f7d5a]"
          />
          <SummaryCard
            title="Upcoming Schedules"
            value={user.stats.upcomingSchedules}
            accent="text-[#7fa37a]"
          />
          <SummaryCard
            title="Weight Logs"
            value={user.stats.weightLogs}
            accent="text-[#8b6b4c]"
          />
        </div>

        {/* Health Quick Stats (optional but very useful) */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <MiniStat
            title="Due Vaccines"
            value={user.stats.dueVaccines}
            hint="Booster / upcoming vaccinations"
            ctaLabel="Open Vaccines →"
            to="/vaccines"
          />
          <MiniStat
            title="Active Medications"
            value={user.stats.activeMeds}
            hint="Currently ongoing prescriptions"
            ctaLabel="Open Prescriptions →"
            to="/prescriptions"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#8b6b4c]/40 mb-6">
          {["profile", "security", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize font-medium transition
                ${
                  activeTab === tab
                    ? "text-[#2f3e2c] border-b-2 border-[#5f7d5a]"
                    : "text-[#6b7d67] hover:text-[#2f3e2c]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <input
              type="text"
              defaultValue={user.name}
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-xl 
              bg-white/60 border border-[#8b6b4c]/40
              focus:ring-2 focus:ring-[#7fa37a]/40 outline-none"
            />

            <input
              type="email"
              defaultValue={user.email}
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl 
              bg-white/60 border border-[#8b6b4c]/40
              focus:ring-2 focus:ring-[#7fa37a]/40 outline-none"
            />

            <button
              type="button"
              onClick={() => alert("Update profile (UI only). Backend later.")}
              className="px-6 py-2 rounded-xl 
              bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
              text-white shadow-md hover:scale-[1.02] transition"
            >
              Update Profile
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-5">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40 outline-none"
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40 outline-none"
            />

            <button
              type="button"
              onClick={() => alert("Change password (UI only). Backend later.")}
              className="px-6 py-2 rounded-xl 
              bg-gradient-to-r from-[#8b6b4c] to-[#5f7d5a]
              text-white shadow-md hover:scale-[1.02] transition"
            >
              Change Password
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 text-[#4e5f4a]">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" defaultChecked />
              Email Notifications
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" defaultChecked />
              Schedule Reminders
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" />
              Medication Reminders
            </label>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------------- Small UI components ---------------- */

function SummaryCard({ title, value, accent }) {
  return (
    <div
      className="p-6 rounded-2xl 
      bg-white/60 backdrop-blur-lg
      border border-[#8b6b4c]/40 shadow-md text-center"
    >
      <h3 className="text-lg font-semibold text-[#2f3e2c]">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${accent}`}>{value}</p>
    </div>
  );
}

function MiniStat({ title, value, hint, ctaLabel, to }) {
  return (
    <div
      className="p-5 rounded-2xl 
      bg-white/55 backdrop-blur-lg
      border border-[#8b6b4c]/40 shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-[#6b7d67]">{title}</div>
          <div className="text-2xl font-extrabold text-[#2f3e2c] mt-1">{value}</div>
          <div className="text-xs text-[#6b7d67] mt-1">{hint}</div>
        </div>

        <Link
          to={to}
          className="px-4 py-2 rounded-xl bg-white/60
          border border-[#8b6b4c]/35 backdrop-blur-xl
          text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}