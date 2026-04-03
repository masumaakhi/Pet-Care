//backend/routes/petRoutes.js
const express = require("express");
const { 
  createPet, 
  getPets, 
  getPetById, 
  updatePet,
  getPetSchedules,
  createSchedule,
  getPetWeightLogs,
  createWeightLog,
  uploadPetPhoto,
  getPetGallery,
  deletePetPhoto,
  deletePet,
  adminGetAllPets,
  adminUpdatePetStatus,
  getPetVaccines,
  getPetMedicalRecords,
  getPetPrescriptions
} = require("../controllers/petController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router.route("/")
  .post(createPet)
  .get(getPets);

router.route("/:id")
  .get(getPetById)
  .patch(updatePet)
  .delete(deletePet);

router.route("/:id/schedules")
  .get(getPetSchedules)
  .post(createSchedule);

router.route("/:id/weights")
  .get(getPetWeightLogs)
  .post(createWeightLog);

router.route("/:id/gallery")
  .get(getPetGallery)
  .post(upload.single("photo"), uploadPetPhoto);

router.get("/:id/vaccines", getPetVaccines);
router.get("/:id/medical", getPetMedicalRecords);
router.get("/:id/prescriptions", getPetPrescriptions);

router.delete("/gallery/:photoId", deletePetPhoto);

// Admin Routes
router.get("/admin/all", adminGetAllPets);
router.patch("/admin/status/:id", adminUpdatePetStatus);

module.exports = router;
