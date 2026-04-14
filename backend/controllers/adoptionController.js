// backend/controllers/adoptionController.js
const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");

/**
 * @desc    Request to list a pet for adoption
 * @route   POST /api/adoptions/request/:petId
 * @access  Private (Owner only)
 */
const requestAdoption = async (req, res) => {
    try {
        const { petId } = req.params;

        const pet = await prisma.pet.findUnique({ where: { id: petId } });

        if (!pet) return sendError(res, 404, "Pet not found");
        if (pet.ownerId !== req.user.id) return sendError(res, 403, "Not authorized");

        const firstPhoto = await prisma.petPhoto.findFirst({
            where: { petId: pet.id },
            orderBy: { createdAt: "desc" },
        });
        const imageUrl = firstPhoto?.url || null;

        const existing = await prisma.adoptionPet.findUnique({ where: { petId } });

        if (existing) {
            if (existing.status === "REJECTED") {
                const listing = await prisma.adoptionPet.update({
                    where: { id: existing.id },
                    data: {
                        name: pet.name,
                        type: pet.species,
                        breed: pet.breed,
                        age: pet.age_months.toString() + " months",
                        gender: pet.gender,
                        image: imageUrl ?? existing.image,
                        status: "PENDING",
                        tag: "Pending Approval",
                    },
                });
                await prisma.pet.update({
                    where: { id: petId },
                    data: { adoptionStatus: "PENDING" },
                });
                return sendSuccess(res, 200, "Adoption request re-submitted to Admin", listing);
            }
            if (existing.status === "PENDING") {
                return sendError(res, 400, "An adoption request for this pet is already pending review");
            }
            if (existing.status === "APPROVED") {
                return sendError(res, 400, "This pet is already listed for adoption");
            }
            if (existing.status === "ADOPTED") {
                return sendError(res, 400, "This pet is already marked as adopted");
            }
            return sendError(res, 400, "Cannot submit adoption request for this pet");
        }

        await prisma.pet.update({
            where: { id: petId },
            data: { adoptionStatus: "PENDING" },
        });

        const listing = await prisma.adoptionPet.create({
            data: {
                name: pet.name,
                type: pet.species,
                breed: pet.breed,
                age: pet.age_months.toString() + " months",
                gender: pet.gender,
                image: imageUrl,
                petId: pet.id,
                ownerId: req.user.id,
                status: "PENDING",
                tag: "Pending Approval",
            },
        });

        return sendSuccess(res, 201, "Adoption request submitted to Admin", listing);
    } catch (error) {
        console.error("Request Adoption Error:", error);
        return sendError(res, 500, "Internal Server Error");
    }
};

/**
 * @desc    Admin: Create adoption listing (live immediately, or link existing pet)
 * @route   POST /api/adoptions/admin/listing
 * @access  Admin
 */
const adminCreateListing = async (req, res) => {
    try {
        if (req.user.role !== "admin") return sendError(res, 403, "Admin only");

        let image = null;
        if (req.file?.filename) {
            image = `/uploads/adoptions/${req.file.filename}`;
        }

        const rawPetId = req.body.petId;
        const petId =
            rawPetId != null && String(rawPetId).trim() !== ""
                ? String(rawPetId).trim()
                : null;
        if (petId) {
            const pet = await prisma.pet.findUnique({ where: { id: petId } });
            if (!pet) return sendError(res, 404, "Pet not found");

            const dup = await prisma.adoptionPet.findUnique({ where: { petId } });
            if (dup) return sendError(res, 400, "This pet already has an adoption listing");

            const firstPhoto = await prisma.petPhoto.findFirst({
                where: { petId },
                orderBy: { createdAt: "desc" },
            });

            const listing = await prisma.adoptionPet.create({
                data: {
                    name: pet.name,
                    type: pet.species,
                    breed: pet.breed,
                    age: pet.age_months.toString() + " months",
                    gender: pet.gender,
                    size: req.body.size?.trim?.() || null,
                    image: image || firstPhoto?.url || null,
                    petId: pet.id,
                    ownerId: pet.ownerId || req.user.id,
                    status: "APPROVED",
                    tag: "Available for Adoption",
                },
            });

            await prisma.pet.update({
                where: { id: petId },
                data: { adoptionStatus: "APPROVED" },
            });

            return sendSuccess(res, 201, "Adoption listing published", listing);
        }

        const { name, type, breed, age, gender } = req.body;
        if (!name || !type || !breed || !age || !gender) {
            return sendError(res, 400, "Provide name, type, breed, age, and gender (or petId to link a pet)");
        }

        const listing = await prisma.adoptionPet.create({
            data: {
                name: String(name).trim(),
                type: String(type).trim(),
                breed: String(breed).trim(),
                age: String(age).trim(),
                gender: String(gender).trim(),
                size: req.body.size?.trim?.() || null,
                image,
                petId: null,
                ownerId: req.user.id,
                status: "APPROVED",
                tag: "Available for Adoption",
            },
        });

        return sendSuccess(res, 201, "Adoption listing published", listing);
    } catch (error) {
        console.error("Admin Create Listing Error:", error);
        return sendError(res, 500, "Internal Server Error");
    }
};

