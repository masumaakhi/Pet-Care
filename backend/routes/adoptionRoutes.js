// backend/routes/adoptionRoutes.js
const express = require("express");
const router = express.Router();
const adoptionController = require("../controllers/adoptionController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", adoptionController.getAdoptions);

// Admin routes (before /:id so paths like /admin/all are never captured as an id)
router.get("/admin/all", protect, adoptionController.adminGetAllAdoptions);
router.get("/admin/applications", protect, adoptionController.adminGetAllAdoptionApplications);
router.patch("/admin/status/:id", protect, adoptionController.updateAdoptionStatus);
router.patch(
  "/admin/application-status/:applicationId",
  protect,
  adoptionController.updateApplicationStatus
);
router.post(
  "/admin/listing",
  protect,
  upload.single("image"),
  adoptionController.adminCreateListing
);

router.get("/:id", optionalProtect, adoptionController.getAdoptionById);

// Protected routes
router.get("/my/listings", protect, adoptionController.getMyAdoptionListings);
router.get("/my/applications", protect, adoptionController.getMyAdoptionApplications);
router.post("/request/:petId", protect, adoptionController.requestAdoption);
router.post("/apply", protect, adoptionController.applyForAdoption);

module.exports = router;
