// src/pages/admin/AdminAdoptionDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../utils/api";
import { getAdoptionListingImage } from "../../utils/helpers";

/**
 * Admin view: one adoption listing (AdoptionPet) and its AdoptionApplication rows.
 */
export default function AdminAdoptionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/adoptions/${id}`);
        if (cancelled) return;
        if (res.data?.success && res.data.data) {
          setListing(res.data.data);
        } else {
          setListing(null);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e.response?.data?.message || "Failed to load listing");
          setListing(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleListingStatus = async (newStatus) => {
    try {
      const res = await api.patch(`/adoptions/admin/status/${id}`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Listing ${newStatus.toLowerCase()}`);
        setListing((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen pt-24 flex justify-center">
        <div className="w-10 h-10 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="relative min-h-screen pt-24 px-4 text-center">
        <p className="text-[#6b7d67] mb-4">Listing not found.</p>
        <Link to="/admin/adoptions" className="text-[#5f7d5a] font-bold underline">
          Back to adoptions
        </Link>
      </div>
    );
  }

  const applications = Array.isArray(listing.applications) ? listing.applications : [];

  return (
    <div className="relative min-h-screen pt-8 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gradient-to-br from-[#7fa37a]/15 via-[#5f7d5a]/10 to-[#8b6b4c]/10 rounded-full blur-[170px] opacity-40" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Link
            to="/admin/adoptions"
            className="flex items-center gap-2 text-[#2f3e2c] font-black uppercase text-[10px] tracking-widest hover:opacity-70 transition"
          >
            ← Back to Requests
          </Link>
          <div
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
              listing.status === "PENDING"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : listing.status === "APPROVED"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {listing.status}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6 text-center">
              <div className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest mb-4">
                Listing
              </div>
              <img
                src={getAdoptionListingImage(listing)}
                alt={listing.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#7fa37a]/30 shadow-xl mb-4"
              />
              <h2 className="text-xl font-extrabold text-[#2f3e2c]">{listing.name}</h2>
              <p className="text-xs font-bold text-[#6b7d67] uppercase tracking-wider">
                {listing.type} • {listing.breed}
              </p>
              <p className="text-xs text-[#4e5f4a] mt-2">
                {listing.gender} • {listing.age}
              </p>
              <div className="mt-4 pt-4 border-t border-[#8b6b4c]/10 text-[10px] font-black text-[#5f7d5a] tracking-widest">
                ID: {listing.id.slice(0, 8)}…
              </div>
            </GlassCard>

            {listing.status === "PENDING" && (
              <GlassCard className="p-6">
                <div className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest mb-4">
                  Listing decision
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleListingStatus("APPROVED")}
                    className="py-3 rounded-2xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-bold text-sm"
                  >
                    Approve listing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleListingStatus("REJECTED")}
                    className="py-3 rounded-2xl border border-rose-300 text-rose-700 font-bold text-sm"
                  >
                    Reject listing
                  </button>
                </div>
              </GlassCard>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8">
              <SectionHeader icon="📋" title="Applications" />
              {applications.length === 0 ? (
                <p className="mt-6 text-sm text-[#6b7d67]">No applications yet.</p>
              ) : (
                <ul className="mt-6 space-y-4">
                  {applications.map((app) => (
                    <li
                      key={app.id}
                      className="p-4 rounded-2xl bg-white/50 border border-[#8b6b4c]/15"
                    >
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <div>
                          <div className="font-extrabold text-[#2f3e2c]">{app.fullName}</div>
                          <div className="text-xs text-[#6b7d67] mt-1">{app.email}</div>
                          <div className="text-xs text-[#6b7d67]">{app.phone}</div>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-1 rounded-full bg-[#e4efe0] text-[#2f3e2c]">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#4e5f4a] mt-3">
                        <span className="font-bold text-[#5f7d5a]">Living situation:</span>{" "}
                        {app.livingSituation}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>

            <GlassCard className="p-8">
              <SectionHeader icon="📝" title="Internal notes" />
              <textarea
                placeholder="Notes for fellow admins (local only — not saved to server yet)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-6 p-5 rounded-2xl bg-white/40 border border-[#8b6b4c]/30 outline-none focus:ring-2 focus:ring-[#7fa37a]/50 text-[#2f3e2c] font-medium h-32"
              />
              <p className="text-[10px] text-[#6b7d67] mt-2">
                Application-level approve/reject API is not implemented; manage listing status from here or the main table.
              </p>
            </GlassCard>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate("/admin/adoptions")}
                className="px-6 py-3 rounded-2xl bg-white/70 border border-[#8b6b4c]/30 font-bold text-[#2f3e2c]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassCard({ className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-[2rem] bg-white/65 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl p-2 rounded-xl bg-white border border-[#8b6b4c]/10 shadow-sm">{icon}</span>
      <h3 className="text-lg font-black text-[#2f3e2c] uppercase tracking-tight">{title}</h3>
    </div>
  );
}
