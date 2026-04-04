// backend/controllers/adoptionController.js
const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");

const getAdoptions = async (req, res) => {
    try {
        const pets = await prisma.adoptionPet.findMany({
            orderBy: { createdAt: "desc" }
        });
        return sendSuccess(res, 200, "Adoption listings fetched", pets);
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Server Error fetching adoptions");
    }
};

const getAdoptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await prisma.adoptionPet.findUnique({ where: { id } });
        if (!pet) return sendError(res, 404, "Adoption pet not found");
        return sendSuccess(res, 200, "Adoption pet fetched", pet);
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Server Error fetching adoption details");
    }
};

const applyForAdoption = async (req, res) => {
    try {
        const { petId, fullName, email, phone, livingSituation } = req.body;
        const userId = req.user ? req.user.id : null;

        // Ensure the pet exists
        const petExists = await prisma.adoptionPet.findUnique({ where: { id: petId } });
        if (!petExists) return sendError(res, 404, "Adoption pet not found, cannot apply.");

        const application = await prisma.adoptionApplication.create({
            data: {
                adoptionPetId: petId,
                userId,
                fullName,
                email,
                phone,
                livingSituation
            }
        });
        return sendSuccess(res, 201, "Application submitted successfully", application);
    } catch (error) {
        console.error(error);
        return sendError(res, 500, "Server Error submitting application");
    }
};

module.exports = {
    getAdoptions,
    getAdoptionById,
    applyForAdoption
};
