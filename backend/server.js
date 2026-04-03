require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const petRoutes = require("./routes/petRoutes");
const medicalRoutes = require("./routes/medicalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/medical", medicalRoutes);
app.use("/api/dashboard", dashboardRoutes);

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