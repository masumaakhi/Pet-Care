// frontend/src/pages/Prescriptions.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { usePet } from "../context/PetContext";
import PetSelector from "../components/medical/PetSelector";

export default function Prescriptions() {
  const { selectedPetId, pets } = usePet();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedPetId) {
      fetchPrescriptions();
    }
  }, [selectedPetId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/medical/prescriptions?petId=${selectedPetId}`);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [items]);

  const handleDelete = async (id) => {
    if(!window.confirm("Verify delete?")) return;
    try {
       await api.delete(`/medical/prescriptions/${id}`);
       setItems(prev => prev.filter(x => x.id !== id));
       toast.success("Document deleted");
    } catch (e) { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden text-[#2f3e2c]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[170px] opacity-60 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">Prescriptions</h1>
            <p className="text-[#6b7d67] mt-1 font-bold">Manage meds & clinical documents.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto text-[#2f3e2c]">
             <PetSelector />
             <button onClick={() => setIsOpen(true)} className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5f7d5a] text-white font-black hover:scale-105 transition shadow-lg whitespace-nowrap">➕ Upload Doc</button>
          </div>
        </motion.div>

        {loading ? (
             <div className="py-20 text-center font-bold text-[#6b7d67]">Syncing records...</div>
        ) : (
          <div className="space-y-4">
             {filtered.map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 bg-white/60 border border-[#8b6b4c]/15 shadow-sm">
                   <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                         <h3 className="text-lg font-black tracking-tight">{p.pet?.name}'s Prescription • {new Date(p.date).toLocaleDateString()}</h3>
                         <p className="text-xs font-bold text-[#6b7d67]">Vet: {p.vet || "Clinic"} • Notes: {p.notes || "None"}</p>
                      </div>
                      <div className="flex gap-2">
                         {p.fileUrl && (
                            <a href={`${process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5250'}${p.fileUrl}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-white border border-[#8b6b4c]/20 font-black text-xs hover:bg-[#5f7d5a] hover:text-white transition group flex items-center gap-2">
                               📄 <span className="group-hover:inline hidden">View File</span>
                            </a>
                         )}
                         <button onClick={() => handleDelete(p.id)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100 font-bold">🗑️</button>
                      </div>
                   </div>

                   {/* Medicine Timeline */}
                   <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(p.medicines || []).map((m, i) => (
                         <div key={i} className="p-4 rounded-2xl bg-white/40 border border-[#8b6b4c]/10 flex flex-col justify-between">
                            <p className="font-black text-[#2f3e2c]">{m.name}</p>
                            <div className="flex justify-between items-end mt-2">
                               <span className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest">{m.time} • {m.days} Days</span>
                               {m.reminder && <span className="text-[8px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border border-emerald-100">Reminder Set</span>}
                            </div>
                         </div>
                      ))}
                   </div>
                </motion.div>
             ))}
          </div>
        )}
      </div>

      <AnimatePresence>
         {isOpen && (
           <UploadModal pets={pets} onClose={() => setIsOpen(false)} 
             onAdd={async (formData) => {
                try {
                  const res = await api.post("/medical/prescriptions", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });
                  if (res.data.success) {
                    setItems(prev => [res.data.data, ...prev]);
                    setIsOpen(false);
                    toast.success("Document Uploaded!");
                  }
                } catch (e) { toast.error("Upload failed"); }
             }} 
           />
         )}
      </AnimatePresence>
    </div>
  );
}

