import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const icons = {
        success: <FaCheckCircle className="text-xl text-[#5f7d5a]" />,
        error: <FaExclamationTriangle className="text-xl text-[#d08475]" />,
        warning: <FaExclamationTriangle className="text-xl text-[#d0a775]" />,
        info: <FaInfoCircle className="text-xl text-[#5a7d7a]" />,
    };

    const bgColors = {
        success: "bg-white/90 border-[#5f7d5a]/30",
        error: "bg-white/90 border-[#d08475]/30",
        warning: "bg-white/90 border-[#d0a775]/30",
        info: "bg-white/90 border-[#5a7d7a]/30",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: 10, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] ${bgColors[type]}`}
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-[#2f3e2c] font-semibold text-sm md:text-base whitespace-nowrap">
                {message}
            </p>
            <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-black/5 rounded-full transition"
            >
                <FaTimes className="text-[#6b7d67]" />
            </button>
        </motion.div>
    );
};

export default Toast;
