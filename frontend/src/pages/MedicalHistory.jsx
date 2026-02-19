import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Mock data (backend later) ----
const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const initialRecords = [
  {
    id: 1,
    petId: "1",
    date: "2026-01-05",
    diagnosis: "Skin allergy",
    treatment: "Antihistamine + medicated shampoo",
    vet: "City Vet Center",
    followUp: "2026-01-20",
    cost: 1200,
    emergency: false,
    reportUrl: "",
  },
  {
    id: 2,
    petId: "1",
    date: "2026-02-12",
    diagnosis: "Minor injury",
    treatment: "Wound cleaning + antibiotics",
    vet: "Happy Paws Clinic",
    followUp: "",
    cost: 800,
    emergency: true,
    reportUrl: "",
  },
  {
    id: 3,
    petId: "2",
    date: "2026-01-22",
    diagnosis: "Fever",
    treatment: "Paracetamol (vet prescribed) + rest",
    vet: "CareVet",
    followUp: "2026-01-29",
    cost: 600,
    emergency: false,
    reportUrl: "",
  },
];

// ---- Simple health risk scoring (demo rules) ----
function calcRiskScore(records) {
  let score = 0;
  records.forEach((r) => {
    score += r.emergency ? 3 : 1;
    if (r.followUp) score += 1;
  });
  if (score <= 3) return { label: "Low", color: "emerald" };
  if (score <= 6) return { label: "Medium", color: "amber" };
  return { label: "High", color: "red" };
}

export default function MedicalHistory() {
  const [petId, setPetId] = useState("all");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState(initialRecords);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = petId === "all" ? records : records.filter((r) => r.petId === petId);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.diagnosis.toLowerCase().includes(q) ||
          r.vet.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records, petId, query]);

  const risk = useMemo(() => calcRiskScore(filtered), [filtered]);

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
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Medical History
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Track diagnoses, treatments, follow-ups & costs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-xl
              border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold"
            >
              <option value="all" className="bg-[#f3eee8]">All Pets</option>
              {mockPets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by diagnosis or vet..."
              className="px-4 py-2 rounded-xl bg-white/60 backdrop-blur-xl
              border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold outline-none"
            />

            <button
              onClick={() => setIsOpen(true)}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition"
            >
              ➕ Add Record
            </button>
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7"
        >
          <Summary label="Total Visits" value={filtered.length} />
          <Summary label="Emergency Cases" value={filtered.filter((r) => r.emergency).length} />
          <Summary label="Total Cost" value={`৳ ${filtered.reduce((a, b) => a + b.cost, 0)}`} />
          <RiskBadge risk={risk} />
        </motion.div>

        {/* Timeline */}
        <div className="space-y-4">
          {filtered.map((r, idx) => {
            const petName = mockPets.find((p) => p.id === r.petId)?.name || "Pet";
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                whileHover={{ y: -4 }}
                className={`rounded-2xl p-4 sm:p-5
                bg-white/55 backdrop-blur-2xl
                border ${r.emergency ? "border-red-300/60" : "border-[#8b6b4c]/45"}
                shadow-[0_18px_55px_rgba(0,0,0,0.10)]
                flex flex-col md:flex-row md:items-center md:justify-between gap-4`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#2f3e2c]">{r.diagnosis}</p>
                    {r.emergency && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
                        Emergency
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#6b7d67] mt-1">
                    Pet: <span className="font-medium">{petName}</span> • Vet:{" "}
                    <span className="font-medium">{r.vet}</span>
                  </p>
                  <p className="text-sm text-[#6b7d67]">
                    Date: <span className="font-medium">{r.date}</span> • Follow-up:{" "}
                    <span className="font-medium">{r.followUp || "—"}</span>
                  </p>
                  <p className="text-sm text-[#6b7d67] mt-1">
                    Treatment: <span className="font-medium">{r.treatment}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c] text-sm">
                    ৳ {r.cost}
                  </span>

                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
                    text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
                    onClick={() => alert("Upload/view report UI (next)")}
                  >
                    📎 Report
                  </button>

                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-red-300/60
                    text-red-600 font-semibold hover:bg-red-50 transition"
                    onClick={() =>
                      setRecords((prev) => prev.filter((x) => x.id !== r.id))
                    }
                  >
                    🗑 Delete
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center text-[#6b7d67] py-10">
              No medical history found.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isOpen && (
          <AddRecordModal
            pets={mockPets}
            onClose={() => setIsOpen(false)}
            onAdd={(payload) => {
              setRecords((prev) => [{ id: Date.now(), ...payload }, ...prev]);
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------- UI Bits -------- */

function Summary({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white/55 backdrop-blur-xl
      border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]">
      <p className="text-xs sm:text-sm text-[#6b7d67]">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-[#2f3e2c] mt-1">
        {value}
      </p>
    </div>
  );
}

function RiskBadge({ risk }) {
  const map = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <div className={`p-4 rounded-2xl border ${map[risk.color]} shadow-[0_16px_50px_rgba(0,0,0,0.10)]`}>
      <p className="text-xs sm:text-sm">Health Risk</p>
      <p className="text-xl sm:text-2xl font-bold mt-1">{risk.label}</p>
    </div>
  );
}

function AddRecordModal({ onClose, onAdd, pets }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [date, setDate] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [vet, setVet] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [cost, setCost] = useState("");
  const [emergency, setEmergency] = useState(false);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-7
        bg-gradient-to-br from-white/80 via-[#e5e3df]/80 to-[#a18463]/35
        backdrop-blur-2xl border border-[#8b6b4c]/50
        shadow-[0_35px_110px_rgba(0,0,0,0.22)]"
      >
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-1">Add Medical Record</h3>
        <p className="text-sm text-[#6b7d67] mb-4">Save visit details.</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!petId || !date || !diagnosis) return alert("Fill Pet, Date & Diagnosis");
            onAdd({
              petId,
              date,
              diagnosis,
              treatment,
              vet: vet || "—",
              followUp,
              cost: Number(cost || 0),
              emergency,
              reportUrl: "",
            });
          }}
        >
          <Field label="Pet">
            <select value={petId} onChange={(e) => setPetId(e.target.value)} className={baseInputClass()}>
              {pets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Visit">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={baseInputClass()} />
            </Field>
            <Field label="Follow-up Date">
              <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className={baseInputClass()} />
            </Field>
          </div>

          <Field label="Problem / Diagnosis">
            <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className={baseInputClass()} />
          </Field>

          <Field label="Treatment Summary">
            <textarea rows={3} value={treatment} onChange={(e) => setTreatment(e.target.value)} className={baseInputClass()} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Vet / Clinic">
              <input value={vet} onChange={(e) => setVet(e.target.value)} className={baseInputClass()} />
            </Field>
            <Field label="Cost (৳)">
              <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className={baseInputClass()} />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#2f3e2c]">
            <input type="checkbox" className="accent-[#5f7d5a]" checked={emergency} onChange={() => setEmergency((x) => !x)} />
            Mark as emergency / critical case
          </label>

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
