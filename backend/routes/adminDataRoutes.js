const express = require("express");
const router = express.Router();
const { 
  getAllRecords, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} = require("../controllers/adminDataController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All routes require authentication and admin/owner role
router.use(protect, authorize("admin", "owner"));

router.route("/:model")
  .get(getAllRecords)
  .post(createRecord);

router.route("/:model/:id")
  .patch(updateRecord)
  .delete(deleteRecord);

module.exports = router;
