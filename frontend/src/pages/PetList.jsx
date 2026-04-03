// frontend/src/pages/PetList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { toast } from "react-hot-toast";

// Helper to format age months to readable string
const formatAge = (months) => {
  if (months < 12) return `${months} mos`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} ${years === 1 ? "yr" : "yrs"}`;
  return `${years} ${years === 1 ? "yr" : "yrs"} ${remainingMonths} ${remainingMonths === 1 ? "mo" : "mos"}`;
};

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pets");
      if (res.data.success) {
        setPets(res.data.data);
      }
    } catch (error) {
      console.error("Fetch Pets Error:", error);
      toast.error("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      const res = await api.delete(`/pets/${id}`);
      if (res.data.success) {
        toast.success("Pet deleted successfully");
        setPets((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Delete Pet Error:", error);
      toast.error("Failed to delete pet");
    }
  };

  const stats = useMemo(() => {
    const totalSchedules = pets.reduce((acc, p) => acc + (p._count?.schedules || 0), 0);
    const totalWeights = pets.reduce((acc, p) => acc + (p._count?.weightLogs || 0), 0);
    return {
      total: pets.length,
      schedules: totalSchedules,
      weights: totalWeights,
      reminders: totalSchedules > 0 ? "Active" : "None"
    };
  }, [pets]);

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              My Pets
            </h1>
            <p className="text-[#6b7d67] text-sm sm:text-base mt-1">
              Manage your pets, view details, and track their care.
            </p>
          </div>

          <Link
            to="/pets/add"
            className="inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
            border border-[#d6e2d3]
            text-black/75 font-semibold
            hover:scale-[1.02] hover:shadow-lg transition duration-300"
          >
            ➕ Add Pet
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Pets", value: stats.total },
            { label: "Care Routines", value: stats.schedules },
            { label: "Weight Logs", value: stats.weights },
            { label: "Reminders", value: stats.reminders },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl bg-white/55 backdrop-blur-xl
              border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]"
            >
              <p className="text-xs sm:text-sm text-[#6b7d67] font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-xl sm:text-2xl font-black text-[#2f3e2c] mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Pet Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6b7d67]">
            <div className="w-12 h-12 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mb-4" />
            <p className="font-medium">Loading your pets...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, idx) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 + idx * 0.05 }}
                whileHover={{ y: -8 }}
                className="group rounded-[2.5rem] overflow-hidden
                bg-white/60 backdrop-blur-3xl border border-[#8b6b4c]/30
                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                hover:shadow-[0_45px_120px_rgba(95,125,90,0.25)]
                transition duration-500"
              >
                <div className="relative h-44 sm:h-48 bg-[#f3eee8]">
                  <img
                    src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80"}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/40 text-[10px] font-black uppercase text-[#2f3e2c] tracking-widest">
                    {pet.species}
                  </div>
                  {pet.status === "PENDING" && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-500/80 text-white text-[10px] font-bold">
                       Pending
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-[#2f3e2c]">{pet.name}</h3>
                      <p className="text-xs font-bold text-[#6b7d67] mt-1 uppercase tracking-wide">
                        {pet.breed} • {formatAge(pet.age_months)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Link
                      to={`/pets/${pet.id}`}
                      className="flex-1 text-center py-3 rounded-2xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-black hover:shadow-lg transition"
                    >
                      Details
                    </Link>
                    <Link
                       to={`/pets/${pet.id}`} // Using Details for edit logic in Phase 1
                       className="px-4 py-3 rounded-2xl bg-white border border-[#8b6b4c]/20 text-[#2f3e2c] font-bold hover:bg-[#f3eee8] transition"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && pets.length === 0 && (
          <div className="mt-10 text-center text-[#6b7d67] py-20 rounded-[3rem] bg-white/20 border border-dashed border-[#8b6b4c]/40">
            <p className="text-5xl mb-4">🐾</p>
            <p className="font-bold text-lg">No pets found yet.</p>
            <p className="text-sm mt-1">Click <span className="font-black text-[#2f3e2c]">Add Pet</span> to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
