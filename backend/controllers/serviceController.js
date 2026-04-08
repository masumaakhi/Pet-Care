const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new booking (Mocked for easy testing)
exports.createBooking = async (req, res) => {
    try {
        const {
            providerName,
            type,
            serviceTitle,
            date,
            time,
            petName,
            petType,
            amount,
            providerNotes,
            userId
        } = req.body;

        console.log("\n[Service Backend] -------- NEW SERVICE BOOKING RECEIVED --------");
        console.log("[Service Backend] Booking Details Received:");
        console.log(`- Provider: ${providerName} (${type})`);
        console.log(`- Service: ${serviceTitle}`);
        console.log(`- Pet: ${petName} (${petType})`);
        console.log(`- Schedule: ${date} at ${time}`);
        console.log(`- Amount: ${amount}`);
        console.log(`- Notes: ${providerNotes}`);
        console.log(`- User ID: ${userId || "Anonymous"}`);
        console.log("[Service Backend] Generating Mock Success Response...\n");

        const newBooking = {
            id: "mock-booking-" + Date.now(),
            providerName,
            type,
            serviceTitle,
            date,
            time,
            status: "upcoming",
            petName,
            petType,
            amount,
            providerNotes,
            userId: userId || null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        res.status(201).json({ message: "Booking created successfully (Mocked)", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Failed to create booking" });
    }
};

// Get all bookings (Mocked)
exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.query;

        console.log(`\n[Service Backend] Fetching Bookings (MOCKED) ${userId ? `for User: ${userId}` : "for all users"}`);

        // We can return an empty array or a simple dummy list
        res.status(200).json([]);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

// Get a single booking by ID
exports.getBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma.serviceBooking.findUnique({
            where: { id },
        });

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ error: "Failed to fetch booking details" });
    }
};

// Cancel a booking (Mocked)
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        console.log(`\n[Service Backend] -------- BOOKING CANCELLATION REQUEST --------`);
        console.log(`- Booking ID: ${id}`);
        console.log(`- Cancellation Reason: ${cancelReason || "No reason provided"}`);
        console.log(`[Service Backend] Generating Mock Success Response...\n`);

        res.status(200).json({ message: "Booking cancelled successfully (Mocked)" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({ error: "Failed to cancel booking" });
    }
};

// Submit a review (Mocked)
exports.submitReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, reviewText } = req.body;

        console.log(`\n[Service Backend] -------- NEW PROVIDER REVIEW SUBMITTED --------`);
        console.log(`- Booking ID: ${id}`);
        console.log(`- Rating: ${"⭐".repeat(rating)} (${rating}/5)`);
        console.log(`- Review Content: "${reviewText}"`);
        console.log(`[Service Backend] Generating Mock Success Response...\n`);

        res.status(200).json({ message: "Review submitted successfully (Mocked)" });
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ error: "Failed to submit review" });
    }
};
