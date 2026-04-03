// backend/routes/medicalRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getVaccinations,
  addVaccination,
  deleteVaccination,
  getMedicalHistory,
  addMedicalRecord,
  deleteMedicalRecord,
  getPrescriptions,
  addPrescription,
  deletePrescription,
} = require("../controllers/medicalController");

const router = express.Router();

router.use(protect);

// Vaccination Routes
router.route("/vaccines")
  .get(getVaccinations)
  .post(upload.single("proof"), addVaccination);

router.delete("/vaccines/:id", deleteVaccination);

// Medical History Routes
router.route("/history")
  .get(getMedicalHistory)
  .post(upload.single("report"), addMedicalRecord);

router.delete("/history/:id", deleteMedicalRecord);

// Prescription Routes
router.route("/prescriptions")
  .get(getPrescriptions)
  .post(upload.single("file"), addPrescription);

router.delete("/prescriptions/:id", deletePrescription);

module.exports = router;
