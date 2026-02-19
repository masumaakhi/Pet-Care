import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ----- Mock Data (backend later) -----
const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const initialVaccines = [
  {
    id: 1,
    petId: "1",
    vaccineName: "Rabies",
    dose: "1st Dose",
    givenDate: "2026-01-10",
    nextDueDate: "2027-01-10",
    vetName: "City Vet Center",
    status: "Completed",
    reminder: true,
    proofUrl: "",
  },
  {
    id: 2,
    petId: "1",
    vaccineName: "FVRCP",
    dose: "Booster",
    givenDate: "2026-02-05",
    nextDueDate: "2026-08-05",
    vetName: "Happy Paws Clinic",
    status: "Due",
    reminder: true,
    proofUrl: "",
  },
  {
    id: 3,
    petId: "2",
    vaccineName: "DHPP",
    dose: "1st Dose",
    givenDate: "2026-01-22",
    nextDueDate: "2026-02-22",
    vetName: "CareVet",
    status: "Overdue",
    reminder: false,
    proofUrl: "",
  },
];

// ----- Helpers -----
function computeStatus(nextDueDate) {
  if (!nextDueDate) return "Completed";
  const now = new Date();
  const due = new Date(nextDueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays <= 14) return "Due";
  return "Completed";
}

function statusStyles(status) {
  // same palette family; no harsh colors
  if (status === "Overdue") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (status === "Due") {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default function VaccinationRecords() {
  const [petId, setPetId] = useState("all");
  const [items, setItems] = useState(initialVaccines);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = petId === "all" ? items : items.filter((v) => v.petId === petId);
    // keep UI fresh: compute status from nextDueDate
    return list
      .map((v) => ({ ...v, status: computeStatus(v.nextDueDate) }))
      .sort((a, b) => new Date(b.givenDate) - new Date(a.givenDate));
  }, [items, petId]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const due = filtered.filter((x) => x.status === "Due").length;
    const overdue = filtered.filter((x) => x.status === "Overdue").length;
    const remindersOn = filtered.filter((x) => x.reminder).length;
    return { total, due, overdue, remindersOn };
  }, [filtered]);

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow (same as your auth pages vibe) */}
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
              Vaccination Records
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Keep track of vaccines, due dates, and reminders.
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
              <option value="all" className="bg-[#f3eee8]">
                All Pets
              </option>
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
              ➕ Add Vaccine
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7"
        >
          <SummaryCard label="Total Records" value={summary.total} />
          <SummaryCard label="Due Soon" value={summary.due} />
          <SummaryCard label="Overdue" value={summary.overdue} />
          <SummaryCard label="Reminders On" value={summary.remindersOn} />
        </motion.div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((v, idx) => {
            const petName = mockPets.find((p) => p.id === v.petId)?.name || "Pet";
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl p-4 sm:p-5
                bg-white/55 backdrop-blur-2xl
                border border-[#8b6b4c]/45
                shadow-[0_18px_55px_rgba(0,0,0,0.10)]
                flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Left info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[#2f3e2c]">
                      {v.vaccineName}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c]">
                      {v.dose}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${statusStyles(
                        v.status
                      )}`}
                    >
                      {v.status}
                    </span>
                  </div>

                  <p className="text-sm text-[#6b7d67] mt-1">
                    Pet: <span className="font-medium">{petName}</span> • Vet:{" "}
                    <span className="font-medium">{v.vetName}</span>
                  </p>

                  <p className="text-sm text-[#6b7d67]">
                    Given: <span className="font-medium">{v.givenDate}</span> •
                    Next Due:{" "}
                    <span className="font-medium">{v.nextDueDate || "—"}</span>
                  </p>
                </div>

                {/* Right actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#2f3e2c]">
                    <input
                      type="checkbox"
                      className="accent-[#5f7d5a]"
                      checked={v.reminder}
                      onChange={() =>
                        setItems((prev) =>
                          prev.map((x) =>
                            x.id === v.id ? { ...x, reminder: !x.reminder } : x
                          )
                        )
                      }
                    />
                    Reminder
                  </label>

                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
                    text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
                    onClick={() => alert("Edit modal (next) — backend later")}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-red-300/60
                    text-red-600 font-semibold hover:bg-red-50 transition"
                    onClick={() =>
                      setItems((prev) => prev.filter((x) => x.id !== v.id))
                    }
                  >
                    🗑 Delete
                  </button>

                  <button
                    className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40
                    text-[#2f3e2c] font-semibold hover:bg-white/75 transition"
                    onClick={() => alert("Upload proof UI (next)")}
                  >
                    📎 Proof
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center text-[#6b7d67] py-10">
              No vaccination records found.
            </div>
          )}
        </div>
      </div>

      {/* Add Vaccine Modal */}
      <AnimatePresence>
        {isOpen && (
          <AddVaccineModal
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

/* ------------------ UI Bits ------------------ */

function SummaryCard({ label, value }) {
  return (
    <div
      className="p-4 rounded-2xl bg-white/55 backdrop-blur-xl
      border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]"
    >
      <p className="text-xs sm:text-sm text-[#6b7d67]">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-[#2f3e2c] mt-1">
        {value}
      </p>
    </div>
  );
}

function AddVaccineModal({ onClose, onAdd, pets }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [vaccineName, setVaccineName] = useState("");
  const [dose, setDose] = useState("1st Dose");
  const [givenDate, setGivenDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [vetName, setVetName] = useState("");
  const [reminder, setReminder] = useState(true);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
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
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#2f3e2c]">
              Add Vaccination
            </h3>
            <p className="text-sm text-[#6b7d67]">
              Save vaccine details & next due date.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/60 border border-[#8b6b4c]/35
            hover:bg-white/80 transition"
            aria-label="Close modal"
            title="Close"
          >
            ✕
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!petId || !vaccineName || !givenDate) {
              alert("Please fill Pet, Vaccine Name & Given Date");
              return;
            }

            onAdd({
              petId,
              vaccineName,
              dose,
              givenDate,
              nextDueDate,
              vetName: vetName || "—",
              reminder,
              status: computeStatus(nextDueDate),
              proofUrl: "",
            });
          }}
        >
          <Field label="Pet">
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className={baseInputClass()}
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Vaccine Name">
            <input
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              placeholder="e.g., Rabies / DHPP / FVRCP"
              className={baseInputClass()}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Dose">
              <select
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                className={baseInputClass()}
              >
                <option className="bg-[#f3eee8]">1st Dose</option>
                <option className="bg-[#f3eee8]">2nd Dose</option>
                <option className="bg-[#f3eee8]">Booster</option>
              </select>
            </Field>

            <Field label="Vet / Clinic">
              <input
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
                placeholder="e.g., City Vet Center"
                className={baseInputClass()}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Given Date">
              <input
                type="date"
                value={givenDate}
                onChange={(e) => setGivenDate(e.target.value)}
                className={baseInputClass()}
              />
            </Field>

            <Field label="Next Due Date (optional)">
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className={baseInputClass()}
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm text-[#2f3e2c]">
            <input
              type="checkbox"
              className="accent-[#5f7d5a]"
              checked={reminder}
              onChange={() => setReminder((x) => !x)}
            />
            Enable reminder for this vaccine
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/55
              border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold
              hover:bg-white/70 hover:shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </form>

        <p className="text-xs text-[#6b7d67] mt-4">
          (Backend later) Proof upload + edit workflow will be added.
        </p>
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
