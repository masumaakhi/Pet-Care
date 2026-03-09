import React from "react";
import { motion } from "framer-motion";
import {
    FaStethoscope,
    FaCut,
    FaVideo,
    FaStar,
    FaMapMarkedAlt
} from "react-icons/fa";

const services = [
    {
        id: "vet",
        title: "Vet Appointment Booking",
        description: "Schedule visits with top-rated local veterinarians for checkups and treatments.",
        icon: <FaStethoscope className="text-3xl" />,
        color: "bg-[#E38B3A]",
    },
    {
        id: "groomer",
        title: "Groomer / Trainer / Sitter",
        description: "Professional care for your pet's appearance, behavior, and daily needs.",
        icon: <FaCut className="text-3xl" />,
        color: "bg-[#7A9A7C]",
    },
    {
        id: "consultation",
        title: "Online Consultation",
        description: "Get quick expert advice from the comfort of your home via video call.",
        icon: <FaVideo className="text-3xl" />,
        color: "bg-[#D89B65]",
    },
    {
        id: "reviews",
        title: "Review & Rating System",
        description: "Read trusted feedback from fellow pet owners about local service providers.",
        icon: <FaStar className="text-3xl" />,
        color: "bg-[#5A7F5C]",
    },
    {
        id: "map",
        title: "Find Nearby Vets",
        description: "Locate emergency and general practitioners near your current location.",
        icon: <FaMapMarkedAlt className="text-3xl" />,
        color: "bg-[#E38B3A]",
    },
];

const Services = () => {
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
                <p className="text-lg text-gray-600">
                    Everything your pet needs, from health checkups to professional training, all in one place.
                </p>
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

                        <button className="w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition shadow-md">
                            Learn More
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Map Placeholder section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-24 rounded-[3rem] overflow-hidden bg-white/50 backdrop-blur-lg border border-white/60 shadow-2xl p-8 md:p-12"
            >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-primary mb-6">Locate Help Instantly</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Find the nearest specialized veterinary centers and emergency hospitals. Our interactive map helps you reach care when minutes matter.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                                <span className="block font-bold text-primary text-xl">25+</span>
                                <span className="text-sm text-gray-600">Partner Vets</span>
                            </div>
                            <div className="bg-accent/10 p-4 rounded-2xl border border-accent/20">
                                <span className="block font-bold text-accent text-xl">24/7</span>
                                <span className="text-sm text-gray-600">Emergency Support</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64 md:h-96 rounded-3xl bg-gray-200 border-4 border-white shadow-inner flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-50 transition group-hover:grayscale-0 duration-700"></div>
                        <div className="relative z-10 text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                            <FaMapMarkedAlt className="text-5xl text-accent mx-auto mb-4" />
                            <p className="font-bold text-gray-800">Map Interface Placeholder</p>
                            <p className="text-sm text-gray-600">Integration in Progress</p>
                        </div>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Services;
