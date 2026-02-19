// src/pages/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdmindLayout() {
  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[900px] h-[900px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[170px] opacity-60 pointer-events-none"
      />

      {/* ✅ Sidebar */}
      <AdminSidebar />

      {/* ✅ Right side content */}
      <div className="relative z-10 max-w-7xl mx-auto md:pl-[86px]">
        <Outlet />
      </div>
    </div>
  );
}
