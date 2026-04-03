// frontend/src/pages/PetDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
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

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchPetData();
  }, [id]);

  const fetchPetData = async () => {
    try {
      setLoading(true);
      const [petRes, schRes, weightRes] = await Promise.all([
        api.get(`/pets/${id}`),
        api.get(`/pets/${id}/schedules`),
        api.get(`/pets/${id}/weights`)
      ]);

      if (petRes.data.success) setPet(petRes.data.data);
      if (schRes.data.success) setSchedules(schRes.data.data);
      if (weightRes.data.success) setWeightLogs(weightRes.data.data);
      
    } catch (error) {
      console.error("Fetch Pet Data Error:", error);
      toast.error("Failed to load pet data");
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate("/pets");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/30 backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin" />
          <p className="text-[#2f3e2c] font-semibold">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[780px] h-[780px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none"
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
              {pet.name} <span className="text-[#6b7d67] font-medium">({pet.species})</span>
            </h1>
            <p className="text-[#6b7d67] mt-1 font-medium">
              Breed: <span className="font-bold text-[#2f3e2c]">{pet.breed}</span> • Age:{" "}
              <span className="font-bold text-[#2f3e2c]">{formatAge(pet.age_months)}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/pets"
              className="px-5 py-2.5 rounded-xl bg-white/60
              border border-[#8b6b4c]/40 backdrop-blur-xl
              text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition"
            >
              ← Back
            </Link>

            <button
              onClick={() => setIsEditOpen(true)}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              border border-[#d6e2d3]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              ✏️ Edit Pet
            </button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Info/Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-2 rounded-3xl overflow-hidden
            bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
            backdrop-blur-2xl border border-[#8b6b4c]/45
            shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="relative h-64 sm:h-80 bg-[#f3eee8]">
              <img
                src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80"}
                alt={`${pet.name} main`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 text-sm font-bold text-[#2f3e2c]">
                {pet.gender} • {pet.weight_kg} kg
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-xl text-[#2f3e2c] mb-3">About {pet.name}</h3>
              <p className="text-[#4e5f4a] leading-relaxed font-medium">
                {pet.description || `No description provided for ${pet.name} yet.`}
              </p>
              
              <div className="mt-8 border-t border-[#8b6b4c]/20 pt-6">
                <h3 className="font-bold text-[#2f3e2c] mb-4">Photo Gallery</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded-2xl overflow-hidden h-20 sm:h-24 bg-black/5">
                    <img src={pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80"} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <p className="text-xs text-[#6b7d67] mt-4 font-semibold italic">
                  * Multi-photo upload and gallery management coming in Phase 3.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Quick Panels */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="rounded-3xl p-5
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-4 uppercase text-xs tracking-wider">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Link
                  to="/pets/weight"
                  className="text-center py-3 rounded-2xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  text-black/75 font-bold hover:shadow-lg transition duration-300"
                >
                  ⚖️ Weight
                </Link>

                <Link
                  to="/pets/schedule"
                  className="text-center py-3 rounded-2xl
                  bg-white/55 border border-[#8b6b4c]/40
                  text-[#2f3e2c] font-bold hover:bg-white/70 transition"
                >
                  🗓 Schedule
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <Link
                  to="/pets/gallery"
                  className="text-center py-3 rounded-2xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-bold hover:bg-white/70 transition"
                >
                  Gallery
                </Link>
                <Link
                  to="/pets/calendar"
                  className="text-center py-3 rounded-2xl bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-bold hover:bg-white/70 transition"
                >
                  Calendar
                </Link>
              </div>
            </motion.div>

            {/* Weight Summary */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-3xl p-5
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-3 text-sm">Recent Weight</h3>
              <div className="space-y-2">
                {weightLogs.slice(-3).reverse().map((w, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/55 border border-[#8b6b4c]/20">
                    <span className="text-xs font-bold text-[#4e5f4a]">
                      {new Date(w.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="font-extrabold text-[#2f3e2c]">{w.weight_kg} kg</span>
                  </div>
                ))}
                {weightLogs.length === 0 && (
                  <p className="text-xs text-[#6b7d67] italic p-2 text-center">No weight logs yet.</p>
                )}
              </div>
            </motion.div>

            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="rounded-3xl p-5 bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45 shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-3 text-sm">Today’s Care</h3>
              <div className="space-y-2">
                {schedules.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/55 border border-[#8b6b4c]/20">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#5f7d5a] uppercase">{s.type}</span>
                      <span className="text-xs font-extrabold text-[#2f3e2c] truncate max-w-[100px]">{s.title || "Untitled"}</span>
                    </div>
                    <span className="font-bold text-[#2f3e2c] text-xs">{s.scheduled_time}</span>
                  </div>
                ))}
                {schedules.length === 0 && (
                  <p className="text-xs text-[#6b7d67] italic p-2 text-center">No care routines set.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditOpen && (
            <EditPetModal 
              onClose={() => setIsEditOpen(false)} 
              pet={pet} 
              onUpdated={(updated) => {
                setPet(updated);
                setIsEditOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EditPetModal({ onClose, pet, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: pet.name,
    breed: pet.breed,
    age_months: pet.age_months.toString(),
    gender: pet.gender,
    weight_kg: pet.weight_kg.toString(),
    description: pet.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.patch(`/pets/${pet.id}`, {
        ...formData,
        age_months: parseInt(formData.age_months),
        weight_kg: parseFloat(formData.weight_kg),
      });

      if (res.data.success) {
        toast.success("Pet updated successfully!");
        onUpdated(res.data.data);
      }
    } catch (error) {
      console.error("Update Pet Error:", error);
      toast.error(error.response?.data?.message || "Failed to update pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative w-full max-w-lg rounded-3xl p-7 bg-gradient-to-br from-white/90 via-[#f3eee8]/90 to-[#e5e3df]/90 backdrop-blur-2xl border border-[#8b6b4c]/50 shadow-2xl"
      >
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-xl font-bold text-[#2f3e2c]">Edit {pet.name}'s Profile</h3>
          <button onClick={onClose} className="text-[#6b7d67] hover:text-[#2f3e2c]">✕</button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Name">
            <Input name="name" value={formData.name} onChange={handleChange} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Breed">
              <Input name="breed" value={formData.breed} onChange={handleChange} />
            </Field>
            <Field label="Age (Months)">
              <Input type="number" name="age_months" value={formData.age_months} onChange={handleChange} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Gender">
              <Input name="gender" value={formData.gender} onChange={handleChange} />
            </Field>
            <Field label="Weight (kg)">
              <Input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} />
            </Field>
          </div>
          <Field label="Description">
            <Textarea name="description" value={formData.description} onChange={handleChange} />
          </Field>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-bold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white border border-[#8b6b4c]/30 text-[#2f3e2c] font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#4e5f4a] uppercase tracking-wider mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input 
      {...props} 
      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#8b6b4c]/30 focus:ring-2 focus:ring-[#7fa37a]/50 outline-none transition text-[#2f3e2c] font-medium" 
    />
  );
}

function Textarea(props) {
  return (
    <textarea 
      {...props} 
      rows={3} 
      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#8b6b4c]/30 focus:ring-2 focus:ring-[#7fa37a]/50 outline-none transition text-[#2f3e2c] font-medium" 
    />
  );
}
