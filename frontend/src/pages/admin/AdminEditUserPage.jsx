import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

export default function AdminEditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    role: "user",
    status: "active",
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      try {
        const res = await api.get(`/auth/users/${id}`);
        const data = res.data;
        if (data?.success && data?.data) {
          setUser(data.data);
          return;
        }
      } catch {
        // fallback
      }

      const res = await api.get("/auth/users");
      const data = res.data;

      if (data?.success && Array.isArray(data?.data)) {
        const foundUser = data.data.find((u) => String(u.id) === String(id));
        if (foundUser) {
          setUser(foundUser);
        } else {
          toast.error("User not found");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      role: user.role || "user",
      status: user.status || "active",
    });
  }, [user]);

  const enhancedUser = useMemo(() => {
    if (!user) return null;
    return {
      ...user,
      petsCount:
        typeof user.petsCount === "number"
          ? user.petsCount
          : typeof user.totalPets === "number"
          ? user.totalPets
          : 0,
      adoptionCount:
        typeof user.adoptionCount === "number" ? user.adoptionCount : 0,
      rescueCount: typeof user.rescueCount === "number" ? user.rescueCount : 0,
    };
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Preferred admin edit endpoint
      try {
        const res = await api.put(`/auth/users/${id}`, formData);
        if (res.data?.success) {
          toast.success("User updated successfully");
          navigate(`/admin/users/view/${id}`);
          return;
        }
      } catch {
        // fallback নিচে যাবে
      }

      // Fallback to profile endpoint for role/fullName/email if that's what backend supports
      const payload = {
        userId: id,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        bio: formData.bio,
        status: formData.status,
      };

      const res = await api.put("/auth/profile", payload);

      if (res.data?.success) {
        toast.success("User updated successfully");
        navigate(`/admin/users/view/${id}`);
      } else {
        toast.error("Could not update user");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 pb-10 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 p-10 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] animate-spin" />
          <p className="mt-4 text-[#6b7d67] font-medium">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!enhancedUser) {
    return (
      <div className="pt-8 pb-10 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 p-10 text-center">
          <p className="text-[#2f3e2c] font-semibold">User not found.</p>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-4 px-4 py-2 rounded-xl border border-[#8b6b4c]/30 bg-white/70"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-6 pb-10">
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2
        w-[900px] h-[900px]
        bg-gradient-to-br from-[#7fa37a]/30 via-[#5f7d5a]/20 to-[#8b6b4c]/20
        rounded-full blur-[170px] opacity-60"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              Edit User
            </h1>
            <p className="text-[#6b7d67] mt-1">
              Update user information and access settings.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/admin/users/view/${id}`)}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c] font-semibold"
            >
              View Profile
            </button>

            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c] font-semibold"
            >
              Back
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl p-6 bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/25 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              <h3 className="text-lg font-bold text-[#2f3e2c] mb-5">
                Editable Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <InputField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <InputField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />

                <SelectField
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={[
                    { value: "user", label: "User" },
                    { value: "volunteer", label: "Volunteer" },
                    { value: "vet", label: "Vet" },
                    { value: "owner", label: "Owner" },
                    { value: "admin", label: "Admin" },
                  ]}
                />

                <SelectField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "pending", label: "Pending" },
                    { value: "suspended", label: "Suspended" },
                  ]}
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-semibold text-[#2f3e2c] mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-[#8b6b4c]/30
                  outline-none focus:ring-2 focus:ring-[#7fa37a]/40 text-[#2f3e2c] resize-none"
                  placeholder="Write user bio..."
                />
              </div>

              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-3 rounded-xl
                  bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
                  border border-[#d6e2d3]
                  text-black/80 font-semibold disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/admin/users/view/${id}`)}
                  className="px-5 py-3 rounded-xl bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c] font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="rounded-3xl p-5 bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/25 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-bold text-[#2f3e2c] mb-4">
                Current Summary
              </h3>

              <div className="space-y-3">
                <MetricBox label="Pets" value={enhancedUser.petsCount} />
                <MetricBox label="Adoptions" value={enhancedUser.adoptionCount} />
                <MetricBox label="Rescues" value={enhancedUser.rescueCount} />
              </div>
            </div>

            <div className="rounded-3xl p-5 bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/25 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <h3 className="text-base font-bold text-[#2f3e2c] mb-4">
                User Preview
              </h3>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7fa37a]/50 via-[#5f7d5a]/30 to-[#8b6b4c]/30
                  flex items-center justify-center text-[#2f3e2c] text-lg font-bold border border-white/40"
                >
                  {formData.fullName?.charAt(0).toUpperCase() || "U"}
                </div>

                <div>
                  <p className="font-bold text-[#2f3e2c]">
                    {formData.fullName || "Unnamed User"}
                  </p>
                  <p className="text-sm text-[#6b7d67]">{formData.email || "No email"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <RoleBadge role={formData.role} />
                <StatusBadge status={formData.status} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2f3e2c] mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-[#8b6b4c]/30
        outline-none focus:ring-2 focus:ring-[#7fa37a]/40 text-[#2f3e2c]"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2f3e2c] mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-[#8b6b4c]/30
        outline-none focus:ring-2 focus:ring-[#7fa37a]/40 text-[#2f3e2c]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="rounded-2xl p-3 bg-white/50 border border-[#8b6b4c]/15">
      <div className="text-[11px] font-medium text-[#6b7d67]">{label}</div>
      <div className="text-base font-bold text-[#2f3e2c] mt-1">{value}</div>
    </div>
  );
}

function RoleBadge({ role }) {
  const roleConfig = {
    admin: {
      bg: "bg-rose-500/15",
      border: "border-rose-500/30",
      text: "text-rose-700",
      label: "Admin",
    },
    owner: {
      bg: "bg-rose-500/15",
      border: "border-rose-500/30",
      text: "text-rose-700",
      label: "Owner",
    },
    volunteer: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/30",
      text: "text-amber-800",
      label: "Volunteer",
    },
    vet: {
      bg: "bg-sky-500/15",
      border: "border-sky-500/30",
      text: "text-sky-800",
      label: "Vet",
    },
    user: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      text: "text-emerald-800",
      label: "User",
    },
  };

  const config = roleConfig[role] || roleConfig.user;

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text}`}
    >
      {config.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    active: {
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      text: "text-emerald-800",
      label: "Active",
    },
    suspended: {
      bg: "bg-rose-500/15",
      border: "border-rose-500/30",
      text: "text-rose-700",
      label: "Suspended",
    },
    pending: {
      bg: "bg-amber-500/15",
      border: "border-amber-500/30",
      text: "text-amber-800",
      label: "Pending",
    },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.border} ${config.text}`}
    >
      {config.label}
    </span>
  );
}