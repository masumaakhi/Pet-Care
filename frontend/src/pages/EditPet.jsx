// frontend/src/pages/EditPet.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { getPetImageUrl } from "../utils/helpers";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    species: "Dog",
    gender: "Male",
    breed: "",
    age_months: "",
    weight_kg: "",
    description: "",
  });

  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/pets/${id}`);
      if (res.data.success) {
        const pet = res.data.data;
        setFormData({
          name: pet.name || "",
          species: pet.species || "Dog",
          gender: pet.gender || "Male",
          breed: pet.breed || "",
          age_months: pet.age_months || "",
          weight_kg: pet.weight_kg || "",
          description: pet.description || "",
        });
        setExistingPhotos(pet.photos || []);
      }
    } catch (error) {
      console.error("Fetch Pet Error:", error);
      toast.error("Failed to load pet details");
      navigate("/pets");
    } finally {
      setFetching(false);
    }
  };

  const previewUrl = useMemo(() => {
    if (photoFile) return URL.createObjectURL(photoFile);
    return getPetImageUrl(existingPhotos);
  }, [photoFile, existingPhotos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      // 1. Update Pet basic info
      const res = await api.patch(`/pets/${id}`, {
        ...formData,
        age_months: parseInt(formData.age_months),
        weight_kg: parseFloat(formData.weight_kg),
      });

      if (res.data.success) {
        // 2. Upload new photo if selected
        if (photoFile) {
          const photoData = new FormData();
          photoData.append("photo", photoFile);
          await api.post(`/pets/${id}/gallery`, photoData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
        
        toast.success("Pet updated successfully!");
        navigate("/pets");
      }
    } catch (error) {
      console.error("Update Pet Error:", error);
      toast.error(error.response?.data?.message || "Failed to update pet");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30 rounded-full blur-[150px] opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">Edit Pet Profile</h1>
            <p className="text-[#6b7d67] mt-1">Update details for {formData.name}.</p>
          </div>
          <Link to="/pets" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/40 backdrop-blur-xl text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition">← Cancel</Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30 backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)] p-6 sm:p-10">
          <form className="grid lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Field label="Name"><Input name="name" value={formData.name} onChange={handleChange} required /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Species">
                  <Select name="species" value={formData.species} onChange={handleChange}>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </Select>
                </Field>
                <Field label="Gender">
                  <Select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                </Field>
              </div>
              <Field label="Breed"><Input name="breed" value={formData.breed} onChange={handleChange} required /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age (Months)"><Input type="number" name="age_months" value={formData.age_months} onChange={handleChange} required /></Field>
                <Field label="Weight (kg)"><Input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} required /></Field>
              </div>
              <Field label="Description"><Textarea name="description" value={formData.description} onChange={handleChange} /></Field>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-bold hover:shadow-lg transition disabled:opacity-50">{loading ? "Updating..." : "Save Changes"}</button>
                <button type="button" onClick={() => navigate("/pets")} className="flex-1 py-3 rounded-xl bg-white border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-[#f3eee8] transition">Discard</button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-[#4e5f4a]">Pet Photo</p>
              <div className="rounded-3xl border border-[#8b6b4c]/45 bg-white/55 backdrop-blur-2xl p-4 shadow-sm">
                <div className="relative rounded-2xl overflow-hidden h-64 bg-black/5">
                  {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#6b7d67]">No photo yet</div>}
                </div>
                <div className="mt-4 flex gap-3">
                  <label className="cursor-pointer flex-1 text-center py-2.5 rounded-xl bg-[#5f7d5a] text-white font-bold text-sm">Update Photo<input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} /></label>
                  {photoFile && <button type="button" onClick={() => setPhotoFile(null)} className="px-4 rounded-xl border border-red-200 text-red-500 font-bold text-sm">Undo</button>}
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }) { return (<div><label className="block text-xs font-bold text-[#4e5f4a] uppercase mb-1 ml-1">{label}</label>{children}</div>); }
function baseInputClass() { return `w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#8b6b4c]/40 text-[#2f3e2c] font-black outline-none focus:ring-2 focus:ring-[#7fa37a]/40 transition`; }
function Input(props) { return <input {...props} className={baseInputClass()} />; }
function Select({ children, ...props }) { return <select {...props} className={baseInputClass()}>{children}</select>; }
function Textarea(props) { return <textarea {...props} rows={3} className={baseInputClass()} />; }
