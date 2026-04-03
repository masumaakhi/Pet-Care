// backend/controllers/medicalController.js
const prisma = require("../prisma/prismaClient");
const { sendSuccess, sendError } = require("../utils/response");

/* --- Vaccination Controllers --- */

const getVaccinations = async (req, res) => {
  try {
    const { petId } = req.query;
    const where = { ownerId: req.user.id };
    if (petId) where.petId = petId;

    const vaccinations = await prisma.vaccination.findMany({
      where,
      include: { pet: { select: { name: true } } },
      orderBy: { givenDate: "desc" },
    });
    return sendSuccess(res, 200, "Vaccinations fetched", vaccinations);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

const addVaccination = async (req, res) => {
  try {
    const { petId, vaccineName, dose, givenDate, nextDueDate, vetName, reminder } = req.body;
    
    const vaccination = await prisma.vaccination.create({
      data: {
        vaccineName,
        dose,
        givenDate: new Date(givenDate),
        nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
        vetName,
        reminder: reminder === "true" || reminder === true,
        petId,
        ownerId: req.user.id,
        status: "Completed", // Default
        proofUrl: req.file ? `/uploads/pets/${req.file.filename}` : null,
      },
    });
    return sendSuccess(res, 201, "Vaccination added", vaccination);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

const deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vaccination.delete({ where: { id, ownerId: req.user.id } });
    return sendSuccess(res, 200, "Vaccination deleted");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/* --- Medical records Controllers --- */

const getMedicalHistory = async (req, res) => {
  try {
    const { petId } = req.query;
    const where = { ownerId: req.user.id };
    if (petId) where.petId = petId;

    const records = await prisma.medicalRecord.findMany({
      where,
      include: { pet: { select: { name: true } } },
      orderBy: { date: "desc" },
    });
    return sendSuccess(res, 200, "Medical history fetched", records);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

const addMedicalRecord = async (req, res) => {
  try {
    const { petId, date, diagnosis, treatment, vet, followUp, cost, emergency } = req.body;

    const record = await prisma.medicalRecord.create({
      data: {
        date: new Date(date),
        diagnosis,
        treatment,
        vet,
        followUp: followUp ? new Date(followUp) : null,
        cost: parseFloat(cost || 0),
        emergency: emergency === "true" || emergency === true,
        petId,
        ownerId: req.user.id,
        reportUrl: req.file ? `/uploads/pets/${req.file.filename}` : null,
      },
    });
    return sendSuccess(res, 201, "Medical record added", record);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.medicalRecord.delete({ where: { id, ownerId: req.user.id } });
    return sendSuccess(res, 200, "Record deleted");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

/* --- Prescription Controllers --- */

const getPrescriptions = async (req, res) => {
  try {
    const { petId } = req.query;
    const where = { ownerId: req.user.id };
    if (petId) where.petId = petId;

    const prescriptions = await prisma.prescription.findMany({
      where,
      include: { pet: { select: { name: true } } },
      orderBy: { date: "desc" },
    });
    return sendSuccess(res, 200, "Prescriptions fetched", prescriptions);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

const addPrescription = async (req, res) => {
  try {
    const { petId, date, vet, medicines, notes } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        date: new Date(date),
        vet,
        notes,
        medicines: medicines ? JSON.parse(medicines) : [],
        petId,
        ownerId: req.user.id,
        fileName: req.file ? req.file.originalname : null,
        fileUrl: req.file ? `/uploads/pets/${req.file.filename}` : null,
      },
    });
    return sendSuccess(res, 201, "Prescription added", prescription);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.prescription.delete({ where: { id, ownerId: req.user.id } });
    return sendSuccess(res, 200, "Prescription deleted");
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "Server Error");
  }
};

module.exports = {
  getVaccinations,
  addVaccination,
  deleteVaccination,
  getMedicalHistory,
  addMedicalRecord,
  deleteMedicalRecord,
  getPrescriptions,
  addPrescription,
  deletePrescription,
};
