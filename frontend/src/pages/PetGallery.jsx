// frontend/src/pages/PetGallery.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const BACKEND_URL = "http://localhost:5250";

export default function PetGallery() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState("all");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchPetsAndPhotos();
  }, []);

  const fetchPetsAndPhotos = async () => {
    try {
      setLoading(true);
      const petsRes = await api.get("/pets");
      if (petsRes.data.success) {
        setPets(petsRes.data.data);
        const petsData = petsRes.data.data;

        const allPhotos = [];
        for (const pet of petsData) {
          const galleryRes = await api.get(`/pets/${pet.id}/gallery`);
          if (galleryRes.data.success) {
            allPhotos.push(...galleryRes.data.data.map(p => ({ ...p, petName: pet.name })));
          }
        }
        setPhotos(allPhotos);
      }
    } catch (error) {
      console.error("Fetch Gallery Error:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (selectedPetId === "all") return photos;
    return photos.filter((p) => p.petId === selectedPetId);
  }, [photos, selectedPetId]);

  const removePhoto = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await api.delete(`/pets/gallery/${id}`);
      if (res.data.success) {
        toast.success("Photo removed");
        setPhotos((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete photo");
    }
  };

  const setAsProfile = async (photoUrl, petId) => {
    try {
      const res = await api.patch(`/pets/${petId}`, { photo: `${BACKEND_URL}${photoUrl}` });
      if (res.data.success) {
        toast.success("Pet profile photo updated!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile photo");
    }
  };

  return (
    <div className="min-h-screen pt-[6rem] pb-[4rem] px-4 sm:px-6 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[820px] h-[820px]
        bg-gradient-to-br from-[#7fa37a]/40 via-[#5f7d5a]/30 to-[#8b6b4c]/30
        rounded-full blur-[170px] opacity-60 pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Pet Photo Gallery
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Manage all your pet's memories in one place.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              className="px-4 py-2 rounded-xl
              bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold outline-none focus:ring-2 focus:ring-[#7fa37a]/50"
            >
              <option value="all" className="bg-[#f3eee8]">All Pets</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (pets.length === 0) return toast.error("Please add a pet first");
                setIsOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition"
            >
              ➕ Upload Photo
            </button>
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-[#6b7d67]">
            <div className="w-10 h-10 border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] rounded-full animate-spin mx-auto mb-4" />
            <p>Gathering memories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.03 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[2rem] overflow-hidden
                bg-white/55 backdrop-blur-3xl border border-[#8b6b4c]/30
                shadow-[0_15px_45px_rgba(0,0,0,0.08)] aspect-square"
              >
                <img
                  src={`${BACKEND_URL}${p.url}`}
                  alt="pet"
                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition duration-700"
                  onClick={() => setLightbox(p)}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                   <p className="text-white text-xs font-bold mb-2 truncate">
                    {p.petName}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 text-[10px] py-1.5 rounded-lg bg-white/90 text-[#2f3e2c] font-bold hover:bg-white"
                      onClick={() => setAsProfile(p.url, p.petId)}
                    >
                      Make Profile
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-500/90 text-white hover:bg-rose-600"
                      onClick={() => removePhoto(p.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-[#6b7d67] py-20 rounded-3xl bg-white/20 border border-dashed border-[#8b6b4c]/30">
            <p className="text-5xl mb-4">📸</p>
            <p className="font-bold">No memories captured yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLightbox(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={`${BACKEND_URL}${lightbox.url}`} 
                alt="preview" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
              />
              <button 
                onClick={() => setLightbox(null)}
                className="absolute top-0 right-0 m-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && (
          <UploadPhotoModal
            pets={pets}
            onClose={() => setIsOpen(false)}
            onAdded={fetchPetsAndPhotos}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadPhotoModal({ onClose, pets, onAdded }) {
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a photo");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setLoading(true);
      const res = await api.post(`/pets/${selectedPetId}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Photo uploaded to gallery!");
        onAdded();
        onClose();
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        className="relative w-full max-w-md rounded-[2.5rem] p-8
        bg-white/95 backdrop-blur-3xl border border-[#8b6b4c]/30
        shadow-[0_45px_120px_rgba(0,0,0,0.25)]"
      >
        <h3 className="text-2xl font-black text-[#2f3e2c] mb-1">Catch a Moment</h3>
        <p className="text-sm font-semibold text-[#6b7d67] mb-6">Upload a photo to your pet's gallery.</p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Field label="Who is this for?">
            <select 
              value={selectedPetId} 
              onChange={(e) => setSelectedPetId(e.target.value)} 
              className={baseInputClass()}
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Choose Photo">
            <div className="relative group cursor-pointer h-48 rounded-3xl border-2 border-dashed border-[#8b6b4c]/30 overflow-hidden bg-[#f3eee8]/40 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#6b7d67]">
                  <span className="text-3xl">📷</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Click to select</span>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
          </Field>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-black shadow-lg hover:shadow-xl transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Save to Gallery"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] font-black text-[#4e5f4a] uppercase tracking-[0.15em] mb-2 ml-1">{label}</label>
      {children}
    </div>
  );
}

function baseInputClass() {
  return `w-full px-5 py-3.5 rounded-2xl
    bg-[#f3eee8]/40 border border-[#8b6b4c]/20
    focus:ring-2 focus:ring-[#7fa37a]/50
    text-[#2f3e2c] font-bold outline-none transition backdrop-blur-md`;
}
