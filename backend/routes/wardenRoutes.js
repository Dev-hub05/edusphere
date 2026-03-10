const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getDashboardStats,
    getGatepasses,
    updateGatepassStatus,
    getHostelLogs,
    getGrievances,
    respondToGrievance,
} = require("../controllers/wardenController");

// All routes below require: logged in + warden role
router.use(protect, authorize("warden"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Gatepass Management
router.get("/gatepasses", getGatepasses);
router.put("/gatepasses/:id", updateGatepassStatus);

// Hostel In/Out Logs
router.get("/logs", getHostelLogs);

// Grievances
router.get("/grievances", getGrievances);
router.put("/grievances/:id", respondToGrievance);

module.exports = router;
