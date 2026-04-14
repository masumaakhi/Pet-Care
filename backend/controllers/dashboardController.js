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
    // Only admins or owners can access these platform-wide stats
    if (req.user.role !== "admin" && req.user.role !== "owner") {
      return sendError(res, 403, "Not authorized to access platform statistics");
    }

    // 1. User Counts by Role
    const userStats = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    const users = {
      total: 0,
      owners: 0,
      volunteers: 0,
      vets: 0,
      user: 0,
      admin: 0,
    };

    userStats.forEach((stat) => {
      users[stat.role] = stat._count;
      users.total += stat._count;
    });

    // 2. Pet Counts by Status
    const petStats = await prisma.pet.groupBy({
      by: ["status"],
      _count: true,
    });

    const pets = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    petStats.forEach((stat) => {
      const statusKey = stat.status.toLowerCase();
      pets[statusKey] = stat._count;
      pets.total += stat._count;
    });

    // 3. Medical & Health Record Counts
    const [vaccines, records, prescriptions] = await Promise.all([
      prisma.vaccination.count(),
      prisma.medicalRecord.count(),
      prisma.prescription.count(),
    ]);

    // 4. Recently Registered Users (for activity feed)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, createdAt: true },
    });

    // 5. Recently Added Pets
    const recentPets = await prisma.pet.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true, owner: { select: { fullName: true } } },
    });

    return sendSuccess(res, 200, "Dashboard stats fetched successfully", {
      metrics: {
        users,
        pets,
        health: {
          vaccines,
          records,
          prescriptions,
          total: vaccines + records + prescriptions,
        },
      },
      activity: {
        recentUsers,
        recentPets,
      },
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
