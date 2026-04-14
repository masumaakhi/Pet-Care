import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, loading, setUser } = useAuth();
  const navigate = useNavigate();

  // Local state for editing the profile
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [pets, setPets] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
      fetchExtraData();
    }
  }, [user]);

  const fetchExtraData = async () => {
    try {
      setIsFetchingData(true);
      const [petsRes, vaccineRes, presRes] = await Promise.all([
        api.get("/pets"),
        api.get("/medical/vaccines"),
        api.get("/medical/prescriptions"),
      ]);

      if (petsRes.data.success) setPets(petsRes.data.data);
      if (vaccineRes.data.success) setVaccines(vaccineRes.data.data);
      if (presRes.data.success) setPrescriptions(presRes.data.data);
    } catch (error) {
      console.error("Fetch Profile Data Error:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  const stats = useMemo(() => {
    const totalSchedules = pets.reduce((acc, p) => acc + (p._count?.schedules || 0), 0);
    const totalWeights = pets.reduce((acc, p) => acc + (p._count?.weightLogs || 0), 0);
    // Count vaccines due soon (basic logic)
    const dueVaccines = vaccines.filter(v => v.nextDueDate && new Date(v.nextDueDate) < new Date(Date.now() + 14 * 86400000)).length;

    return {
      totalPets: pets.length,
      schedules: totalSchedules,
      weights: totalWeights,
      dueVaccines,
      activeMeds: prescriptions.length
    };
  }, [pets, vaccines, prescriptions]);

  if (loading || isFetchingData) {
    return (
      <div className="min-h-screen px-4 sm:px-8 pt-[6rem] pb-[4rem] flex items-center justify-center">
        <div className="text-[#2f3e2c] text-lg font-medium">
          Loading profile data...
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.fullName || "User";
  const displayEmail = user.email || "No email";
  const displayRole = user.role || "user";
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 pt-[6rem] pb-[4rem] relative overflow-hidden">
      <div
        className="absolute 
        top-1/2 left-1/2 
        -translate-x-1/2 -translate-y-1/2
        w-[720px] h-[720px]
        bg-gradient-to-br 
        from-[#7fa37a]/40 
        via-[#5f7d5a]/30 
        to-[#8b6b4c]/30
        rounded-full blur-[160px] opacity-60 pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-6xl mx-auto
        bg-gradient-to-br 
        from-white/75 via-[#e5e3df]/75 to-[#a18463]/35
        backdrop-blur-2xl rounded-3xl
        border border-[#8b6b4c]/40
        shadow-[0_25px_80px_rgba(0,0,0,0.15)]
        p-6 sm:p-10"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 rounded-full 
              bg-gradient-to-br from-[#7fa37a] to-[#8b6b4c] 
              flex items-center justify-center 
              text-white text-3xl font-bold shadow-lg"
            >
              {initial}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2f3e2c]">{displayName}</h2>
              <p className="text-[#6b7d67] text-sm">{displayEmail}</p>

              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-[#7fa37a]/30 text-[#2f3e2c] capitalize">
                {displayRole}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-start lg:justify-end w-full lg:w-auto">
            {displayRole === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  🛡️ Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#7fa37a] to-[#8b6b4c]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  👥 Users
                </Link>
              </>
            )}

            {displayRole === "volunteer" && (
              <>
                <Link
                  to="/rescue/nearby"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  🚑 Live Radar
                </Link>
                <Link
                  to="/rescue/history"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#7fa37a] to-[#8b6b4c]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  📝 History
                </Link>
              </>
            )}

            {displayRole !== "admin" && displayRole !== "volunteer" && (
              <>
                <Link
                  to="/pets"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  🐾 My Pets
                </Link>
                <Link
                  to="/health"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#7fa37a] to-[#8b6b4c]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  🏥 Health Hub
                </Link>
                <Link
                  to="/rescue/my-requests"
                  className="px-5 py-2 rounded-xl 
                  bg-gradient-to-r from-[#7fa37a] to-[#8b6b4c]
                  text-white font-medium shadow-md 
                  hover:scale-[1.02] hover:shadow-lg transition"
                >
                  📝 Rescue Requst History
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl 
              bg-gradient-to-r from-[#8b6b4c] to-[#5f7d5a]
              text-white font-medium shadow-md 
              hover:scale-[1.02] hover:shadow-lg transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {displayRole === "admin" && (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <SummaryCard title="System Alerts" value="3" accent="text-[#5f7d5a]" />
              <SummaryCard title="Pending Rescues" value="12" accent="text-[#7fa37a]" />
              <SummaryCard title="Active Campaigns" value="4" accent="text-[#8b6b4c]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <MiniStat
                title="Manage Admin Metrics"
                value="Active"
                hint="View complete site performance"
                ctaLabel="Open Dashboard →"
                to="/admin"
              />
              <MiniStat
                title="System Reports"
                value="Latest"
                hint="View global donations & rescues"
                ctaLabel="View Reports →"
                to="/admin/reports"
              />
            </div>
          </>
        )}

        {displayRole === "volunteer" && (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <SummaryCard title="Active Missions" value="1" accent="text-[#5f7d5a]" />
              <SummaryCard title="Rescues Completed" value="14" accent="text-[#7fa37a]" />
              <SummaryCard title="Avg Response Time" value="12m" accent="text-[#8b6b4c]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <MiniStat
                title="Nearby Emergencies"
                value="3"
                hint="SOS calls needing volunteer assigned"
                ctaLabel="View Map →"
                to="/rescue/nearby"
              />
              <MiniStat
                title="Volunteer Rating"
                value="4.9/5"
                hint="Excellent performance!"
                ctaLabel="My History →"
                to="/rescue/history"
              />
            </div>
          </>
        )}

        {displayRole !== "admin" && displayRole !== "volunteer" && (
          <>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <SummaryCard title="Total Pets" value={stats.totalPets} accent="text-[#5f7d5a]" />
              <SummaryCard title="Upcoming Schedules" value={stats.schedules} accent="text-[#7fa37a]" />
              <SummaryCard title="Weight Logs" value={stats.weights} accent="text-[#8b6b4c]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <MiniStat
                title="Due Vaccines"
                value={stats.dueVaccines}
                hint="Booster / upcoming vaccinations"
                ctaLabel="Open Vaccines →"
                to="/vaccines"
              />
              <MiniStat
                title="Active Medications"
                value={stats.activeMeds}
                hint="Currently ongoing prescriptions"
                ctaLabel="Open Prescriptions →"
                to="/prescriptions"
              />
            </div>
          </>
        )}

        <div className="flex gap-6 border-b border-[#8b6b4c]/40 mb-6">
          {["profile", "security", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 capitalize font-medium transition ${activeTab === tab
                  ? "text-[#2f3e2c] border-b-2 border-[#5f7d5a]"
                  : "text-[#6b7d67] hover:text-[#2f3e2c]"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="space-y-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#2f3e2c]">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-[#5f7d5a] bg-[#5f7d5a]/10 px-4 py-1.5 rounded-lg hover:bg-[#5f7d5a]/20 transition"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ 
                      fullName: user.fullName, 
                      email: user.email,
                      phone: user.phone || "",
                      address: user.address || "",
                      bio: user.bio || ""
                    });
                  }}
                  className="text-sm font-medium text-red-500 bg-red-50 px-4 py-1.5 rounded-lg hover:bg-red-100 transition"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                setIsUpdating(true);
                const res = await api.put("/auth/profile", editForm);
                setUser(res.data.data);
                toast.success(res.data.message || "Profile updated successfully");
                setIsEditing(false);
              } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to update profile");
              } finally {
                setIsUpdating(false);
              }
            }}>
              <div>
                <label className="block text-sm text-[#4e5f4a] mb-1">Full Name</label>
                <input
                  type="text"
                  value={isEditing ? editForm.fullName : displayName}
                  readOnly={!isEditing}
                  onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-xl border outline-none transition ${isEditing ? 'bg-white/80 border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40' : 'bg-white/60 border-[#8b6b4c]/40 opacity-80 cursor-default'}`}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm text-[#4e5f4a] mb-1">Email Address</label>
                <input
                  type="email"
                  value={isEditing ? editForm.email : displayEmail}
                  readOnly={!isEditing}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-2 rounded-xl border outline-none transition ${isEditing ? 'bg-white/80 border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40' : 'bg-white/60 border-[#8b6b4c]/40 opacity-80 cursor-default'}`}
                  required
                />
              </div>

              <div className="mt-6">
                 <h4 className="text-sm font-bold text-[#2f3e2c] mb-3 uppercase tracking-wider">Additional Information</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#4e5f4a] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={isEditing ? editForm.phone : (user.phone || "Not provided")}
                        readOnly={!isEditing}
                        placeholder="e.g. +1 234 567 890"
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition ${isEditing ? 'bg-white/80 border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40' : 'bg-white/60 border-[#8b6b4c]/40 opacity-80 cursor-default'}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#4e5f4a] mb-1">Address</label>
                      <input
                        type="text"
                        value={isEditing ? editForm.address : (user.address || "Not provided")}
                        readOnly={!isEditing}
                        placeholder="e.g. 123 Street, City"
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        className={`w-full px-4 py-2 rounded-xl border outline-none transition ${isEditing ? 'bg-white/80 border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40' : 'bg-white/60 border-[#8b6b4c]/40 opacity-80 cursor-default'}`}
                      />
                    </div>
                 </div>
                 <div className="mt-4">
                    <label className="block text-sm text-[#4e5f4a] mb-1">Bio</label>
                    <textarea
                      value={isEditing ? editForm.bio : (user.bio || "No bio added yet.")}
                      readOnly={!isEditing}
                      rows={3}
                      placeholder="Tell us a bit about yourself..."
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className={`w-full px-4 py-2 rounded-xl border outline-none transition resize-none ${isEditing ? 'bg-white/80 border-[#5f7d5a] focus:ring-2 focus:ring-[#7fa37a]/40' : 'bg-white/60 border-[#8b6b4c]/40 opacity-80 cursor-default'}`}
                    />
                 </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#5f7d5a] to-[#7fa37a] text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg transition disabled:opacity-60"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-5">
            <Link
              to="/forgot-password"
              className="inline-block px-6 py-2 rounded-xl 
              bg-gradient-to-r from-[#8b6b4c] to-[#5f7d5a]
              text-white shadow-md hover:scale-[1.02] transition"
            >
              Change Password
            </Link>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 text-[#4e5f4a]">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" defaultChecked />
              Email Notifications
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" defaultChecked />
              Schedule Reminders
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" className="accent-[#5f7d5a]" />
              Medication Reminders
            </label>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SummaryCard({ title, value, accent }) {
  return (
    <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-lg border border-[#8b6b4c]/40 shadow-md text-center">
      <h3 className="text-lg font-semibold text-[#2f3e2c]">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${accent}`}>{value}</p>
    </div>
  );
}

function MiniStat({ title, value, hint, ctaLabel, to }) {
  return (
    <div className="p-5 rounded-2xl bg-white/55 backdrop-blur-lg border border-[#8b6b4c]/40 shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-[#6b7d67]">{title}</div>
          <div className="text-2xl font-extrabold text-[#2f3e2c] mt-1">{value}</div>
          <div className="text-xs text-[#6b7d67] mt-1">{hint}</div>
        </div>

        <Link
          to={to}
          className="px-4 py-2 rounded-xl bg-white/60 border border-[#8b6b4c]/35 backdrop-blur-xl text-[#2f3e2c] font-semibold hover:bg-white/75 hover:shadow-md transition"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}