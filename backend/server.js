const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();


// Parse JSON body
app.use(express.json());

// Enable CORS (allow frontend to call backend)
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);

// ==================== ROUTES ====================

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "EduSphere API is running 🚀",
        timestamp: new Date().toISOString(),
    });
});

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Student routes
app.use("/api/student", require("./routes/studentRoutes"));

// Admin routes
app.use("/api/admin", require("./routes/adminRoutes"));

// Faculty routes
app.use("/api/faculty", require("./routes/facultyRoutes"));

// Warden routes
app.use("/api/warden", require("./routes/wardenRoutes"));

// Parent routes
app.use("/api/parent", require("./routes/parentRoutes"));

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 EduSphere API Server running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}\n`);
});
