const Gatepass = require("../models/Gatepass");
const Grievance = require("../models/Grievance");
const User = require("../models/User");

// ==================== DASHBOARD ====================

// @desc    Get warden dashboard statistics
// @route   GET /api/warden/dashboard
// @access  Private/Warden
const getDashboardStats = async (req, res) => {
    try {
        const pendingGatepasses = await Gatepass.countDocuments({ status: "pending" });
        const approvedGatepasses = await Gatepass.countDocuments({ status: "approved" });
        const hostelGrievances = await Grievance.countDocuments({ status: "pending" });
        const totalHostelers = await User.countDocuments({ role: "student" }); // Simplification

        res.status(200).json({
            pendingGatepasses,
            approvedGatepasses,
            hostelGrievances,
            totalHostelers,
        });
    } catch (error) {
        console.error("Warden Dashboard Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== GATEPASS MANAGEMENT ====================

// @desc    Get all gatepass requests
// @route   GET /api/warden/gatepasses
// @access  Private/Warden
const getGatepasses = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const gatepasses = await Gatepass.find(query)
            .populate("student", "name email enrollmentNo department")
            .populate("warden", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: gatepasses.length, gatepasses });
    } catch (error) {
        console.error("Get Gatepasses Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Approve or reject a gatepass
// @route   PUT /api/warden/gatepasses/:id
// @access  Private/Warden
const updateGatepassStatus = async (req, res) => {
    try {
        const { status, comments } = req.body;

        if (!status || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Status must be 'approved' or 'rejected'" });
        }

        const gatepass = await Gatepass.findById(req.params.id);
        if (!gatepass) return res.status(404).json({ message: "Gatepass not found" });

        gatepass.status = status;
        gatepass.warden = req.user._id;
        if (comments) gatepass.comments = comments;

        await gatepass.save();

        res.status(200).json({ message: `Gatepass ${status}`, gatepass });
    } catch (error) {
        console.error("Update Gatepass Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== HOSTEL LOGS ====================

// @desc    Get hostel in/out logs (approved gatepasses with dates)
// @route   GET /api/warden/logs
// @access  Private/Warden
const getHostelLogs = async (req, res) => {
    try {
        const logs = await Gatepass.find({ status: "approved" })
            .populate("student", "name enrollmentNo department")
            .sort({ outDate: -1 })
            .limit(50);

        res.status(200).json({ count: logs.length, logs });
    } catch (error) {
        console.error("Get Hostel Logs Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ==================== HOSTEL GRIEVANCES ====================

// @desc    Get hostel-related grievances
// @route   GET /api/warden/grievances
// @access  Private/Warden
const getGrievances = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const grievances = await Grievance.find(query)
            .populate("student", "name email enrollmentNo")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: grievances.length, grievances });
    } catch (error) {
        console.error("Get Grievances Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Respond to a hostel grievance
// @route   PUT /api/warden/grievances/:id
// @access  Private/Warden
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

module.exports = {
    getDashboardStats,
    getGatepasses,
    updateGatepassStatus,
    getHostelLogs,
    getGrievances,
    respondToGrievance,
};
