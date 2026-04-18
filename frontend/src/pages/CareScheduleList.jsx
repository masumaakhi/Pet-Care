// frontend/src/pages/CareScheduleList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import BackNavButton from "../components/BackNavButton";

export default function CareScheduleList() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("all");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchPetsAndSchedules();
  }, []);

  const fetchPetsAndSchedules = async () => {
    try {
      setLoading(true);
      // Fetch all pets first to populate the dropdown
      const petsRes = await api.get("/pets");
      if (petsRes.data.success) {
        setPets(petsRes.data.data);
        const petsData = petsRes.data.data;

        // Fetch schedules for all pets (simplified for this view)
        // In a real app, you might fetch only for the selected pet
        const allSchedules = [];
        for (const pet of petsData) {
          const schRes = await api.get(`/pets/${pet.id}/schedules`);
          if (schRes.data.success) {
            allSchedules.push(...schRes.data.data.map(s => ({ ...s, petName: pet.name })));
          }
        }
        setSchedules(allSchedules);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load care data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    try {
      const res = await api.delete(`/pets/schedules/${scheduleId}`);
      if (res.data.success) {
        toast.success("Schedule deleted");
        setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      }
    } catch (error) {
       toast.error("Delete failed");
    }
  };

  const filteredSchedules = useMemo(() => {
    if (selectedPetId === "all") return schedules;
    return schedules.filter((s) => s.petId === selectedPetId);
  }, [selectedPetId, schedules]);

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[780px] h-[780px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <BackNavButton className="mb-3" />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Care Schedules
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Manage feeding, grooming & exercise reminders.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="px-4 py-2 rounded-xl
              bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold outline-none focus:ring-2 focus:ring-[#7fa37a]/50"
            >
              <option value="all" className="bg-[#f3eee8]">All Pets</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (pets.length === 0) return toast.error("Please add a pet first");
                setIsOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              ➕ Add Schedule
            </button>
          </div>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-[#6b7d67]">
              <div className="w-10 h-10 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
              <p>Loading schedules...</p>
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center text-[#6b7d67] py-20 rounded-3xl bg-white/30 border border-dashed border-[#8b6b4c]/40">
              <p className="text-4xl mb-3">🗓️</p>
              <p className="font-semibold">No schedules found for this pet.</p>
            </div>
          ) : (
            filteredSchedules.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-4 sm:p-5
                bg-white/55 backdrop-blur-2xl
                border border-[#8b6b4c]/45
                shadow-[0_18px_55px_rgba(0,0,0,0.10)]
                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-[#2f3e2c] text-lg">
                    {s.type} {s.title ? `• ${s.title}` : ""}
                  </p>
                  <p className="text-sm font-semibold text-[#6b7d67] mt-0.5">
                    Pet: <span className="text-[#2f3e2c]">{s.petName || pets.find(p => p.id === s.petId)?.name}</span> • 
                    Freq: <span className="text-[#2f3e2c]">{s.frequency || "Daily"}</span>
                  </p>
                  <p className="text-sm text-[#5f7d5a] font-bold mt-1">
                    🕒 Time: {s.scheduled_time}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
                    text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
                    onClick={() => {
                        setEditingSchedule(s);
                        setIsOpen(true);
                    }}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-red-300/60
                    text-red-600 font-semibold hover:bg-red-50 transition"
                    onClick={() => handleDelete(s.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      <AnimatePresence>
        {isOpen && (
          <AddScheduleModal 
            onClose={() => {
                setIsOpen(false);
                setEditingSchedule(null);
            }} 
            pets={pets} 
            onAdded={fetchPetsAndSchedules}
            editingSchedule={editingSchedule}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddScheduleModal({ onClose, pets, onAdded, editingSchedule }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: editingSchedule?.petId || pets[0]?.id || "",
    type: editingSchedule?.type || "Feeding",
    title: editingSchedule?.title || "",
    scheduled_time: editingSchedule?.scheduled_time || "",
    frequency: editingSchedule?.frequency || "Daily",
    notes: editingSchedule?.notes || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.scheduled_time) return toast.error("Please pick a time");

    try {
      setLoading(true);
      if (editingSchedule) {
        // Update
        const res = await api.put(`/pets/schedules/${editingSchedule.id}`, {
            ...formData,
            scheduled_date: editingSchedule.scheduled_date // Keep original date or update if logic requires
        });
        if (res.data.success) {
            toast.success("Schedule updated!");
            onAdded();
            onClose();
        }
      } else {
        // Create
        const res = await api.post(`/pets/${formData.petId}/schedules`, {
            ...formData,
            scheduled_date: new Date().toISOString(),
        });
        if (res.data.success) {
            toast.success("Schedule added successfully!");
            onAdded();
            onClose();
        }
      }
    } catch (error) {
      console.error("Save Schedule Error:", error);
      toast.error("Failed to save schedule");
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
        className="relative w-full max-w-md rounded-3xl p-7
        bg-gradient-to-br from-white/90 via-[#f3eee8]/90 to-[#e5e3df]/90
        backdrop-blur-2xl border border-[#8b6b4c]/50
        shadow-[0_35px_110px_rgba(0,0,0,0.22)]"
      >
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-1">
          {editingSchedule ? "Edit Care Schedule" : "Add Care Schedule"}
        </h3>
        <p className="text-sm text-[#6b7d67] mb-5">
          {editingSchedule ? "Update this reminder's details." : "Set feeding, grooming or exercise reminders."}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!editingSchedule && (
            <Field label="Target Pet">
              <select 
                name="petId"
                value={formData.petId}
                onChange={handleChange}
                className={baseInputClass()}
              >
                {pets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#f3eee8]">{p.name}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Schedule Type">
            <select 
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={baseInputClass()}
            >
              <option value="Feeding" className="bg-[#f3eee8]">Feeding</option>
              <option value="Grooming" className="bg-[#f3eee8]">Grooming</option>
              <option value="Exercise" className="bg-[#f3eee8]">Exercise</option>
              <option value="Medicine" className="bg-[#f3eee8]">Medicine</option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Time">
              <input 
                type="time" 
                name="scheduled_time"
                value={formData.scheduled_time}
                onChange={handleChange}
                className={baseInputClass()} 
              />
            </Field>
            <Field label="Frequency">
              <select 
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className={baseInputClass()}
              >
                <option value="Daily" className="bg-[#f3eee8]">Daily</option>
                <option value="Weekly" className="bg-[#f3eee8]">Weekly</option>
                <option value="Once" className="bg-[#f3eee8]">Once</option>
              </select>
            </Field>
          </div>

          <Field label="Title / Task">
            <input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Dinner Time" 
              className={baseInputClass()} 
            />
          </Field>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl
              bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
              text-white font-bold hover:shadow-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Schedule"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white border border-[#8b6b4c]/40
              text-[#2f3e2c] font-bold hover:bg-white/70 transition"
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

function baseInputClass() {
  return `w-full px-4 py-2.5 rounded-xl
    bg-white border border-[#8b6b4c]/30
    focus:ring-2 focus:ring-[#7fa37a]/40
    text-[#2f3e2c] font-semibold outline-none transition`;
}
