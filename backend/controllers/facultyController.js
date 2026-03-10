const User = require("../models/User");
const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Grievance = require("../models/Grievance");
const mongoose = require("mongoose");

// ==================== DASHBOARD ====================

// @desc    Get faculty dashboard statistics
// @route   GET /api/faculty/dashboard
// @access  Private/Faculty
const getDashboardStats = async (req, res) => {
    try {
        const facultyId = req.user._id;

        // Courses assigned to this faculty
        const assignedCourses = await Course.find({ faculty: facultyId });
        const courseSubjects = assignedCourses.map((c) => c.title);

        // Total classes taken (attendance entries marked by this faculty)
        const totalClasses = await Attendance.countDocuments({ markedBy: facultyId });

        // Total unique students across assigned courses
        const studentsInCourses = await Attendance.distinct("student", {
            subject: { $in: courseSubjects },
        });

        // Pending grievances (all unresolved grievances for now, can later filter by department)
        const pendingGrievances = await Grievance.countDocuments({ status: "pending" });

        res.status(200).json({
            totalClasses,
            students: studentsInCourses.length,
            grievances: pendingGrievances,
            courses: assignedCourses.length,
        });
    } catch (error) {
        console.error("Faculty Dashboard Error:", error);
        res.status(500).json({ message: "Server error while fetching dashboard" });
    }
};

// ==================== COURSES ====================

// @desc    Get faculty's assigned courses
// @route   GET /api/faculty/courses
// @access  Private/Faculty
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ faculty: req.user._id }).sort({ courseCode: 1 });
        res.status(200).json({ count: courses.length, courses });
    } catch (error) {
        console.error("Get My Courses Error:", error);
        res.status(500).json({ message: "Server error while fetching courses" });
    }
};

// ==================== ATTENDANCE ====================

// @desc    Mark attendance for a class/subject
// @route   POST /api/faculty/attendance
// @access  Private/Faculty
const markAttendance = async (req, res) => {
    try {
        const { subject, date, records } = req.body;
        // records: [{ student: ObjectId, status: "present" | "absent" }]

        if (!subject || !date || !records || !Array.isArray(records)) {
            return res.status(400).json({
                message: "subject, date and records array are required",
            });
        }

        const attendanceRecords = records.map((r) => ({
            student: r.student,
            subject,
            date: new Date(date),
            status: r.status,
            markedBy: req.user._id,
        }));

        // Use insertMany with ordered: false to skip duplicates
        const result = await Attendance.insertMany(attendanceRecords, { ordered: false })
            .catch((err) => {
                // Handle duplicate key errors gracefully
                if (err.code === 11000 || err.writeErrors) {
                    return { insertedCount: err.insertedDocs?.length || 0, duplicatesSkipped: true };
                }
                throw err;
            });

        res.status(201).json({
            message: "Attendance marked successfully",
            count: Array.isArray(result) ? result.length : result.insertedCount,
        });
    } catch (error) {
        console.error("Mark Attendance Error:", error);
        res.status(500).json({ message: "Server error while marking attendance" });
    }
};

// @desc    Get attendance records for a subject
// @route   GET /api/faculty/attendance
// @access  Private/Faculty
const getAttendance = async (req, res) => {
    try {
        const { subject, date } = req.query;
        let query = { markedBy: req.user._id };

        if (subject) query.subject = subject;
        if (date) {
            const d = new Date(date);
            query.date = {
                $gte: new Date(d.setHours(0, 0, 0, 0)),
                $lte: new Date(d.setHours(23, 59, 59, 999)),
            };
        }

        const records = await Attendance.find(query)
            .populate("student", "name enrollmentNo")
            .sort({ date: -1 });

        res.status(200).json({ count: records.length, records });
    } catch (error) {
        console.error("Get Attendance Error:", error);
        res.status(500).json({ message: "Server error while fetching attendance" });
    }
};

