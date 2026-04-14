// backend/routes/donationRoutes.js
const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");

router.get("/me", protect, donationController.getMyDonations);
router.get("/receipt/:id", protect, donationController.getReceipt);

router.get("/campaigns", donationController.getCampaigns);
router.get("/campaigns/:id/supporters", donationController.getCampaignSupporters);
router.get("/campaigns/:id", donationController.getCampaignById);

router.get("/sponsor-pets", donationController.getSponsorPets);
router.get("/sponsor-pets/:id", donationController.getSponsorPetById);

router.get("/transparency", donationController.getTransparency);

router.get("/admin/all", protect, donationController.adminListDonations);
router.get("/admin/stats", protect, donationController.adminStats);
router.get("/admin/reports/summary", protect, donationController.adminReportsSummary);
router.get("/admin/export", protect, donationController.adminExportCsv);
router.patch("/admin/:id/status", protect, donationController.adminUpdateDonationStatus);

router.post("/", optionalProtect, donationController.createDonation);

module.exports = router;
