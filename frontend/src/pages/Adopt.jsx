import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaPaw } from "react-icons/fa";

// Birds (b) and Rabbits (r) from src/assets — only these images are used for adoption cards.
import b1 from "../assets/b1.jpg";
import b2 from "../assets/b2.jpg";
import b3 from "../assets/b3.jpg";
import b4 from "../assets/b4.jpg";
import b5 from "../assets/b5.jpg";
import r1 from "../assets/r1.jpg";
import r2 from "../assets/r2.jpg";
import r3 from "../assets/r3.jpg";
import r4 from "../assets/r4.jpg";
import r5 from "../assets/r5.jpg";
import cat1 from "../assets/cat1.jpg";
import cat2 from "../assets/cat2.jpg";
import cat3 from "../assets/cat3.jpg";
import cat4 from "../assets/cat4.jpg";
import dog1 from "../assets/dog1.jpg";
import dog2 from "../assets/dog2.jpg";
import dog3 from "../assets/dog3.jpg";
import dog4 from "../assets/dog4.jpg";
import dog5 from "../assets/dog5.jpg";


const petsFromUrls = [
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

// Pet profiles from assets: b = Bird, r = Rabbit (only b1–b3.jpg and r1–r5.jpg used).
const petsFromAssets = [
  {
    id: 7,
    name: "Sky",
    type: "Bird",
    breed: "Budgie",
    age: "1 year",
    size: "Small",
    gender: "Male",
    image: b1,
    tag: "Talkative & Curious",
  },
  {
    id: 8,
    name: "Sunny",
    type: "Bird",
    breed: "Canary",
    age: "8 months",
    size: "Small",
    gender: "Female",
    image: b2,
    tag: "Cheerful & Active",
  },
  {
    id: 9,
    name: "Blue",
    type: "Bird",
    breed: "Parakeet",
    age: "1.5 years",
    size: "Small",
    gender: "Male",
    image: b3,
    tag: "Friendly & Social",
  },
  {
    id: 10,
    name: "Bunny",
    type: "Rabbit",
    breed: "Holland Lop",
    age: "10 months",
    size: "Small",
    gender: "Male",
    image: r1,
    tag: "Quiet & Sweet",
  },
  {
    id: 11,
    name: "Coco",
    type: "Rabbit",
    breed: "Mini Lop",
    age: "1 year",
    size: "Small",
    gender: "Female",
    image: r2,
    tag: "Calm & Affectionate",
  },
  {
    id: 12,
    name: "Dusty",
    type: "Rabbit",
    breed: "Netherland Dwarf",
    age: "7 months",
    size: "Small",
    gender: "Male",
    image: r3,
    tag: "Playful & Energetic",
  },
  {
    id: 13,
    name: "Luna",
    type: "Rabbit",
    breed: "Lionhead",
    age: "1.2 years",
    size: "Small",
    gender: "Female",
    image: r4,
    tag: "Gentle & Fluffy",
  },
  {
    id: 14,
    name: "Pepper",
    type: "Rabbit",
    breed: "Rex",
    age: "2 years",
    size: "Medium",
    gender: "Male",
    image: r5,
    tag: "Rescued • Vaccinated",
  },
  {
    id: 15,
    name: "Sunny",
    type: "Bird",
    breed: "Canary",
    age: "2 years",
    size: "Small",
    gender: "Female",
    image: b4,
    tag: "Cheerful & Melodious",
  },
  {
    id: 16,
    name: "Rio",
    type: "Bird",
    breed: "Macaw",
    age: "4 years",
    size: "Large",
    gender: "Male",
    image: b5,
    tag: "Colorful & Intelligent",
  },
  {
    id: 17,
    name: "Whiskers",
    type: "Cat",
    breed: "Persian",
    age: "3 years",
    size: "Medium",
    gender: "Male",
    image: cat1,
    tag: "Calm & Gentle",
  },
  {
    id: 18,
    name: "Samba",
    type: "Cat",
    breed: "Siamese",
    age: "2 years",
    size: "Small",
    gender: "Female",
    image: cat2,
    tag: "Curious & Vocal",
  },
  {
    id: 19,
    name: "Shadow",
    type: "Cat",
    breed: "Maine Coon",
    age: "4 years",
    size: "Large",
    gender: "Male",
    image: cat3,
    tag: "Playful & Affectionate",
  },
  {
    id: 20,
    name: "George",
    type: "Cat",
    breed: "Bengal",
    age: "1 year",
    size: "Medium",
    gender: "Female",
    image: cat4,
    tag: "Energetic & Adventurous",
  },
  {
    id: 21,
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    size: "Large",
    gender: "Male",
    image: dog1,
    tag: "Friendly & Loyal",
  },
  {
    id: 22,
    name: "Samir",
    type: "Dog",
    breed: "Beagle",
    age: "2 years",
    size: "Medium",
    gender: "Female",
    image: dog2,
    tag: "Curious & Energetic",
  },
  {
    id: 23,
    name: "Rocky",
    type: "Dog",
    breed: "German Shepherd",
    age: "4 years",
    size: "Large",
    gender: "Male",
    image: dog3,
    tag: "Protective & Intelligent",
  },
  {
    id: 24,
    name: "Daisy",
    type: "Dog",
    breed: "Poodle",
    age: "1.5 years",
    size: "Small",
    gender: "Female",
    image: dog4,
    tag: "Playful & Elegant",
  },
  {
    id: 25,
    name: "Charlie",
    type: "Dog",
    breed: "Bulldog",
    age: "5 years",
    size: "Medium",
    gender: "Male",
    image: dog5,
    tag: "Calm & Affectionate",
  },


];

const pets = [...petsFromUrls, ...petsFromAssets];

function Adopt() {
  const navigate = useNavigate();
  const filterOptions = useMemo(
    () => ["All", "Dog", "Cat", "Bird", "Rabbit"],
    []
  );
  const [activeFilter, setActiveFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "error") => setToast({ message, type });

  const handleAdoptionRequest = async (pet) => {
    try {
      // 1. Save to localStorage for local persistence
      const existingAdoptions = JSON.parse(localStorage.getItem("adoptions") || "[]");
      // Check if already exists to avoid duplicates
      if (!existingAdoptions.find(p => p.id === pet.id)) {
        existingAdoptions.push(pet);
        localStorage.setItem("adoptions", JSON.stringify(existingAdoptions));
      }

      // 2. Try to sync with backend if it exists
      try {
        await axios.post("/adoptions", pet);
      } catch (apiErr) {
        console.warn("Backend storage failed, using localStorage only:", apiErr.message);
      }

      navigate("/adopt/listing");
    } catch (err) {
      console.error("Error handling adoption request:", err);
      showToast("Something went wrong. Please try again.");
    }
  };

  const filteredPets = useMemo(() => {
    if (activeFilter === "All") return pets;
    return pets.filter((p) => p.type === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen px-6 md:px-16 pt-[6rem] pb-16 bg-gradient-to-b from-[#f5f3ef] via-[#f8faf5] to-[#e5eee2]">
      {/* Heading */}
      <div className="max-w-5xl mx-auto mb-10 md:mb-14 text-center">
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
          className="text-sm md:text-base text-[#4e5f4a] max-w-2xl mx-auto mb-8"
        >
          Every pet here is waiting for a safe and loving home. Browse through
          the available pets, learn about their personalities, and start your
          adoption journey with just a few clicks.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            to="/adopt/listing"
            className="inline-flex items-center gap-2 bg-[#5f7d5a] text-white px-8 py-3.5 rounded-2xl font-semibold shadow-[0_15px_30px_rgba(95,125,90,0.3)] hover:bg-[#4e5f4a] hover:-translate-y-1 transition duration-300"
          >
            Explore Listing Pets
            <FaPaw className="text-lg" />
          </Link>
        </motion.div>
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
          {activeFilter !== "All" && (
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className="text-[#5f7d5a] hover:underline font-medium"
            >
              Reset
            </button>
          )}
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
                    onClick={() => handleAdoptionRequest(pet)}
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

      {/* Adoption Checklist */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="max-w-5xl mx-auto mt-12 md:mt-16 bg-white/90 backdrop-blur-2xl rounded-3xl px-6 md:px-10 py-8 md:py-10 shadow-[0_20px_70px_rgba(0,0,0,0.08)] border border-[#e0ded8]"
      >
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#2f3e2c] mb-2">
            Adoption Checklist
          </h2>
          <p className="text-sm md:text-base text-[#6b7d67] max-w-2xl mx-auto md:mx-0">
            Keep track of the next steps in your adoption journey and feel
            prepared when it&apos;s time to bring your new friend home.
          </p>
        </div>

        <div className="relative flex flex-col gap-8 md:gap-10 md:pl-10">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-3 top-3 bottom-3 w-px bg-[#e4ddff]" />

          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f0e9ff] border border-[#c0a6ff] flex items-center justify-center text-sm font-semibold text-[#4b2c88]">
                1
              </div>
              <div className="md:flex-1 w-px bg-[#e4ddff] flex-1 mt-1 hidden md:block" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2f3e2c] mb-2">
                Schedule a Time to Meet the Pet
              </h3>
              <ul className="space-y-2 text-sm md:text-[15px] text-[#4e5f4a] list-disc ml-5">
                <li>
                  Verify shelter or rescuer hours and whether you need an
                  appointment.
                </li>
                <li>
                  Learn more about the pet&apos;s background, temperament, and
                  any special needs.
                </li>
                <li>
                  Prepare questions about behavior, medical history, diet, and
                  what to expect during the first visits.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f0e9ff] border border-[#c0a6ff] flex items-center justify-center text-sm font-semibold text-[#4b2c88]">
                2
              </div>
              <div className="md:flex-1 w-px bg-[#e4ddff] flex-1 mt-1 hidden md:block" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2f3e2c] mb-2">
                Finalize the Adoption
              </h3>
              <ul className="space-y-2 text-sm md:text-[15px] text-[#4e5f4a] list-disc ml-5">
                <li>
                  Review and sign the adoption agreement and pay any adoption
                  fee.
                </li>
                <li>
                  Confirm which vaccines and treatments have already been given,
                  and when the next vet visit is due.
                </li>
                <li>
                  Arrange safe transportation home and prepare essentials like
                  food, bed, litter, and ID tag or microchip details.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f0e9ff] border border-[#c0a6ff] flex items-center justify-center text-sm font-semibold text-[#4b2c88]">
                3
              </div>
              <div className="md:flex-1 w-px bg-[#e4ddff] flex-1 mt-1 hidden md:block" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2f3e2c] mb-2">
                Get Ready to Bring Your Pet Home
              </h3>
              <ul className="space-y-2 text-sm md:text-[15px] text-[#4e5f4a] list-disc ml-5">
                <li>
                  Use a secure carrier, leash, or harness for safe transportation.
                </li>
                <li>
                  Pet‑proof your home by moving toxic plants, medicines, and cleaning
                  supplies out of reach.
                </li>
                <li>
                  Create a calm landing space with a bed, water bowl, and a few familiar
                  toys so they can decompress.
                </li>
                <li>
                  Dogs
                  <ul className="mt-2 ml-5 list-disc space-y-1 text-[13px] md:text-sm">
                    <li>Baby gates to block off unsafe areas (stairs, kitchen, etc.).</li>
                    <li>
                      Cord organizers or covers to prevent chewing on electrical wires.
                    </li>
                    <li>Cabinet locks for trash and cleaning supplies.</li>
                    <li>Non‑slip rugs or mats to help prevent slips and protect floors.</li>
                    <li>
                      Chew toys to redirect chewing away from furniture and shoes.
                    </li>
                    <li>
                      Crate or dog‑safe area for secure rest when unsupervised.
                    </li>
                  </ul>
                </li>
                <li>
                  Cats
                  <ul className="mt-2 ml-5 list-disc space-y-1 text-[13px] md:text-sm">
                    <li>
                      Window screens or guards so curious cats stay safe around heights.
                    </li>
                    <li>
                      Scratch posts or pads to save your furniture and give them an outlet.
                    </li>
                    <li>
                      Hide small objects (elastic bands, hair ties) that can be swallowed.
                    </li>
                    <li>
                      Secure cords and blinds that could tangle or be chewed.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f0e9ff] border border-[#c0a6ff] flex items-center justify-center text-sm font-semibold text-[#4b2c88]">
                4
              </div>
              <div className="md:flex-1 w-px bg-[#e4ddff] flex-1 mt-1 hidden md:block" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2f3e2c] mb-2">
                File Your Pet&apos;s Paperwork
              </h3>
              <ul className="space-y-2 text-sm md:text-[15px] text-[#4e5f4a] list-disc ml-5 mb-4">
                <li>Keep vaccination and deworming records together and up to date.</li>
                <li>
                  Store digital copies of vet records in case you ever need them in an
                  emergency.
                </li>
                <li>
                  Update microchip registration and contact details after adoption.
                </li>
                <li>
                  Order or update an ID tag with your phone number and pet&apos;s name.
                </li>
              </ul>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f36b3a] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                View Smart Pet ID Tips
              </button>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f0e9ff] border border-[#c0a6ff] flex items-center justify-center text-sm font-semibold text-[#4b2c88]">
                5
              </div>
              <div className="md:flex-1 w-px bg-[#e4ddff] flex-1 mt-1 hidden md:block" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2f3e2c] mb-2">
                Understand the Importance of Insurance
              </h3>
              <ul className="space-y-2 text-sm md:text-[15px] text-[#4e5f4a] list-disc ml-5 mb-4">
                <li>
                  Learn about accident, illness, and wellness plans available in your area.
                </li>
                <li>
                  Compare coverage for emergencies, surgeries, and long‑term medications.
                </li>
                <li>
                  Consider how insurance or a dedicated savings fund fits your budget.
                </li>
              </ul>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e7622b] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                Compare Insurance Options
              </button>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f0e9ff] border border-[#c0a6ff] flex items-center justify-center text-sm font-semibold text-[#4b2c88]">
                6
              </div>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-[#2f3e2c] mb-2">
                Establish Ongoing Support
              </h3>
              <ul className="space-y-2 text-sm md:text-[15px] text-[#4e5f4a] list-disc ml-5 mb-4">
                <li>
                  Choose a local vet and schedule an initial health check‑up and follow‑up
                  visits.
                </li>
                <li>
                  Research trainers, groomers, pet sitters, and boarding options you trust.
                </li>
                <li>
                  Set reminders for flea/tick prevention, heartworm prevention, and annual
                  vaccines.
                </li>
                <li>
                  Save contact details for local shelters or lost‑pet services just in
                  case.
                </li>
              </ul>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                Explore Local Pet Services
              </button>
            </div>
          </div>
        </div>
      </motion.section>

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
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Adopt;
