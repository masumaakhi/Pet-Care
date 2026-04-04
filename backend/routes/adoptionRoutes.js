// backend/routes/adoptionRoutes.js
const express = require("express");
const router = express.Router();
const adoptionController = require("../controllers/adoptionController");

// If you want middleware, import it: (const { protect } = require("../middleware/authMiddleware");)
// But to ensure it works interchangeably for any caller right now, we keep it standard:

// GET /api/adoptions -> Fetch all
router.get("/", adoptionController.getAdoptions);

// GET /api/adoptions/:id -> Fetch single adoption
router.get("/:id", adoptionController.getAdoptionById);

// POST /api/adoptions/apply -> Submit form
router.post("/apply", adoptionController.applyForAdoption);

module.exports = router;
