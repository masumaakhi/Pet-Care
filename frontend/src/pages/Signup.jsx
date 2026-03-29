import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/register", formData);
      const { token, ...user } = res.data.data;

      login(token, user);
      toast.success(res.data.message || "Registration successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;

      if (!idToken) {
        return toast.error("Google token not found");
      }

      const res = await api.post("/auth/google", { idToken });
      const { token, ...user } = res.data.data;

      login(token, user);
      toast.success(res.data.message || "Google signup successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)] relative overflow-hidden pt-[6rem] pb-[5rem]">
      <div
        className="absolute 
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
        pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/35 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.15)] border border-[#8b6b4c]/50 p-6 sm:p-8 hover:shadow-[0_50px_200px_rgba(95,125,90,0.35)] transition duration-500"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c] text-center mb-2">
          Create Account
        </h2>

        <p className="text-[#6b7d67] text-center mb-6 text-sm sm:text-base">
          Join and care for your pets
        </p>

        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSignup}
            onError={() => toast.error("Google signup failed")}
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-[#4e5f4a] mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/65 via-[#7fa37a]/35 via-[#a18463]/25 border border-[#8b6b4c]/50 focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 text-black outline-none transition backdrop-blur-md"
            />
          </div>

          <div>
            <label className="block text-sm text-[#4e5f4a] mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/65 via-[#7fa37a]/35 via-[#a18463]/25 border border-[#8b6b4c]/50 focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 text-black outline-none transition backdrop-blur-md"
            />
          </div>

          <div>
            <label className="block text-sm text-[#4e5f4a] mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/65 via-[#7fa37a]/35 via-[#a18463]/25 border border-[#8b6b4c]/50 focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 text-black outline-none transition backdrop-blur-md"
            />
          </div>

          <div>
            <label className="block text-sm text-black/60 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-br from-white/65 via-[#7fa37a]/35 via-[#a18463]/25 border border-[#8b6b4c]/50 focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 text-black outline-none transition backdrop-blur-md"
            >
              <option value="user" className="bg-[#f3eee8]">
                User
              </option>
              <option value="owner" className="bg-[#f3eee8]">
                Pet Owner
              </option>
              <option value="volunteer" className="bg-[#f3eee8]">
                Volunteer / Rescuer
              </option>
              <option value="vet" className="bg-[#f3eee8]">
                Vet
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c] text-black/70 font-semibold hover:scale-[1.02] hover:shadow-lg transition duration-300 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-[#8b6b4c]"></div>
          <span className="px-3 text-black text-sm">OR</span>
          <div className="flex-grow h-px bg-[#8b6b4c]"></div>
        </div>

        <p className="text-center text-black text-[15px] mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-black text-[15px] underline hover:underline transition hover:text-black hover:font-semibold cursor-pointer ml-1"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}