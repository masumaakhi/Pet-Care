// backend/controllers/donationController.js
const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");

const DEFAULT_FUND_SPLIT = [
  { category: "Medical/Veterinary", percentage: 45, color: "bg-blue-500" },
  { category: "Food & Supplies", percentage: 25, color: "bg-green-500" },
  { category: "Shelter Maintenance", percentage: 15, color: "bg-yellow-500" },
  { category: "Rescue Operations", percentage: 10, color: "bg-red-500" },
  { category: "Admin/Platform", percentage: 5, color: "bg-gray-500" },
];

async function ensureDonationSeed() {
  const c = await prisma.donationCampaign.count();
  if (c > 0) return;

  await prisma.donationCampaign.createMany({
    data: [
      {
        title: "Emergency Surgery for Max",
        description:
          "Max the Golden Retriever was found with severe injuries. He needs immediate life-saving surgery.",
        image:
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        type: "pet_specific",
        goalAmount: 5000,
        status: "active",
      },
      {
        title: "Winter Shelter Drive",
        description:
          "Help us provide warm beds, blankets, and heating for our rescue shelter before the winter hits.",
        image:
          "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        type: "general",
        goalAmount: 10000,
        status: "active",
      },
      {
        title: "Food for 100 Puppies",
        description:
          "We recently rescued 100 stray puppies and need funding to provide high-quality nutritious puppy food for them.",
        image:
          "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        type: "rescue",
        goalAmount: 2500,
        status: "completed",
      },
    ],
  });

  await prisma.donationSponsorPet.createMany({
    data: [
      {
        name: "Bella",
        breed: "Beagle Cross",
        age: "3 years",
        image:
          "https://images.unsplash.com/photo-1537151625747-768ad6cfbfc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        story: "Bella needs consistent medical care for a chronic condition.",
        monthlySponsorshipAmount: 30,
        status: "needs_sponsor",
      },
      {
        name: "Charlie",
        breed: "Tabby Cat",
        age: "5 months",
        image:
          "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        story: "Charlie was found abandoned and requires special dietary food.",
        monthlySponsorshipAmount: 20,
        status: "needs_sponsor",
      },
    ],
  });
}

async function campaignAggregates(campaignId) {
  const paid = await prisma.donation.aggregate({
    where: { campaignId, status: "paid" },
    _sum: { amount: true },
  });
  const raised = paid._sum.amount || 0;
  const supportersGroups = await prisma.donation.groupBy({
    by: ["donorEmail"],
    where: { campaignId, status: "paid" },
  });
  return { raised, supporters: supportersGroups.length };
}

function mapCampaignRow(row, agg) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    type: row.type,
    goal: row.goalAmount,
    raised: agg.raised,
    supporters: agg.supporters,
    status: row.status.toLowerCase(),
  };
}

const requireAdmin = (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    sendError(res, 403, "Admin only");
    return false;
  }
  return true;
};

/**
 * GET /api/donations/campaigns
 */
const getCampaigns = async (req, res) => {
  try {
    await ensureDonationSeed();
    const rows = await prisma.donationCampaign.findMany({
      orderBy: { createdAt: "asc" },
    });
    const out = [];
    for (const row of rows) {
      const agg = await campaignAggregates(row.id);
      out.push(mapCampaignRow(row, agg));
    }
    return sendSuccess(res, 200, "Campaigns fetched", out);
  } catch (e) {
    console.error("getCampaigns", e);
    return sendError(res, 500, "Failed to load campaigns");
  }
};

/**
 * GET /api/donations/campaigns/:id
 */
const getCampaignById = async (req, res) => {
  try {
    await ensureDonationSeed();
    const { id } = req.params;
    const row = await prisma.donationCampaign.findUnique({ where: { id } });
    if (!row) return sendError(res, 404, "Campaign not found");
    const agg = await campaignAggregates(row.id);
    return sendSuccess(res, 200, "Campaign fetched", mapCampaignRow(row, agg));
  } catch (e) {
    console.error("getCampaignById", e);
    return sendError(res, 500, "Failed to load campaign");
  }
};

/**
 * GET /api/donations/campaigns/:id/supporters
 */
const getCampaignSupporters = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await prisma.donationCampaign.findUnique({ where: { id } });
    if (!campaign) return sendError(res, 404, "Campaign not found");

    const donations = await prisma.donation.findMany({
      where: { campaignId: id, status: "paid" },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { donorName: true, amount: true, createdAt: true },
    });

    const list = donations.map((d) => ({
      name: d.donorName?.toLowerCase().includes("anonymous") ? "Anonymous Donor" : d.donorName,
      amount: d.amount,
      date: d.createdAt,
    }));

    return sendSuccess(res, 200, "Supporters fetched", list);
  } catch (e) {
    console.error("getCampaignSupporters", e);
    return sendError(res, 500, "Failed to load supporters");
  }
};

/**
 * GET /api/donations/sponsor-pets
 */
