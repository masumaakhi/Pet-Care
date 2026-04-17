//backend/controllers/petController.js
const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");
const { getUploadedFileUrl } = require("../utils/uploadUrl");

/**
 * @desc    Create a new pet
 * @route   POST /api/pets
 * @access  Private
 */
const createPet = async (req, res) => {
  try {
    const { name, species, breed, age_months, gender, weight_kg, description, isForAdoption } = req.body;

    if (!name || !species || !breed || !age_months || !gender || !weight_kg) {
      return sendError(res, 400, "Please provide all required fields");
    }

    const isAdmin = req.user.role === "admin";
    const listingApproved = Boolean(isForAdoption && isAdmin);

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        age_months: parseInt(age_months),
        gender,
        weight_kg: parseFloat(weight_kg),
        description,
        ownerId: req.user.id,
        status: isAdmin ? "APPROVED" : "PENDING",
        adoptionStatus: isForAdoption ? (listingApproved ? "APPROVED" : "PENDING") : "NONE",
      },
    });

    if (isForAdoption) {
      await prisma.adoptionPet.create({
        data: {
          name: pet.name,
          type: pet.species,
          breed: pet.breed,
          age: pet.age_months.toString() + " months",
          gender: pet.gender,
          image: null,
          petId: pet.id,
          ownerId: req.user.id,
          status: listingApproved ? "APPROVED" : "PENDING",
          tag: listingApproved ? "Available for Adoption" : "Pending Approval",
        },
      });
    }

    const msg =
      "Pet created successfully" +
      (isForAdoption
        ? listingApproved
          ? " and published on adoption listing"
          : " and adoption request sent for admin review"
        : "");
    return sendSuccess(res, 201, msg, pet);
  } catch (error) {
    console.error("Create Pet Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get all pets for logged-in user
 * @route   GET /api/pets
 * @access  Private
 */
const getPets = async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== "admin" && req.user.role !== "vet") {
      where.ownerId = req.user.id;
    }

    const pets = await prisma.pet.findMany({
      where,
      include: {
        photos: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: {
          select: { weightLogs: true, schedules: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, 200, "Pets fetched successfully", pets);
  } catch (error) {
    console.error("Get Pets Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get single pet details
 * @route   GET /api/pets/:id
 * @access  Private (Owner only)
 */
const getPetById = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { photos: { orderBy: { createdAt: "desc" } } },
    });

    if (!pet) {
      return sendError(res, 404, "Pet not found");
    }

    if (pet.ownerId !== req.user.id && req.user.role !== "admin") {
      return sendError(res, 403, "Not authorized to access this pet");
    }

    return sendSuccess(res, 200, "Pet fetched successfully", pet);
  } catch (error) {
    console.error("Get Pet By ID Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Update pet details
 * @route   PATCH /api/pets/:id
 * @access  Private (Owner only)
 */
const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if pet exists and user owns it
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return sendError(res, 404, "Pet not found");
    }

    if (pet.ownerId !== req.user.id) {
      return sendError(res, 403, "Not authorized to update this pet");
    }

    // Sanitize numeric fields if they exist in update body
    if (updateData.age_months) updateData.age_months = parseInt(updateData.age_months);
    if (updateData.weight_kg) updateData.weight_kg = parseFloat(updateData.weight_kg);

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(res, 200, "Pet updated successfully", updatedPet);
  } catch (error) {
    console.error("Update Pet Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Delete pet
 * @route   DELETE /api/pets/:id
 * @access  Private (Owner only)
 */
const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if pet exists and user owns it
    const pet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!pet) {
      return sendError(res, 404, "Pet not found");
    }

    if (pet.ownerId !== req.user.id) {
      return sendError(res, 403, "Not authorized to delete this pet");
    }

    await prisma.pet.delete({
      where: { id },
    });

    return sendSuccess(res, 200, "Pet deleted successfully");
  } catch (error) {
    console.error("Delete Pet Error:", error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get schedules for a pet
 * @route   GET /api/pets/:id/schedules
 */
const getPetSchedules = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { schedules: { orderBy: { scheduled_date: "asc" } } },
    });

    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    return sendSuccess(res, 200, "Schedules fetched", pet.schedules);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Create schedule for a pet
 * @route   POST /api/pets/:id/schedules
 */
const createSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, scheduled_date, scheduled_time, frequency, notes } = req.body;

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    const schedule = await prisma.schedule.create({
      data: {
        type,
        title,
        scheduled_date: new Date(scheduled_date),
        scheduled_time,
        frequency,
        notes,
        petId: id,
        ownerId: req.user.id,
      },
    });

    return sendSuccess(res, 201, "Schedule created", schedule);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Get weight logs for a pet
 * @route   GET /api/pets/:id/weights
 */
const getPetWeightLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { weightLogs: { orderBy: { date: "asc" } } },
    });

    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    return sendSuccess(res, 200, "Weight logs fetched", pet.weightLogs);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Create weight log for a pet
 * @route   POST /api/pets/:id/weights
 */
const createWeightLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight_kg, date, note } = req.body;

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    const weightLog = await prisma.weightLog.create({
      data: {
        weight_kg: parseFloat(weight_kg),
        date: date ? new Date(date) : new Date(),
        note,
        petId: id,
        ownerId: req.user.id,
      },
    });

    // Optionally update pet main weight
    await prisma.pet.update({
      where: { id },
      data: { weight_kg: parseFloat(weight_kg) },
    });

    return sendSuccess(res, 201, "Weight log created", weightLog);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Upload pet photo
 * @route   POST /api/pets/:id/gallery
 */
const uploadPetPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return sendError(res, 400, "No photo uploaded");
    }

    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    // Construct URL (Relative for static serving)
    const fallbackPhotoUrl = req.file.filename ? `/uploads/pets/${req.file.filename}` : null;
    const photoUrl = getUploadedFileUrl(req.file, fallbackPhotoUrl);

    const photo = await prisma.petPhoto.create({
      data: {
        url: photoUrl,
        petId: id,
        ownerId: req.user.id,
      },
    });

    await prisma.adoptionPet.updateMany({
      where: { petId: id },
      data: { image: photoUrl },
    });

    return sendSuccess(res, 201, "Photo uploaded successfully", photo);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Get pet gallery
 * @route   GET /api/pets/:id/gallery
 */
const getPetGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { photos: { orderBy: { createdAt: "desc" } } },
    });

    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    return sendSuccess(res, 200, "Gallery fetched", pet.photos);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Delete pet photo
 * @route   DELETE /api/pets/gallery/:photoId
 */
const deletePetPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const fs = require("fs");
    const path = require("path");

    const photo = await prisma.petPhoto.findUnique({
      where: { id: photoId },
    });

    if (!photo) return sendError(res, 404, "Photo not found");
    if (photo.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    // Remove from disk
    if (photo.url && !/^https?:\/\//i.test(photo.url)) {
      const filePath = path.join(__dirname, "..", photo.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove from DB
    await prisma.petPhoto.delete({
      where: { id: photoId },
    });

    return sendSuccess(res, 200, "Photo deleted");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Get all pets for admin moderation
 * @route   GET /api/pets/admin/all
 * @access  Admin only
 */
const adminGetAllPets = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return sendError(res, 403, "Forbidden: Admin access only");
    }

    const pets = await prisma.pet.findMany({
      include: {
        photos: { orderBy: { createdAt: "desc" }, take: 1 },
        owner: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, 200, "All pets fetched for moderation", pets);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Update pet status (Approve/Reject/Flag)
 * @route   PATCH /api/pets/admin/status/:id
 * @access  Admin only
 */
const adminUpdatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (req.user.role !== "admin") {
      return sendError(res, 403, "Forbidden: Admin access only");
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: { status },
    });

    return sendSuccess(res, 200, `Pet status updated to ${status}`, pet);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Get vaccination records for a pet
 * @route   GET /api/pets/:id/vaccines
 * @access  Private (Owner only)
 */
const getPetVaccines = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { vaccinations: { orderBy: { givenDate: "desc" } } },
    });

    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Not authorized");

    return sendSuccess(res, 200, "Vaccinations fetched", pet.vaccinations);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get medical history for a pet
 * @route   GET /api/pets/:id/medical
 * @access  Private (Owner only)
 */
const getPetMedicalRecords = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { medicalRecords: { orderBy: { date: "desc" } } },
    });

    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Not authorized");

    return sendSuccess(res, 200, "Medical history fetched", pet.medicalRecords);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Get prescriptions for a pet
 * @route   GET /api/pets/:id/prescriptions
 * @access  Private (Owner only)
 */
const getPetPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { prescriptions: { orderBy: { date: "desc" } } },
    });

    if (!pet) return sendError(res, 404, "Pet not found");
    if (pet.ownerId !== req.user.id) return sendError(res, 403, "Not authorized");

    return sendSuccess(res, 200, "Prescriptions fetched", pet.prescriptions);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Internal Server Error");
  }
};

/**
 * @desc    Update care schedule
 * @route   PUT /api/pets/schedules/:scheduleId
 */
const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { type, title, scheduled_date, scheduled_time, frequency, notes } = req.body;

    const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) return sendError(res, 404, "Schedule not found");
    if (schedule.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    const updated = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        type,
        title,
        scheduled_date: scheduled_date ? new Date(scheduled_date) : undefined,
        scheduled_time,
        frequency,
        notes,
      },
    });

    return sendSuccess(res, 200, "Schedule updated", updated);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Delete care schedule
 * @route   DELETE /api/pets/schedules/:scheduleId
 */
const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await prisma.schedule.findUnique({ where: { id: scheduleId } });
    if (!schedule) return sendError(res, 404, "Schedule not found");
    if (schedule.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    await prisma.schedule.delete({ where: { id: scheduleId } });

    return sendSuccess(res, 200, "Schedule deleted");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Update weight log
 * @route   PUT /api/pets/weights/:logId
 */
const updateWeightLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const { weight_kg, date, note } = req.body;

    const log = await prisma.weightLog.findUnique({ where: { id: logId } });
    if (!log) return sendError(res, 404, "Weight log not found");
    if (log.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    const updated = await prisma.weightLog.update({
      where: { id: logId },
      data: {
        weight_kg: weight_kg ? parseFloat(weight_kg) : undefined,
        date: date ? new Date(date) : undefined,
        note,
      },
    });

    return sendSuccess(res, 200, "Weight log updated", updated);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/**
 * @desc    Delete weight log
 * @route   DELETE /api/pets/weights/:logId
 */
const deleteWeightLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const log = await prisma.weightLog.findUnique({ where: { id: logId } });
    if (!log) return sendError(res, 404, "Weight log not found");
    if (log.ownerId !== req.user.id) return sendError(res, 403, "Forbidden");

    await prisma.weightLog.delete({ where: { id: logId } });

    return sendSuccess(res, 200, "Weight log deleted");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

module.exports = {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  getPetSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getPetWeightLogs,
  createWeightLog,
  updateWeightLog,
  deleteWeightLog,
  uploadPetPhoto,
  getPetGallery,
  deletePetPhoto,
  adminGetAllPets,
  adminUpdatePetStatus,
  getPetVaccines,
  getPetMedicalRecords,
  getPetPrescriptions,
};
