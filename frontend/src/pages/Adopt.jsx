import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const pets = [
  {
    id: 1,
    name: "Bella",
    type: "Dog",
    breed: "Golden Retriever",
    age: "2 years",
    size: "Medium",
    gender: "Female",
    image:
      "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Gentle & Friendly",
  },
  {
    id: 2,
    name: "Milo",
    type: "Cat",
    breed: "Tabby",
    age: "8 months",
    size: "Small",
    gender: "Male",
    image:
      "https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Indoor & Playful",
  },
  {
    id: 3,
    name: "Luna",
    type: "Dog",
    breed: "Indie",
    age: "1.5 years",
    size: "Medium",
    gender: "Female",
    image:
      "https://images.pexels.com/photos/5731865/pexels-photo-5731865.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Rescued • Vaccinated",
  },
  {
    id: 4,
    name: "Oreo",
    type: "Cat",
    breed: "Domestic Short Hair",
    age: "3 years",
    size: "Small",
    gender: "Male",
    image:
      "https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Calm & Affectionate",
  },
  {
    id: 5,
    name: "Kiwi",
    type: "Bird",
    breed: "Budgie",
    age: "1 year",
    size: "Small",
    gender: "Female",
    image:
      "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Talkative & Curious",
  },
  {
    id: 6,
    name: "Coco",
    type: "Rabbit",
    breed: "Holland Lop",
    age: "10 months",
    size: "Small",
    gender: "Male",
    image:
      "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Quiet & Sweet",
  },
];

function Adopt() {
  const filterOptions = useMemo(
    () => ["All", "Dog", "Cat", "Bird", "Rabbit"],
    []
  );
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredPets = useMemo(() => {
    if (activeFilter === "All") return pets;
    return pets.filter((p) => p.type === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen px-6 md:px-16 pt-[6rem] pb-16 bg-gradient-to-b from-[#f5f3ef] via-[#f8faf5] to-[#e5eee2]">
      {/* Heading */}
      <div className="max-w-5xl mx-auto mb-10 md:mb-14">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-[#2f3e2c] mb-4"
        >
          Find Your New Best Friend
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-sm md:text-base text-[#4e5f4a] max-w-2xl"
        >
          Every pet here is waiting for a safe and loving home. Browse through
          the available pets, learn about their personalities, and start your
          adoption journey with just a few clicks.
        </motion.p>
      </div>

      {/* Filters Row */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto mb-6 md:mb-10 grid gap-4 md:grid-cols-[2fr,1.3fr,1.3fr]"
      >
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-[#d0ddcc] rounded-2xl px-4 py-2.5 shadow-sm">
          <span className="text-xs font-semibold text-[#7fa37a] uppercase tracking-wide">
            Quick Filters
          </span>
          <div className="flex gap-2 flex-wrap text-xs">
            {filterOptions.map((label) => {
              const isActive = activeFilter === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveFilter(label)}
                  className={[
                    "px-3 py-1 rounded-full border transition",
                    isActive
                      ? "bg-[#5f7d5a] border-[#5f7d5a] text-white shadow-sm"
                      : "bg-white/60 border-[#d6e2d3] text-[#2f3e2c] hover:bg-[#e4efe0]",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#d0ddcc] rounded-2xl px-4 py-2.5 text-xs text-[#4e5f4a] flex items-center justify-between shadow-sm">
          <span className="font-medium">Location</span>
          <span className="text-[11px] bg-[#e4efe0] px-3 py-1 rounded-full">
            Near you (static)
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-[#d0ddcc] rounded-2xl px-4 py-2.5 text-xs text-[#4e5f4a] flex items-center justify-between shadow-sm">
          <span className="font-medium">Sort by</span>
          <span className="text-[11px] bg-[#f1e9dd] px-3 py-1 rounded-full">
            Recently added
          </span>
        </div>
      </motion.div>

      {/* Pets Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="text-[#4e5f4a]">
            Showing{" "}
            <span className="font-semibold text-[#2f3e2c]">
              {filteredPets.length}
            </span>{" "}
            result{filteredPets.length === 1 ? "" : "s"}
            {activeFilter === "All" ? "" : ` for ${activeFilter}s`}
          </div>
          <button
            type="button"
            onClick={() => setActiveFilter("All")}
            className="text-[#5f7d5a] hover:underline font-medium"
          >
            Reset
          </button>
        </div>

        {filteredPets.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md border border-[#d0ddcc] rounded-3xl p-10 text-center text-[#4e5f4a] shadow-sm">
            No pets found for <span className="font-semibold">{activeFilter}</span>
            . Try another filter.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPets.map((pet, index) => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.08)] border border-[#d6e2d3]/80 hover:shadow-[0_30px_90px_rgba(95,125,90,0.25)] hover:-translate-y-1.5 transition duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition group-hover:scale-105 duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-medium bg-[#f1e9dd]/90 text-[#5a452f]">
                    {pet.tag}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-lg font-semibold text-[#2f3e2c]">
                      {pet.name}
                    </h3>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#e4efe0] text-[#4e5f4a] font-medium">
                      {pet.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7d67] mb-3">
                    {pet.breed} • {pet.gender} • {pet.size}
                  </p>

                  <div className="flex justify-between items-center text-xs text-[#4e5f4a] mb-4">
                    <span>Age: {pet.age}</span>
                    <span className="text-[11px] px-2 py-1 rounded-full bg-[#e2f3f1] text-[#28534c]">
                      Vaccinated • Dewormed
                    </span>
                  </div>

                  <button
                    type="button"
                    className="mt-auto w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a] to-[#8b6b4c] text-black/80 text-sm font-semibold shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition"
                  >
                    Start Adoption Request
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-5xl mx-auto mt-10 md:mt-14 bg-gradient-to-r from-[#5f7d5a] via-[#7fa37a] to-[#8b6b4c] rounded-3xl px-6 md:px-10 py-6 md:py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white shadow-[0_22px_80px_rgba(95,125,90,0.4)]"
      >
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-1">
            Didn&apos;t find the right match yet?
          </h2>
          <p className="text-sm md:text-[15px] opacity-90 max-w-xl">
            Tell us what kind of pet you are looking for and we&apos;ll notify
            you when a similar rescue is available.
          </p>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 rounded-2xl bg-white text-[#2f3e2c] text-sm font-semibold shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          Get Adoption Alerts
        </button>
      </motion.div>
    </div>
  );
}

export default Adopt;
