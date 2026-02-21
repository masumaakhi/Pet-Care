import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const mockPets = [
  {
    id: 1,
    name: "Milo",
    species: "Cat",
    breed: "Mixed",
    age: "2 yrs",
    photo:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80",
  },
  {
    id: 2,
    name: "Luna",
    species: "Dog",
    breed: "Golden Retriever",
    age: "1.5 yrs",
    photo:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
  },
  {
    id: 3,
    name: "Tiger",
    species: "Cat",
    breed: "Persian",
    age: "3 yrs",
    photo:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80",
  },
  {
    id: 4,
    name: "Rio",
    species: "Bird",
    breed: "Cockatiel",
    age: "1 yr",
    photo:
      "https://images.unsplash.com/photo-1552728089-57bdde30fc3b?w=800&q=80",
  },
  {
    id: 5,
    name: "Cotton",
    species: "Rabbit",
    breed: "Holland Lop",
    age: "6 mos",
    photo:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80",
  },
];

export default function PetList() {
  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 lg:px-10
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Background Glow (same vibe as Signin/Signup) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      {/* Page Container */}
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
              My Pets
            </h1>
            <p className="text-[#6b7d67] text-sm sm:text-base mt-1">
              Manage your pets, view details, and track their care.
            </p>
          </div>

          <Link
            to="/pets/add"
            className="inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
            border border-[#d6e2d3]
            text-black/75 font-semibold
            hover:scale-[1.02] hover:shadow-lg transition duration-300"
          >
            ➕ Add Pet
          </Link>
        </motion.div>

        {/* Stats Row (optional but nice for dashboard) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Pets", value: mockPets.length },
            { label: "Upcoming Schedules", value: 5 },
            { label: "Weight Logs", value: 12 },
            { label: "Reminders On", value: 3 },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-2xl bg-white/55 backdrop-blur-xl
              border border-[#8b6b4c]/35 shadow-[0_16px_50px_rgba(0,0,0,0.10)]"
            >
              <p className="text-xs sm:text-sm text-[#6b7d67]">{s.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#2f3e2c] mt-1">
                {s.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Pet Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPets.map((pet, idx) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 + idx * 0.05 }}
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: -2,
                transition: { duration: 0.2 },
              }}
              className="group rounded-3xl overflow-hidden
              bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
              backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]
              hover:shadow-[0_55px_160px_rgba(95,125,90,0.35)]
              transition duration-500"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Image */}
              <div className="relative h-44 sm:h-48">
                <img
                  src={pet.photo}
                  alt={`${pet.name} photo`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

                {/* Badge */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full
                  bg-white/70 backdrop-blur-md border border-white/40
                  text-xs font-semibold text-[#2f3e2c]"
                >
                  {pet.species}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#2f3e2c]">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-[#6b7d67] mt-0.5">
                      Breed: <span className="font-medium">{pet.breed}</span>
                    </p>
                    <p className="text-sm text-[#6b7d67]">
                      Age: <span className="font-medium">{pet.age}</span>
                    </p>
                  </div>

                  {/* Quick Action */}
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center
                    bg-white/60 border border-[#8b6b4c]/35
                    shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                    group-hover:scale-105 transition"
                    title="Quick Actions"
                  >
                    ⚡
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/pets/${pet.id}`}
                    className="flex-1 text-center py-2.5 rounded-xl
                    bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                    text-black/75 font-semibold
                    hover:scale-[1.02] hover:shadow-lg transition duration-300"
                  >
                    View Pet
                  </Link>

                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl
                    bg-white/55 border border-[#8b6b4c]/40
                    text-[#2f3e2c] font-semibold
                    hover:bg-white/70 hover:shadow-md transition"
                    onClick={() => alert("Edit will open in Pet Details modal")}
                  >
                    Edit
                  </button>
                </div>

                {/* Mini footer note */}
                <p className="text-xs text-[#6b7d67] mt-4">
                  Tip: Track weight & schedules from Pet Details.
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State (if no pets) */}
        {mockPets.length === 0 && (
          <div className="mt-10 text-center text-[#6b7d67]">
            No pets found. Click <span className="font-semibold">Add Pet</span>{" "}
            to get started.
          </div>
        )}
      </div>
    </div>
  );
}
