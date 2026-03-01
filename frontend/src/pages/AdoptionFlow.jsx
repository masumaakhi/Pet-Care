import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaRegClipboard, FaPhoneAlt, FaUsers, FaHome, FaCheck, FaHeart } from "react-icons/fa";
import axios from "axios";

// Fallback image
import b1 from "../assets/b1.jpg";

export default function AdoptionFlow() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Flow State
    const [step, setStep] = useState(1); // 1: Policy, 2: Tracking Flow
    const [isAgreed, setIsAgreed] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        livingSituation: "apartment"
    });

    // Check if form is completely filled out
    const isFormValid = formData.fullName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.phone.trim() !== "";

    // Simulate current tracking progress step (1 to 5)
    // For demo purposes, we'll start at 2 (Admin Review) after submitting
    const [trackingStep, setTrackingStep] = useState(2);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                setLoading(true);
                const localData = JSON.parse(localStorage.getItem("adoptions") || "[]");
                let foundPet = localData.find(p => String(p.id) === String(id));

                if (!foundPet) {
                    try {
                        const response = await axios.get(`/adoptions/${id}`);
                        foundPet = response.data;
                    } catch (apiErr) {
                        console.warn("API fetch failed", apiErr);
                    }
                }

                if (foundPet) {
                    setPet(foundPet);
                } else {
                    setError("Pet details not found.");
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

    const handleProceed = () => {
        if (!isFormValid) {
            alert("Please fill all the information");
            return;
        }
        if (isAgreed && isFormValid) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

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
                <Link to="/adopt/listing" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-semibold">
                    Back to Listings
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 md:px-16 pt-[6rem] pb-16 bg-gradient-to-b from-[#f5f3ef] via-[#f8faf5] to-[#e5eee2]">
            <div className="max-w-4xl mx-auto">
                {/* Header Back Button */}
                <div className="mb-8">
                    <Link
                        to={`/adopt/listing/${id}`}
                        className="inline-flex items-center gap-2 text-[#5f7d5a] hover:text-[#4e5f4a] font-medium transition"
                    >
                        <FaArrowLeft className="text-sm" />
                        Back to {pet.name}'s Details
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: Policy and Agreement */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/90 backdrop-blur-xl border border-[#d0ddcc] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
                        >
                            {/* Summary Header */}
                            <div className="bg-[#5f7d5a]/10 p-8 md:p-10 border-b border-[#5f7d5a]/20 flex flex-col md:flex-row items-center gap-6">
                                <img
                                    src={pet.image || b1}
                                    alt={pet.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md flex-shrink-0"
                                    onError={(e) => { e.target.src = b1; }}
                                />
                                <div className="text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-[#2f3e2c] mb-2">Adoption Application</h1>
                                    <p className="text-[#4e5f4a]">You are applying to adopt <span className="font-semibold text-[#5f7d5a]">{pet.name}</span>.</p>
                                </div>
                            </div>

                            {/* Applicant Form */}
                            <div className="p-8 md:p-10 border-b border-[#e4efe0]">
                                <h2 className="text-xl font-bold text-[#2f3e2c] mb-6">Adopter Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4e5f4a] mb-2">Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Your full name"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#d0ddcc] bg-[#f8faf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5f7d5a] transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4e5f4a] mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            placeholder="your@gmail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#d0ddcc] bg-[#f8faf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5f7d5a] transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4e5f4a] mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            placeholder="+8801xxxxxxxxx"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#d0ddcc] bg-[#f8faf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5f7d5a] transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#4e5f4a] mb-2">Living Situation *</label>
                                        <select
                                            value={formData.livingSituation}
                                            onChange={(e) => setFormData({ ...formData, livingSituation: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-[#d0ddcc] bg-[#f8faf5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5f7d5a] transition appearance-none"
                                        >
                                            <option value="apartment">Apartment</option>
                                            <option value="house_rent">House (Rented)</option>
                                            <option value="house_own">House (Owned)</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Terms Content */}
                            <div className="p-8 md:p-10">
                                <h2 className="text-xl font-bold text-[#2f3e2c] mb-6 flex items-center gap-2">
                                    <FaRegClipboard className="text-[#d0a775]" /> Policy & Agreement
                                </h2>

                                <div className="space-y-4 text-sm text-[#4e5f4a] bg-[#f8faf5] p-6 rounded-2xl border border-[#e4efe0] max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <p><strong>1. Commitment:</strong> Adopting a pet is a lifelong commitment. You agree to provide proper food, water, shelter, and veterinary care for the duration of the pet's life.</p>
                                    <p><strong>2. Indoor Living:</strong> All adopted pets must be kept indoors as family members. They are not to be kept exclusively outdoors or chained.</p>
                                    <p><strong>3. Medical Care:</strong> You agree to keep the pet up to date on all necessary vaccinations, preventative medications, and yearly wellness exams.</p>
                                    <p><strong>4. Return Policy:</strong> If for any reason you can no longer care for the pet, you must return them to our rescue organization. They may not be abandoned, sold, or given away.</p>
                                    <p><strong>5. Check-ins:</strong> You agree to allow a representative of our organization to conduct occasional check-ins (virtual or in-person) to ensure the pet's well-being.</p>
                                    <p>By proceeding, you acknowledge that you have read, understood, and agree to abide by these terms. Our team will review your application and contact you for the next steps.</p>
                                </div>

                                {/* Checkbox & Action */}
                                <div className="mt-8">
                                    <label className="flex items-start gap-4 cursor-pointer group">
                                        <div className="relative flex items-center justify-center w-6 h-6 mt-0.5">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={isAgreed}
                                                onChange={() => setIsAgreed(!isAgreed)}
                                            />
                                            <div className="w-6 h-6 border-2 border-[#d0ddcc] rounded-md peer-checked:bg-[#5f7d5a] peer-checked:border-[#5f7d5a] peer-focus:ring-2 peer-focus:ring-[#5f7d5a]/30 transition-all"></div>
                                            <FaCheck className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none text-sm" />
                                        </div>
                                        <span className="text-[#2f3e2c] font-medium leading-relaxed group-hover:text-[#5f7d5a] transition">
                                            I have read and agree to the Adoption Policy & Agreement.
                                        </span>
                                    </label>

                                    <button
                                        onClick={handleProceed}
                                        disabled={!isAgreed}
                                        className={`mt-8 w-full py-4 rounded-2xl text-lg font-bold shadow-sm transition-all duration-300 ${isAgreed
                                            ? "bg-gradient-to-r from-[#5f7d5a] via-[#7fa37a] to-[#8b6b4c] text-white hover:shadow-md hover:-translate-y-1"
                                            : "bg-[#e4efe0] text-[#a0b09d] cursor-not-allowed"
                                            }`}
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Progress Tracker Flow */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center mb-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="w-20 h-20 bg-[#f1e9dd] rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <FaCheckCircle className="text-4xl text-[#5f7d5a]" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-[#2f3e2c] mb-2">Application Received!</h1>
                                <p className="text-[#4e5f4a] max-w-lg mx-auto">
                                    Thank you for applying to adopt <span className="font-semibold">{pet.name}</span>. Your application is now in our system. Track your progress below.
                                </p>
                            </div>

                            {/* Vertical Tracker */}
                            <div className="bg-white/80 backdrop-blur-xl border border-[#d0ddcc] rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-2xl mx-auto">
                                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#5f7d5a] before:via-[#d0ddcc] before:to-transparent">

                                    {/* Stages Data */}
                                    {[
                                        { id: 1, title: "Application Submitted", desc: "We've got your details. Great first step!", icon: FaRegClipboard },
                                        { id: 2, title: "Admin Review", desc: "Our team is reviewing your profile to ensure a great match.", icon: FaUsers },
                                        { id: 3, title: "Phone Interview", desc: "A quick chat to discuss expectations and answer questions.", icon: FaPhoneAlt },
                                        { id: 4, title: "Meet & Greet", desc: `Time to meet ${pet.name} in person and see if you click!`, icon: FaHeart },
                                        { id: 5, title: "Final Approval", desc: `Welcome ${pet.name} to their forever home!`, icon: FaHome },
                                    ].map((stage, idx) => {
                                        const isCompleted = trackingStep > stage.id;
                                        const isActive = trackingStep === stage.id;
                                        const isPending = trackingStep < stage.id;
                                        const Icon = stage.icon;

                                        return (
                                            <div key={stage.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">

                                                {/* Icon Node */}
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-500 ${isCompleted ? "bg-[#5f7d5a] border-white text-white" :
                                                    isActive ? "bg-white border-[#5f7d5a] text-[#5f7d5a] ring-4 ring-[#5f7d5a]/20" :
                                                        "bg-[#f8faf5] border-[#d0ddcc] text-[#a0b09d]"
                                                    }`}>
                                                    {isCompleted ? <FaCheck className="text-xl" /> : <Icon className="text-xl" />}
                                                </div>

                                                {/* Card Content */}
                                                <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-5 rounded-2xl border transition-all duration-300 ${isActive ? "bg-gradient-to-br from-[#f8faf5] to-white border-[#8b6b4c]/30 shadow-md scale-[1.02]" :
                                                    isCompleted ? "bg-white/50 border-[#d6e2d3] opacity-80" :
                                                        "bg-white/30 border-transparent opacity-50"
                                                    }`}>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className={`font-bold ${isActive ? "text-[#2f3e2c]" : "text-[#4e5f4a]"}`}>{stage.title}</h3>
                                                        {isActive && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#f1e9dd] text-[#8b6b4c] animate-pulse">In Progress</span>}
                                                    </div>
                                                    <p className="text-sm text-[#6b7d67]">{stage.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-12 text-center">
                                    <p className="text-sm text-[#4e5f4a] bg-[#f8faf5] py-3 px-6 rounded-xl border border-[#e4efe0] inline-block">
                                        We will update this tracker and notify you via email as your application progresses.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
