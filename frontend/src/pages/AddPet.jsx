// frontend/src/pages/AddPet.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { AnimatePresence } from "framer-motion";

export default function AddPet() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    species: "Dog",
    gender: "Male",
    breed: "",
    age_months: "",
    weight_kg: "",
    description: "",
  });

  const previewUrl = useMemo(() => {
    if (!photoFile) return "";
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = ["name", "species", "gender", "breed", "age_months", "weight_kg"];
    const isAnyEmpty = requiredFields.some((field) => !formData[field].toString().trim());

    if (isAnyEmpty) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/pets", {
        ...formData,
        age_months: parseInt(formData.age_months),
        weight_kg: parseFloat(formData.weight_kg),
      });

      if (res.data.success) {
        toast.success("Pet added successfully!");
        navigate("/pets");
      }
    } catch (error) {
      console.error("Add Pet Error:", error);
      toast.error(error.response?.data?.message || "Failed to add pet");
    } finally {
      setLoading(false);
    }
  };

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
          <form className="grid lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            {/* Left: Form */}
            <div className="space-y-4">
              <Field label="Name">
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Milo" 
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Species">
                  <Select 
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                  >
                    <option value="Dog" className="bg-[#f3eee8]">Dog</option>
                    <option value="Cat" className="bg-[#f3eee8]">Cat</option>
                    <option value="Bird" className="bg-[#f3eee8]">Bird</option>
                    <option value="Rabbit" className="bg-[#f3eee8]">Rabbit</option>
                    <option value="Other" className="bg-[#f3eee8]">Other</option>
                  </Select>
                </Field>

                <Field label="Gender">
                  <Select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male" className="bg-[#f3eee8]">Male</option>
                    <option value="Female" className="bg-[#f3eee8]">Female</option>
                    <option value="Unknown" className="bg-[#f3eee8]">Unknown</option>
                  </Select>
                </Field>
              </div>

              <Field label="Breed">
                <Input 
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="e.g., Persian / Mixed" 
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Age (Months)">
                  <Input 
                    type="number"
                    name="age_months"
                    value={formData.age_months}
                    onChange={handleChange}
                    placeholder="e.g., 24" 
                  />
                </Field>
                <Field label="Weight (kg)">
                  <Input 
                    type="number"
                    step="0.1"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleChange}
                    placeholder="e.g., 4.5" 
                  />
                </Field>
              </div>

              <Field label="Description">
                <Textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short note about your pet..." 
                />
              </Field>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  text-black/75 font-semibold
                  hover:scale-[1.02] hover:shadow-lg transition duration-300 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Pet"}
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

                <p className="text-xs text-[#6b7d67] mt-3 font-medium">
                  Note: Photo upload integration (Multer) is in Phase 3.
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
      <label className="block text-sm font-semibold text-[#4e5f4a] mb-1">{label}</label>
      {children}
    </div>
  );
}

function baseInputClass() {
  return `w-full px-4 py-2 rounded-xl
    bg-gradient-to-br from-white/65 via-[#7fa37a]/20 to-[#a18463]/20
    border border-[#8b6b4c]/45
    focus:border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40
    text-black outline-none transition backdrop-blur-md font-medium placeholder-[#6b7d67]/60`;
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