// @desc    Get students with low attendance for a subject
// @route   GET /api/faculty/attendance/low
// @access  Private/Faculty
const getLowAttendanceStudents = async (req, res) => {
    try {
        const { subject, threshold = 75 } = req.query;

        let matchQuery = { markedBy: req.user._id };
        if (subject) matchQuery.subject = subject;

        const stats = await Attendance.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: { student: "$student", subject: "$subject" },
                    total: { $sum: 1 },
                    present: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    student: "$_id.student",
                    subject: "$_id.subject",
                    total: 1,
                    present: 1,
                    percentage: {
                        $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1],
                    },
                },
            },
            { $match: { percentage: { $lt: Number(threshold) } } },
            { $sort: { percentage: 1 } },
        ]);

        // Populate student names
        const populatedStats = await User.populate(stats, {
            path: "student",
            select: "name enrollmentNo",
        });

        res.status(200).json(populatedStats);
    } catch (error) {
        console.error("Low Attendance Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== MARKS / RESULTS ====================

// @desc    Upload marks for students
// @route   POST /api/faculty/results
// @access  Private/Faculty
const uploadMarks = async (req, res) => {
    try {
        const { subject, examType, semester, marks } = req.body;
        // marks: [{ student: ObjectId, marks: Number, totalMarks: Number, grade: String }]

        if (!subject || !examType || !semester || !marks || !Array.isArray(marks)) {
            return res.status(400).json({
                message: "subject, examType, semester and marks array are required",
            });
        }

        const resultRecords = marks.map((m) => ({
            student: m.student,
            subject,
            examType,
            semester,
            marks: m.marks,
            totalMarks: m.totalMarks || 100,
            grade: m.grade || "",
            uploadedBy: req.user._id,
        }));

        const result = await Result.insertMany(resultRecords, { ordered: false })
            .catch((err) => {
                if (err.code === 11000 || err.writeErrors) {
                    return { insertedCount: err.insertedDocs?.length || 0, duplicatesSkipped: true };
                }
                throw err;
            });

        res.status(201).json({
            message: "Marks uploaded successfully",
            count: Array.isArray(result) ? result.length : result.insertedCount,
        });
    } catch (error) {
        console.error("Upload Marks Error:", error);
        res.status(500).json({ message: "Server error while uploading marks" });
    }
};

// @desc    Get results uploaded by faculty for a subject
// @route   GET /api/faculty/results
// @access  Private/Faculty
const getResults = async (req, res) => {
    try {
        const { subject, examType, semester } = req.query;
        let query = { uploadedBy: req.user._id };

        if (subject) query.subject = subject;
        if (examType) query.examType = examType;
        if (semester) query.semester = Number(semester);

        const results = await Result.find(query)
            .populate("student", "name enrollmentNo")
            .sort({ subject: 1 });

        res.status(200).json({ count: results.length, results });
    } catch (error) {
        console.error("Get Results Error:", error);
        res.status(500).json({ message: "Server error while fetching results" });
    }
};

// ==================== GRIEVANCES ====================

// @desc    Get grievances assigned/visible to faculty
// @route   GET /api/faculty/grievances
// @access  Private/Faculty
const getGrievances = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const grievances = await Grievance.find(query)
            .populate("student", "name email enrollmentNo department")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: grievances.length, grievances });
    } catch (error) {
        console.error("Get Grievances Error:", error);
        res.status(500).json({ message: "Server error while fetching grievances" });
    }
};

// @desc    Respond to a grievance
// @route   PUT /api/faculty/grievances/:id
// @access  Private/Faculty
const respondToGrievance = async (req, res) => {
    try {
        const { status, response } = req.body;

        const grievance = await Grievance.findById(req.params.id);
        if (!grievance) return res.status(404).json({ message: "Grievance not found" });

        if (status) grievance.status = status;
        if (response) grievance.response = response;
        grievance.respondedBy = req.user._id;
        grievance.respondedAt = new Date();

        await grievance.save();

        res.status(200).json({ message: "Grievance updated", grievance });
    } catch (error) {
        console.error("Respond Grievance Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== STUDENTS LIST ====================

// @desc    Get all students (for marking attendance/uploading marks)
// @route   GET /api/faculty/students
// @access  Private/Faculty
const getStudents = async (req, res) => {
    try {
        const { department, semester } = req.query;
        let query = { role: "student" };

        if (department) query.department = department;
        if (semester) query.semester = Number(semester);

        const students = await User.find(query)
            .select("name email enrollmentNo department semester")
            .sort({ name: 1 });

        res.status(200).json({ count: students.length, students });
    } catch (error) {
        console.error("Get Students Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
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
};
