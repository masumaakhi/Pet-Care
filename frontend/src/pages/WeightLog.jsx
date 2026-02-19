import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const initialLogs = [
  { id: 1, petId: "1", date: "2026-01-02", weight: 4.2 },
  { id: 2, petId: "1", date: "2026-01-15", weight: 4.3 },
  { id: 3, petId: "1", date: "2026-02-01", weight: 4.5 },
  { id: 4, petId: "2", date: "2026-01-10", weight: 22.1 },
];

export default function WeightLog() {
  const [petId, setPetId] = useState("all");
  const [logs, setLogs] = useState(initialLogs);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (petId === "all") return logs;
    return logs.filter((l) => l.petId === petId);
  }, [petId, logs]);

  const chartData = useMemo(() => {
    return filtered.map((l) => ({ date: l.date, weight: l.weight }));
  }, [filtered]);

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
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="px-4 py-2 rounded-xl
              bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold"
            >
              <option value="all" className="bg-[#f3eee8]">All Pets</option>
              {mockPets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsOpen(true)}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              ➕ Add Weight
            </button>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl p-4 sm:p-6 mb-6
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
        >
          <h3 className="font-bold text-[#2f3e2c] mb-4">Weight Trend</h3>
          <div className="h-[260px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((l, idx) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl p-4 sm:p-5
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_18px_55px_rgba(0,0,0,0.10)]
              flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-bold text-[#2f3e2c]">
                  {l.weight} kg
                </p>
                <p className="text-sm text-[#6b7d67]">
                  Date: <span className="font-medium">{l.date}</span>
                </p>
              </div>

              <button
                className="px-4 py-2 rounded-xl bg-white/60 border border-red-300/60
                text-red-600 font-semibold hover:bg-red-50 transition"
                onClick={() =>
                  setLogs((prev) => prev.filter((x) => x.id !== l.id))
                }
              >
                🗑 Delete
              </button>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-[#6b7d67] py-10">
              No weight logs found for this pet.
            </div>
          )}
        </div>
      </div>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {isOpen && (
          <AddWeightModal
            onClose={() => setIsOpen(false)}
            onAdd={(data) =>
              setLogs((prev) => [
                ...prev,
                { id: Date.now(), petId, ...data },
              ])
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddWeightModal({ onClose, onAdd }) {
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState("");

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
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md rounded-3xl p-6
        bg-gradient-to-br from-white/80 via-[#e5e3df]/80 to-[#a18463]/35
        backdrop-blur-2xl border border-[#8b6b4c]/50
        shadow-[0_35px_110px_rgba(0,0,0,0.22)]"
      >
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-1">Add Weight</h3>
        <p className="text-sm text-[#6b7d67] mb-4">Log today’s weight.</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!weight || !date) return alert("Fill all fields");
            onAdd({ weight: Number(weight), date });
            onClose();
          }}
        >
          <Field label="Weight (kg)">
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={baseInputClass()}
              placeholder="e.g., 4.6"
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={baseInputClass()}
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/55 border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold hover:bg-white/70 transition"
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
      <label className="block text-sm text-[#4e5f4a] mb-1">{label}</label>
      {children}
    </div>
  );
}

function baseInputClass() {
  return `w-full px-4 py-2 rounded-xl
    bg-gradient-to-br from-white/65 via-[#7fa37a]/20 to-[#a18463]/20
    border border-[#8b6b4c]/45
    focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40
    text-black outline-none transition backdrop-blur-md`;
}
