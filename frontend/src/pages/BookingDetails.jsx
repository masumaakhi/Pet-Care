import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaVideo,
    FaCalendarAlt,
    FaClock,
    FaUserMd,
    FaNotesMedical,
    FaPrescriptionBottleAlt,
    FaArrowLeft,
    FaStethoscope,
    FaWallet
} from "react-icons/fa";

// Dummy database for booking details (Simulating an API fetch)
const bookingDb = {
    "b1": {
        id: "b1",
        providerName: "Dr. Sarah Jenkins",
        type: "consultation",
        serviceTitle: "Online Consultation",
        date: "Today",
        time: "05:00 PM",
        status: "upcoming",
        petName: "Max",
        amount: "$45.00",
        providerNotes: "Max has been experiencing mild scratching. Please ensure you have a well-lit area for the video call so I can examine his coat.",
        prescription: "None yet. Will evaluate during consultation.",
        meetingLink: "https://zoom.us/j/1234567890",
        summary: "Initial consultation for dermatological concerns."
    },
    "b3": {
        id: "b3",
        providerName: "City Care Animal Hospital",
        type: "vet",
        serviceTitle: "General Checkup",
        date: "Sep 15, 2023",
        time: "02:00 PM",
        status: "completed",
        petName: "Max",
        amount: "$85.00",
        providerNotes: "Max's weight is healthy. Vitals are normal. Recommend switching to a high-protein diet for seniors.",
        prescription: "Prescribed 1x monthly heartworm preventative tablet.",
        meetingLink: null,
        summary: "Annual wellness exam completed without issue."
    }
};

const defaultBooking = {
    id: "unknown",
    providerName: "Unknown Provider",
    type: "vet",
    serviceTitle: "General Appointment",
    date: "N/A",
    time: "N/A",
    status: "upcoming",
    petName: "Your Pet",
    amount: "$0.00",
    providerNotes: "No notes available for this booking.",
    prescription: "No prescriptions added.",
    meetingLink: null,
    summary: "Pending service details."
};

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch from localStorage first, then dummy DB, then fallback
    const storedBookings = localStorage.getItem("userBookings");
    const parsedBookings = storedBookings ? JSON.parse(storedBookings) : [];
    const localBooking = parsedBookings.find(b => b.id === id);

    const booking = localBooking || bookingDb[id] || { ...defaultBooking, id };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 text-primary font-bold hover:underline flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white hover:bg-white transition shadow-sm w-fit"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Booking Info & status */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/60">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Booking Info</h2>

                            <div className="space-y-4 text-gray-700">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`px-4 py-1 rounded-full text-sm font-bold capitalize ${booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                        booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Provider</p>
                                    <p className="font-semibold flex items-center gap-2">
                                        <FaUserMd className="text-primary" /> {booking.providerName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date & Time</p>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-2 font-medium"><FaCalendarAlt className="text-primary" /> {booking.date}</span>
                                        <span className="flex items-center gap-2 font-medium"><FaClock className="text-primary" /> {booking.time}</span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Patient</p>
                                    <p className="font-semibold">{booking.petName}</p>
                                </div>

                                <div className="pt-4 border-t">
                                    <p className="font-bold flex items-center justify-between">
                                        <span className="flex items-center gap-2"><FaWallet className="text-primary" /> Total Amount</span>
                                        <span className="text-lg">{booking.amount}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Consultation Link Card */}
                        <div className={`rounded-3xl p-8 shadow-xl border border-white/60 backdrop-blur-lg ${booking.type === 'consultation' && booking.status === 'upcoming'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-100'
                            : 'bg-white/70'
                            }`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                                        {booking.type === 'consultation' ? <FaVideo className="text-green-600" /> : <FaStethoscope className="text-blue-600" />}
                                        {booking.serviceTitle}
                                    </h2>
                                    <p className="text-gray-600 font-medium">Session ID: #{booking.id.toUpperCase()}-2026</p>
                                </div>

                                {booking.type === 'consultation' && booking.status === 'upcoming' && (
                                    <a
                                        href={booking.meetingLink || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition shadow-lg flex items-center gap-3 w-full md:w-auto justify-center animate-pulse"
                                    >
                                        <FaVideo className="text-xl" /> Join Video Call
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Provider Notes */}
                        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/60">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaNotesMedical className="text-primary" /> Provider Notes
                            </h3>
                            <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-100">
                                <p className="text-gray-700 leading-relaxed italic">
                                    "{booking.providerNotes}"
                                </p>
                            </div>
                        </div>

                        {/* Summary / Prescription */}
                        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/60">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaPrescriptionBottleAlt className="text-primary" /> Summary & Prescription
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-gray-700 mb-1">Appointment Summary:</h4>
                                    <p className="text-gray-600">{booking.summary}</p>
                                </div>
                                <div className="pt-4 border-t">
                                    <h4 className="font-bold text-gray-700 mb-1">Prescribed Medication:</h4>
                                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 font-medium">
                                        {booking.prescription}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </motion.div>
        </div>
    );
};

export default BookingDetails;
