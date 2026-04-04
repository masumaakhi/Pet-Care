import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaStethoscope,
    FaCut,
    FaVideo,
    FaStar,
    FaMapMarkedAlt,
    FaCalendarCheck,
    FaInfoCircle
} from "react-icons/fa";

const services = [
    {
        id: "vet",
        title: "Vet Appointment Booking",
        description: "Schedule visits with top-rated local veterinarians for checkups and treatments.",
        icon: <FaStethoscope className="text-3xl" />,
        color: "bg-[#E38B3A]",
        buttonText: "Book Vet Appointment",
    },
    {
        id: "groomer",
        title: "Groomer / Trainer / Sitter",
        description: "Professional care for your pet's appearance, behavior, and daily needs.",
        icon: <FaCut className="text-3xl" />,
        color: "bg-[#7A9A7C]",
        buttonText: "Book Care Service",
    },
    {
        id: "consultation",
        title: "Online Consultation",
        description: "Get quick expert advice from the comfort of your home via video call.",
        icon: <FaVideo className="text-3xl" />,
        color: "bg-[#D89B65]",
        buttonText: "Start Consultation",
    },
    {
        id: "reviews",
        title: "Review & Rating System",
        description: "Read trusted feedback from fellow pet owners about local service providers.",
        icon: <FaStar className="text-3xl" />,
        color: "bg-[#5A7F5C]",
        buttonText: "Read Reviews",
    },
    {
        id: "map",
        title: "Find Nearby Vets",
        description: "Locate emergency and general practitioners near your current location.",
        icon: <FaMapMarkedAlt className="text-3xl" />,
        color: "bg-[#E38B3A]",
        buttonText: "See Vets & Map",
    },
];

const nearbyVets = [
    { id: "v1", name: "Obhoyaronno Animal Welfare", locationQuery: "Obhoyaronno Animal Welfare Foundation Dhaka", distance: "3.2 km", rating: 4.8, open: true },
    { id: "v2", name: "Gulshan Pet Clinic", locationQuery: "Gulshan Pet Clinic, Dhaka", distance: "4.5 km", rating: 4.7, open: true },
    { id: "v3", name: "Care & Cure Vet Clinic", locationQuery: "Care & Cure Vet Clinic, Dhanmondi, Dhaka", distance: "5.1 km", rating: 4.9, open: true },
    { id: "v4", name: "Advance Pet Clinic", locationQuery: "Advance Pet Clinic, Mirpur, Dhaka", distance: "7.0 km", rating: 4.6, open: true },
    { id: "v5", name: "Central Veterinary Hospital", locationQuery: "Central Veterinary Hospital, Dhaka", distance: "8.2 km", rating: 4.5, open: false },
];

const Services = () => {
    const [selectedVet, setSelectedVet] = useState(nearbyVets[0]);

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 md:px-12 lg:px-24">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                    Premium Pet Care Services
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                    Everything your pet needs, from health checkups to professional training, all in one place.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/services/my-bookings" className="flex items-center justify-center gap-2 px-8 py-3 bg-white/70 backdrop-blur-md text-primary font-bold rounded-full shadow-lg border border-primary/20 hover:bg-primary hover:text-white transition">
                        <FaCalendarCheck /> My Bookings
                    </Link>
                </div>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className={`relative overflow-hidden rounded-3xl p-8 backdrop-blur-md border border-white/40 shadow-xl flex flex-col items-start h-full ${service.featured ? "bg-white/60 ring-2 ring-primary/20" : "bg-white/40"
                            }`}
                    >
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 w-24 h-24 ${service.color} opacity-10 rounded-bl-full`} />

                        <div className={`${service.color} p-4 rounded-2xl text-white mb-6 shadow-lg`}>
                            {service.icon}
                        </div>

                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            {service.title}
                        </h3>

                        <p className="text-gray-600 mb-8 flex-grow">
                            {service.description}
                        </p>

                        {service.id === "map" ? (
                            <button
                                onClick={() => {
                                    document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition shadow-md"
                            >
                                {service.buttonText}
                            </button>
                        ) : (
                            <Link to={`/services/${service.id}`} className="w-full block text-center py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition shadow-md">
                                {service.buttonText || "Learn More"}
                            </Link>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Map Placeholder section */}
            <motion.section
                id="map-section"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-24 rounded-[3rem] overflow-hidden bg-white/50 backdrop-blur-lg border border-white/60 shadow-2xl p-8 md:p-12"
            >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col h-full max-h-[24rem]">
                        <h2 className="text-3xl font-bold text-primary mb-2">Nearby Vets & Clinics</h2>
                        <p className="text-gray-600 mb-6 font-medium">
                            Find top-rated veterinary centers near your location.
                        </p>
                        <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
                            {nearbyVets.map((vet) => (
                                <div
                                    key={vet.id}
                                    onClick={() => setSelectedVet(vet)}
                                    className={`cursor-pointer p-4 rounded-2xl border shadow-sm flex items-center justify-between transition group ${selectedVet.id === vet.id ? 'bg-white border-primary ring-1 ring-primary' : 'bg-white/70 border-white/40 hover:bg-white'}`}
                                >
                                    <div>
                                        <h4 className="font-bold text-gray-800">{vet.name}</h4>
                                        <div className="flex items-center text-sm gap-2 mt-1 text-gray-600">
                                            <span className="flex items-center text-yellow-500"><FaStar className="mr-1" /> {vet.rating}</span>
                                            <span className="text-gray-300">•</span>
                                            <span>{vet.distance}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className={vet.open ? "text-green-500" : "text-red-500"}>
                                                {vet.open ? "Open Now" : "Closed"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`flex flex-col gap-2 transition duration-300 ${selectedVet.id === vet.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}>
                                        <Link to="/services/vet" className="text-center px-4 py-2 bg-primary/10 text-primary font-semibold rounded-lg transition hover:bg-primary hover:text-white" onClick={(e) => e.stopPropagation()}>
                                            Book
                                        </Link>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(vet.locationQuery)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="whitespace-nowrap text-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg transition hover:bg-blue-600 hover:text-white text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Map & Routes
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-64 md:h-96 rounded-3xl bg-gray-200 border-4 border-white shadow-inner relative overflow-hidden">
                        <iframe
                            key={selectedVet.id}
                            title={`${selectedVet.name} Location`}
                            className="absolute inset-0 w-full h-full border-0 animate-pulse"
                            onLoad={(e) => e.target.classList.remove('animate-pulse')}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedVet.locationQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Services;
