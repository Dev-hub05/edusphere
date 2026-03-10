const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getDashboardStats,
    getMyCourses,
    markAttendance,
    getAttendance,
    getLowAttendanceStudents,
    uploadMarks,
    getResults,
    getGrievances,
    respondToGrievance,
    getStudents,
} = require("../controllers/facultyController");

// All routes below require: logged in + faculty role
router.use(protect, authorize("faculty"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Courses
router.get("/courses", getMyCourses);

// Students (for dropdown selectors)
router.get("/students", getStudents);

// Attendance
router.route("/attendance").get(getAttendance).post(markAttendance);
router.get("/attendance/low", getLowAttendanceStudents);

// Results / Marks
router.route("/results").get(getResults).post(uploadMarks);

// Grievances
router.get("/grievances", getGrievances);
router.put("/grievances/:id", respondToGrievance);

module.exports = router;
