// src/pages/admin/AdminAdoptionManagementPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { getAdoptionListingImage } from "../../utils/helpers";

/**
 * Admin Adoption Management
 * Features: Request Table, Filter Bar, Match Scores, Status Actions
 */
export default function AdminAdoptionManagementPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/adoptions/admin/all");
      if (res.data.success) {
        setAdoptions(res.data.data);
      }
    } catch (error) {
      console.error("Admin Fetch Adoptions Error:", error);
      toast.error("Failed to load adoption requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdoptions = useMemo(() => {
    return adoptions.filter((adp) => {
      const matchFilter = filter === "all" || adp.status.toLowerCase() === filter.toLowerCase();
      const matchSearch =
        adp.name.toLowerCase().includes(search.toLowerCase()) ||
        adp.breed.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [adoptions, filter, search]);

  const handleAction = async (id, newStatus) => {
    try {
      const res = await api.patch(`/adoptions/admin/status/${id}`, { status: newStatus });
      if (res.data.success) {
         toast.success(`Application ${newStatus.toLowerCase()} successfully.`);
         setAdoptions((prev) =>
           prev.map((adp) => (adp.id === id ? { ...adp, status: newStatus } : adp))
         );
      }
    } catch (error) {
       console.error("Action Error:", error);
       toast.error("Failed to update status");
    }
  };

  return (
    <div className="relative min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#7fa37a]/20 via-[#5f7d5a]/15 to-[#8b6b4c]/15 rounded-full blur-[170px] opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">
              Adoption Management
            </h1>
            <p className="text-[#6b7d67] mt-2 font-medium">
              User requests stay pending until you approve; admin-added listings go live immediately.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/adoptions/requests"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#8b6b4c]/30 bg-white/80 text-[#2f3e2c] font-bold text-sm hover:shadow-lg transition shrink-0"
            >
              View adopt requests
            </Link>
            <Link
              to="/admin/adoptions/add"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-black/80 bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c] hover:shadow-lg transition shrink-0"
            >
              + Add live listing
            </Link>
          </div>
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
                  <th className="px-8 py-6">Pet Listing</th>
                  <th className="px-8 py-6">Type & Breed</th>
                  <th className="px-8 py-6">Date Listed</th>
                  <th className="px-8 py-6 text-center">Applications</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                       <td colSpan="6" className="px-8 py-20 text-center">
                          <div className="w-10 h-10 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
                          <p className="text-[#6b7d67] font-bold">Loading listings...</p>
                       </td>
                    </tr>
                  ) : filteredAdoptions.map((adp) => {
                    const thumb = getAdoptionListingImage(adp);
                    return (
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
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5f7d5a] to-[#7fa37a] flex items-center justify-center text-white font-black text-xs shadow-md overflow-hidden">
                            {thumb ? (
                               <img src={thumb} alt="" className="w-full h-full object-cover" />
                            ) : (
                               adp.name[0]
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#2f3e2c]">
                              {adp.name}
                            </div>
                            <div className="text-[10px] text-[#6b7d67] font-bold">
                              ID: {adp.id.split("-")[0]}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div>
                          <div className="font-bold text-[#2f3e2c]">{adp.type}</div>
                          <div className="text-[10px] text-[#6b7d67] font-bold uppercase tracking-wider">
                             {adp.breed}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-black text-[#6b7d67]">
                          {new Date(adp.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-[#2f3e2c]">
                               {adp.applications?.length || 0}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          adp.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : adp.status === "APPROVED"
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
                            title="Admin detail"
                          >
                            👁️
                          </Link>
                          <Link
                            to={`/adopt/listing/${adp.id}`}
                            className="p-2 rounded-xl bg-white/80 border border-[#8b6b4c]/20 text-[#2f3e2c] hover:bg-white hover:shadow-lg transition text-xs font-bold"
                            title="Public listing"
                          >
                            ↗
                          </Link>
                          {adp.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleAction(adp.id, "APPROVED")}
                                className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 hover:bg-emerald-500 hover:text-white transition"
                                title="Approve Listing"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleAction(adp.id, "REJECTED")}
                                className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 hover:bg-rose-500 hover:text-white transition"
                                title="Reject Listing"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );})}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {!loading && filteredAdoptions.length === 0 && (
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
