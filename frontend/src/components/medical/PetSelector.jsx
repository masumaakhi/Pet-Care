import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePet } from "../../context/PetContext";
import { getPetImageUrl } from "../../utils/helpers";

/**
 * PetSelector - A premium custom searchable dropdown for pet selection
 * Follows the project's glassmorphism design system.
 */
export default function PetSelector() {
  const { pets, selectedPetId, setSelectedPetId } = usePet();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  const filteredPets = pets.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.breed.toLowerCase().includes(search.toLowerCase()) ||
    p.species.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative z-40 w-full sm:w-72" ref={dropdownRef}>
      <label className="text-[10px] font-black uppercase text-[#6b7d67] mb-2 block tracking-widest px-1">
        Select Patient
      </label>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 p-3 rounded-2xl 
          bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/30
          shadow-sm hover:shadow-md transition-all duration-300 group
          ${isOpen ? "ring-2 ring-[#7fa37a]/50 border-[#7fa37a]/50" : ""}`}
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#f3eee8] border border-[#8b6b4c]/10 flex-shrink-0">
          <img
            src={getPetImageUrl(selectedPet?.photos)}
            alt={selectedPet?.name}
            className="w-full h-full object-cover transition group-hover:scale-110"
          />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-black text-[#2f3e2c] truncate">
            {selectedPet?.name || "Choose Pet"}
          </div>
          <p className="text-[10px] font-bold text-[#6b7d67] uppercase tracking-wider truncate">
            {selectedPet ? `${selectedPet.species} • ${selectedPet.breed}` : "Select a patient profile"}
          </p>
        </div>
        <span className={`text-[#7fa37a] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-3 p-3 rounded-3xl 
              bg-white/95 backdrop-blur-2xl border border-[#8b6b4c]/20 
              shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Search Input */}
            <div className="relative mb-3">
              <input
                autoFocus
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-9 rounded-xl bg-[#f3eee8]/50 border border-[#8b6b4c]/10
                  text-sm font-bold text-[#2f3e2c] outline-none focus:ring-2 focus:ring-[#7fa37a]/30"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 text-sm">🔍</span>
            </div>

            {/* Pets List */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 pr-1">
              {filteredPets.length > 0 ? (
                filteredPets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => {
                      setSelectedPetId(pet.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition
                      ${selectedPetId === pet.id 
                        ? "bg-[#5f7d5a] text-white" 
                        : "hover:bg-[#f3eee8] text-[#2f3e2c]"
                      }`}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/30 border border-white/20">
                      <img
                        src={getPetImageUrl(pet.photos)}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-xs font-black ${selectedPetId === pet.id ? "text-white" : "text-[#2f3e2c]"}`}>
                        {pet.name}
                      </div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedPetId === pet.id ? "text-white/80" : "text-[#6b7d67]"}`}>
                        {pet.species} • {pet.breed}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center">
                  <span className="text-2xl mb-2 block">🐾</span>
                  <p className="text-[10px] font-black uppercase text-[#6b7d67] tracking-widest">No patient found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
