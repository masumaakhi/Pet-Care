const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * Supported Models Mapping
 */
const modelMap = {
  user: prisma.user,
  pet: prisma.pet,
  adoptionpet: prisma.adoptionPet,
  adoptionapplication: prisma.adoptionApplication,
  rescuerequest: prisma.rescueRequest,
  donation: prisma.donation,
  donationcampaign: prisma.donationCampaign,
  donationsponsorpet: prisma.donationSponsorPet,
  servicebooking: prisma.serviceBooking,
  communitypost: prisma.communityPost,
};

/**
 * @desc    Get all records for a model with search
 * @route   GET /api/admin/data/:model
 */
const getAllRecords = async (req, res) => {
  try {
    const { model } = req.params;
    const { q, page = 1, limit = 50 } = req.query;
    const targetModel = modelMap[model.toLowerCase()];

    if (!targetModel) return sendError(res, 400, "Unsupported model");

    const where = {};
    if (q) {
      // Basic text search for common fields
      where.OR = [
        { id: { contains: q, mode: "insensitive" } },
      ];
      // Model specific search fields
      if (model === "user") where.OR.push({ fullName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } });
      if (model === "pet" || model === "adoptionpet") where.OR.push({ name: { contains: q, mode: "insensitive" } });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [total, records] = await Promise.all([
      targetModel.count({ where }),
      targetModel.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        // Simple include for visibility
        ...(model === "pet" && { include: { owner: { select: { fullName: true } }, photos: { take: 1 } } }),
        ...(model === "adoptionpet" && { include: { pet: true } }),
        ...(model === "adoptionapplication" && { include: { adoptionPet: true, user: true } }),
        ...(model === "rescuerequest" && { include: { reporter: { select: { fullName: true } } } }),
        ...(model === "communitypost" && { include: { author: { select: { fullName: true } } } }),
      }),
    ]);

    return sendSuccess(res, 200, `${model} records fetched`, {
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error(`AdminData GET ${req.params.model} Error:`, error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Create a record
 * @route   POST /api/admin/data/:model
 */
const createRecord = async (req, res) => {
  try {
    const { model } = req.params;
    const targetModel = modelMap[model.toLowerCase()];
    if (!targetModel) return sendError(res, 400, "Unsupported model");

    const record = await targetModel.create({
      data: req.body,
    });

    return sendSuccess(res, 201, `${model} record created successfully`, record);
  } catch (error) {
    console.error(`AdminData POST ${req.params.model} Error:`, error);
    return sendError(res, 400, "Failed to create record. Check field types and constraints.");
  }
};

/**
 * @desc    Update a record
 * @route   PATCH /api/admin/data/:model/:id
 */
const updateRecord = async (req, res) => {
  try {
    const { model, id } = req.params;
    const targetModel = modelMap[model.toLowerCase()];
    if (!targetModel) return sendError(res, 400, "Unsupported model");

    const record = await targetModel.update({
      where: { id },
      data: req.body,
    });

    return sendSuccess(res, 200, `${model} record updated successfully`, record);
  } catch (error) {
    console.error(`AdminData PATCH ${req.params.model} Error:`, error);
    return sendError(res, 400, "Failed to update record.");
  }
};

/**
 * @desc    Delete a record
 * @route   DELETE /api/admin/data/:model/:id
 */
const deleteRecord = async (req, res) => {
  try {
    const { model, id } = req.params;
    const targetModel = modelMap[model.toLowerCase()];
    if (!targetModel) return sendError(res, 400, "Unsupported model");

    await targetModel.delete({
      where: { id },
    });

    return sendSuccess(res, 200, `${model} record deleted successfully`);
  } catch (error) {
    console.error(`AdminData DELETE ${req.params.model} Error:`, error);
    return sendError(res, 400, "Failed to delete record. It may be referenced by other data.");
  }
};

module.exports = {
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};