function UploadModal({ onClose, onAdd, pets }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [date, setDate] = useState("");
  const [vet, setVet] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState(null);
  const [medicines, setMedicines] = useState([{ name: "", time: "Morning", days: 1, reminder: true }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!petId || !date) return toast.error("Missing Date/Pet");
    const formData = new FormData();
    formData.append("petId", petId);
    formData.append("date", date);
    formData.append("vet", vet);
    formData.append("notes", notes);
    formData.append("medicines", JSON.stringify(medicines));
    if (file) formData.append("file", file);
    onAdd(formData);
  };

  const updateMed = (idx, key, val) => {
     setMedicines(prev => prev.map((m, i) => i === idx ? {...m, [key]: val} : m));
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-2xl rounded-[2.5rem] p-8 bg-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <h3 className="text-2xl font-black mb-6">Archive Prescription</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <Field label="Pet">
                <select 
                  className="w-full p-4 rounded-2xl border border-[#8b6b4c]/20 bg-[#f3eee8]/50 font-bold text-[#2f3e2c] outline-none focus:ring-2 focus:ring-[#7fa37a]/50 transition" 
                  value={petId} 
                  onChange={e => setPetId(e.target.value)}
                >
                   {pets.map(p => <option key={p.id} value={p.id}>{p.name} ({p.species})</option>)}
                </select>
             </Field>
             <Field label="Date"><input type="date" className="w-full p-4 rounded-2xl border font-bold" value={date} onChange={e => setDate(e.target.value)} /></Field>
          </div>
          <Field label="Clinic / Vet Name"><input className="w-full p-4 rounded-2xl border font-bold" value={vet} onChange={e => setVet(e.target.value)} /></Field>
          <Field label="Prescription File (PDF/Image)"><input type="file" className="w-full p-4 rounded-2xl border font-bold" onChange={e => setFile(e.target.files?.[0])} /></Field>
          
          <div className="pt-4">
             <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest">Medicine Routine</label>
                <button type="button" onClick={() => setMedicines(prev => [...prev, {name:"", time:"Morning", days:1, reminder:true}])} className="text-[10px] font-black uppercase text-[#5f7d5a] hover:underline">+ Add Medicine</button>
             </div>
             <div className="space-y-3">
                {medicines.map((m, i) => (
                   <div key={i} className="flex flex-col sm:flex-row gap-2 bg-[#f3eee8]/40 p-3 rounded-2xl border border-[#8b6b4c]/10">
                      <div className="flex-1 space-y-2">
                         <input className="w-full p-2.5 rounded-xl border bg-white/50 text-xs font-bold" placeholder="Medicine name..." value={m.name} onChange={e => updateMed(i, "name", e.target.value)} />
                         <div className="flex gap-2">
                            <select className="flex-1 p-2.5 rounded-xl border bg-white/50 text-[10px] font-bold" value={m.time} onChange={e => updateMed(i, "time", e.target.value)}>
                               <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Night</option>
                            </select>
                            <div className="flex items-center gap-1 border rounded-xl bg-white/50 px-2">
                               <span className="text-[9px] font-black text-[#6b7d67]">Days:</span>
                               <input type="number" className="w-10 bg-transparent text-[10px] font-bold outline-none" value={m.days} onChange={e => updateMed(i, "days", e.target.value)} />
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <button type="button" onClick={() => updateMed(i, "reminder", !m.reminder)} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl border text-[9px] font-black uppercase transition shadow-sm ${m.reminder ? 'bg-[#5f7d5a] text-white border-[#5f7d5a]' : 'bg-white text-[#6b7d67] border-[#8b6b4c]/20'}`}>
                           {m.reminder ? '🔔 Reminder On' : '🔕 No Alerts'}
                         </button>
                         {medicines.length > 1 && (
                            <button type="button" onClick={() => setMedicines(prev => prev.filter((_, idx) => idx !== i))} className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 border border-rose-100 hover:bg-rose-500 hover:text-white transition">
                               ✕
                            </button>
                         )}
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <Field label="Extra Notes"><textarea rows={2} className="w-full p-4 rounded-2xl border font-bold" value={notes} onChange={e => setNotes(e.target.value)} /></Field>
          <button type="submit" className="w-full py-4 rounded-2xl bg-[#5f7d5a] text-white font-black hover:scale-[1.02] shadow-xl mt-4">Save To Profile</button>
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
