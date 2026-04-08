require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const path = require("path");

const app = express();

// Middleware
// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://pet-care-frontpage.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
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

// Root route for testing
app.get("/", (req, res) => {
  res.send("Pet Care Backend Directory 🔥");
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});