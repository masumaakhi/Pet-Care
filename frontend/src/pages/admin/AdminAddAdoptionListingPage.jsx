// src/pages/admin/AdminAddAdoptionListingPage.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

/**
 * Admin-only: creates an APPROVED AdoptionPet (live on /adopt/listing immediately).
 * Either link an existing pet (UUID) or enter shelter-animal details + optional photo.
 */
export default function AdminAddAdoptionListingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("shelter"); // "shelter" | "link"
  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    petId: "",
    name: "",
    type: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    size: "",
  });

  const previewUrl = useMemo(() => {
    if (!photoFile) return "";
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "link") {
      if (!form.petId.trim()) {
        toast.error("Enter the pet UUID to link");
        return;
      }
    } else {
      const req = ["name", "type", "breed", "age", "gender"];
      if (req.some((k) => !form[k].toString().trim())) {
        toast.error("Fill name, type, breed, age, and gender");
        return;
      }
    }

    try {
      setLoading(true);
      const data = new FormData();
      if (photoFile) data.append("image", photoFile);
      if (mode === "link") {
        data.append("petId", form.petId.trim());
        if (form.size.trim()) data.append("size", form.size.trim());
      } else {
        data.append("name", form.name.trim());
        data.append("type", form.type.trim());
        data.append("breed", form.breed.trim());
        data.append("age", form.age.trim());
        data.append("gender", form.gender.trim());
        if (form.size.trim()) data.append("size", form.size.trim());
      }

      const res = await api.post("/adoptions/admin/listing", data);
      if (res.data.success) {
        toast.success(res.data.message || "Listing published");
        navigate("/admin/adoptions");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-8 pb-16 px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-[#7fa37a]/20 via-[#5f7d5a]/15 to-[#8b6b4c]/15 rounded-full blur-[160px] opacity-50" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2f3e2c] tracking-tight">
              Add adoption listing
            </h1>
            <p className="text-[#6b7d67] mt-2 font-medium">
              Publishes immediately on the public adoption listing (no extra approval step).
            </p>
          </div>
          <Link
            to="/admin/adoptions"
            className="text-sm font-bold text-[#5f7d5a] hover:underline"
          >
            ← Back to adoptions
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white/70 backdrop-blur-xl border border-[#8b6b4c]/25 shadow-xl p-6 sm:p-10"
        >
          <div className="flex gap-2 p-1 bg-[#f3eee8]/80 rounded-2xl mb-8">
            {[
              { id: "shelter", label: "Shelter / manual entry" },
              { id: "link", label: "Link existing pet" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setMode(t.id)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                  mode === t.id
                    ? "bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white shadow-md"
                    : "text-[#2f3e2c] hover:bg-white/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "link" ? (
              <Field label="Pet ID (UUID from database)">
                <input
                  name="petId"
                  value={form.petId}
                  onChange={handleChange}
                  placeholder="e.g. from Admin → Pets or owner profile"
                  className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 text-[#2f3e2c] font-medium outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                />
              </Field>
            ) : (
              <>
                <Field label="Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Type">
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                    >
                      {["Dog", "Cat", "Bird", "Rabbit", "Other"].map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Gender">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </Field>
                </div>
                <Field label="Breed">
                  <input
                    name="breed"
                    value={form.breed}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                  />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Age (display text)">
                    <input
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      placeholder='e.g. "8 months" or "2 years"'
                      className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                    />
                  </Field>
                  <Field label="Size (optional)">
                    <input
                      name="size"
                      value={form.size}
                      onChange={handleChange}
                      placeholder="Small / Medium / Large"
                      className="w-full rounded-xl border border-[#8b6b4c]/25 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-[#7fa37a]/40"
                    />
                  </Field>
                </div>
              </>
            )}

            {mode === "link" && (
              <Field label="Override image (optional)">
                <p className="text-xs text-[#6b7d67] mb-2">
                  If omitted, the pet&apos;s latest gallery photo is used.
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="text-sm text-[#2f3e2c]"
                />
              </Field>
            )}

            {mode === "shelter" && (
              <Field label="Photo (optional)">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="text-sm text-[#2f3e2c]"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt=""
                    className="mt-3 h-40 rounded-2xl object-cover border border-[#d0ddcc]"
                  />
                )}
              </Field>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-black/80 bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c] hover:shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Publishing…" : "Publish listing"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#6b7d67] uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
