import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "../../components/rescue/SectionHeader";
import RescueMapPanel from "../../components/rescue/RescueMapPanel";
import { Camera, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

const RescueRequestPage = () => {
  const [formData, setFormData] = useState({
    problemType: "",
    priority: "",
    description: "",
    address: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setIsSubmitted(true), 800);
  };

  const inputClass = `w-full px-4 py-2 rounded-xl 
              bg-gradient-to-br 
              from-white/65 
              via-[#7fa37a]/35 
              via-[#a18463]/25  
              border border-[#8b6b4c]/50 
              focus:border-[#5f7d5a] 
              focus:ring-2 focus:ring-[#7fa37a]/40 
              text-black outline-none 
              transition backdrop-blur-md`;

  const labelClass = "block text-sm text-[#4e5f4a] mb-1";

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 relative overflow-hidden pt-[6rem] pb-[5rem]">
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
          className="relative z-10 w-full max-w-3xl 
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
            transition duration-500 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c] border border-[#d6e2d3] shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-[#2f3e2c]" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2f3e2c] mb-3">
            Request Submitted Successfully
          </h2>

          <p className="text-[#6b7d67] text-center mb-8 text-sm sm:text-base max-w-2xl mx-auto">
            Your rescue request has been received. We are alerting nearby verified
            volunteers right now. You can track their status in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/rescue/my-requests"
              className="px-6 py-3 rounded-xl 
                bg-white/50 border border-[#8b6b4c]/50 
                text-black/70 text-[15px] font-semibold
                hover:scale-[1.02] hover:shadow-lg 
                transition duration-300 backdrop-blur-md"
            >
              View My Requests
            </Link>

            <Link
              to="/rescue/tracking/REQ-001"
              className="px-6 py-3 rounded-xl 
                bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c]
                border border-[#d6e2d3]
                text-black/70 text-[15px] font-semibold
                hover:scale-[1.02] hover:shadow-lg 
                transition duration-300 backdrop-blur-md"
            >
              Track Live Status
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 relative overflow-hidden pt-[6rem] pb-[5rem]">
      <div
        className="absolute 
          top-1/2 left-1/2 
          -translate-x-1/2 -translate-y-1/2
          w-[650px] h-[650px]
          bg-gradient-to-br 
          from-[#7fa37a]/40 
          via-[#5f7d5a]/30 
          to-[#8b6b4c]/30
          rounded-full 
          blur-[140px] 
          opacity-70
          pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeader
          title="Emergency Rescue Request"
          description="Report an injured or abandoned pet. Our local volunteers will be dispatched to help."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 w-full
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
                transition duration-500
                space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Problem Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.problemType}
                    onChange={(e) =>
                      setFormData({ ...formData, problemType: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="" className="bg-[#f3eee8]">
                      Select the issue
                    </option>
                    <option value="injured" className="bg-[#f3eee8]">
                      Injured (Hit by car, broken bone)
                    </option>
                    <option value="bleeding" className="bg-[#f3eee8]">
                      Bleeding Severely
                    </option>
                    <option value="sick" className="bg-[#f3eee8]">
                      Sick / Lethargic
                    </option>
                    <option value="abandoned" className="bg-[#f3eee8]">
                      Abandoned / Trapped
                    </option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Priority Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="" className="bg-[#f3eee8]">
                      Select urgency
                    </option>
                    <option value="critical" className="bg-[#f3eee8]">
                      Critical - Life Threatening
                    </option>
                    <option value="high" className="bg-[#f3eee8]">
                      High - Needs Vet Today
                    </option>
                    <option value="normal" className="bg-[#f3eee8]">
                      Normal - Not in immediate danger
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Condition Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please describe exactly what you see. Is the animal moving? Breathing? What breed/color?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={`${inputClass} py-3 placeholder:text-black/45`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                  <label className="block text-sm text-[#4e5f4a]">
                    Exact Location <span className="text-red-500">*</span>
                  </label>

                  <button
                    type="button"
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl
                      bg-gradient-to-r from-[#5f7d5a]/30 via-[#7fa37a]/40 to-[#8b6b4c]/30
                      border border-[#8b6b4c]/40
                      text-black/70 text-[13px] font-semibold
                      hover:scale-[1.02] hover:shadow-lg 
                      transition duration-300 backdrop-blur-md"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Use My Location
                  </button>
                </div>

                <input
                  required
                  type="text"
                  placeholder="E.g., Corner of 5th Ave and Maple St, behind the gas station"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={`${inputClass} placeholder:text-black/45`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Upload Photo (Optional, but highly recommended)
                </label>

                <div
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
                >
                  <div className="space-y-2 text-center">
                    <Camera className="mx-auto h-12 w-12 text-black/45 group-hover:text-[#5f7d5a] transition-colors" />
                    <div className="flex flex-wrap justify-center text-sm text-black/65">
                      <span className="relative cursor-pointer font-semibold text-black/75 underline">
                        Upload a file
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                        />
                      </span>
                      <span className="pl-1">or drag and drop</span>
                    </div>
                    <p className="text-xs text-black/50">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto py-3 px-8 rounded-xl 
                    bg-gradient-to-r from-[#5f7d5a]/50 via-[#7fa37a] to-[#8b6b4c]
                    text-black/70 font-semibold 
                    hover:scale-[1.02] hover:shadow-lg 
                    transition duration-300"
                >
                  Submit Emergency Request
                </button>

                <p className="text-black/50 text-xs hidden sm:block">
                  By submitting, you confirm the details are accurate.
                </p>
              </div>
            </motion.form>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br 
                from-white/75 
                via-[#e5e3df]/75 
                to-[#a18463]/35 
                backdrop-blur-2xl 
                rounded-3xl 
                shadow-[0_25px_80px_rgba(0,0,0,0.15)] 
                border border-[#8b6b4c]/50 
                p-6"
            >
              <h3 className="flex items-center text-lg font-bold text-[#2f3e2c] mb-4">
                <AlertCircle className="w-5 h-5 mr-2 text-[#8b6b4c]" />
                Rescue Guidelines
              </h3>

              <ul className="space-y-4 text-sm text-[#4e5f4a]">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7fa37a] mt-1.5 mr-2 shrink-0"></div>
                  Do NOT put yourself in danger to reach the animal.
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7fa37a] mt-1.5 mr-2 shrink-0"></div>
                  If the animal is aggressive, keep a safe distance and wait for experts.
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7fa37a] mt-1.5 mr-2 shrink-0"></div>
                  Do not attempt to move an animal with presumed spinal injuries or heavy bleeding.
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-gradient-to-br 
                from-white/75 
                via-[#e5e3df]/75 
                to-[#a18463]/35 
                backdrop-blur-2xl 
                rounded-3xl 
                shadow-[0_25px_80px_rgba(0,0,0,0.15)] 
                border border-[#8b6b4c]/50 
                p-2"
            >
              <RescueMapPanel height="h-64" title="Your Location" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescueRequestPage;