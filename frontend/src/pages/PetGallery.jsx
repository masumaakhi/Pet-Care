import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- Mock pets & photos (backend later) ----
const mockPets = [
  { id: "1", name: "Milo" },
  { id: "2", name: "Luna" },
];

const initialPhotos = [
  { id: 1, petId: "1", url: "https://placekitten.com/520/420", caption: "First day rescue", isCover: true },
  { id: 2, petId: "1", url: "https://placekitten.com/521/420", caption: "After treatment", isCover: false },
  { id: 3, petId: "2", url: "https://placekitten.com/500/420", caption: "Play time", isCover: true },
];

export default function PetGallery() {
  const [petId, setPetId] = useState("all");
  const [photos, setPhotos] = useState(initialPhotos);
  const [lightbox, setLightbox] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    return petId === "all" ? photos : photos.filter((p) => p.petId === petId);
  }, [photos, petId]);

  const setCover = (id) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    );
  };

  const removePhoto = (id) => setPhotos((prev) => prev.filter((p) => p.id !== id));

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
              Manage multiple photos per pet. Set cover & view progress.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="px-4 py-2 rounded-xl
              bg-white/60 backdrop-blur-xl border border-[#8b6b4c]/40
              text-[#2f3e2c] font-semibold"
            >
              <option value="all" className="bg-[#f3eee8]">All Pets</option>
              {mockPets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsOpen(true)}
              className="px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition"
            >
              ➕ Upload Photo
            </button>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
              whileHover={{ y: -6, rotateX: 6 }}
              className="group relative rounded-2xl overflow-hidden
              bg-white/55 backdrop-blur-2xl
              border border-[#8b6b4c]/45
              shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
            >
              <img
                src={p.url}
                alt={p.caption || "pet photo"}
                className="w-full h-44 object-cover"
                onClick={() => setLightbox(p)}
              />

              {p.isCover && (
                <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full
                bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Cover
                </span>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition" />

              <div className="absolute bottom-0 left-0 right-0 p-3
                translate-y-8 group-hover:translate-y-0 transition">
                <p className="text-white text-sm font-semibold line-clamp-1">
                  {p.caption || "—"}
                </p>

                <div className="flex gap-2 mt-2">
                  <button
                    className="text-xs px-2 py-1 rounded bg-white/80 text-[#2f3e2c] hover:bg-white"
                    onClick={() => setCover(p.id)}
                  >
                    Set Cover
                  </button>
                  <button
                    className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                    onClick={() => removePhoto(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-[#6b7d67] py-12">
            No photos found for this pet.
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setLightbox(null)} />
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
            >
              <img src={lightbox.url} alt="preview" className="w-full h-auto object-contain" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 text-white text-sm">
                {lightbox.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal (simple) */}
      <AnimatePresence>
        {isOpen && (
          <UploadPhotoModal
            pets={mockPets}
            onClose={() => setIsOpen(false)}
            onAdd={(payload) => {
              setPhotos((prev) => [{ id: Date.now(), ...payload }, ...prev]);
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------- Upload Modal -------- */

function UploadPhotoModal({ onClose, onAdd, pets }) {
  const [petId, setPetId] = useState(pets[0]?.id || "");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-7
        bg-gradient-to-br from-white/80 via-[#e5e3df]/80 to-[#a18463]/35
        backdrop-blur-2xl border border-[#8b6b4c]/50
        shadow-[0_35px_110px_rgba(0,0,0,0.22)]"
      >
        <h3 className="text-xl font-bold text-[#2f3e2c] mb-1">Upload Photo</h3>
        <p className="text-sm text-[#6b7d67] mb-4">Paste image URL (backend will handle file upload).</p>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!petId || !url) return alert("Pet & Image URL required");
            onAdd({ petId, url, caption, isCover: false });
          }}
        >
          <Field label="Pet">
            <select value={petId} onChange={(e) => setPetId(e.target.value)} className={baseInputClass()}>
              {pets.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#f3eee8]">
                  {p.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Image URL">
            <input value={url} onChange={(e) => setUrl(e.target.value)} className={baseInputClass()} />
          </Field>

          <Field label="Caption (optional)">
            <input value={caption} onChange={(e) => setCaption(e.target.value)} className={baseInputClass()} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              text-black/75 font-semibold hover:scale-[1.02] hover:shadow-lg transition">
              Save
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl
              bg-white/55 border border-[#8b6b4c]/40 text-[#2f3e2c] font-semibold hover:bg-white/70 transition">
              Cancel
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
