// backend/controllers/dashboardController.js
const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * @desc    Get platform-wide statistics for Admin Dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private (Admin/Owner)
 */
const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return sendError(res, 403, "Not authorized to access platform statistics");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. User & Pet Counts (Existing)
    const [userStats, petStats] = await Promise.all([
      prisma.user.groupBy({ by: ["role"], _count: true }),
      prisma.pet.groupBy({ by: ["status"], _count: true }),
    ]);

    const users = { total: 0, admin: 0, owner: 0, volunteer: 0, vet: 0, user: 0 };
    userStats.forEach((s) => {
      users[s.role] = s._count;
      users.total += s._count;
    });

    const pets = { total: 0, pending: 0, approved: 0, rejected: 0, flagged: 0 };
    petStats.forEach((s) => {
      const k = s.status.toLowerCase();
      pets[k] = s._count;
      pets.total += s._count;
    });

    // 2. Adoption & Rescue Stats
    const [
      adoptionListings,
      adoptionApps,
      rescueStats,
      emergencyRescues,
    ] = await Promise.all([
      prisma.adoptionPet.groupBy({ by: ["status"], _count: true }),
      prisma.adoptionApplication.groupBy({ by: ["status"], _count: true }),
      prisma.rescueRequest.groupBy({ by: ["status"], _count: true }),
      prisma.rescueRequest.count({ where: { priority: { in: ["High", "Critical"] }, status: { notIn: ["COMPLETED", "CANCELLED"] } } }),
    ]);

    const adoptions = { total: 0, pending: 0, approved: 0, rejected: 0 };
    adoptionApps.forEach(s => {
      const k = s.status.toLowerCase();
      if (adoptions.hasOwnProperty(k)) adoptions[k] = s._count;
      adoptions.total += s._count;
    });

    const rescues = { total: 0, active: 0, completed: 0, emergency: emergencyRescues };
    rescueStats.forEach(s => {
      if (["ASSIGNED", "IN_PROGRESS", "PICKED", "VET", "RESCUED", "SHELTER"].includes(s.status)) {
        rescues.active += s._count;
      } else if (s.status === "COMPLETED") {
        rescues.completed += s._count;
      }
      rescues.total += s._count;
    });

    // 3. Donation Stats
    const donationMetrics = await prisma.donation.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    });

    const donationToday = await prisma.donation.aggregate({
      where: { status: "paid", createdAt: { gte: today } },
      _sum: { amount: true },
    });

    const donationMonth = await prisma.donation.aggregate({
      where: { status: "paid", createdAt: { gte: firstDayOfMonth } },
      _sum: { amount: true },
    });

    const donations = {
      today: donationToday._sum.amount || 0,
      month: donationMonth._sum.amount || 0,
      total: donationMetrics._sum.amount || 0,
    };

    // 4. Analytics Data for Recharts
    const rangeDays = parseInt(req.query.range) || 7;
    const analyticsRangeDate = new Date();
    analyticsRangeDate.setDate(analyticsRangeDate.getDate() - (rangeDays - 1));
    analyticsRangeDate.setHours(0, 0, 0, 0);

    const [dailyUsers, dailyAdoptions, dailyRescues] = await Promise.all([
      prisma.user.findMany({ where: { createdAt: { gte: analyticsRangeDate } }, select: { createdAt: true } }),
      prisma.adoptionApplication.findMany({ where: { createdAt: { gte: analyticsRangeDate } }, select: { createdAt: true } }),
      prisma.rescueRequest.findMany({ where: { createdAt: { gte: analyticsRangeDate } }, select: { createdAt: true } }),
    ]);

    // Grouping by date with zero-filling
    const analyticsMap = {};
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(analyticsRangeDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      analyticsMap[dateStr] = { date: dateStr, users: 0, adoptions: 0, rescues: 0 };
    }

    dailyUsers.forEach(u => {
      const d = u.createdAt.toISOString().split("T")[0];
      if (analyticsMap[d]) analyticsMap[d].users++;
    });
    dailyAdoptions.forEach(a => {
      const d = a.createdAt.toISOString().split("T")[0];
      if (analyticsMap[d]) analyticsMap[d].adoptions++;
    });
    dailyRescues.forEach(r => {
      const d = r.createdAt.toISOString().split("T")[0];
      if (analyticsMap[d]) analyticsMap[d].rescues++;
    });

    const analytics = Object.values(analyticsMap);

    // 5. Unified Recent Activity (Detailed)
    const [lastUsers, lastPets, lastRescues, lastDonations] = await Promise.all([
      prisma.user.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { fullName: true, createdAt: true, role: true } }),
      prisma.pet.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { name: true, createdAt: true, species: true } }),
      prisma.rescueRequest.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { problemType: true, createdAt: true, priority: true } }),
      prisma.donation.findMany({ take: 5, orderBy: { createdAt: "desc" }, select: { donorName: true, amount: true, createdAt: true } }),
    ]);

    const activity = [
      ...lastUsers.map(u => ({ type: "user", title: `New ${u.role} joined: ${u.fullName}`, time: u.createdAt })),
      ...lastPets.map(p => ({ type: "pet", title: `New pet registered: ${p.name} (${p.species})`, time: p.createdAt })),
      ...lastRescues.map(r => ({ type: "rescue", title: `Rescue request: ${r.problemType} (${r.priority})`, time: r.createdAt })),
      ...lastDonations.map(d => ({ type: "donation", title: `Donation received: $${d.amount} from ${d.donorName}`, time: d.createdAt })),
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    return sendSuccess(res, 200, "Dashboard stats fetched successfully", {
      metrics: {
        users,
        pets,
        adoptions,
        rescues,
        donations,
        kpi: {
          adoptionSuccess: adoptionApps.length ? Math.round((adoptions.approved / (adoptions.total || 1)) * 100) : 0,
          rescueSuccess: rescueStats.length ? Math.round((rescues.completed / (rescues.total || 1)) * 100) : 0,
          avgRescueResponseMin: 12, // Placeholder
          volunteerScore: 85, // Placeholder
        }
      },
      activity,
      analytics,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return sendError(res, 500, "Server error fetching dashboard statistics");
  }
};

/**
 * @desc    Admin: queue-style alert counts (rescues, adoptions, donations)
 * @route   GET /api/dashboard/admin-summary
 * @access  Private (admin)
 */
const getAdminSummary = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return sendError(res, 403, "Not authorized");
    }

    const [
      pendingRescues,
      pendingAdoptions,
      pendingDonationsAgg,
      activeRescues,
    ] = await Promise.all([
      prisma.rescueRequest.count({ where: { status: "PENDING" } }),
      prisma.adoptionPet.count({ where: { status: "PENDING" } }),
      prisma.donation.aggregate({
        where: { status: "pending" },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      prisma.rescueRequest.count({
        where: { status: { in: ["ASSIGNED", "IN_PROGRESS", "PICKED", "VET", "RESCUED", "SHELTER"] } },
      }),
    ]);

    return sendSuccess(res, 200, "Admin summary fetched", {
      pendingRescues,
      pendingAdoptions,
      pendingDonationsCount: pendingDonationsAgg._count?._all ?? 0,
      pendingDonationsAmount: pendingDonationsAgg._sum.amount || 0,
      activeRescueMissions: activeRescues,
    });
  } catch (error) {
    console.error("getAdminSummary", error);
    return sendError(res, 500, "Server error");
  }
};

module.exports = {
  getAdminStats,
  getAdminSummary,
};