const getSponsorPets = async (req, res) => {
  try {
    await ensureDonationSeed();
    const rows = await prisma.donationSponsorPet.findMany({
      orderBy: { createdAt: "asc" },
    });
    const out = rows.map((r) => ({
      id: r.id,
      name: r.name,
      breed: r.breed,
      age: r.age,
      image: r.image,
      story: r.story,
      monthlySponsorshipAmount: r.monthlySponsorshipAmount,
      status: r.status,
    }));
    return sendSuccess(res, 200, "Sponsor pets fetched", out);
  } catch (e) {
    console.error("getSponsorPets", e);
    return sendError(res, 500, "Failed to load sponsor pets");
  }
};

/**
 * GET /api/donations/sponsor-pets/:id
 */
const getSponsorPetById = async (req, res) => {
  try {
    await ensureDonationSeed();
    const { id } = req.params;
    const r = await prisma.donationSponsorPet.findUnique({ where: { id } });
    if (!r) return sendError(res, 404, "Sponsor pet not found");
    return sendSuccess(res, 200, "Sponsor pet fetched", {
      id: r.id,
      name: r.name,
      breed: r.breed,
      age: r.age,
      image: r.image,
      story: r.story,
      monthlySponsorshipAmount: r.monthlySponsorshipAmount,
      status: r.status,
    });
  } catch (e) {
    console.error("getSponsorPetById", e);
    return sendError(res, 500, "Failed to load sponsor pet");
  }
};

/**
 * GET /api/donations/transparency
 */
const getTransparency = async (req, res) => {
  try {
    const paid = await prisma.donation.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    });
    const total = paid._sum.amount || 0;
    const distribution = DEFAULT_FUND_SPLIT.map((row) => ({
      category: row.category,
      percentage: row.percentage,
      amount: Math.round(total * (row.percentage / 100)),
      color: row.color,
    }));
    return sendSuccess(res, 200, "Transparency breakdown", distribution);
  } catch (e) {
    console.error("getTransparency", e);
    return sendError(res, 500, "Failed to load transparency data");
  }
};

/**
 * POST /api/donations  (optional auth)
 */
const createDonation = async (req, res) => {
  try {
    const {
      amount,
      type,
      frequency = "one-time",
      message,
      campaignId,
      sponsorPetId,
      donorName: bodyName,
      donorEmail: bodyEmail,
    } = req.body;

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      return sendError(res, 400, "Valid amount is required");
    }

    const donorName =
      req.user?.fullName?.trim() || (bodyName && String(bodyName).trim());
    const donorEmail =
      req.user?.email?.trim() || (bodyEmail && String(bodyEmail).trim().toLowerCase());

    if (!donorName || !donorEmail) {
      return sendError(res, 400, "Donor name and email are required (sign in or fill the form)");
    }

    let resolvedType = type || "general";
    let designationLabel = "General Rescue Fund";

    if (campaignId) {
      const camp = await prisma.donationCampaign.findUnique({ where: { id: campaignId } });
      if (!camp) return sendError(res, 404, "Campaign not found");
      resolvedType = camp.type;
      designationLabel = camp.title;
    } else if (sponsorPetId) {
      const sp = await prisma.donationSponsorPet.findUnique({ where: { id: sponsorPetId } });
      if (!sp) return sendError(res, 404, "Sponsor pet not found");
      resolvedType = "sponsor";
      designationLabel = `Sponsor: ${sp.name}`;
    } else {
      if (!["general", "rescue"].includes(resolvedType)) {
        resolvedType = "general";
      }
      designationLabel =
        resolvedType === "rescue" ? "Emergency Rescue Fund" : "General Rescue Fund";
    }

    const freqNorm = frequency === "monthly" ? "monthly" : "one-time";

    const autoPaid = process.env.DONATION_SIMULATE_PENDING === "true" ? "pending" : "paid";

    const donation = await prisma.donation.create({
      data: {
        userId: req.user?.id || null,
        donorName,
        donorEmail,
        amount: numAmount,
        type: resolvedType,
        frequency: freqNorm,
        status: autoPaid,
        message: message ? String(message).slice(0, 2000) : null,
        campaignId: campaignId || null,
        sponsorPetId: sponsorPetId || null,
        designationLabel,
        receiptUrl: null,
      },
    });

    return sendSuccess(res, 201, "Thank you for your support", donation);
  } catch (e) {
    console.error("createDonation", e);
    return sendError(res, 500, "Could not process donation");
  }
};

/**
 * GET /api/donations/me
 */
const getMyDonations = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Not authorized");

    const rows = await prisma.donation.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    const data = rows.map((d) => ({
      id: d.id,
      campaignName: d.designationLabel || "Donation",
      type: d.type,
      amount: d.amount,
      status: d.status,
      date: d.createdAt.toISOString(),
      receiptUrl: d.receiptUrl,
    }));

    return sendSuccess(res, 200, "Your donations", data);
  } catch (e) {
    console.error("getMyDonations", e);
    return sendError(res, 500, "Failed to load donations");
  }
};

/**
 * GET /api/donations/receipt/:id
 */
