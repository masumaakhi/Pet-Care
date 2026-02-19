import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Mock data (backend later) ----
const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const initialPrescriptions = [
  {
    id: 1,
    petId: "1",
    date: "2026-02-10",
    vet: "City Vet Center",
    fileName: "prescription_feb10.pdf",
    medicines: [
      { name: "Antibiotic", time: "Morning", days: 5, reminder: true },
      { name: "Vitamin Syrup", time: "Evening", days: 10, reminder: false },
    ],
    notes: "Give after food",
  },
];

export default function Prescriptions() {
  const [petId, setPetId] = useState("all");
  const [items, setItems] = useState(initialPrescriptions);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (petId === "all") return items;
    return items.filter((x) => x.petId === petId);
  }, [items, petId]);

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[820px] h-[820px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[170px] opacity-60 pointer-events-none"
      />

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
              Prescriptions
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Upload prescriptions & manage medicine reminders.
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
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition"
            >
              ➕ Upload Prescription
            </button>
          </div>
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((p, idx) => {
            const petName = mockPets.find((x) => x.id === p.petId)?.name || "Pet";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-4 sm:p-5
                bg-white/55 backdrop-blur-2xl
                border border-[#8b6b4c]/45
                shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#2f3e2c]">
                      Prescription • {p.date}
                    </p>
                    <p className="text-sm text-[#6b7d67]">
                      Pet: <span className="font-medium">{petName}</span> • Vet:{" "}
                      <span className="font-medium">{p.vet}</span>
                    </p>
                    <p className="text-sm text-[#6b7d67]">
                      File: <span className="font-medium">{p.fileName}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
                      text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
                      onClick={() => alert("Open file (backend later)")}
                    >
                      📄 View
                    </button>

                    <button
                      className="px-4 py-2 rounded-xl bg-white/60 border border-red-300/60
                      text-red-600 font-semibold hover:bg-red-50 transition"
                      onClick={() =>
                        setItems((prev) => prev.filter((x) => x.id !== p.id))
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                {/* Medicines */}
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {p.medicines.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 bg-white/60 border border-[#8b6b4c]/35
                      flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-semibold text-[#2f3e2c]">{m.name}</p>
                        <p className="text-xs text-[#6b7d67]">
                          {m.time} • {m.days} days
                        </p>
                      </div>

                      <label className="flex items-center gap-2 text-xs text-[#2f3e2c]">
                        <input
                          type="checkbox"
                          className="accent-[#5f7d5a]"
                          defaultChecked={m.reminder}
                        />
                        Reminder
                      </label>
                    </div>
                  ))}
                </div>

                {p.notes && (
                  <p className="text-xs text-[#6b7d67] mt-3">
                    Notes: {p.notes}
                  </p>
                )}
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center text-[#6b7d67] py-10">
              No prescriptions found.
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && (
          <UploadModal
            pets={mockPets}
            onClose={() => setIsOpen(false)}
            onAdd={(payload) => {
              setItems((prev) => [{ id: Date.now(), ...payload }, ...prev]);
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------- Upload Modal -------- */

function UploadModal({ onClose, onAdd, pets }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [date, setDate] = useState("");
  const [vet, setVet] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", time: "Morning", days: 5, reminder: true },
  ]);

  const addMedicine = () =>
    setMedicines((prev) => [...prev, { name: "", time: "Morning", days: 5, reminder: true }]);

  const updateMedicine = (idx, key, value) =>
    setMedicines((prev) => prev.map((m, i) => (i === idx ? { ...m, [key]: value } : m)));

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-xl rounded-3xl p-6 sm:p-7
        bg-gradient-to-br from-white/80 via-[#e5e3df]/80 to-[#a18463]/35
        backdrop-blur-2xl border border-[#8b6b4c]/50
        shadow-[0_35px_110px_rgba(0,0,0,0.22)]"
      >
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-1">Upload Prescription</h3>
        <p className="text-sm text-[#6b7d67] mb-4">Attach file & set medicine reminders.</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!petId || !date || !file) return alert("Pet, Date & File required");
            onAdd({
              petId,
              date,
              vet: vet || "—",
              fileName: file.name,
              medicines,
              notes,
            });
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Pet">
              <select value={petId} onChange={(e) => setPetId(e.target.value)} className={baseInputClass()}>
                {pets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={baseInputClass()} />
            </Field>
          </div>

          <Field label="Vet / Clinic">
            <input value={vet} onChange={(e) => setVet(e.target.value)} className={baseInputClass()} />
          </Field>

          <Field label="Prescription File (PDF/Image)">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className={baseInputClass()} />
          </Field>

          {/* Medicines */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#2f3e2c]">Medicines</p>
            {medicines.map((m, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                <input
                  placeholder="Name"
                  value={m.name}
                  onChange={(e) => updateMedicine(i, "name", e.target.value)}
                  className={baseInputClass()}
                />
                <select value={m.time} onChange={(e) => updateMedicine(i, "time", e.target.value)} className={baseInputClass()}>
                  <option className="bg-[#f3eee8]">Morning</option>
                  <option className="bg-[#f3eee8]">Noon</option>
                  <option className="bg-[#f3eee8]">Evening</option>
                  <option className="bg-[#f3eee8]">Night</option>
                </select>
                <input
                  type="number"
                  min={1}
                  value={m.days}
                  onChange={(e) => updateMedicine(i, "days", e.target.value)}
                  className={baseInputClass()}
                />
                <label className="flex items-center gap-1 text-xs text-[#2f3e2c]">
                  <input type="checkbox" checked={m.reminder} onChange={() => updateMedicine(i, "reminder", !m.reminder)} />
                  Remind
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={addMedicine}
              className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
            >
              ➕ Add Medicine
            </button>
          </div>

          <Field label="Notes">
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={baseInputClass()} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition">
              Save
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl
              bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-white/70 transition">
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
