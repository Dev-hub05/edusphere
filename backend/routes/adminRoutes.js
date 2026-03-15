const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const {
    getDashboardStats,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getNotices,
    createNotice,
    deleteNotice,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getFees,
    createFee,
    updateFee,
    getGrievances,
    respondToGrievance,
    createNotification,
    getExams,
    createExam,
    updateExam,
    deleteExam,
    getAttendanceReports
} = require("../controllers/adminController");

// All routes below require: logged in + admin role
router.use(protect, authorize("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// User Management
router.route("/users").get(getUsers).post(createUser);
router.route("/users/:id").put(updateUser).delete(deleteUser);

// Course Management
router.route("/courses").get(getCourses).post(createCourse);
router.route("/courses/:id").put(updateCourse).delete(deleteCourse);

// Notice Management
router.route("/notices").get(getNotices).post(createNotice);
router.delete("/notices/:id", deleteNotice);

// Event Management
router.route("/events").get(getEvents).post(createEvent);
router.route("/events/:id").put(updateEvent).delete(deleteEvent);

// Fee Management
router.route("/fees").get(getFees).post(createFee);
router.put("/fees/:id", updateFee);

// Grievance Management
router.get("/grievances", getGrievances);
router.put("/grievances/:id", respondToGrievance);

// Notifications
router.post("/notifications", createNotification);

// Exam Management
router.route("/exams").get(getExams).post(createExam);
router.route("/exams/:id").put(updateExam).delete(deleteExam);

// Reports
router.get("/reports/attendance", getAttendanceReports);

module.exports = router;
