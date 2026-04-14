//backend/routes/petRoutes.js
const express = require("express");
const { 
  createPet, 
  getPets, 
  getPetById, 
  updatePet,
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

// Must be before "/:id" so "admin" is not captured as an id
router.get("/admin/all", adminGetAllPets);
router.patch("/admin/status/:id", adminUpdatePetStatus);

router.route("/:id")
  .get(getPetById)
  .patch(updatePet)
  .delete(deletePet);

router.route("/:id/schedules")
  .get(getPetSchedules)
  .post(createSchedule);

router.route("/schedules/:scheduleId")
  .put(updateSchedule)
  .delete(deleteSchedule);

router.route("/:id/weights")
  .get(getPetWeightLogs)
  .post(createWeightLog);

router.route("/weights/:logId")
  .put(updateWeightLog)
  .delete(deleteWeightLog);

router.route("/:id/gallery")
  .get(getPetGallery)
  .post(upload.single("photo"), uploadPetPhoto);

router.delete("/gallery/:photoId", deletePetPhoto);

module.exports = router;
