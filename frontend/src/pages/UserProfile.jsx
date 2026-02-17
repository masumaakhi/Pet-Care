import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen px-4 sm:px-8 pt-[6rem] pb-[4rem] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute 
        top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        w-[700px] h-[700px]
        bg-gradient-to-br 
        from-[#7fa37a]/40 
        via-[#5f7d5a]/30 
        to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none">
      </div>

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
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">

          {/* Profile Info */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full 
              bg-gradient-to-br from-[#7fa37a] to-[#8b6b4c] 
              flex items-center justify-center 
              text-white text-3xl font-bold shadow-lg">
              U
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2f3e2c]">
                User Name
              </h2>
              <p className="text-[#6b7d67] text-sm">
                useremail@example.com
              </p>

              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-[#7fa37a]/30 text-[#2f3e2c]">
                Pet Owner
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              to="/pets"
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
              text-white font-medium shadow-md 
              hover:scale-105 transition"
            >
              🐾 My Pets
            </Link>

            <button
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-[#8b6b4c] to-[#5f7d5a]
              text-white font-medium shadow-md 
              hover:scale-105 transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl 
            bg-white/60 backdrop-blur-lg
            border border-[#8b6b4c]/40 shadow-md text-center">
            <h3 className="text-lg font-semibold text-[#2f3e2c]">
              Total Pets
            </h3>
            <p className="text-3xl font-bold text-[#5f7d5a] mt-2">
              3
            </p>
          </div>

          <div className="p-6 rounded-2xl 
            bg-white/60 backdrop-blur-lg
            border border-[#8b6b4c]/40 shadow-md text-center">
            <h3 className="text-lg font-semibold text-[#2f3e2c]">
              Upcoming Schedules
            </h3>
            <p className="text-3xl font-bold text-[#7fa37a] mt-2">
              5
            </p>
          </div>

          <div className="p-6 rounded-2xl 
            bg-white/60 backdrop-blur-lg
            border border-[#8b6b4c]/40 shadow-md text-center">
            <h3 className="text-lg font-semibold text-[#2f3e2c]">
              Weight Logs
            </h3>
            <p className="text-3xl font-bold text-[#8b6b4c] mt-2">
              12
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#8b6b4c]/40 mb-6">
          {["profile", "security", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize font-medium transition
                ${activeTab === tab
                  ? "text-[#2f3e2c] border-b-2 border-[#5f7d5a]"
                  : "text-[#6b7d67] hover:text-[#2f3e2c]"}
              `}
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
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-xl 
              bg-white/60 border border-[#8b6b4c]/40
              focus:ring-2 focus:ring-[#7fa37a]/40 outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-xl 
              bg-white/60 border border-[#8b6b4c]/40
              focus:ring-2 focus:ring-[#7fa37a]/40 outline-none"
            />

            <button
              className="px-6 py-2 rounded-xl 
              bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
              text-white shadow-md hover:scale-105 transition"
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
              className="px-6 py-2 rounded-xl 
              bg-gradient-to-r from-[#8b6b4c] to-[#5f7d5a]
              text-white shadow-md hover:scale-105 transition"
            >
              Change Password
            </button>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 text-[#4e5f4a]">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" />
              Email Notifications
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" />
              Schedule Reminders
            </label>
          </div>
        )}

      </motion.div>
    </div>
  );
}
