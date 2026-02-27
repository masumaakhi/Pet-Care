import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

// Fallback image if API doesn't provide one
import b1 from "../assets/b1.jpg";

function AdoptionListing() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filterOptions = useMemo(
        () => ["All", "Dog", "Cat", "Bird", "Rabbit"],
        []
    );
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        const fetchAdoptions = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/adoptions");
                setPets(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching adoptions:", err);
                setError("Failed to load adoption listings. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, []);

    const filteredPets = useMemo(() => {
        if (activeFilter === "All") return pets;
        return pets.filter((p) => p.type === activeFilter);
    }, [activeFilter, pets]);

    return (
        <div className="min-h-screen px-6 md:px-16 pt-[6rem] pb-16 bg-gradient-to-b from-[#f5f3ef] via-[#f8faf5] to-[#e5eee2]">
            {/* Back Button & Header */}
            <div className="max-w-5xl mx-auto mb-10">
                <Link
                    to="/adopt"
                    className="inline-flex items-center gap-2 text-[#5f7d5a] hover:text-[#4e5f4a] font-medium transition mb-6"
                >
                    <FaArrowLeft className="text-sm" />
                    Back to Adoption Guide
                </Link>
                <div className="text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl md:text-4xl font-bold text-[#2f3e2c] mb-4"
                    >
                        Available for Adoption
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="text-sm md:text-base text-[#4e5f4a] max-w-2xl"
                    >
                        Find your perfect companion among our rescued pets. Each of them has a story and is looking for a forever home.
                    </motion.p>
                </div>
            </div>

            {/* Filters Row */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto mb-8 flex flex-wrap items-center gap-4"
            >
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-[#d0ddcc] rounded-2xl px-4 py-2.5 shadow-sm">
                    <span className="text-xs font-semibold text-[#7fa37a] uppercase tracking-wide">
                        Filter by:
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
            </motion.div>

            {/* Pets Grid */}
            <div className="max-w-5xl mx-auto">
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-80 bg-white/40 backdrop-blur-md rounded-3xl animate-pulse border border-[#d0ddcc]"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-white/80 backdrop-blur-md border border-red-100 rounded-3xl p-10 text-center text-red-600 shadow-sm">
                        {error}
                    </div>
                ) : (
                    <>
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
                                . Try another category.
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
                                                src={pet.image || b1}
                                                alt={pet.name}
                                                className="w-full h-full object-cover transition group-hover:scale-105 duration-500"
                                                onError={(e) => {
                                                    e.target.src = b1;
                                                }}
                                            />
                                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-medium bg-[#f1e9dd]/90 text-[#5a452f]">
                                                {pet.tag || "Available"}
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
                                                {pet.breed} • {pet.gender} • {pet.age}
                                            </p>

                                            <button
                                                type="button"
                                                className="mt-auto w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#5f7d5a]/60 via-[#7fa37a] to-[#8b6b4c] text-black/80 text-sm font-semibold shadow-sm group-hover:shadow-md group-hover:scale-[1.02] transition"
                                            >
                                                Adopt Now
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default AdoptionListing;
