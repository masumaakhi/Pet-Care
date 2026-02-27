import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const healthLinks = [
  {
    title: "Medical History",
    description: "Track diagnoses, treatments, follow-ups & vet costs.",
    path: "/medical",
    icon: "📋",
  },
  {
    title: "Vaccination Records",
    description: "View and manage vaccine schedules for your pets.",
    path: "/vaccines",
    icon: "💉",
  },
  {
    title: "Prescriptions",
    description: "Keep track of medications and refill reminders.",
    path: "/prescriptions",
    icon: "💊",
  },
  {
    title: "Weight Log",
    description: "Monitor your pet's weight over time.",
    path: "/pets/weight",
    icon: "⚖️",
  },
  {
    title: "Care Schedule",
    description: "Feeding, grooming & activity routines.",
    path: "/pets/schedule",
    icon: "📅",
  },
  {
    title: "Care Calendar",
    description: "Upcoming appointments and reminders.",
    path: "/pets/calendar",
    icon: "🗓️",
  },
];

const quickTips = [
  "Keep vet contact and emergency numbers saved.",
  "Note any allergies or reactions for each pet.",
  "Schedule annual check-ups and booster vaccines.",
];

export default function HealthAndMedical() {
  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[820px] h-[820px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[170px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2f3e2c] mb-2">
            Health & Medical
          </h1>
          <p className="text-[#6b7d67] max-w-2xl mx-auto">
            Manage your pets’ health records, vaccines, prescriptions, and care schedules in one place.
          </p>
        </motion.div>

        {/* Quick links to My Pets (for logged-in flow) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8"
        >
          <Link
            to="/pets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold hover:bg-white/80 hover:shadow-lg transition"
          >
            🐾 My Pets
          </Link>
        </motion.div>

        {/* Health cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
          {healthLinks.map((item, idx) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={item.path}
                className="block h-full rounded-2xl p-5 sm:p-6
                  bg-white/55 backdrop-blur-2xl
                  border border-[#8b6b4c]/45
                  shadow-[0_18px_55px_rgba(0,0,0,0.10)]
                  hover:shadow-[0_24px_70px_rgba(95,125,90,0.18)]
                  hover:border-[#7fa37a]/50 transition"
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h2 className="text-lg font-bold text-[#2f3e2c] mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-[#6b7d67]">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick tips */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl p-5 sm:p-6
            bg-white/50 backdrop-blur-xl border border-[#8b6b4c]/35
            shadow-[0_18px_55px_rgba(0,0,0,0.08)]"
        >
          <h3 className="text-lg font-bold text-[#2f3e2c] mb-3">
            Quick health tips
          </h3>
          <ul className="space-y-2 text-[#6b7d67] text-sm">
            {quickTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#7fa37a] mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
    </div>
  );
}
