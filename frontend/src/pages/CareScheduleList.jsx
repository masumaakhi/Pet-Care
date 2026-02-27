import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const mockSchedules = [
  { id: 1, petId: "1", type: "Feeding", time: "09:00 AM", freq: "Daily", reminder: true },
  { id: 2, petId: "1", type: "Grooming", time: "06:00 PM", freq: "Weekly", reminder: false },
  { id: 3, petId: "2", type: "Exercise", time: "07:30 AM", freq: "Daily", reminder: true },
];

export default function CareScheduleList() {
  const [petId, setPetId] = useState("all");
  const [isOpen, setIsOpen] = useState(false);

  const schedules = useMemo(() => {
    if (petId === "all") return mockSchedules;
    return mockSchedules.filter((s) => s.petId === petId);
  }, [petId]);

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[780px] h-[780px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
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
              ➕ Add Schedule
            </button>
          </div>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {schedules.map((s, idx) => (
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
                <p className="font-bold text-[#2f3e2c]">
                  {s.type} • <span className="text-[#6b7d67]">{s.freq}</span>
                </p>
                <p className="text-sm text-[#6b7d67] mt-0.5">
                  Time: <span className="font-medium">{s.time}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Reminder Toggle */}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#2f3e2c]">
                  <input type="checkbox" defaultChecked={s.reminder} className="accent-[#5f7d5a]" />
                  Reminder
                </label>

                <button
                  className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
                  text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
                  onClick={() => alert("Edit modal later")}
                >
                  ✏️ Edit
                </button>

                <button
                  className="px-4 py-2 rounded-xl bg-white/60 border border-red-300/60
                  text-red-600 font-semibold hover:bg-red-50 transition"
                  onClick={() => alert("Delete later")}
                >
                  🗑 Delete
                </button>
              </div>
            </motion.div>
          ))}

          {schedules.length === 0 && (
            <div className="text-center text-[#6b7d67] py-10">
              No schedules found for this pet.
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      <AnimatePresence>
        {isOpen && <AddScheduleModal onClose={() => setIsOpen(false)} pets={mockPets} />}
      </AnimatePresence>
    </div>
  );
}

function AddScheduleModal({ onClose, pets }) {
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
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-1">Add Care Schedule</h3>
        <p className="text-sm text-[#6b7d67] mb-4">Set feeding, grooming or exercise.</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Schedule added (UI only). Backend later.");
            onClose();
          }}
        >
          <Field label="Pet">
            <select className={baseInputClass()}>
              {pets.map((p) => (
                <option key={p.id} className="bg-[#f3eee8]">{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Type">
            <select className={baseInputClass()}>
              <option className="bg-[#f3eee8]">Feeding</option>
              <option className="bg-[#f3eee8]">Grooming</option>
              <option className="bg-[#f3eee8]">Exercise</option>
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Time">
              <input type="time" className={baseInputClass()} />
            </Field>
            <Field label="Frequency">
              <select className={baseInputClass()}>
                <option className="bg-[#f3eee8]">Daily</option>
                <option className="bg-[#f3eee8]">Weekly</option>
                <option className="bg-[#f3eee8]">Custom</option>
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea rows={3} className={baseInputClass()} placeholder="Optional notes..." />
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
