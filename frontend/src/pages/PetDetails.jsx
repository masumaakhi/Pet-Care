import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";

const mockPets = [
  {
    id: "1",
    name: "Milo",
    species: "Cat",
    breed: "Mixed",
    age: "2 yrs",
    gender: "Male",
    weight: 4.5,
    photos: [
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=1200&q=80",
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=1200&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    ],
    weightLogs: [
      { date: "2026-01-02", value: 4.2 },
      { date: "2026-01-15", value: 4.3 },
      { date: "2026-02-01", value: 4.5 },
    ],
    schedules: [
      { type: "Feeding", time: "09:00 AM", freq: "Daily" },
      { type: "Grooming", time: "06:00 PM", freq: "Weekly" },
    ],
  },
];

export default function PetDetails() {
  const { id } = useParams();
  const pet = useMemo(() => mockPets.find((p) => p.id === id) || mockPets[0], [id]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[780px] h-[780px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              {pet.name} <span className="text-[#6b7d67] font-medium">({pet.species})</span>
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Breed: <span className="font-medium">{pet.breed}</span> • Age:{" "}
              <span className="font-medium">{pet.age}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/pets"
              className="px-5 py-2.5 rounded-xl bg-white/60
              border border-[#8b6b4c]/40 backdrop-blur-xl
              text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition"
            >
              ← Back
            </Link>

            <button
              onClick={() => setIsEditOpen(true)}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              border border-[#d6e2d3]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              ✏️ Edit Pet
            </button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-2 rounded-3xl overflow-hidden
            bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
            backdrop-blur-2xl border border-[#8b6b4c]/45
            shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="relative h-64 sm:h-80">
              <img
                src={pet.photos[0]}
                alt={`${pet.name} main`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/40 text-xs font-semibold text-[#2f3e2c]">
                {pet.gender} • {pet.weight} kg
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-[#2f3e2c] mb-3">Photo Gallery</h3>
              <div className="grid grid-cols-3 gap-3">
                {pet.photos.slice(0, 3).map((src, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden h-24 bg-black/5">
                    <img src={src} alt={`${pet.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#6b7d67] mt-4">
                (Later: Upload more photos, reorder, delete)
              </p>
            </div>
          </motion.div>

          {/* Right: Quick Panels */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="rounded-3xl p-5
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-4">Quick Actions</h3>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/pets/weight"
                  className="text-center py-3 rounded-2xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  text-black/75 font-semibold
                  hover:scale-[1.02] hover:shadow-lg transition duration-300"
                >
                  ⚖️ Weight Log
                </Link>

                <Link
                  to="/pets/schedule"
                  className="text-center py-3 rounded-2xl
                  bg-white/55 border border-[#8b6b4c]/40
                  text-[#2f3e2c] font-semibold
                  hover:bg-white/70 hover:shadow-md transition"
                >
                  🗓 Schedule
                </Link>
              </div>



                <div className="grid grid-cols-2 gap-3 mt-3">

                <Link
                  to="/pets/gallery"
                  className="text-center py-3 rounded-2xl
                  bg-white/55 border border-[#8b6b4c]/40
                  text-[#2f3e2c] font-semibold
                  hover:bg-white/70 hover:shadow-md transition"
                >
                  Gallery
                </Link>

                                <Link
                  to="/pets/calendar"
                  className="text-center py-3 rounded-2xl
                  bg-white/55 border border-[#8b6b4c]/40
                  text-[#2f3e2c] font-semibold
                  hover:bg-white/70 hover:shadow-md transition"
                >
                  Calendar
                </Link>
              </div>
            </motion.div>

            {/* Weight Summary */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-3xl p-5
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-3">Recent Weight</h3>
              <div className="space-y-2">
                {pet.weightLogs.slice(-3).reverse().map((w, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2 rounded-2xl
                    bg-white/55 border border-[#8b6b4c]/35"
                  >
                    <span className="text-sm text-[#4e5f4a]">{w.date}</span>
                    <span className="font-semibold text-[#2f3e2c]">{w.value} kg</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#6b7d67] mt-3">
                (Later: show mini chart here)
              </p>
            </motion.div>

            {/* Schedule Summary */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="rounded-3xl p-5 bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45 shadow-[0_25px_70px_rgba(0,0,0,0.10)]"
            >
              <h3 className="font-bold text-[#2f3e2c] mb-3">Today’s Schedule</h3>
              <div className="space-y-2">
                {pet.schedules.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2 rounded-2xl
                    bg-white/55 border border-[#8b6b4c]/35"
                  >
                    <span className="text-sm text-[#4e5f4a]">
                      {s.type} • {s.freq}
                    </span>
                    <span className="font-semibold text-[#2f3e2c]">{s.time}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#6b7d67] mt-3">
                (Later: reminder toggle + calendar view)
              </p>
            </motion.div>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditOpen && (
            <Modal onClose={() => setIsEditOpen(false)} pet={pet} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Modal({ onClose, pet }) {
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

      {/* Modal Card */}
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
            <h3 className="text-xl font-bold text-[#2f3e2c]">Edit Pet</h3>
            <p className="text-sm text-[#6b7d67]">Update basic information</p>
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
            alert("Saved (UI only). Backend will be added later.");
            onClose();
          }}
        >
          <Field label="Name">
            <Input defaultValue={pet.name} placeholder="Pet name" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Breed">
              <Input defaultValue={pet.breed} placeholder="Breed" />
            </Field>
            <Field label="Age">
              <Input defaultValue={pet.age} placeholder="Age" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Gender">
              <Input defaultValue={pet.gender} placeholder="Gender" />
            </Field>
            <Field label="Weight (kg)">
              <Input defaultValue={pet.weight} placeholder="Weight" />
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300"
            >
              Save Changes
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

function Input(props) {
  return <input {...props} className={baseInputClass()} />;
}
