const express = require("express");
const {
    createBooking,
    getUserBookings,
    getBookingDetails,
    cancelBooking,
    submitReview
} = require("../controllers/serviceController");

const router = express.Router();

// Route to create a new booking
router.post("/bookings", createBooking);

// Route to get all bookings for a user
router.get("/bookings", getUserBookings);

// Route to get a specific booking's details
router.get("/bookings/:id", getBookingDetails);

// Route to cancel a booking
router.patch("/bookings/:id/cancel", cancelBooking);

// Route to submit a review for a booking
router.patch("/bookings/:id/review", submitReview);

module.exports = router;
