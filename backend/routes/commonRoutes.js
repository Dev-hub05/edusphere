const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
    getNotices,
    getEvents,
    getCourses,
} = require("../controllers/adminController");

// All routes below require login
router.use(protect);

router.get("/notices", getNotices);
router.get("/events", getEvents);
router.get("/courses", getCourses);

module.exports = router;
