// src/pages/admin/AdminAdoptionManagementPage.jsx
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

/**
 * Admin Adoption Management
 * Features: Request Table, Filter Bar, Match Scores, Status Actions
 */
export default function AdminAdoptionManagementPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Mock data for initial frontend setup
  const [adoptions, setAdoptions] = useState([
    {
      id: "adp-001",
      applicant: { name: "Sarah Ahmed", email: "sarah@example.com", avatar: "SA" },
      pet: { name: "Bella", species: "Dog", breed: "Golden Retriever" },
      date: "2024-03-28",
      matchScore: 92,
      status: "pending",
    },
    {
      id: "adp-002",
      applicant: { name: "John Doe", email: "john@example.com", avatar: "JD" },
      pet: { name: "Luna", species: "Cat", breed: "Persian" },
      date: "2024-03-25",
      matchScore: 75,
      status: "approved",
    },
    {
      id: "adp-003",
      applicant: { name: "Emily Watson", email: "emily@example.com", avatar: "EW" },
      pet: { name: "Charlie", species: "Dog", breed: "Beagle" },
      date: "2024-03-20",
      matchScore: 60,
      status: "rejected",
    },
    {
      id: "adp-004",
      applicant: { name: "David Miller", email: "david@example.com", avatar: "DM" },
      pet: { name: "Max", species: "Dog", breed: "Poodle" },
      date: "2024-03-15",
      matchScore: 88,
      status: "pending",
    },
  ]);

  const filteredAdoptions = useMemo(() => {
    return adoptions.filter((adp) => {
      const matchFilter = filter === "all" || adp.status === filter;
      const matchSearch =
        adp.applicant.name.toLowerCase().includes(search.toLowerCase()) ||
        adp.pet.name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [adoptions, filter, search]);

  const handleAction = (id, newStatus) => {
    setAdoptions((prev) =>
      prev.map((adp) => (adp.id === id ? { ...adp, status: newStatus } : adp))
    );
    toast.success(`Application ${newStatus} successfully.`);
  };

  return (
    <div className="relative min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#7fa37a]/20 via-[#5f7d5a]/15 to-[#8b6b4c]/15 rounded-full blur-[170px] opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">
            Adoption Management
          </h1>
          <p className="text-[#6b7d67] mt-2 font-medium">
            Review and oversee and management pet adoption applications.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 p-1 bg-white/40 backdrop-blur-xl border border-[#8b6b4c]/30 rounded-2xl">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition ${
                  filter === tab
                    ? "bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white shadow-lg"
                    : "text-[#2f3e2c] hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name or pet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-white/50 backdrop-blur-xl border border-[#8b6b4c]/30 outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-white/70 to-white/30 backdrop-blur-3xl border border-[#8b6b4c]/30 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f3eee8]/80 text-[#2f3e2c] font-black uppercase text-[10px] tracking-[0.2em] border-b border-[#8b6b4c]/10">
                  <th className="px-8 py-6">Applicant</th>
                  <th className="px-8 py-6">Pet</th>
                  <th className="px-8 py-6">Date</th>
                  <th className="px-8 py-6 text-center">Match Score</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredAdoptions.map((adp) => (
                    <motion.tr
                      key={adp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="group border-b border-[#8b6b4c]/5 hover:bg-white/40 transition duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5f7d5a] to-[#7fa37a] flex items-center justify-center text-white font-black text-xs shadow-md">
                            {adp.applicant.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-[#2f3e2c] hover:underline cursor-pointer">
                              {adp.applicant.name}
                            </div>
                            <div className="text-[10px] text-[#6b7d67] font-bold">
                              {adp.applicant.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <div className="font-bold text-[#2f3e2c]">{adp.pet.name}</div>
                          <div className="text-[10px] text-[#6b7d67] font-bold uppercase tracking-wider">
                            {adp.pet.species} • {adp.pet.breed}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-black text-[#6b7d67]">
                          {new Date(adp.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`text-lg font-black ${
                            adp.matchScore >= 80 ? "text-[#5f7d5a]" : adp.matchScore >= 60 ? "text-amber-600" : "text-rose-600"
                          }`}>
                            {adp.matchScore}%
                          </div>
                          <div className="w-16 h-1 bg-black/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                adp.matchScore >= 80 ? "bg-[#5f7d5a]" : adp.matchScore >= 60 ? "bg-amber-600" : "bg-rose-600"
                              }`}
                              style={{ width: `${adp.matchScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          adp.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : adp.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {adp.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <Link
                            to={`/admin/adoptions/${adp.id}`}
                            className="p-2 rounded-xl bg-white/80 border border-[#8b6b4c]/20 text-[#2f3e2c] hover:bg-white hover:shadow-lg transition"
                          >
                            👁️
                          </Link>
                          {adp.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(adp.id, "approved")}
                                className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 hover:bg-emerald-500 hover:text-white transition"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleAction(adp.id, "rejected")}
                                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 hover:bg-rose-500 hover:text-white transition"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {filteredAdoptions.length === 0 && (
            <div className="py-20 text-center">
              <div className="text-4xl mb-4">📂</div>
              <div className="text-[#2f3e2c] font-black uppercase text-xs tracking-widest">
                No adoption requests found
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
