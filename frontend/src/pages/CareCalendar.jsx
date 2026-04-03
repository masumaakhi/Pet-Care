// frontend/src/pages/CareCalendar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const typeColor = {
  Feeding: "from-emerald-200/70 to-emerald-100/70 border-emerald-300/60 text-emerald-800",
  Grooming: "from-amber-200/70 to-amber-100/70 border-amber-300/60 text-amber-800",
  Exercise: "from-sky-200/70 to-sky-100/70 border-sky-300/60 text-sky-800",
  Medicine: "from-rose-200/70 to-rose-100/70 border-rose-300/60 text-rose-800",
  Other: "from-slate-200/70 to-slate-100/70 border-slate-300/60 text-slate-800",
};

function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 1; i <= last.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  return { firstDay: first.getDay(), days };
}

export default function CareCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("all");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const petsRes = await api.get("/pets");
      if (petsRes.data.success) {
        setPets(petsRes.data.data);
        const petsData = petsRes.data.data;

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
      console.error(error);
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  const { firstDay, days } = useMemo(
    () => getMonthDays(current.getFullYear(), current.getMonth()),
    [current]
  );

  const getEventsForDate = (date) => {
    const dStr = date.toISOString().split('T')[0];
    return schedules.filter(s => {
      const sDate = s.scheduled_date.split('T')[0];
      return sDate === dStr && (selectedPetId === "all" || s.petId === selectedPetId);
    });
  };

  const prevMonth = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[820px] h-[820px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[170px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#2f3e2c] tracking-tight">
              Care Calendar
            </h1>
            <p className="text-[#6b7d67] mt-1 font-bold">
              Visual monthly routines for your pets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="px-5 py-2.5 rounded-2xl bg-white/60 backdrop-blur-3xl
              border border-[#8b6b4c]/30 text-[#2f3e2c] font-black outline-none focus:ring-2 focus:ring-[#7fa37a]/50"
            >
              <option value="all">All Pets</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <div className="flex bg-white/60 p-1 rounded-2xl border border-[#8b6b4c]/30 backdrop-blur-md shadow-sm">
              <button onClick={prevMonth} className="px-4 py-1.5 rounded-xl hover:bg-white transition text-[#2f3e2c] font-bold">◀</button>
              <button onClick={nextMonth} className="px-4 py-1.5 rounded-xl hover:bg-white transition text-[#2f3e2c] font-bold">▶</button>
            </div>
          </div>
        </div>

        {/* Month label */}
        <div className="text-center text-2xl font-black text-[#2f3e2c] mb-6 uppercase tracking-widest">
          {current.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        {loading ? (
          <div className="text-center py-40">
             <div className="w-12 h-12 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
             <p className="text-[#6b7d67] font-bold">Mapping your care calendar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs text-[#6b7d67] font-black uppercase tracking-tighter opacity-70 mb-2">
                {d}
              </div>
            ))}

            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] bg-black/5 rounded-3xl opacity-30" />
            ))}

            {days.map((d) => {
              const dayEvents = getEventsForDate(d);
              const isToday = today.toDateString() === d.toDateString();

              return (
                <motion.div
                  key={d.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  className={`min-h-[110px] sm:min-h-[130px] rounded-[2rem] p-3
                  bg-white/60 backdrop-blur-3xl flex flex-col
                  border ${isToday ? "border-[#5f7d5a] ring-2 ring-[#7fa37a]/40 shadow-xl" : "border-[#8b6b4c]/20 shadow-sm"}
                  transition hover:shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-black ${isToday ? "text-[#5f7d5a]" : "text-[#2f3e2c]"}`}>
                      {d.getDate()}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-black uppercase text-[#5f7d5a]">Today</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        className={`text-[9px] font-black rounded-xl px-2 py-1.5
                        bg-gradient-to-br ${typeColor[e.type] || typeColor.Other}
                        border border-black/5 shadow-sm leading-tight`}
                      >
                        <p className="truncate">{e.title || e.type}</p>
                        <p className="opacity-70 text-[8px]">{e.scheduled_time}</p>
                        {selectedPetId === "all" && <p className="text-[7px] italic mt-0.5">{e.petName}</p>}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
