// src/pages/admin/AdminUserManagementPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth/users");
      const data = res.data;

      if (data.success && data.data) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        error.message ||
        "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);

      const res = await api.put("/auth/profile", { userId, role: newRole });
      const data = res.data;

      if (data.success) {
        toast.success("User role updated successfully!");
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Could not update user role");
    } finally {
      setUpdatingId(null);
    }
  };

  const enhancedUsers = useMemo(() => {
    return users.map((u, index) => ({
      ...u,
      status: u.status || "active",
      lastActive: u.lastActive || u.updatedAt || u.createdAt || new Date(),
      petsCount:
        typeof u.petsCount === "number"
          ? u.petsCount
          : typeof u.totalPets === "number"
            ? u.totalPets
            : 0,
      trustScore: typeof u.trustScore === "number" ? u.trustScore : 80,
      adoptionCount:
        typeof u.adoptionCount === "number" ? u.adoptionCount : 0,
      rescueCount: typeof u.rescueCount === "number" ? u.rescueCount : 0,
      activeListings:
        typeof u.activeListings === "number" ? u.activeListings : 0,
      completedActions:
        typeof u.completedActions === "number"
          ? u.completedActions
          : (typeof u.adoptionCount === "number" ? u.adoptionCount : 0) +
          (typeof u.rescueCount === "number" ? u.rescueCount : 0),
      reportsCount: typeof u.reportsCount === "number" ? u.reportsCount : 0,
      phone: u.phone || "Not provided",
      address: u.address || "Not provided",
      bio: u.bio || "No bio added yet.",
      emailVerified:
        typeof u.emailVerified === "boolean" ? u.emailVerified : true,
      phoneVerified:
        typeof u.phoneVerified === "boolean" ? u.phoneVerified : false,
      profileCompletion:
        typeof u.profileCompletion === "number" ? u.profileCompletion : 78,
      petsOverview: Array.isArray(u.petsOverview) ? u.petsOverview : [],
      recentActivities: Array.isArray(u.recentActivities)
        ? u.recentActivities
        : [
          "Logged in recently",
          "Updated profile information",
          "Viewed dashboard activity",
        ],
      engagementScore:
        typeof u.engagementScore === "number"
          ? u.engagementScore
          : Math.min(
            100,
            45 +
            (typeof u.petsCount === "number" ? u.petsCount * 8 : 0) +
            (typeof u.adoptionCount === "number" ? u.adoptionCount * 6 : 0) +
            (typeof u.rescueCount === "number" ? u.rescueCount * 6 : 0)
          ),
      joinedDateLabel: u.createdAt
        ? new Date(u.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        : "N/A",
      healthScore:
        typeof u.healthScore === "number"
          ? u.healthScore
          : Math.max(60, 90 - index * 3),
    }));
  }, [users]);

  const filteredUsers = enhancedUsers.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const analytics = useMemo(() => {
    const total = enhancedUsers.length;
    const activeUsers = enhancedUsers.filter((u) => u.status === "active").length;
    const verifiedUsers = enhancedUsers.filter((u) => u.emailVerified).length;
    const totalPets = enhancedUsers.reduce((sum, u) => sum + (u.petsCount || 0), 0);
    const totalAdoptions = enhancedUsers.reduce(
      (sum, u) => sum + (u.adoptionCount || 0),
      0
    );
    const totalRescues = enhancedUsers.reduce(
      (sum, u) => sum + (u.rescueCount || 0),
      0
    );

    return {
      total,
      activeUsers,
      verifiedUsers,
      totalPets,
      totalAdoptions,
      totalRescues,
    };
  }, [enhancedUsers]);

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
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2f3e2c]">
              User Management
            </h1>
            <p className="text-[#6b7d67] mt-1">
              View, filter, and modify user roles across the platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7d67]">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white/60
                border border-[#8b6b4c]/40 backdrop-blur-xl
                text-[#2f3e2c] font-medium outline-none focus:ring-2 focus:ring-[#7fa37a]/50
                placeholder-[#6b7d67]/70 transition w-full md:w-64"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/60
              border border-[#8b6b4c]/40 backdrop-blur-xl
              text-[#2f3e2c] font-semibold outline-none focus:ring-2 focus:ring-[#7fa37a]/50
              cursor-pointer transition"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="volunteer">Volunteer</option>
              <option value="vet">Vet</option>
              <option value="owner">Owner (Admin)</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={fetchUsers}
              className="px-4 py-2.5 rounded-xl
              bg-gradient-to-r from-[#5f7d5a]/55 via-[#7fa37a] to-[#8b6b4c]
              border border-[#d6e2d3]
              text-black/75 font-semibold
              hover:scale-[1.02] hover:shadow-lg transition duration-300 flex items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.1-8.5" />
                <path d="M2.5 22v-6h6M21.87 8.43a9 9 0 1 0-3.1 8.5" />
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
        >
          <StatCard label="Total Users" value={analytics.total} />
          <StatCard label="Active Users" value={analytics.activeUsers} />
          <StatCard label="Verified Users" value={analytics.verifiedUsers} />
          <StatCard label="Total Pets" value={analytics.totalPets} />
          <StatCard label="Adoptions" value={analytics.totalAdoptions} />
          <StatCard label="Rescues" value={analytics.totalRescues} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <AnalyticsPanel
            title="User Health"
            value={`${enhancedUsers.filter((u) => u.trustScore >= 80).length
              }/${enhancedUsers.length || 0}`}
            subtitle="Users with strong trust score"
          />
          <AnalyticsPanel
            title="Profile Completion"
            value={`${Math.round(
              enhancedUsers.reduce((sum, u) => sum + (u.profileCompletion || 0), 0) /
              (enhancedUsers.length || 1)
            )}%`}
            subtitle="Average profile completion"
          />
          <AnalyticsPanel
            title="Engagement"
            value={`${Math.round(
              enhancedUsers.reduce((sum, u) => sum + (u.engagementScore || 0), 0) /
              (enhancedUsers.length || 1)
            )}%`}
            subtitle="Average user engagement"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl bg-gradient-to-br from-white/75 via-[#e5e3df]/75 to-[#a18463]/30
          backdrop-blur-2xl border border-[#8b6b4c]/45 shadow-[0_25px_80px_rgba(0,0,0,0.12)]
          overflow-hidden"
        >
          <div className="overflow-x-auto p-1">
            <table className="w-full text-left border-collapse min-w-[1280px]">
              <thead>
                <tr className="border-b border-[#8b6b4c]/20">
                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    User
                  </th>
                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    Role
                  </th>
                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    Status
                  </th>
                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    Last Active
                  </th>
                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    Pets
                  </th>
                  {/* <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    Trust
                  </th> */}

                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm text-right">
                    Actions
                  </th>
                  <th className="py-4 px-6 text-[#4e5f4a] font-semibold text-sm">
                    Joined Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-[#6b7d67]">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-4 border-[#7fa37a]/30 border-t-[#5f7d5a] animate-spin" />
                        <p className="font-medium animate-pulse">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-[#6b7d67]">
                      <span className="text-3xl block mb-2">🔍</span>
                      <p className="font-medium">
                        No users found matching your criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      key={user.id}
                      className="border-b border-[#8b6b4c]/10 hover:bg-white/40 transition-colors last:border-0"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7fa37a]/50 via-[#5f7d5a]/30 to-[#8b6b4c]/30
                            flex items-center justify-center text-[#2f3e2c] font-bold border border-white/40 shadow-sm shrink-0"
                          >
                            {user.fullName?.charAt(0).toUpperCase() || "U"}
                          </div>

                          <div className="overflow-hidden">
                            <div className="font-bold text-[#2f3e2c] truncate">
                              {user.fullName || "Unnamed User"}
                            </div>
                            <div className="text-sm text-[#6b7d67] truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={user.status} />
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm text-[#2f3e2c] font-medium">
                          {formatLastActive(user.lastActive)}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm text-[#2f3e2c] font-semibold">
                          {user.petsCount}
                        </div>
                      </td>

                      {/* <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-20 h-2 rounded-full bg-white/60 border border-[#8b6b4c]/15 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#7fa37a]/70 via-[#5f7d5a]/75 to-[#8b6b4c]/70"
                              style={{ width: `${Math.min(user.trustScore, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-[#2f3e2c]">
                            {user.trustScore}%
                          </span>
                        </div>
                      </td> */}



                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/admin/users/view/${user.id}`)}
                            className="px-3 py-1.5 rounded-lg bg-white/70 border border-[#8b6b4c]/30 hover:border-[#8b6b4c]/60
                            text-sm text-[#2f3e2c] font-semibold transition"
                          >
                            View Profile
                          </button>

                          <button
                            onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            className="px-3 py-1.5 rounded-lg bg-white/70 border border-[#8b6b4c]/30 hover:border-[#8b6b4c]/60
                            text-sm text-[#2f3e2c] font-semibold transition"
                          >
                            Edit
                          </button>

                          {updatingId === user.id ? (
                            <span className="text-sm text-[#5f7d5a] animate-pulse font-semibold">
                              Updating...
                            </span>
                          ) : (
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user.id, e.target.value)
                              }
                              className="px-3 py-1.5 rounded-lg bg-white/70 border border-[#8b6b4c]/30 hover:border-[#8b6b4c]/60
                              text-sm text-[#2f3e2c] font-semibold outline-none focus:ring-2 focus:ring-[#7fa37a]/50
                              cursor-pointer transition"
                            >
                              <option value="user">User</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="vet">Vet</option>
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-[#2f3e2c] font-medium">
                          {user.joinedDateLabel}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30 backdrop-blur-xl">
      <div className="text-xs text-[#6b7d67] font-medium">{label}</div>
      <div className="text-2xl font-extrabold text-[#2f3e2c] mt-1">{value}</div>
    </div>
  );
}

function AnalyticsPanel({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl p-4 bg-white/55 border border-[#8b6b4c]/30 backdrop-blur-xl">
      <div className="text-sm font-semibold text-[#4e5f4a]">{title}</div>
      <div className="text-2xl font-extrabold text-[#2f3e2c] mt-2">{value}</div>
      <div className="text-xs text-[#6b7d67] mt-1">{subtitle}</div>
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