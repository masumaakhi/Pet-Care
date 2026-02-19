import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function AddPet() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);

  const previewUrl = useMemo(() => {
    if (!photoFile) return "";
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  return (
    <div
      className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6
      shadow-[0_35px_90px_rgba(0,0,0,0.18),0_10px_30px_rgba(95,125,90,0.25)]
      relative overflow-hidden"
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[750px] h-[750px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[150px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Add New Pet
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Create a profile to track care schedules & health.
            </p>
          </div>

          <Link
            to="/pets"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl
            bg-white/60 border border-[#8b6b4c]/40 backdrop-blur-xl
            text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition"
          >
            ← Back to Pets
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl overflow-hidden
          bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl border border-[#8b6b4c]/45
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]
          p-6 sm:p-10"
        >
          <form
            className="grid lg:grid-cols-2 gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              // backend later
              alert("Pet saved (UI only). Backend will be added later.");
              navigate("/pets");
            }}
          >
            {/* Left: Form */}
            <div className="space-y-4">
              <Field label="Name">
                <Input placeholder="e.g., Milo" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Species">
                  <Select>
                    <option className="bg-[#f3eee8]">Cat</option>
                    <option className="bg-[#f3eee8]">Dog</option>
                    <option className="bg-[#f3eee8]">Bird</option>
                    <option className="bg-[#f3eee8]">Other</option>
                  </Select>
                </Field>

                <Field label="Gender">
                  <Select>
                    <option className="bg-[#f3eee8]">Male</option>
                    <option className="bg-[#f3eee8]">Female</option>
                    <option className="bg-[#f3eee8]">Unknown</option>
                  </Select>
                </Field>
              </div>

              <Field label="Breed">
                <Input placeholder="e.g., Persian / Mixed" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Age">
                  <Input placeholder="e.g., 2 years" />
                </Field>
                <Field label="Weight (kg)">
                  <Input placeholder="e.g., 4.5" />
                </Field>
              </div>

              <Field label="Description">
                <Textarea placeholder="Short note about your pet..." />
              </Field>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  text-black/75 font-semibold
                  hover:scale-[1.02] hover:shadow-lg transition duration-300"
                >
                  Save Pet
                </button>

                <button
                  type="button"
                  className="flex-1 py-3 rounded-xl
                  bg-white/55 border border-[#8b6b4c]/40
                  text-[#2f3e2c] font-semibold
                  hover:bg-white/70 hover:shadow-md transition"
                  onClick={() => navigate("/pets")}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right: Photo Upload */}
            <div className="space-y-4">
              <p className="text-sm text-[#4e5f4a]">
                Upload a clear photo (optional)
              </p>

              <div
                className="rounded-3xl border border-[#8b6b4c]/45 bg-white/55
                backdrop-blur-2xl p-4 shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
              >
                <div className="relative rounded-2xl overflow-hidden h-56 sm:h-64 bg-black/5">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Pet preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6b7d67] text-sm">
                      Photo preview will appear here
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <label
                    className="cursor-pointer px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                    text-black/75 font-semibold
                    hover:scale-[1.02] hover:shadow-lg transition duration-300"
                  >
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    />
                  </label>

                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-xl bg-white/55
                    border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold
                    hover:bg-white/70 transition"
                    onClick={() => setPhotoFile(null)}
                    disabled={!photoFile}
                  >
                    Remove
                  </button>
                </div>

                <p className="text-xs text-[#6b7d67] mt-3">
                  Tip: Use a front-facing image for best recognition later (AI).
                </p>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-[#4e5f4a] mb-1">{label}</label>
      {children}
    </div>
  );
}

function baseInputClass() {
  return `w-full px-4 py-2 rounded-xl
    bg-gradient-to-br from-white/65 via-[#7fa37a]/20 to-[#a18463]/20
    border border-[#8b6b4c]/45
    focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40
    text-black outline-none transition backdrop-blur-md`;
}

function Input(props) {
  return <input {...props} className={baseInputClass()} />;
}

function Select({ children, ...props }) {
  return (
    <select {...props} className={baseInputClass()}>
      {children}
    </select>
  );
}

function Textarea(props) {
  return <textarea {...props} rows={4} className={baseInputClass()} />;
}
