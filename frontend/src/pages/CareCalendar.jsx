import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// ---- Mock data (backend later) ----
const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const mockEvents = [
  { id: 1, petId: "1", title: "Feeding", date: "2026-02-19", type: "feeding" },
  { id: 2, petId: "1", title: "Grooming", date: "2026-02-20", type: "grooming" },
  { id: 3, petId: "2", title: "Exercise", date: "2026-02-21", type: "exercise" },
  { id: 4, petId: "2", title: "Vaccination Due", date: "2026-02-22", type: "medical" },
];

const typeColor = {
  feeding: "from-emerald-200/70 to-emerald-100/70 border-emerald-300/60",
  grooming: "from-amber-200/70 to-amber-100/70 border-amber-300/60",
  exercise: "from-sky-200/70 to-sky-100/70 border-sky-300/60",
  medical: "from-rose-200/70 to-rose-100/70 border-rose-300/60",
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
  const [petId, setPetId] = useState("all");

  const { firstDay, days } = useMemo(
    () => getMonthDays(current.getFullYear(), current.getMonth()),
    [current]
  );

  const eventsFor = (dateStr) =>
    mockEvents.filter(
      (e) =>
        e.date === dateStr && (petId === "all" || e.petId === petId)
    );

  const prevMonth = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Care Calendar
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Monthly view of feeding, grooming, exercise & medical schedules.
            </p>
          </div>

          <div className="flex items-center gap-2">
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

            <button onClick={prevMonth} className="px-3 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40">◀</button>
            <button onClick={nextMonth} className="px-3 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/40">▶</button>
          </div>
        </div>

        {/* Month label */}
        <div className="text-center text-lg font-semibold text-[#2f3e2c] mb-3">
          {current.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs sm:text-sm text-[#6b7d67] font-semibold">
              {d}
            </div>
          ))}

          {/* Empty cells */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((d) => {
            const dateStr = d.toISOString().slice(0, 10);
            const dayEvents = eventsFor(dateStr);
            const isToday =
              new Date().toISOString().slice(0, 10) === dateStr;

            return (
              <motion.div
                key={dateStr}
                whileHover={{ y: -4, rotateX: 5 }}
                className={`min-h-[90px] sm:min-h-[110px] rounded-2xl p-2
                bg-white/55 backdrop-blur-2xl
                border ${isToday ? "border-emerald-400" : "border-[#8b6b4c]/40"}
                shadow-[0_14px_45px_rgba(0,0,0,0.10)]`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-[#2f3e2c]">
                    {d.getDate()}
                  </span>
                  {isToday && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Today
                    </span>
                  )}
                </div>

                <div className="mt-1 space-y-1">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      className={`text-[10px] sm:text-xs rounded-lg px-2 py-1
                      bg-gradient-to-br ${typeColor[e.type]}
                      border`}
                    >
                      {e.title}
                    </div>
                  ))}

                  {dayEvents.length === 0 && (
                    <p className="text-[10px] text-[#9aa79a] mt-3">No tasks</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
