const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getProfile,
    updateProfile,
    getAttendance,
    getResults,
    getNotifications,
    submitGrievance,
    getGrievances,
    getDashboardStats,
    requestGatepass,
    getGatepasses,
    getFees,
    getCourses,
    getExams,
} = require("../controllers/studentController");

// All routes below require: logged in + student role
router.use(protect, authorize("student"));

// GET /api/student/dashboard — Dashboard summary stats
router.get("/dashboard", getDashboardStats);

// GET /api/student/profile — Get student profile
router.get("/profile", getProfile);

// PUT /api/student/profile — Update student profile
router.put("/profile", updateProfile);

// GET /api/student/attendance — Get attendance records (aggregated)
router.get("/attendance", getAttendance);

// GET /api/student/results — Get exam results
router.get("/results", getResults);

// GET /api/student/notifications — Get notifications
router.get("/notifications", getNotifications);

// POST /api/student/grievance — Submit a grievance
router.post("/grievance", submitGrievance);

// GET /api/student/grievances — Get all submitted grievances
router.get("/grievances", getGrievances);

// POST /api/student/gatepass — Request a gatepass
router.post("/gatepass", requestGatepass);

// GET /api/student/gatepasses — Get gatepass history
router.get("/gatepasses", getGatepasses);

// GET /api/student/fees — Get fee records
router.get("/fees", getFees);

// GET /api/student/courses — Get registered courses
router.get("/courses", getCourses);

// GET /api/student/exams — Get upcoming exams
router.get("/exams", getExams);

module.exports = router;
