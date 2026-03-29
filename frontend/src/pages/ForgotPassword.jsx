import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Instructions processed!");
      // Move to step 2 to allow the user to reset it directly based on existing API design
      setStep(2);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error("Please enter a new password");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password", { email, newPassword });
      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 
    shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)] 
    relative overflow-hidden pt-[6rem] pb-[4rem]">

      {/* Background Glow */}
      <div className="absolute 
        top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        w-[550px] h-[550px]
        bg-gradient-to-br 
        from-[#7fa37a]/40 
        via-[#5f7d5a]/30 
        to-[#8b6b4c]/30
        rounded-full 
        blur-[130px] 
        opacity-70
        pointer-events-none">
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md sm:max-w-lg 
        bg-gradient-to-br 
        from-white/75 
        via-[#e5e3df]/75 
        to-[#a18463]/35 
        backdrop-blur-2xl 
        rounded-3xl 
        shadow-[0_25px_80px_rgba(0,0,0,0.15)] 
        border border-[#8b6b4c]/50 
        p-6 sm:p-8 
        hover:shadow-[0_50px_200px_rgba(95,125,90,0.35)] 
        transition duration-500 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c] text-center mb-2">
                Forgot Password
              </h2>
              <p className="text-[#6b7d67] text-center mb-6 text-sm sm:text-base">
                Enter your email to reset your password
              </p>

              <form className="space-y-4" onSubmit={handleForgotSubmit}>
                <div>
                  <label className="block text-sm text-[#4e5f4a] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full px-4 py-2 rounded-xl 
                    bg-gradient-to-br 
                    from-white/65 
                    via-[#7fa37a]/35 
                    via-[#a18463]/25  
                    border border-[#8b6b4c]/50 
                    focus:border-[#5f7d5a] 
                    focus:ring-2 focus:ring-[#7fa37a]/40 
                    text-black outline-none 
                    transition backdrop-blur-md"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl 
                  bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c] 
                  text-black/70 font-semibold 
                  hover:scale-[1.02] hover:shadow-lg 
                  transition duration-300 disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Verify Email"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c] text-center mb-2">
                Reset Password
              </h2>
              <p className="text-[#6b7d67] text-center mb-6 text-sm sm:text-base">
                Create a new secure password for {email}
              </p>

              <form className="space-y-4" onSubmit={handleResetSubmit}>
                <div>
                  <label className="block text-sm text-[#4e5f4a] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-2 rounded-xl 
                    bg-gradient-to-br 
                    from-white/65 
                    via-[#7fa37a]/35 
                    via-[#a18463]/25  
                    border border-[#8b6b4c]/50 
                    focus:border-[#5f7d5a] 
                    focus:ring-2 focus:ring-[#7fa37a]/40 
                    text-black outline-none 
                    transition backdrop-blur-md"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl 
                  bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c] 
                  text-black/70 font-semibold 
                  hover:scale-[1.02] hover:shadow-lg 
                  transition duration-300 disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-[#8b6b4c]"></div>
          <span className="px-3 text-black text-sm">OR</span>
          <div className="flex-grow h-px bg-[#8b6b4c]"></div>
        </div>

        <p className="text-center text-black text-[15px]">
          Remember your password?
          <Link
            to="/login"
            className="ml-1 underline hover:font-semibold transition"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