/**
 * @desc    Get all approved adoption listings
 * @route   GET /api/adoptions
 * @access  Public
 */
const getAdoptions = async (req, res) => {
    try {
        const adoptions = await prisma.adoptionPet.findMany({
            where: { status: "APPROVED" },
            include: {
                pet: {
                    include: {
                        photos: { orderBy: { createdAt: "desc" }, take: 1 }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return sendSuccess(res, 200, "Adoption listings fetched", adoptions);
    } catch (error) {
        console.error("Get Adoptions Error:", error);
        return sendError(res, 500, "Server Error fetching adoptions");
    }
};

/**
 * @desc    Admin: Get all adoption listings for moderation
 * @route   GET /api/adoptions/admin/all
 * @access  Admin
 */
const adminGetAllAdoptions = async (req, res) => {
    try {
        if (req.user.role !== "admin") return sendError(res, 403, "Admin only");

        const adoptions = await prisma.adoptionPet.findMany({
            include: {
                pet: {
                    include: {
                        photos: { orderBy: { createdAt: "desc" }, take: 1 }
                    }
                },
                applications: true
            },
            orderBy: { createdAt: "desc" }
        });
        return sendSuccess(res, 200, "All adoptions fetched for admin", adoptions);
    } catch (error) {
        console.error("Admin Get Adoptions Error:", error);
        return sendError(res, 500, "Server Error");
    }
};

/**
 * @desc    Get single adoption details
 * @route   GET /api/adoptions/:id
 * @access  Public
 */
const getAdoptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const adoption = await prisma.adoptionPet.findUnique({
            where: { id },
            include: {
                pet: {
                    include: {
                        photos: { orderBy: { createdAt: "desc" } }
                    }
                },
                applications: true
            }
        });

        if (!adoption) return sendError(res, 404, "Adoption listing not found");

        const isApproved = adoption.status === "APPROVED";
        const uid = req.user?.id;
        const isAdmin = req.user?.role === "admin";
        const isOwner = adoption.ownerId && uid && adoption.ownerId === uid;

        if (!isApproved && !isAdmin && !isOwner) {
            return sendError(res, 404, "Adoption listing not found");
        }

        return sendSuccess(res, 200, "Adoption details fetched", adoption);
    } catch (error) {
        console.error("Get Adoption By ID Error:", error);
        return sendError(res, 500, "Server Error fetching adoption details");
    }
};

/**
 * @desc    Admin: Approve/Reject adoption listing
 * @route   PATCH /api/adoptions/admin/status/:id
 * @access  Admin
 */
const updateAdoptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED, REJECTED, ADOPTED

        if (req.user.role !== "admin") return sendError(res, 403, "Admin only");

        const tag =
            status === "APPROVED"
                ? "Available for Adoption"
                : status === "PENDING"
                  ? "Pending Approval"
                  : status === "REJECTED"
                    ? "Rejected"
                    : status === "ADOPTED"
                      ? "Adopted"
                      : status;

        const listing = await prisma.adoptionPet.update({
            where: { id },
            data: { 
                status,
                tag
            },
            include: { pet: true }
        });

        // Also update the main Pet model's status
        if (listing.petId) {
            await prisma.pet.update({
                where: { id: listing.petId },
                data: { adoptionStatus: status }
            });
        }

        return sendSuccess(res, 200, `Listing status updated to ${status}`, listing);
    } catch (error) {
        console.error("Update Adoption Status Error:", error);
        return sendError(res, 500, "Server Error");
    }
};

/**
 * @desc    Apply for adoption
 * @route   POST /api/adoptions/apply
 * @access  Private
 */
const applyForAdoption = async (req, res) => {
    try {
        const { petId, fullName, email, phone, livingSituation } = req.body;
        const userId = req.user.id;

        if (!petId || !fullName || !email || !phone || !livingSituation) {
            return sendError(res, 400, "Please provide petId, fullName, email, phone, and livingSituation");
        }

        const listing = await prisma.adoptionPet.findUnique({ where: { id: petId } });
        if (!listing) {
            return sendError(res, 404, "Adoption listing not found");
        }
        if (listing.status !== "APPROVED") {
            return sendError(res, 400, "This pet is not open for applications yet");
        }

        const application = await prisma.adoptionApplication.create({
            data: {
                adoptionPetId: petId,
                userId,
                fullName,
                email,
                phone,
                livingSituation,
                status: "PENDING"
            }
        });

        return sendSuccess(res, 201, "Application submitted successfully", application);
    } catch (error) {
        console.error("Apply For Adoption Error:", error);
        return sendError(res, 500, "Server Error submitting application");
    }
};

module.exports = {
    requestAdoption,
    getAdoptions,
    getAdoptionById,
    adminGetAllAdoptions,
    adminCreateListing,
    updateAdoptionStatus,
    applyForAdoption
};
