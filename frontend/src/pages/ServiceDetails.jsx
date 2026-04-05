import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaStar,
    FaClock,
    FaMoneyBillWave,
    FaCalendarCheck,
    FaDog,
    FaCat,
    FaCheckCircle
} from "react-icons/fa";
import api from "../utils/api";

// Dummy data for providers based on service ID
const serviceProviders = {
    vet: {
        id: "vet",
        name: "Dr. Sarah Jenkins",
        title: "Senior Veterinarian",
        specialty: "General Practice & Surgery",
        bio: "Dr. Jenkins has over 15 years of experience in veterinary medicine, specializing in small animals and preventive care.",
        fees: "$85 per consultation",
        rating: 4.9,
        reviewCount: 128,
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
        reviews: [
            { id: 1, author: "Michael T.", rating: 5, text: "Excellent care for my bulldog! Very knowledgeable." },
            { id: 2, author: "Elena R.", rating: 5, text: "Dr. Jenkins is incredibly gentle and thorough." },
        ],
        slots: ["09:00 AM", "10:30 AM", "01:00 PM", "03:30 PM", "04:00 PM"],
    },
    groomer: {
        id: "groomer",
        name: "Paws & Bubbles Spa",
        title: "Master Groomer",
        specialty: "Full Pet Styling & Spa",
        bio: "Award-winning grooming salon dedicated to making your pets look and feel their absolute best with organic products.",
        fees: "From $50 depending on size/breed",
        rating: 4.8,
        reviewCount: 95,
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=200&h=200",
        reviews: [
            { id: 1, author: "Jessica W.", rating: 5, text: "My poodle has never looked better. Highly recommend!" },
            { id: 2, author: "David M.", rating: 4, text: "Great service, but book well in advance as they are popular." },
        ],
        slots: ["08:00 AM", "11:00 AM", "02:00 PM"],
    },
    consultation: {
        id: "consultation",
        name: "Dr. James Wilson",
        title: "Virtual Avian & Exotic Vet",
        specialty: "Online Triage & Advice",
        bio: "Get immediate peace of mind with a virtual consultation. Perfect for non-emergency advice and initial triage.",
        fees: "$45 per 20-min session",
        rating: 4.7,
        reviewCount: 210,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
        reviews: [
            { id: 1, author: "Sarah B.", rating: 5, text: "Saved me a trip to the ER! Great advice." },
            { id: 2, author: "Tom H.", rating: 5, text: "Very convenient and professional." },
        ],
        slots: ["Anytime (Queue-based)", "Scheduled 05:00 PM", "Scheduled 06:30 PM"],
    },
    reviews: {
        id: "reviews",
        name: "Community Pet Service Reviews",
        title: "Trusted Feedback",
        specialty: "Read and Share Experiences",
        bio: "Browse through hundreds of genuine reviews from our community. Find the best caregivers, vets, and groomers based on honest feedback.",
        fees: "Free",
        rating: 4.8,
        reviewCount: 1540,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=200&h=200",
        reviews: [
            { id: 1, author: "Mark T.", rating: 5, text: "Found an amazing groomer through this review system!" },
            { id: 2, author: "Lily K.", rating: 5, text: "Very helpful for finding reliable vets when I moved here." },
            { id: 3, author: "John D.", rating: 4, text: "Great detailed reviews by others." },
        ],
        slots: [],
        hideBooking: true
    }
};

const defaultProvider = {
    id: "general",
    name: "Premium Pet Care Network",
    title: "Certified Professionals",
    specialty: "Comprehensive Pet Services",
    bio: "We connect you with the top-rated pet care professionals in your area for reliable and loving care.",
    fees: "Varies by specific service",
    rating: 4.8,
    reviewCount: 500,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200&h=200",
    reviews: [
        { id: 1, author: "Alex K.", rating: 5, text: "The best pet care network I have ever used." },
    ],
    slots: ["10:00 AM", "02:00 PM", "04:00 PM"],
};

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const provider = serviceProviders[id] || defaultProvider;

    const [selectedSlot, setSelectedSlot] = useState("");
    const [petType, setPetType] = useState("");
    const [petName, setPetName] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Dynamic Pet Categories
    const petCategories = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Small Mammal", "Other"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const bookingData = {
                providerName: provider.name,
                type: provider.id,
                serviceTitle: provider.specialty,
                date: "Today",
                time: selectedSlot,
                petName: petName || "Your Pet",
                petType: petType || "Dog",
                amount: provider.fees.split(" ")[0],
                providerNotes: notes || "No notes provided"
            };

            const response = await api.post("/services/bookings", bookingData);

            setIsSubmitting(false);
            setBookingSuccess(true);

            // Keep localStorage update to avoid breaking other components yet
            const storedBookings = localStorage.getItem("userBookings");
            let bookings = storedBookings ? JSON.parse(storedBookings) : [];
            bookings.push(response.data.booking);
            localStorage.setItem("userBookings", JSON.stringify(bookings));

            setTimeout(() => {
                navigate(-1);
            }, 3000);
        } catch (err) {
            console.error("Booking Error:", err);
            setIsSubmitting(false);
            alert("Failed to confirm booking! " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-primary font-medium hover:underline flex items-center gap-2"
                >
                    &larr; Back to Services
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Provider Details */}
                    <div className={`space-y-8 ${provider.hideBooking ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                        {/* Provider Header Card */}
                        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40 flex flex-col md:flex-row gap-8 items-start">
                            <img
                                src={provider.image}
                                alt={provider.name}
                                className="w-32 h-32 rounded-2xl object-cover shadow-md"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">{provider.name}</h1>
                                <p className="text-xl text-primary font-medium mb-1">{provider.title}</p>
                                <p className="text-gray-600 mb-4">{provider.specialty}</p>

                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                                        <FaStar /> {provider.rating} ({provider.reviewCount} Reviews)
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                        <FaMoneyBillWave /> {provider.fees}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Provider</h2>
                            <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/40">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Reviews</h2>
                            <div className="space-y-4">
                                {provider.reviews.map((review) => (
                                    <div key={review.id} className="bg-white/40 p-4 rounded-2xl border border-white/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-700">{review.author}</span>
                                            <div className="flex text-yellow-500 text-sm">
                                                {[...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 italic">"{review.text}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Form */}
                    {!provider.hideBooking && (
                        <div className="lg:col-span-1">
                            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-primary/20 sticky top-24">
                                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                                    <FaCalendarCheck /> Book Appointment
                                </h2>

                                {bookingSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                                        <p className="text-gray-600">You will be redirected shortly.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">

                                        {/* Pet Selection */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Pet Name</label>
                                                <input
                                                    type="text"
                                                    value={petName}
                                                    onChange={(e) => setPetName(e.target.value)}
                                                    placeholder="e.g. Max"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Pet Type</label>
                                                <select
                                                    value={petType}
                                                    onChange={(e) => setPetType(e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition appearance-none cursor-pointer"
                                                    required
                                                >
                                                    <option value="" disabled>Select type...</option>
                                                    {petCategories.map((category) => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Available Slots */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Available Slots (Today)</label>
                                            <div className="flex flex-wrap gap-2">
                                                {provider.slots.map((slot, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedSlot === slot
                                                            ? "bg-accent text-white shadow-md"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        <FaClock className="inline mr-1 mb-0.5" /> {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Problem / Notes */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Problem / Notes</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Briefly describe the reason for this appointment..."
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition min-h-[100px] resize-none"
                                                required
                                            ></textarea>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !selectedSlot || !petName || !petType}
                                            className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                "Confirm Booking"
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ServiceDetails;