const getReceipt = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Not authorized");
    const { id } = req.params;
    const d = await prisma.donation.findUnique({ where: { id } });
    if (!d || d.userId !== req.user.id) {
      return sendError(res, 404, "Receipt not found");
    }
    return sendSuccess(res, 200, "Receipt", {
      id: d.id,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      amount: d.amount,
      designation: d.designationLabel,
      date: d.createdAt,
      status: d.status,
    });
  } catch (e) {
    console.error("getReceipt", e);
    return sendError(res, 500, "Failed to load receipt");
  }
};

/**
 * GET /api/donations/admin/all
 */
const adminListDonations = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const rows = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    const data = rows.map((d) => ({
      id: d.id,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      campaignName: d.designationLabel || "—",
      type: d.type,
      amount: d.amount,
      status: d.status,
      date: d.createdAt.toISOString(),
    }));
    return sendSuccess(res, 200, "All donations", data);
  } catch (e) {
    console.error("adminListDonations", e);
    return sendError(res, 500, "Failed to load donations");
  }
};

/**
 * GET /api/donations/admin/stats
 */
const adminStats = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const paid = await prisma.donation.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
      _avg: { amount: true },
      _count: { _all: true },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const month = await prisma.donation.aggregate({
      where: { status: "paid", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    });

    const pending = await prisma.donation.aggregate({
      where: { status: "pending" },
      _sum: { amount: true },
    });

    const activeCampaigns = await prisma.donationCampaign.count({
      where: { status: "active" },
    });

    const activeSponsors = await prisma.donation.groupBy({
      by: ["donorEmail"],
      where: { type: "sponsor", status: "paid" },
    });

    const data = {
      totalDonations: paid._sum.amount || 0,
      monthlyTotal: month._sum.amount || 0,
      averageDonation: Math.round(paid._avg.amount || 0),
      activeCampaigns,
      activeSponsors: activeSponsors.length,
      pendingPayments: pending._sum.amount || 0,
      donationCount: paid._count?._all ?? 0,
    };

    return sendSuccess(res, 200, "Stats", data);
  } catch (e) {
    console.error("adminStats", e);
    return sendError(res, 500, "Failed to load stats");
  }
};

/**
 * GET /api/donations/admin/reports/summary
 */
const adminReportsSummary = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const paid = await prisma.donation.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
      _avg: { amount: true },
    });
    const total = paid._sum.amount || 0;

    const distribution = DEFAULT_FUND_SPLIT.map((row) => ({
      category: row.category,
      percentage: row.percentage,
      amount: Math.round(total * (row.percentage / 100)),
      color: row.color,
    }));

    const topCampaigns = await prisma.donationCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    const withRaised = await Promise.all(
      topCampaigns.map(async (c) => {
        const agg = await campaignAggregates(c.id);
        return {
          id: c.id,
          title: c.title,
          raised: agg.raised,
          supporters: agg.supporters,
        };
      })
    );

    withRaised.sort((a, b) => b.raised - a.raised);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthTotal = await prisma.donation.aggregate({
      where: { status: "paid", createdAt: { gte: startOfMonth } },
      _sum: { amount: true },
    });

    return sendSuccess(res, 200, "Report summary", {
      monthlyGross: monthTotal._sum.amount || 0,
      avgGift: Math.round(paid._avg.amount || 0),
      distribution,
      topCampaigns: withRaised.slice(0, 8),
    });
  } catch (e) {
    console.error("adminReportsSummary", e);
    return sendError(res, 500, "Failed to build report");
  }
};

/**
 * PATCH /api/donations/admin/:id/status
 */
const adminUpdateDonationStatus = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "paid", "failed"].includes(status)) {
      return sendError(res, 400, "Invalid status");
    }
    const updated = await prisma.donation.update({
      where: { id },
      data: { status },
    });
    return sendSuccess(res, 200, "Donation updated", updated);
  } catch (e) {
    console.error("adminUpdateDonationStatus", e);
    return sendError(res, 500, "Update failed");
  }
};

/**
 * GET /api/donations/admin/export.csv
 */
const adminExportCsv = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const rows = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
      take: 5000,
    });
    const header = "id,donorName,donorEmail,campaignName,type,amount,status,date\n";
    const lines = rows.map((d) =>
      [
        d.id,
        `"${(d.donorName || "").replace(/"/g, '""')}"`,
        d.donorEmail,
        `"${(d.designationLabel || "").replace(/"/g, '""')}"`,
        d.type,
        d.amount,
        d.status,
        d.createdAt.toISOString(),
      ].join(",")
    );
    const csv = header + lines.join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=donations.csv");
    return res.send(csv);
  } catch (e) {
    console.error("adminExportCsv", e);
    return sendError(res, 500, "Export failed");
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  getCampaignSupporters,
  getSponsorPets,
  getSponsorPetById,
  getTransparency,
  createDonation,
  getMyDonations,
  getReceipt,
  adminListDonations,
  adminStats,
  adminReportsSummary,
  adminUpdateDonationStatus,
  adminExportCsv,
};
