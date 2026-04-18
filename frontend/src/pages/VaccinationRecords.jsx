// frontend/src/pages/VaccinationRecords.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { usePet } from "../context/PetContext";
import PetSelector from "../components/medical/PetSelector";
import BackNavButton from "../components/BackNavButton";

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
  if (status === "Overdue") return "bg-red-50 text-red-700 border-red-200";
  if (status === "Due") return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default function VaccinationRecords() {
  const { selectedPetId, pets, loading: contextLoading } = usePet();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedPetId) {
      fetchVaccines();
    }
  }, [selectedPetId]);

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/medical/vaccines?petId=${selectedPetId}`);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load vaccine data");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return items
      .map((v) => ({ ...v, status: computeStatus(v.nextDueDate) }))
      .sort((a, b) => new Date(b.givenDate) - new Date(a.givenDate));
  }, [items]);

  const summary = useMemo(() => {
    const total = filtered.length;
    const due = filtered.filter((x) => x.status === "Due").length;
    const overdue = filtered.filter((x) => x.status === "Overdue").length;
    const remindersOn = filtered.filter((x) => x.reminder).length;
    return { total, due, overdue, remindersOn };
  }, [filtered]);

  const handleDelete = async (id) => {
     if (!window.confirm("Delete this record?")) return;
     try {
       await api.delete(`/medical/vaccines/${id}`);
       setItems(prev => prev.filter(x => x.id !== id));
       toast.success("Record deleted");
     } catch (e) { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[170px] opacity-60 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <BackNavButton className="mb-3" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2f3e2c]">Vaccination Records</h1>
            <p className="text-[#6b7d67] mt-1 font-bold">Track vaccines & due dates.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
            <PetSelector />
            <button onClick={() => setIsOpen(true)} className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5f7d5a] text-white font-black hover:scale-105 transition shadow-lg whitespace-nowrap">➕ Add Record</button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Total" value={summary.total} />
          <SummaryCard label="Due" value={summary.due} />
          <SummaryCard label="Overdue" value={summary.overdue} />
          <SummaryCard label="Reminders" value={summary.remindersOn} />
        </div>

        {loading ? (
             <div className="py-20 text-center font-bold text-[#6b7d67]">Syncing health data...</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((v, idx) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-5 bg-white/60 border border-[#8b6b4c]/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg font-black text-[#2f3e2c]">{v.vaccineName}</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${statusStyles(v.status)}`}>{v.status}</span>
                   </div>
                   <p className="text-xs font-bold text-[#6b7d67]">Pet: {v.pet?.name} • Vet: {v.vetName || "Private"}</p>
                   <p className="text-xs font-bold text-[#6b7d67] mt-1">Due: {v.nextDueDate ? new Date(v.nextDueDate).toLocaleDateString() : "—"}</p>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleDelete(v.id)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 border border-rose-100 font-bold">🗑️</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <AddVaccineModal pets={pets} onClose={() => setIsOpen(false)} 
            onAdd={async (payload) => {
               try {
                 const res = await api.post("/medical/vaccines", payload);
                 if (res.data.success) {
                   setItems(prev => [res.data.data, ...prev]);
                   setIsOpen(false);
                   toast.success("Vaccine Added!");
                 }
               } catch (e) { toast.error("Save failed"); }
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white/60 border border-[#8b6b4c]/30 text-center">
      <p className="text-[10px] font-black text-[#6b7d67] uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-[#2f3e2c] mt-1">{value}</p>
    </div>
  );
}

function AddVaccineModal({ onClose, onAdd, pets }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [vaccineName, setVaccineName] = useState("");
  const [givenDate, setGivenDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [vetName, setVetName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!petId || !vaccineName || !givenDate) return toast.error("Required fields missing");
    onAdd({ petId, vaccineName, dose: "1st Dose", givenDate, nextDueDate, vetName, reminder: true });
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-lg rounded-[2.5rem] p-8 bg-white shadow-2xl border border-[#8b6b4c]/30">
        <h3 className="text-2xl font-black text-[#2f3e2c] mb-6">New Vaccination</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Pet">
             <select 
               className="w-full px-5 py-3.5 rounded-2xl border border-[#8b6b4c]/20 bg-[#f3eee8]/50 font-bold text-[#2f3e2c] outline-none focus:ring-2 focus:ring-[#7fa37a]/50 transition" 
               value={petId} 
               onChange={e => setPetId(e.target.value)}
             >
                {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}
             </select>
          </Field>
          <Field label="Vaccine Name">
            <input className="w-full px-5 py-3 rounded-2xl border bg-transparent font-bold" value={vaccineName} onChange={e => setVaccineName(e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
             <Field label="Given Date"><input type="date" className="w-full px-5 py-3 rounded-2xl border font-bold" value={givenDate} onChange={e => setGivenDate(e.target.value)} /></Field>
             <Field label="Next Due"><input type="date" className="w-full px-5 py-3 rounded-2xl border font-bold" value={nextDueDate} onChange={e => setNextDueDate(e.target.value)} /></Field>
          </div>
          <Field label="Vet / Clinic"><input className="w-full px-5 py-3 rounded-2xl border bg-transparent font-bold" value={vetName} onChange={e => setVetName(e.target.value)} /></Field>
          <button type="submit" className="w-full py-4 rounded-2xl bg-[#5f7d5a] text-white font-black hover:shadow-2xl transition mt-4">Save Record</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-[#6b7d67] uppercase tracking-widest mb-2 ml-1">{label}</label>
      {children}
    </div>
  );
}
