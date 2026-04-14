// frontend/src/pages/MedicalHistory.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { usePet } from "../context/PetContext";
import PetSelector from "../components/medical/PetSelector";

export default function MedicalHistory() {
  const { selectedPetId, pets } = usePet();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (selectedPetId) {
      fetchHistory();
    }
  }, [selectedPetId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/medical/history?petId=${selectedPetId}`);
      if (res.data.success) {
        setRecords(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load medical history");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = [...records];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(r => r.diagnosis.toLowerCase().includes(q) || r.vet?.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records, query]);

  const stats = useMemo(() => {
     return {
       total: filtered.length,
       emergencies: filtered.filter(r => r.emergency).length,
       cost: filtered.reduce((acc, r) => acc + (r.cost || 0), 0)
     };
  }, [filtered]);

  const handleDelete = async (id) => {
     if (!window.confirm("Permanent delete?")) return;
     try {
       await api.delete(`/medical/history/${id}`);
       setRecords(prev => prev.filter(x => x.id !== id));
       toast.success("Record removed");
     } catch (e) { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[170px] opacity-60 pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#2f3e2c]">Medical History</h1>
            <p className="text-[#6b7d67] mt-1 font-bold">Diagnoses, treatments & clinic visits.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-3 w-full lg:w-auto">
             <PetSelector />
             <div className="flex-1 w-full flex gap-3">
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search records..." className="flex-1 px-5 py-3.5 rounded-2xl bg-white/60 border border-[#8b6b4c]/40 text-[#2f3e2c] font-black outline-none placeholder:text-[#2f3e2c]/40" />
                <button onClick={() => setIsOpen(true)} className="px-6 py-3.5 rounded-2xl bg-[#5f7d5a] text-white font-black hover:scale-105 transition shadow-lg whitespace-nowrap">➕ Add New</button>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <Summary label="Visits" value={stats.total} />
           <Summary label="Emergencies" value={stats.emergencies} />
           <Summary label="Total Cost" value={`৳${stats.cost}`} />
           <Summary label="Health Rank" value={stats.emergencies > 0 ? "High" : "Low"} />
        </div>

        {loading ? (
           <div className="text-center font-bold text-[#6b7d67] py-20">Loading archive...</div>
        ) : (
          <div className="space-y-4">
             {filtered.map((r, idx) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white/60 rounded-3xl border border-[#8b6b4c]/10 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <h3 className="text-lg font-black text-[#2f3e2c]">{r.diagnosis}</h3>
                         {r.emergency && <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] uppercase font-black border border-rose-100 italic">Emergency</span>}
                      </div>
                      <p className="text-xs font-bold text-[#6b7d67]">Pet: {r.pet?.name} • Date: {new Date(r.date).toLocaleDateString()} • Vet: {r.vet || "Clinic"}</p>
                      <p className="text-xs text-[#2f3e2c] mt-2 font-bold mb-1 opacity-70">Treatment:</p>
                      <p className="text-xs font-bold text-[#6b7d67] italic bg-[#f3eee8]/50 p-2 rounded-lg">{r.treatment}</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-[#2f3e2c]">৳{r.cost}</span>
                      <button onClick={() => handleDelete(r.id)} className="w-10 h-10 rounded-xl bg-transparent text-rose-500 font-bold border border-rose-100 hover:bg-rose-50">🗑️</button>
                   </div>
                </motion.div>
             ))}
          </div>
        )}
      </div>

      <AnimatePresence>
         {isOpen && (
           <AddRecordModal pets={pets} onClose={() => setIsOpen(false)} 
             onAdd={async (payload) => {
                try {
                   const res = await api.post("/medical/history", payload);
                   if (res.data.success) {
                      setRecords(prev => [res.data.data, ...prev]);
                      setIsOpen(false);
                      toast.success("Record Saved");
                   }
                } catch(e) { toast.error("Save failed"); }
             }} 
           />
         )}
      </AnimatePresence>
    </div>
  );
}

function Summary({ label, value }) {
  return (
    <div className="p-4 rounded-2xl bg-white/60 border border-[#8b6b4c]/30 text-center">
      <p className="text-[10px] font-black text-[#6b7d67] uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-[#2f3e2c] mt-1">{value}</p>
    </div>
  );
}

function AddRecordModal({ onClose, onAdd, pets }) {
   const [petId, setPetId] = useState(pets[0]?.id || "");
   const [diagnosis, setDiagnosis] = useState("");
   const [treatment, setTreatment] = useState("");
   const [date, setDate] = useState("");
   const [vet, setVet] = useState("");
   const [cost, setCost] = useState("");
   const [emergency, setEmergency] = useState(false);

   const handleSubmit = (e) => {
      e.preventDefault();
      if(!petId || !diagnosis || !date) return toast.error("Missing fields");
      onAdd({ petId, diagnosis, treatment, date, vet, cost: parseFloat(cost || 0), emergency });
   };

   return (
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
         <motion.div className="relative w-full max-w-lg rounded-[2.5rem] p-8 bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-black text-[#2f3e2c] mb-6 tracking-tight">Add Medical Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-[#6b7d67] mb-2 block tracking-widest ml-1">Select Patient</label>
                  <select 
                    className="w-full p-4 rounded-2xl border border-[#8b6b4c]/20 bg-[#f3eee8]/50 font-bold text-[#2f3e2c] outline-none focus:ring-2 focus:ring-[#7fa37a]/50 transition" 
                    value={petId} 
                    onChange={e => setPetId(e.target.value)}
                  >
                     {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}
                  </select>
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-[#6b7d67] mb-2 block tracking-widest">Diagnosis</label>
                  <input className="w-full p-4 rounded-2xl border font-bold" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Skin Allergy" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-[#6b7d67] mb-2 block tracking-widest">Treatment Summary</label>
                  <textarea className="w-full p-4 rounded-2xl border font-bold" value={treatment} onChange={e => setTreatment(e.target.value)} rows={3} placeholder="Meds, surgery, rest etc." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-[#6b7d67] mb-2 block tracking-widest">Date</label>
                    <input type="date" className="w-full p-4 rounded-2xl border font-bold" value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-[#6b7d67] mb-2 block tracking-widest">Cost (৳)</label>
                    <input type="number" className="w-full p-4 rounded-2xl border font-bold" value={cost} onChange={e => setCost(e.target.value)} />
                  </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                  <input type="checkbox" className="accent-[#5f7d5a] h-5 w-5" checked={emergency} onChange={() => setEmergency(!emergency)} id="em" />
                  <label htmlFor="em" className="text-xs font-black text-rose-600 uppercase tracking-widest cursor-pointer">Mark as Critical Emergency</label>
               </div>
               <button type="submit" className="w-full py-4 rounded-2xl bg-[#5f7d5a] text-white font-black hover:scale-[1.02] transition shadow-xl mt-4">Save Archive</button>
            </form>
         </motion.div>
      </motion.div>
   );
}
