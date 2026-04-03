// src/pages/admin/AdminPetsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import { toast } from "react-hot-toast";

const BACKEND_URL = "http://localhost:5250";

export default function AdminPetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [speciesFilter, setSpeciesFilter] = useState("all");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pets/admin/all");
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (error) {
      console.error("Admin Fetch Pets Error:", error);
      toast.error("Failed to load moderation data");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (petId, newStatus) => {
    try {
      const res = await api.patch(`/pets/admin/status/${petId}`, { status: newStatus });
      if (res.data.success) {
        setPets((prev) =>
          prev.map((pet) => (pet.id === petId ? { ...pet, status: newStatus } : pet))
        );
        toast.success(`Pet ${newStatus} successfully!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner?.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || pet.status === statusFilter;
      const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter;

      return matchesSearch && matchesStatus && matchesSpecies;
    });
  }, [pets, searchTerm, statusFilter, speciesFilter]);

  const stats = useMemo(() => {
    return {
      total: pets.length,
      pending: pets.filter((p) => p.status === "PENDING").length,
      approved: pets.filter((p) => p.status === "APPROVED").length,
      flagged: pets.filter((p) => p.status === "FLAGGED").length,
    };
  }, [pets]);

  return (
    <div className="relative pt-6 pb-10 min-h-screen">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2
        w-[900px] h-[900px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
        rounded-full blur-[170px] opacity-60"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">
              Pets Moderation
            </h1>
            <p className="text-[#6b7d67] mt-1 font-medium">
              Manage and review pet listings from the community.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors">🔍</span>
              <input
                type="text"
                placeholder="Search pet or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-2xl bg-white/60
                border border-[#8b6b4c]/30 backdrop-blur-xl
                text-[#2f3e2c] font-medium outline-none focus:ring-2 focus:ring-[#7fa37a]/50
                placeholder-[#6b7d67]/70 transition w-full md:w-64 shadow-sm"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-white/60
              border border-[#8b6b4c]/30 backdrop-blur-xl
              text-[#2f3e2c] font-semibold outline-none focus:ring-2 focus:ring-[#7fa37a]/50
              cursor-pointer transition shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="FLAGGED">Flagged</option>
            </select>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Listings" value={stats.total} icon="🐾" />
          <StatCard label="Pending" value={stats.pending} icon="⌛" color="text-amber-600" />
          <StatCard label="Approved" value={stats.approved} icon="✅" color="text-emerald-600" />
          <StatCard label="Flagged" value={stats.flagged} icon="🚩" color="text-rose-600" />
        </div>

        {/* Table Container */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-white/80 via-[#e5e3df]/60 to-[#a18463]/20
          backdrop-blur-3xl border border-[#8b6b4c]/30 shadow-xl overflow-hidden">
          {loading ? (
             <div className="py-40 text-center text-[#6b7d67]">
                <div className="w-12 h-12 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold">Gathering pet data...</p>
             </div>
          ) : (
            <div className="overflow-x-auto p-1">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-[#8b6b4c]/15">
                    <th className="py-5 px-8 text-[#4e5f4a] font-bold text-sm uppercase tracking-wider text-center">Photo</th>
                    <th className="py-5 px-8 text-[#4e5f4a] font-bold text-sm uppercase tracking-wider">Pet Info</th>
                    <th className="py-5 px-6 text-[#4e5f4a] font-bold text-sm uppercase tracking-wider">Owner</th>
                    <th className="py-5 px-6 text-[#4e5f4a] font-bold text-sm uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-8 text-[#4e5f4a] font-bold text-sm uppercase tracking-wider text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8b6b4c]/10">
                  <AnimatePresence mode="popLayout">
                    {filteredPets.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center text-[#6b7d67] font-bold">No pets matches found.</td>
                      </tr>
                    ) : (
                      filteredPets.map((pet, idx) => (
                        <motion.tr
                          layout
                          key={pet.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-white/40 transition-all group"
                        >
                          <td className="py-5 px-8 text-center">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/50 shadow-md group-hover:scale-105 transition mx-auto">
                              <img src={pet.photo || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&q=80"} alt={pet.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <div className="font-extrabold text-[#2f3e2c] text-lg">{pet.name}</div>
                            <div className="text-xs font-bold text-[#6b7d67] uppercase tracking-wide">{pet.species} • {pet.breed}</div>
                          </td>
                          <td className="py-5 px-6">
                            <div className="font-bold text-[#2f3e2c]">{pet.owner?.fullName}</div>
                            <div className="text-xs text-[#6b7d67] font-medium">{pet.owner?.email}</div>
                          </td>
                          <td className="py-5 px-6 text-center">
                            <StatusBadge status={pet.status} />
                          </td>
                          <td className="py-5 px-8 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {pet.status !== "APPROVED" && (
                                <button
                                  onClick={() => handleAction(pet.id, "APPROVED")}
                                  className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all font-black text-[10px] uppercase"
                                >
                                  Approve
                                </button>
                              )}
                              {pet.status !== "REJECTED" && (
                                <button
                                  onClick={() => handleAction(pet.id, "REJECTED")}
                                  className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-700 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all font-black text-[10px] uppercase"
                                >
                                  Reject
                                </button>
                              )}
                              {pet.status !== "FLAGGED" && (
                                <button
                                  onClick={() => handleAction(pet.id, "FLAGGED")}
                                  className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-700 hover:bg-amber-500 hover:text-white border border-amber-500/20 transition-all font-black text-[10px] uppercase"
                                >
                                  Flag
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "text-[#2f3e2c]" }) {
  return (
    <div className="rounded-[2rem] p-6 bg-white/60 border border-[#8b6b4c]/20 backdrop-blur-3xl shadow-sm">
        <p className="text-[10px] font-black text-[#6b7d67] uppercase tracking-widest">{label}</p>
        <div className="flex items-end justify-between mt-1">
           <p className={`text-3xl font-black ${color}`}>{value}</p>
           <span className="text-3xl opacity-20">{icon}</span>
        </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    PENDING: { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-700", label: "PENDING" },
    APPROVED: { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-700", label: "APPROVED" },
    REJECTED: { bg: "bg-rose-100", border: "border-rose-400", text: "text-rose-700", label: "REJECTED" },
    FLAGGED: { bg: "bg-indigo-100", border: "border-indigo-400", text: "text-indigo-700", label: "FLAGGED" },
  };
  const { bg, border, text, label } = config[status] || config.PENDING;
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${bg} ${border} ${text} tracking-tighter`}>
      {label}
    </span>
  );
}
