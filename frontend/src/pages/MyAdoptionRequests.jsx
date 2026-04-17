import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { getAdoptionListingImage } from "../utils/helpers";

export default function MyAdoptionRequests() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const res = await api.get("/adoptions/my/applications");
      if (res.data?.success) {
        setRows(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (error) {
      console.error("Fetch My Adoption Requests Error:", error);
      toast.error("Failed to load your adoption requests");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;
    return rows.filter((item) => {
      const listing = item.adoptionPet || {};
      return (
        listing.name?.toLowerCase().includes(q) ||
        listing.breed?.toLowerCase().includes(q) ||
        listing.type?.toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 pt-[6rem] pb-14 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-7 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">My Adoption Requests</h1>
            <p className="text-[#6b7d67] text-sm sm:text-base mt-1">
              Track the requests you submitted to adopt pets.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-[#8b6b4c]/30 bg-white/70 text-[#2f3e2c] font-bold text-sm"
          >
            Back to Profile
          </Link>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pet name, type or breed"
            className="w-full md:w-96 px-4 py-3 rounded-2xl bg-white/50 backdrop-blur-xl border border-[#8b6b4c]/30 outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium"
          />
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 py-20 text-center">
            <div className="w-10 h-10 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#6b7d67] font-bold">Loading your requests...</p>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 py-20 text-center">
            <p className="text-[#2f3e2c] font-bold">No adoption requests found.</p>
            <p className="text-[#6b7d67] text-sm mt-1">Browse pets in adoption listing and apply first.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredRows.map((item) => {
              const listing = item.adoptionPet || {};
              const requestStatus = String(item.status || "").toUpperCase();
              const listingStatus = String(listing.status || "").toUpperCase();
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl bg-white/75 backdrop-blur-xl border border-[#8b6b4c]/20 p-5 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row gap-5 lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#8b6b4c]/20 bg-[#f3eee8]">
                        <img
                          src={getAdoptionListingImage(listing)}
                          alt={listing.name || "Adoption Pet"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-lg font-black text-[#2f3e2c]">{listing.name || "Unknown Pet"}</p>
                        <p className="text-xs text-[#6b7d67] font-bold uppercase tracking-wide">
                          {listing.type || "N/A"} • {listing.breed || "N/A"} • {listing.age || "N/A"}
                        </p>
                        <p className="text-xs text-[#6b7d67] mt-1">
                          Applied on {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-[#4e5f4a] mt-1">Living situation: {item.livingSituation}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <StatusPill label={`Request: ${requestStatus}`} status={requestStatus} />
                      <StatusPill label={`Listing: ${listingStatus}`} status={listingStatus} />
                      {listing.id && (
                        <Link
                          to={`/adopt/listing/${listing.id}`}
                          className="text-xs font-bold text-[#2f3e2c] border border-[#8b6b4c]/30 rounded-xl px-3 py-1.5 bg-white/80 text-center"
                        >
                          Open Listing
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ label, status }) {
  const cls =
    status === "PENDING"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "APPROVED"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : status === "ADOPTED"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-rose-50 text-rose-700 border-rose-200";
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${cls}`}>
      {label}
    </span>
  );
}
