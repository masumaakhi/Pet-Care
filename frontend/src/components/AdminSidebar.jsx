// src/components/admin/AdminSidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Usage:
 * <AdminSidebar />
 * Route examples:
 * /admin
 * /admin/users
 * /admin/pets
 * /admin/adoptions
 * /admin/rescues
 * /admin/donations
 * /admin/reports
 * /admin/alerts
 * /admin/settings
 */

const items = [
  {
    label: "Dashboard",
    to: "/admin",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Pets",
    to: "/admin/pets",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 13c.5-2.5 2.5-4 4.5-4S12 10.5 12 13c0 2-1.5 4-4 4-2.8 0-4.5-1.7-4-4Z" />
        <path d="M20 13c.5-2.5-1.5-4-3.5-4S12 10.5 12 13c0 2 1.5 4 4 4 2.8 0 4.5-1.7 4-4Z" />
        <circle cx="8" cy="6" r="1.5" />
        <circle cx="16" cy="6" r="1.5" />
        <circle cx="12" cy="5" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Adoptions",
    to: "/admin/adoptions",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 7h-7l-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
        <path d="M12 10v6" />
        <path d="M9 13h6" />
      </svg>
    ),
  },
  {
    label: "Rescues",
    to: "/admin/rescues",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l4 8-4 12-4-12 4-8Z" />
        <path d="M6 10h12" />
      </svg>
    ),
  },
  {
    label: "Donations",
    to: "/admin/donations",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Reports",
    to: "/admin/reports",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 2 5-6" />
      </svg>
    ),
  },
  {
    label: "Alerts",
    to: "/admin/alerts",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.3 3.1L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.1a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/admin/settings",
    icon: (
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a7.8 7.8 0 0 0 .1-2l2-1.6-2-3.4-2.4 1a7.2 7.2 0 0 0-1.7-1L15 3h-6l-.4 2.4a7.2 7.2 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.8 7.8 0 0 0 .1 2l-2 1.6 2 3.4 2.4-1a7.2 7.2 0 0 0 1.7 1L9 21h6l.4-2.4a7.2 7.2 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6Z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  return (
    <aside
      className="fixed left-4 top-24 z-[999] hidden md:flex flex-col items-center gap-2
      w-[66px] py-3 rounded-3xl
      bg-white/35 backdrop-blur-2xl
      border border-white/40
      shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
    >
      {/* Brand Dot */}
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center
        bg-gradient-to-br from-[#7fa37a]/50 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        border border-white/40 shadow-sm mb-1"
        title="Admin"
        aria-label="Admin"
      >
        <span className="text-[#2f3e2c] font-black">A</span>
      </div>

      <nav className="w-full flex flex-col items-center gap-2 px-2">
        {items.map((it) => (
          <NavItem key={it.to} {...it} />
        ))}
      </nav>

      {/* Logout (demo) */}
      <div className="mt-2 w-full px-2">
        <button
          type="button"
          onClick={() => alert("Logout (UI only). Backend will be added later.")}
          className="group relative w-full h-11 rounded-2xl
          bg-white/35 backdrop-blur-xl
          border border-white/35
          hover:bg-white/55 hover:shadow-md transition"
        >
          <span className="absolute left-[54px] top-1/2 -translate-y-1/2
            whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold
            bg-black/70 text-white opacity-0 translate-x-1
            group-hover:opacity-100 group-hover:translate-x-0
            transition pointer-events-none">
            Logout
          </span>

          <span className="inline-flex items-center justify-center text-[#2f3e2c]/80 group-hover:text-[#2f3e2c] transition">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ label, to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative w-full h-11 rounded-2xl flex items-center justify-center
         border transition
         ${
           isActive
             ? "bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a]/55 to-[#8b6b4c]/55 border-[#d6e2d3] shadow-md"
             : "bg-white/35 border-white/35 hover:bg-white/55 hover:shadow-md"
         }`
      }
    >
      {/* Tooltip */}
      <span
        className="absolute left-[54px] top-1/2 -translate-y-1/2
        whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold
        bg-black/70 text-white opacity-0 translate-x-1
        group-hover:opacity-100 group-hover:translate-x-0
        transition pointer-events-none"
      >
        {label}
      </span>

      <span className="text-[#2f3e2c]/80 group-hover:text-[#2f3e2c] transition">
        {icon}
      </span>
    </NavLink>
  );
}
