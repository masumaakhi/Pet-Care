import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCalendarCheck,
    FaCheckCircle,
    FaTimesCircle,
    FaVideo,
    FaStar,
    FaClock,
    FaStethoscope,
    FaCalendarAlt
} from "react-icons/fa";

// Dummy data for bookings
const allBookings = [
    {
        id: "b1",
        providerName: "Dr. Sarah Jenkins",
        type: "consultation",
        serviceTitle: "Online Consultation",
        date: "Today",
        time: "05:00 PM",
        status: "upcoming",
        petName: "Max",
        amount: "$45.00"
    },
    {
        id: "b2",
        providerName: "Paws & Bubbles Spa",
        type: "groomer",
        serviceTitle: "Full Pet Styling & Spa",
        date: "Oct 24, 2023",
        time: "10:30 AM",
        status: "upcoming",
        petName: "Bella",
        amount: "$65.00"
    },
    {
        id: "b3",
        providerName: "City Care Animal Hospital",
        type: "vet",
        serviceTitle: "General Checkup",
        date: "Sep 15, 2023",
        time: "02:00 PM",
        status: "completed",
        petName: "Max",
        amount: "$85.00",
        reviewed: false
    },
    {
        id: "b4",
        providerName: "Dr. James Wilson",
        type: "consultation",
        serviceTitle: "Online Triage",
        date: "Aug 10, 2023",
        time: "11:00 AM",
        status: "completed",
        petName: "Bella",
        amount: "$40.00",
        reviewed: true
    },
    {
        id: "b5",
        providerName: "Sunrise Veterinary Center",
        type: "vet",
        serviceTitle: "Vaccination",
        date: "Jul 05, 2023",
        time: "09:00 AM",
        status: "cancelled",
        petName: "Max",
        amount: "$0.00",
        cancelReason: "Rescheduled by user"
    }
];

const MyBookings = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");

    const [bookings, setBookings] = useState([]);

    React.useEffect(() => {
        const storedBookings = localStorage.getItem("userBookings");
        if (storedBookings) {
            setBookings(JSON.parse(storedBookings));
        } else {
            setBookings(allBookings);
            localStorage.setItem("userBookings", JSON.stringify(allBookings));
        }
    }, []);

    const filteredBookings = bookings.filter(b => b.status === activeTab);

    const handleCancelBooking = (bookingId) => {
        const updatedBookings = bookings.map(b => {
            if (b.id === bookingId) {
                return { ...b, status: "cancelled", cancelReason: "Cancelled by user" };
            }
            return b;
        });
        setBookings(updatedBookings);
        localStorage.setItem("userBookings", JSON.stringify(updatedBookings));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        // Handle submission...
        setReviewModalOpen(false);
        setRating(0);
        setReviewText("");
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Bookings</h1>
                        <p className="text-gray-600">Manage your upcoming appointments and view your history.</p>
                    </div>
                    <Link to="/services" className="px-6 py-2 bg-primary/10 text-primary font-medium rounded-full hover:bg-primary hover:text-white transition">
                        &larr; Back to Services
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl mb-8 shadow-sm border border-white max-w-xl">
                    {["upcoming", "completed", "cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-xl font-medium capitalize transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab
                                ? "bg-primary text-white shadow-md"
                                : "text-gray-600 hover:bg-white/60"
                                }`}
                        >
                            {tab === "upcoming" && <FaCalendarCheck />}
                            {tab === "completed" && <FaCheckCircle />}
                            {tab === "cancelled" && <FaTimesCircle />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Booking List */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-16 bg-white/40 backdrop-blur-sm rounded-3xl border border-white/60">
                                <p className="text-xl text-gray-500 font-medium">No {activeTab} bookings found.</p>
                                {activeTab === "upcoming" && (
                                    <Link to="/services" className="mt-4 inline-block px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/90">
                                        Book a Service
                                    </Link>
                                )}
                            </div>
                        ) : (
                            filteredBookings.map((booking) => (
                                <div key={booking.id} className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex gap-6 items-start">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-md flex-shrink-0 ${booking.type === 'consultation' ? 'bg-[#D89B65]' :
                                            booking.type === 'groomer' ? 'bg-[#7A9A7C]' : 'bg-[#E38B3A]'
                                            }`}>
                                            {booking.type === 'consultation' ? <FaVideo /> : <FaStethoscope />}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800">{booking.providerName}</h3>
                                            <p className="text-primary font-medium mb-2">{booking.serviceTitle} • {booking.petName}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1 font-medium bg-gray-100 px-3 py-1 rounded-full"><FaCalendarAlt /> {booking.date}</span>
                                                <span className="flex items-center gap-1 font-medium bg-gray-100 px-3 py-1 rounded-full"><FaClock /> {booking.time}</span>
                                                <span className="font-bold text-gray-700">{booking.amount}</span>
                                            </div>
                                            {booking.status === "cancelled" && (
                                                <p className="text-red-500 text-sm mt-3 font-medium flex items-center gap-1">
                                                    <FaTimesCircle /> Reason: {booking.cancelReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">

                                        <Link
                                            to={`/services/bookings/${booking.id}`}
                                            className="px-6 py-3 bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                                        >
                                            View Details
                                        </Link>

                                        {booking.status === "upcoming" && booking.type === "consultation" && (
                                            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2">
                                                <FaVideo /> Join Consultation
                                            </button>
                                        )}

                                        {booking.status === "upcoming" && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="px-6 py-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition">
                                                Cancel Booking
                                            </button>
                                        )}

                                        {booking.status === "completed" && !booking.reviewed && (
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setReviewModalOpen(true);
                                                }}
                                                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                                            >
                                                <FaStar /> Submit Review
                                            </button>
                                        )}
                                        {booking.status === "completed" && booking.reviewed && (
                                            <span className="px-6 py-3 bg-gray-100 text-gray-500 font-medium rounded-xl text-center flex items-center justify-center gap-2">
                                                <FaCheckCircle /> Reviewed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Review Modal */}
                {reviewModalOpen && selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)}></div>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Rate your experience</h2>
                            <p className="text-gray-600 mb-6">How was your service with {selectedBooking.providerName}?</p>

                            <form onSubmit={handleReviewSubmit}>
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-4xl transition ${rating >= star ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`}
                                        >
                                            <FaStar />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    className="w-full border-2 border-gray-100 rounded-xl p-4 outline-none focus:border-primary transition min-h-[120px] resize-none mb-6"
                                    placeholder="Write your review here..."
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                ></textarea>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setReviewModalOpen(false)}
                                        className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={rating === 0}
                                        className="flex-1 py-3 text-white font-bold bg-primary rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
