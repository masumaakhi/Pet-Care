import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Signin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    if (!formData.email || !formData.password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", formData);
      const { token, ...user } = res.data.data;

      login(token, user);
      toast.success(res.data.message || "Login successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignin = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;

      if (!idToken) {
        return toast.error("Google token not found");
      }

      const res = await api.post("/auth/google", { idToken });
      const { token, ...user } = res.data.data;

      login(token, user);
      toast.success(res.data.message || "Google login successful");
      navigate("/profile");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)] 
      relative overflow-hidden pt-[6rem] pb-[4rem]"
    >
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
        transition duration-500"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c] text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-[#6b7d67] text-center mb-6 text-sm sm:text-base">
          Login to continue caring for pets
        </p>

        {/* Styled Google Login Wrapper */}
        <div
          className="w-full flex items-center justify-center py-2.5 mb-4
          rounded-xl bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c]
          border border-[#d6e2d3]
          hover:scale-[1.02] hover:shadow-lg
          transition duration-300 backdrop-blur-md"
        >
          <div className="scale-[1.02] sm:scale-100">
            <GoogleLogin
              onSuccess={handleGoogleSignin}
              onError={() => toast.error("Google login failed")}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
              width="300"
            />
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-xl 
              bg-gradient-to-br 
              from-white/65 
              via-[#7fa37a]/35 
              via-[#a18463]/25  
              border border-[#8b6b4c]/50 
              focus:border-[#8b6b4c] 
              focus:ring-2 focus:ring-[#8b6b4c]/40 
              text-black outline-none 
              transition backdrop-blur-md"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-[#4e5f4a]">
              <input type="checkbox" className="accent-[#5f7d5a]" />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-[#5f7d5a] hover:underline"
            >
              Forgot password?
            </Link>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-[#8b6b4c]"></div>
          <span className="px-3 text-black text-sm">OR</span>
          <div className="flex-grow h-px bg-[#8b6b4c]"></div>
        </div>

        <p className="text-center text-black text-[15px] mt-6">
          Don’t have an account?
          <Link
            to="/register"
            className="text-black text-[15px] underline hover:underline transition hover:text-black hover:font-semibold cursor-pointer ml-1"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}