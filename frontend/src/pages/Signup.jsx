import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Signup() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)] relative overflow-hidden pt-[6rem] pb-[5rem]">

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
to-[#a18463]/35 backdrop-blur-2xl 
        rounded-3xl 
        shadow-[0_25px_80px_rgba(0,0,0,0.15)] 
        border border-[#8b6b4c]/50 
        p-6 sm:p-8 
        hover:shadow-[0_50px_200px_rgba(95,125,90,0.35)] 
        transition duration-500"
            >
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c] text-center mb-2">
                    Create Account
                </h2>

                <p className="text-[#6b7d67] text-center mb-6 text-sm sm:text-base">
                    Join and care for your pets
                </p>

                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2.5 mb-[16px]
          rounded-xl bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c]
          border border-[#d6e2d3] 
          text-black/70 text-[15px] font-semibold
          hover:scale-[1.02] hover:shadow-lg 
            transition duration-300 backdrop-blur-md"
                >
                    Continue with Google
                </button>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm text-[#4e5f4a] mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 rounded-xl 
              bg-gradient-to-br 
from-white/65 
via-[#7fa37a]/35 
via-[#6fa8dc]/25  border border-[#8b6b4c]/50 
              focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 
              text-black outline-none transition backdrop-blur-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#4e5f4a] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-xl 
              bg-gradient-to-br 
from-white/65 
via-[#7fa37a]/35 
via-[#6fa8dc]/25  border border-[#8b6b4c]/50 
              focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 
              text-black outline-none transition backdrop-blur-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-[#4e5f4a] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create password"
                            className="w-full px-4 py-2 rounded-xl 
              bg-gradient-to-br 
from-white/65 
via-[#7fa37a]/35 
via-[#6fa8dc]/25  border border-[#8b6b4c]/50 
              focus:border-[#8b6b4c] focus:ring-2 focus:ring-[#8b6b4c]/40 
              text-black outline-none transition backdrop-blur-md"
                        />
                    </div>

                    <div >
                        <label className="block text-sm text-black/60 mb-1">
                            Role
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-xl 
              bg-gradient-to-br 
from-white/65 
via-[#7fa37a]/35 
via-[#6fa8dc]/25 border border-[#8b6b4c]/50  
              focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40 
              text-[#2f3e2c] outline-none transition backdrop-blur-md"
                        >
                            <option className="bg-[#f3eee8]">Pet Owner</option>
                            <option className="bg-[#f3eee8]">Adopter</option>
                            <option className="bg-[#f3eee8]">Volunteer / Rescuer</option>
                            <option className="bg-[#f3eee8]">Vet</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl 
            bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c] 
            text-black/70 font-semibold 
            hover:scale-[1.02] hover:shadow-lg 
            transition duration-300"
                    >
                        Register
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-5">
                    <div className="flex-grow h-px bg-[#8b6b4c]"></div>
                    <span className="px-3 text-black text-sm">OR</span>
                    <div className="flex-grow h-px bg-[#8b6b4c]"></div>
                </div>



                <p className="text-center text-black text-[15px] mt-6">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-black text-[15px] underline hover:underline transition hover:text-black hover:font-semibold  cursor-pointer ml-1">
                        Login
                    </Link>
                </p>



            </motion.div>
        </div>
    );
}
