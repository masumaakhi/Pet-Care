import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

// Fallback image
import b1 from "../assets/b1.jpg";

export default function AdoptionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                setLoading(true);

                // First check localStorage as it's our primary source for "stored" requests
                const localData = JSON.parse(localStorage.getItem("adoptions") || "[]");

                // Use strict equality for numbers if ID is numeric, or loose if string vs number
                let foundPet = localData.find(p => String(p.id) === String(id));

                if (!foundPet) {
                    // Fallback to API if not in localStorage. 
                    // This assumes an endpoint like /adoptions/:id exists.
                    try {
                        const response = await axios.get(`/adoptions/${id}`);
                        foundPet = response.data;
                    } catch (apiErr) {
                        console.warn("API fetch for details failed, using only local storage", apiErr);
                    }
                }

                if (foundPet) {
                    setPet(foundPet);
                    setError(null);
                } else {
                    setError("Pet details not found. It may have been removed or already adopted.");
                }

            } catch (err) {
                console.error("Error fetching pet details:", err);
                setError("Failed to load pet details.");
            } finally {
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8faf5]">
                <div className="w-12 h-12 border-4 border-[#5f7d5a] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8faf5] px-6 text-center">
                <FaExclamationTriangle className="text-6xl text-[#d0a775] mb-6" />
                <h1 className="text-3xl font-bold text-[#2f3e2c] mb-4">Oops!</h1>
                <p className="text-[#4e5f4a] mb-8">{error || "Pet not found."}</p>
                <Link
                    to="/adopt/listing"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-semibold shadow-md hover:-translate-y-0.5 transition"
                >
                    Back to Listings
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 md:px-16 pt-[6rem] pb-16 bg-gradient-to-b from-[#f5f3ef] via-[#f8faf5] to-[#e5eee2]">
            <div className="max-w-5xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/adopt/listing"
                        className="inline-flex items-center gap-2 text-[#5f7d5a] hover:text-[#4e5f4a] font-medium transition"
                    >
                        <FaArrowLeft className="text-sm" />
                        Back to Listings
                    </Link>
                </div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.08)] border border-[#d0ddcc] grid lg:grid-cols-2"
                >
                    {/* Image Section */}
                    <div className="relative h-[40vh] lg:h-auto overflow-hidden">
                        <img
                            src={pet.image || b1}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = b1; }}
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide bg-[#f1e9dd]/90 text-[#5a452f] shadow-sm backdrop-blur-md">
                                {pet.tag || "Available for Adoption"}
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 md:p-12 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-[#2f3e2c] mb-2">{pet.name}</h1>
                                <p className="text-lg text-[#6b7d67] font-medium">{pet.breed} • {pet.type}</p>
                            </div>
                            <span className="p-3 bg-rose-50 rounded-full text-rose-500">
                                <FaHeart size={24} />
                            </span>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 my-8 pb-8 border-b border-[#e4efe0]">
                            <div className="text-center p-4 bg-[#f8faf5] rounded-2xl border border-[#d6e2d3]">
                                <span className="block text-xs text-[#7fa37a] uppercase font-bold tracking-wider mb-1">Age</span>
                                <span className="text-[#2f3e2c] font-semibold">{pet.age}</span>
                            </div>
                            <div className="text-center p-4 bg-[#f8faf5] rounded-2xl border border-[#d6e2d3]">
                                <span className="block text-xs text-[#7fa37a] uppercase font-bold tracking-wider mb-1">Gender</span>
                                <span className="text-[#2f3e2c] font-semibold">{pet.gender}</span>
                            </div>
                            <div className="text-center p-4 bg-[#f8faf5] rounded-2xl border border-[#d6e2d3]">
                                <span className="block text-xs text-[#7fa37a] uppercase font-bold tracking-wider mb-1">Size</span>
                                <span className="text-[#2f3e2c] font-semibold">{pet.size || "Unknown"}</span>
                            </div>
                        </div>

                        {/* Health & Location Details */}
                        <div className="space-y-6 flex-1 text-[#4e5f4a]">
                            <div>
                                <h3 className="text-lg font-bold text-[#2f3e2c] mb-2 flex items-center gap-2">
                                    <FaCheckCircle className="text-[#5f7d5a]" />
                                    Health Status
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    {pet.name} is fully vaccinated, dewormed, and has passed a recent health checkup. Ready to join a loving family!
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-[#2f3e2c] mb-2 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-[#d0a775]" />
                                    Location
                                </h3>
                                <p className="text-sm">Current foster home or shelter (Local Area)</p>
                            </div>
                        </div>

                        {/* Action CTA */}
                        <motion.button
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/adopt/flow/${pet.id}`)}
                            className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-[#5f7d5a] via-[#7fa37a] to-[#8b6b4c] text-white text-lg font-bold shadow-[0_15px_40px_rgba(95,125,90,0.3)] hover:shadow-[0_20px_50px_rgba(95,125,90,0.4)] transition-all duration-300"
                        >
                            Confirm Adoption
                        </motion.button>
                        <p className="text-center text-xs text-[#6b7d67] mt-4">
                            By clicking this, you agree to our adoption terms & conditions.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
