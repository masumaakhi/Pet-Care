import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../utils/api";
import { getAdoptionListingImage } from "../../utils/helpers";

export default function AdminAdoptionRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/adoptions/admin/applications");
      if (res.data?.success) {
        setRequests(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (error) {
      console.error("Fetch Adoption Requests Error:", error);
      toast.error("Failed to load adoption requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (applicationId, status) => {
    try {
      const res = await api.patch(`/adoptions/admin/application-status/${applicationId}`, { status });
      if (res.data?.success) {
        toast.success(`Request ${status.toLowerCase()}`);
        setRequests((prev) => {
          const target = prev.find((row) => row.id === applicationId);
          const targetAdoptionPetId = target?.adoptionPetId;
          return prev.map((item) => {
            if (item.id === applicationId) return { ...item, status };
            if (
              status === "APPROVED" &&
              targetAdoptionPetId &&
              item.adoptionPetId === targetAdoptionPetId &&
              item.id !== applicationId &&
              (item.status === "PENDING" || item.status === "APPROVED")
            ) {
              return { ...item, status: "REJECTED" };
            }
            return item;
          });
        });
      }
    } catch (error) {
      console.error("Update Adoption Request Error:", error);
      toast.error(error.response?.data?.message || "Failed to update request");
    }
  };

  const filtered = useMemo(() => {
    return requests.filter((item) => {
      const currentStatus = String(item.status || "").toLowerCase();
      const matchFilter = filter === "all" || currentStatus === filter;
      const key = search.toLowerCase();
      const matchSearch =
        !key ||
        item.adoptionPet?.name?.toLowerCase().includes(key) ||
        item.fullName?.toLowerCase().includes(key) ||
        item.owner?.fullName?.toLowerCase().includes(key) ||
        item.email?.toLowerCase().includes(key);
      return matchFilter && matchSearch;
    });
  }, [requests, filter, search]);

  return (
    <div className="relative min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#7fa37a]/20 via-[#5f7d5a]/15 to-[#8b6b4c]/15 rounded-full blur-[170px] opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">
              Adoption Requests
            </h1>
            <p className="text-[#6b7d67] mt-2 font-medium">
              Connects listing owner and adopter requests in one admin queue.
            </p>
          </div>
          <Link
            to="/admin/adoptions"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-[#8b6b4c]/30 bg-white/70 text-[#2f3e2c] font-bold text-sm"
          >
            Back to Listings
          </Link>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 p-1 bg-white/40 backdrop-blur-xl border border-[#8b6b4c]/30 rounded-2xl">
            {["all", "pending", "approved", "rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  filter === tab
                    ? "bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white shadow-lg"
                    : "text-[#2f3e2c] hover:bg-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search by pet, owner, adopter, email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-xl border border-[#8b6b4c]/30 outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium"
          />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 py-20 text-center">
              <div className="w-10 h-10 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#6b7d67] font-bold">Loading requests...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 py-20 text-center">
              <p className="text-[#2f3e2c] font-bold">No adoption requests found.</p>
            </div>
          ) : (
            filtered.map((req) => {
              const listing = req.adoptionPet || {};
              const thumb = getAdoptionListingImage(listing);
              const status = String(req.status || "").toUpperCase();
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-white/75 backdrop-blur-xl border border-[#8b6b4c]/20 p-5 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#8b6b4c]/20 bg-[#f3eee8]">
                        {thumb ? (
                          <img src={thumb} alt={listing.name || "Pet"} className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-[#2f3e2c]">
                          {listing.name || "Unknown pet"} • {listing.type || "N/A"} • {listing.breed || "N/A"}
                        </p>
                        <p className="text-xs text-[#6b7d67] mt-1">
                          Listing Owner: {req.owner?.fullName || "Unknown"} ({req.owner?.email || "N/A"})
                        </p>
                        <p className="text-xs text-[#6b7d67]">
                          Adopter: {req.fullName || "Unknown"} ({req.email || "N/A"})
                        </p>
                        <p className="text-xs text-[#6b7d67]">
                          Applied: {new Date(req.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-[#4e5f4a] mt-1">
                          Living situation: <span className="font-semibold">{req.livingSituation || "N/A"}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {status}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleDecision(req.id, "APPROVED")}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-bold text-xs"
                          >
                            Approve
                          </button>
                        )}
                        {status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() => handleDecision(req.id, "REJECTED")}
                            className="px-3 py-1.5 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs"
                          >
                            Reject
                          </button>
                        )}
                        <Link
                          to={`/admin/adoptions/${listing.id}`}
                          className="px-3 py-1.5 rounded-xl border border-[#8b6b4c]/30 text-[#2f3e2c] font-bold text-xs bg-white/80"
                        >
                          Open Listing
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
