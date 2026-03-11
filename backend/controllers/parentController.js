const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Fee = require("../models/Fee");
const Gatepass = require("../models/Gatepass");
const Notification = require("../models/Notification");

// ==================== DASHBOARD ====================

// @desc    Get parent dashboard statistics
// @route   GET /api/parent/dashboard
// @access  Private/Parent
const getDashboardStats = async (req, res) => {
    try {
        const { wardId } = req.query;

        if (!wardId) {
            return res.status(400).json({ message: "wardId query param is required" });
        }

        // Ward's overall attendance
        const attendanceData = await Attendance.aggregate([
            { $match: { student: require("mongoose").Types.ObjectId.createFromHexString(wardId) } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    attended: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
        ]);

        const overallAttendance =
            attendanceData.length > 0
                ? `${Math.round((attendanceData[0].attended / attendanceData[0].total) * 100)}%`
                : "0%";

        // Pending gatepasses
        const pendingGatepasses = await Gatepass.countDocuments({
            student: wardId,
            status: "pending",
        });

        // Pending fees
        const pendingFees = await Fee.countDocuments({
            student: wardId,
            status: { $in: ["pending", "overdue"] },
        });

        res.status(200).json({
            wardAttendance: overallAttendance,
            pendingGatepasses,
            pendingFees,
        });
    } catch (error) {
        console.error("Parent Dashboard Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== WARD ATTENDANCE ====================

// @desc    Get ward's attendance (subject-wise)
// @route   GET /api/parent/attendance
// @access  Private/Parent
const getWardAttendance = async (req, res) => {
    try {
        const { wardId } = req.query;

        if (!wardId) {
            return res.status(400).json({ message: "wardId query param is required" });
        }

        const attendance = await Attendance.aggregate([
            { $match: { student: require("mongoose").Types.ObjectId.createFromHexString(wardId) } },
            {
                $group: {
                    _id: "$subject",
                    totalClasses: { $sum: 1 },
                    classesAttended: {
                        $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    totalClasses: 1,
                    classesAttended: 1,
                    percentage: {
                        $round: [
                            { $multiply: [{ $divide: ["$classesAttended", "$totalClasses"] }, 100] },
                            1,
                        ],
                    },
                },
            },
            { $sort: { subject: 1 } },
        ]);

        res.status(200).json(attendance);
    } catch (error) {
        console.error("Parent Get Attendance Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== WARD RESULTS ====================

// @desc    Get ward's exam results
// @route   GET /api/parent/results
// @access  Private/Parent
const getWardResults = async (req, res) => {
    try {
        const { wardId } = req.query;

        if (!wardId) {
            return res.status(400).json({ message: "wardId query param is required" });
        }

        const results = await Result.find({ student: wardId })
            .select("subject examType marks totalMarks grade semester")
            .sort({ semester: -1, subject: 1 });

        res.status(200).json(results);
    } catch (error) {
        console.error("Parent Get Results Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== WARD FEE STATUS ====================

// @desc    Get ward's fee records
// @route   GET /api/parent/fees
// @access  Private/Parent
const getWardFees = async (req, res) => {
    try {
        const { wardId } = req.query;

        if (!wardId) {
            return res.status(400).json({ message: "wardId query param is required" });
        }

        const fees = await Fee.find({ student: wardId }).sort({ dueDate: -1 });

        res.status(200).json(fees);
    } catch (error) {
        console.error("Parent Get Fees Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== GATEPASS APPROVAL ====================

// @desc    Get ward's gatepass requests
// @route   GET /api/parent/gatepasses
// @access  Private/Parent
const getWardGatepasses = async (req, res) => {
    try {
        const { wardId } = req.query;

        if (!wardId) {
            return res.status(400).json({ message: "wardId query param is required" });
        }

        const gatepasses = await Gatepass.find({ student: wardId })
            .populate("warden", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: gatepasses.length, gatepasses });
    } catch (error) {
        console.error("Parent Get Gatepasses Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== NOTIFICATIONS ====================

// @desc    Get notifications for parents
// @route   GET /api/parent/notifications
// @access  Private/Parent
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            isActive: true,
            targetRole: { $in: ["all", "parent"] },
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("createdBy", "name");

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Parent Get Notifications Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getDashboardStats,
    getWardAttendance,
    getWardResults,
    getWardFees,
    getWardGatepasses,
    getNotifications,
};
