const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getDashboardStats,
    getWardAttendance,
    getWardResults,
    getWardFees,
    getWardGatepasses,
    getNotifications,
} = require("../controllers/parentController");

// All routes below require: logged in + parent role
router.use(protect, authorize("parent"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Ward's Attendance
router.get("/attendance", getWardAttendance);

// Ward's Results
router.get("/results", getWardResults);

// Ward's Fee Status
router.get("/fees", getWardFees);

// Ward's Gatepasses
router.get("/gatepasses", getWardGatepasses);

// Notifications
router.get("/notifications", getNotifications);

module.exports = router;
