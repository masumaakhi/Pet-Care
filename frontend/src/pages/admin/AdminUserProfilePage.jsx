import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../utils/api";

export default function AdminUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);

      // Try single-user endpoint first
      try {
        const res = await api.get(`/auth/users/${id}`);
        const data = res.data;
        if (data?.success && data?.data) {
          setUser(data.data);
          return;
        }
      } catch {
        // fallback নিচে যাবে
      }

      // fallback: fetch all users and find one
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
      toast.error(
        error?.response?.data?.message || "Failed to load user profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const enhancedUser = useMemo(() => {
    if (!user) return null;

    return {
      ...user,
      status: user.status || "active",
      phone: user.phone || "Not provided",
      address: user.address || "Not provided",
      bio: user.bio || "No bio added yet.",
      petsCount:
        typeof user.petsCount === "number"
          ? user.petsCount
          : typeof user.totalPets === "number"
          ? user.totalPets
          : 0,
      adoptionCount:
        typeof user.adoptionCount === "number" ? user.adoptionCount : 0,
      rescueCount: typeof user.rescueCount === "number" ? user.rescueCount : 0,
      activeListings:
        typeof user.activeListings === "number" ? user.activeListings : 0,
      reportsCount: typeof user.reportsCount === "number" ? user.reportsCount : 0,
      emailVerified:
        typeof user.emailVerified === "boolean" ? user.emailVerified : true,
      phoneVerified:
        typeof user.phoneVerified === "boolean" ? user.phoneVerified : false,
      lastActive: user.lastActive || user.updatedAt || user.createdAt || null,
      joinedDateLabel: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A",
      recentActivities: Array.isArray(user.recentActivities)
        ? user.recentActivities
        : [
            "Logged in recently",
            "Updated profile information",
            "Viewed account dashboard",
          ],
      petsOverview: Array.isArray(user.petsOverview) ? user.petsOverview : [],
    };
  }, [user]);

  if (loading) {
    return (
      <div className="pt-8 pb-10 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white/70 border border-[#8b6b4c]/20 p-10 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] animate-spin" />
          <p className="mt-4 text-[#6b7d67] font-medium">Loading profile...</p>
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
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7fa37a]/50 via-[#5f7d5a]/30 to-[#8b6b4c]/30
              flex items-center justify-center text-[#2f3e2c] text-xl font-bold border border-white/40 shadow-sm"
            >
              {enhancedUser.fullName?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
                {enhancedUser.fullName || "Unnamed User"}
              </h1>
              <p className="text-[#6b7d67] mt-1">{enhancedUser.email}</p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <RoleBadge role={enhancedUser.role} />
                <StatusBadge status={enhancedUser.status} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c] font-semibold"
            >
              Back
            </button>

            <button
              onClick={() => navigate(`/admin/users/edit/${enhancedUser.id}`)}
              className="px-4 py-2.5 rounded-xl bg-white/70 border border-[#8b6b4c]/30 text-[#2f3e2c] font-semibold"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <MiniStatCard label="Pets" value={enhancedUser.petsCount} />
          <MiniStatCard label="Adoptions" value={enhancedUser.adoptionCount} />
          <MiniStatCard label="Rescues" value={enhancedUser.rescueCount} />
          <MiniStatCard label="Active Listings" value={enhancedUser.activeListings} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <SectionCard title="Basic Information">
              <InfoGrid>
                <InfoItem label="Full Name" value={enhancedUser.fullName || "N/A"} />
                <InfoItem label="Email" value={enhancedUser.email || "N/A"} />
                <InfoItem label="Phone" value={enhancedUser.phone} />
                <InfoItem label="Address" value={enhancedUser.address} />
                <InfoItem label="Role" value={capitalize(enhancedUser.role)} />
                <InfoItem label="Status" value={capitalize(enhancedUser.status)} />
                <InfoItem label="Joined" value={enhancedUser.joinedDateLabel} />
                <InfoItem
                  label="Last Active"
                  value={formatLastActive(enhancedUser.lastActive)}
                />
              </InfoGrid>

              <div className="mt-5">
                <p className="text-xs font-semibold text-[#6b7d67] mb-2">Bio</p>
                <p className="text-sm text-[#2f3e2c] leading-6">
                  {enhancedUser.bio}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Pet Overview">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <MetricBox label="Total Pets" value={enhancedUser.petsCount} />
                <MetricBox
                  label="Adoptions"
                  value={enhancedUser.adoptionCount}
                />
                <MetricBox label="Rescues" value={enhancedUser.rescueCount} />
                <MetricBox
                  label="Reports"
                  value={enhancedUser.reportsCount}
                />
              </div>

              {enhancedUser.petsOverview.length > 0 ? (
                <div className="space-y-3">
                  {enhancedUser.petsOverview.map((pet, index) => (
                    <div
                      key={index}
                      className="rounded-2xl p-4 bg-white/50 border border-[#8b6b4c]/15"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-[#2f3e2c]">
                            {pet.name || `Pet ${index + 1}`}
                          </div>
                          <div className="text-xs text-[#6b7d67] mt-1">
                            {[pet.type, pet.breed, pet.status]
                              .filter(Boolean)
                              .join(" · ") || "No detailed pet info"}
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-[#2f3e2c]">
                          {pet.age || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6b7d67]">
                  No detailed pet records available yet.
                </p>
              )}
            </SectionCard>

            <SectionCard title="Recent Activity">
              <div className="space-y-3">
                {enhancedUser.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="rounded-2xl px-4 py-3 bg-white/50 border border-[#8b6b4c]/15 text-sm text-[#2f3e2c]"
                  >
                    {activity}
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="space-y-6"
          >
            <SectionCard title="Verification">
              <InfoRow
                label="Email Verified"
                value={enhancedUser.emailVerified ? "Yes" : "No"}
              />
              <InfoRow
                label="Phone Verified"
                value={enhancedUser.phoneVerified ? "Yes" : "No"}
              />
            </SectionCard>

            <SectionCard title="Quick Summary">
              <div className="space-y-3">
                <MetricBox label="User ID" value={enhancedUser.id || "N/A"} />
                <MetricBox label="Role" value={capitalize(enhancedUser.role)} />
                <MetricBox
                  label="Status"
                  value={capitalize(enhancedUser.status)}
                />
              </div>
            </SectionCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-3xl p-5 bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/25 backdrop-blur-2xl border border-[#8b6b4c]/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <h3 className="text-base font-bold text-[#2f3e2c] mb-4">{title}</h3>
      {children}
    </div>
  );
}

function MiniStatCard({ label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30 backdrop-blur-xl">
      <div className="text-xs text-[#6b7d67] font-medium">{label}</div>
      <div className="text-2xl font-extrabold text-[#2f3e2c] mt-1">{value}</div>
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

function InfoGrid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-white/45 border border-[#8b6b4c]/15">
      <div className="text-xs font-semibold text-[#6b7d67]">{label}</div>
      <div className="text-sm font-medium text-[#2f3e2c] mt-1 break-words">
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#8b6b4c]/10 last:border-0">
      <span className="text-xs font-semibold text-[#6b7d67]">{label}</span>
      <span className="text-sm text-[#2f3e2c] text-right">{value}</span>
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

function formatLastActive(dateValue) {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  const now = new Date();
  const diffMs = now - date;

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${Math.max(diffMinutes, 1)}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function capitalize(value) {
  if (!value) return "N/A";
  return value.charAt(0).toUpperCase() + value.slice(1);
}