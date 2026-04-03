// frontend/src/pages/WeightLog.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../utils/api";
import { toast } from "react-hot-toast";

export default function WeightLog() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("all");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchPetsAndLogs();
  }, []);

  const fetchPetsAndLogs = async () => {
    try {
      setLoading(true);
      const petsRes = await api.get("/pets");
      if (petsRes.data.success) {
        setPets(petsRes.data.data);
        const petsData = petsRes.data.data;

        const allLogs = [];
        for (const pet of petsData) {
          const logRes = await api.get(`/pets/${pet.id}/weights`);
          if (logRes.data.success) {
            allLogs.push(...logRes.data.data.map(l => ({ ...l, petName: pet.name })));
          }
        }
        // Sort logs by date for chart
        allLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
        setLogs(allLogs);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load weight history");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    if (selectedPetId === "all") return logs;
    return logs.filter((l) => l.petId === selectedPetId);
  }, [selectedPetId, logs]);

  const chartData = useMemo(() => {
    return filteredLogs.map((l) => ({
      date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: l.weight_kg
    }));
  }, [filteredLogs]);

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[780px] h-[780px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Weight Logs
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Track your pet’s growth over time.
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
              ➕ Add Weight
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#2f3e2c]">
            <div className="w-12 h-12 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mb-4" />
            <p className="font-bold">Loading weight data...</p>
          </div>
        ) : (
          <>
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-[2.5rem] p-5 sm:p-8 mb-8
              bg-gradient-to-br from-white/80 via-[#e5e3df]/60 to-[#a18463]/20
              backdrop-blur-3xl border border-[#8b6b4c]/30
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#2f3e2c] text-lg uppercase tracking-wider">Weight Trend Line</h3>
                <span className="text-[#6b7d67] font-semibold text-sm">
                  {selectedPetId === "all" ? "Combined Progress" : `${pets.find(p => p.id === selectedPetId)?.name}'s Growth`}
                </span>
              </div>
              
              <div className="h-[280px] sm:h-[350px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8b6b4c20" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7d67', fontWeight: 600, fontSize: 12 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#6b7d67', fontWeight: 600, fontSize: 12 }}
                        unit="kg"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '1.5rem', 
                          border: '1px solid #8b6b4c40', 
                          background: 'rgba(255, 255, 255, 0.9)', 
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#5f7d5a" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: "#5f7d5a", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6b7d67] italic font-medium">
                    No logs available for a chart. Add a weight entry to begin tracking trend.
                  </div>
                )}
              </div>
            </motion.div>

            {/* List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredLogs.slice().reverse().map((l, idx) => (
                  <motion.div
                    layout
                    key={l.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-3xl p-5
                    bg-white/60 backdrop-blur-3xl
                    border border-[#8b6b4c]/30
                    shadow-[0_18px_55px_rgba(0,0,0,0.06)]
                    flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-extrabold text-[#2f3e2c] text-xl">
                        {l.weight_kg} kg
                      </p>
                      <p className="text-sm font-bold text-[#6b7d67] mt-1">
                        Pet: <span className="text-[#5f7d5a]">{l.petName}</span> • 
                        Date: <span className="font-semibold">{new Date(l.date).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </p>
                      {l.note && <p className="text-xs text-[#6b7d67] mt-1 italic">Note: {l.note}</p>}
                    </div>

                    <button
                      className="px-5 py-2 rounded-2xl bg-white/70 border border-red-300/40
                      text-red-600 font-bold hover:bg-rose-50 transition shadow-sm"
                      onClick={() => toast.error("Delete coming later")}
                    >
                      🗑️
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredLogs.length === 0 && (
                <div className="text-center text-[#6b7d67] py-16 rounded-3xl bg-white/20 border border-dashed border-[#8b6b4c]/40">
                  <p className="text-4xl mb-3">⚖️</p>
                  <p className="font-bold">No weight logs found for this selection.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {isOpen && (
          <AddWeightModal
            onClose={() => setIsOpen(false)}
            pets={pets}
            onAdded={fetchPetsAndLogs}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddWeightModal({ onClose, pets, onAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    petId: pets[0]?.id || "",
    weight_kg: "",
    date: new Date().toISOString().split('T')[0],
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weight_kg || !formData.date) return toast.error("Weight and Date are required");

    try {
      setLoading(true);
      const res = await api.post(`/pets/${formData.petId}/weights`, {
        weight_kg: parseFloat(formData.weight_kg),
        date: new Date(formData.date).toISOString(),
        note: formData.note,
      });

      if (res.data.success) {
        toast.success("Weight log added!");
        onAdded();
        onClose();
      }
    } catch (error) {
      console.error("Add Weight Error:", error);
      toast.error("Failed to save weight log");
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
        bg-white/90 backdrop-blur-2xl border border-[#8b6b4c]/40
        shadow-[0_45px_120px_rgba(0,0,0,0.25)]"
      >
        <h3 className="text-2xl font-extrabold text-[#2f3e2c] mb-1">Add weight Log</h3>
        <p className="text-sm font-medium text-[#6b7d67] mb-6">Keep track of your pet's body progress.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Who is this for?">
            <select 
              name="petId" 
              value={formData.petId} 
              onChange={handleChange} 
              className={baseInputClass()}
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Weight (kg)">
              <input
                type="number"
                step="0.1"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                className={baseInputClass()}
                placeholder="e.g., 4.5"
              />
            </Field>

            <Field label="Logged Date">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={baseInputClass()}
              />
            </Field>
          </div>

          <Field label="Note (Optional)">
            <input 
              name="note" 
              value={formData.note} 
              onChange={handleChange} 
              className={baseInputClass()} 
              placeholder="e.g., Growth spurt!"
            />
          </Field>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 rounded-2xl
              bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
              text-white font-extrabold hover:shadow-xl transition duration-300 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save weight"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-white border border-[#8b6b4c]/30
              text-[#2f3e2c] font-bold hover:bg-[#f3eee8] transition"
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
      <label className="block text-xs font-bold text-[#4e5f4a] uppercase tracking-wider mb-1.5 ml-1">{label}</label>
      {children}
    </div>
  );
}

function baseInputClass() {
  return `w-full px-5 py-3 rounded-2xl
    bg-[#f3eee8]/40 border border-[#8b6b4c]/25
    focus:ring-2 focus:ring-[#7fa37a]/50
    text-[#2f3e2c] font-bold outline-none transition backdrop-blur-md`;
}
