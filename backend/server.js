// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const rescueRoutes = require("./routes/rescueRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const donationRoutes = require("./routes/donationRoutes");
const communityRoutes = require("./routes/communityRoutes");
const adminDataRoutes = require("./routes/adminDataRoutes");

const path = require("path");
const http = require("http");
const socketService = require("./services/SocketService");

const app = express();
const server = http.createServer(app);

// Initialize Socket Service
socketService.init(server);

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://pet-care-frontpage.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/medical", medicalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/rescues", rescueRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/admin/data", adminDataRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Pet Care Backend Directory 🔥");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});