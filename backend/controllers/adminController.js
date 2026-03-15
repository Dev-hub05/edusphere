const User = require("../models/User");
const Course = require("../models/Course");
const Notice = require("../models/Notice");
const Event = require("../models/Event");
const Fee = require("../models/Fee");
const Notification = require("../models/Notification");
const Grievance = require("../models/Grievance");
const Attendance = require("../models/Attendance");
const Result = require("../models/Result");
const Exam = require("../models/Exam");

// ==================== DASHBOARD ====================

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalFaculty = await User.countDocuments({ role: "faculty" });
        const totalCourses = await Course.countDocuments();
        const activeNotices = await Notice.countDocuments();
        const pendingGrievances = await Grievance.countDocuments({ status: "pending" });

        res.status(200).json({
            students: totalStudents,
            faculty: totalFaculty,
            courses: totalCourses,
            notices: activeNotices,
            pendingGrievances,
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        res.status(500).json({ message: "Server error while fetching stats" });
    }
};

// ==================== USER MANAGEMENT ====================

// @desc    Get all users (optionally filter by role)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        let query = {};

        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { enrollmentNo: { $regex: search, $options: "i" } },
            ];
        }

        const users = await User.find(query).select("-password").sort({ createdAt: -1 });

        res.status(200).json({ count: users.length, users });
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, department, semester, enrollmentNo } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "student",
            phone,
            department,
            semester,
            enrollmentNo,
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        });
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({ message: "Server error while creating user" });
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { name, email, role, phone, department, semester, enrollmentNo, isActive } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.name = name || user.name;
        user.email = email || user.email;
        if (role) user.role = role;
        user.phone = phone !== undefined ? phone : user.phone;
        user.department = department !== undefined ? department : user.department;
        user.semester = semester !== undefined ? semester : user.semester;
        user.enrollmentNo = enrollmentNo !== undefined ? enrollmentNo : user.enrollmentNo;
        if (isActive !== undefined) user.isActive = isActive;

        const updatedUser = await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isActive: updatedUser.isActive,
            },
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Server error while updating user" });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Admin cannot delete their own account" });
        }

        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server error while deleting user" });
    }
};

// ==================== COURSE MANAGEMENT ====================

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private/Admin
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("faculty", "name email department")
            .sort({ courseCode: 1 });

        res.status(200).json({ count: courses.length, courses });
    } catch (error) {
        console.error("Get Courses Error:", error);
        res.status(500).json({ message: "Server error while fetching courses" });
    }
};

// @desc    Create a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    try {
        const { courseCode, title, department, faculty, credits, semester, description } = req.body;

        if (!courseCode || !title || !department || !credits || !semester) {
            return res.status(400).json({ message: "courseCode, title, department, credits and semester are required" });
        }

        const exists = await Course.findOne({ courseCode });
        if (exists) return res.status(400).json({ message: "Course code already exists" });

        const course = await Course.create({
            courseCode,
            title,
            department,
            faculty,
            credits,
            semester,
            description,
        });

        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(500).json({ message: "Server error while creating course" });
    }
};

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        console.error("Update Course Error:", error);
        res.status(500).json({ message: "Server error while updating course" });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Delete Course Error:", error);
        res.status(500).json({ message: "Server error while deleting course" });
    }
};

// ==================== NOTICE MANAGEMENT ====================

// @desc    Get all notices
// @route   GET /api/admin/notices
// @access  Private/Admin
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find()
            .populate("postedBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(notices);
    } catch (error) {
        console.error("Get Notices Error:", error);
        res.status(500).json({ message: "Server error while fetching notices" });
    }
};

// @desc    Create a notice
// @route   POST /api/admin/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
    try {
        const { title, content, category, audience, expiryDate } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const notice = await Notice.create({
            title,
            content,
            category,
            audience,
            expiryDate,
            postedBy: req.user._id,
        });

        res.status(201).json({ message: "Notice created successfully", notice });
    } catch (error) {
        console.error("Create Notice Error:", error);
        res.status(500).json({ message: "Server error while creating notice" });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/admin/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) return res.status(404).json({ message: "Notice not found" });

        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.error("Delete Notice Error:", error);
        res.status(500).json({ message: "Server error while deleting notice" });
    }
};

// ==================== EVENT MANAGEMENT ====================

// @desc    Get all events
// @route   GET /api/admin/events
// @access  Private/Admin
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        console.error("Get Events Error:", error);
        res.status(500).json({ message: "Server error while fetching events" });
    }
};

// @desc    Create an event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, organizer, type } = req.body;

        if (!title || !description || !date) {
            return res.status(400).json({ message: "Title, description and date are required" });
        }

        const event = await Event.create({
            title,
            description,
            date,
            location,
            organizer,
            type,
        });

        res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: "Server error while creating event" });
    }
};

// @desc    Update an event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
        console.error("Update Event Error:", error);
        res.status(500).json({ message: "Server error while updating event" });
    }
};

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete Event Error:", error);
        res.status(500).json({ message: "Server error while deleting event" });
    }
};

// ==================== FEE MANAGEMENT ====================

// @desc    Get all fee records
// @route   GET /api/admin/fees
// @access  Private/Admin
const getFees = async (req, res) => {
    try {
        const { status, student } = req.query;
        let query = {};
        if (status) query.status = status;
        if (student) query.student = student;

        const fees = await Fee.find(query)
            .populate("student", "name email enrollmentNo department")
            .sort({ dueDate: -1 });

        res.status(200).json({ count: fees.length, fees });
    } catch (error) {
        console.error("Get Fees Error:", error);
        res.status(500).json({ message: "Server error while fetching fees" });
    }
};

// @desc    Create a fee record
// @route   POST /api/admin/fees
// @access  Private/Admin
const createFee = async (req, res) => {
    try {
        const { student, amount, dueDate, type } = req.body;

        if (!student || !amount || !dueDate) {
            return res.status(400).json({ message: "Student, amount and dueDate are required" });
        }

        const fee = await Fee.create({ student, amount, dueDate, type });

        res.status(201).json({ message: "Fee record created", fee });
    } catch (error) {
        console.error("Create Fee Error:", error);
        res.status(500).json({ message: "Server error while creating fee" });
    }
};

// @desc    Update a fee record (mark paid, etc.)
// @route   PUT /api/admin/fees/:id
// @access  Private/Admin
const updateFee = async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!fee) return res.status(404).json({ message: "Fee record not found" });

        res.status(200).json({ message: "Fee updated", fee });
    } catch (error) {
        console.error("Update Fee Error:", error);
        res.status(500).json({ message: "Server error while updating fee" });
    }
};

// ==================== GRIEVANCE MANAGEMENT ====================

// @desc    Get all grievances (admin oversight)
// @route   GET /api/admin/grievances
// @access  Private/Admin
const getGrievances = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const grievances = await Grievance.find(query)
            .populate("student", "name email enrollmentNo")
            .populate("respondedBy", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: grievances.length, grievances });
    } catch (error) {
        console.error("Get Grievances Error:", error);
        res.status(500).json({ message: "Server error while fetching grievances" });
    }
};

// @desc    Respond to a grievance
// @route   PUT /api/admin/grievances/:id
// @access  Private/Admin
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
        res.status(500).json({ message: "Server error while updating grievance" });
    }
};

// ==================== NOTIFICATION MANAGEMENT ====================

// @desc    Create a notification
// @route   POST /api/admin/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
    try {
        const { title, message, type, targetRole } = req.body;

        if (!title || !message) {
            return res.status(400).json({ message: "Title and message are required" });
        }

        const notification = await Notification.create({
            title,
            message,
            type,
            targetRole,
            createdBy: req.user._id,
        });

        res.status(201).json({ message: "Notification sent", notification });
    } catch (error) {
        console.error("Create Notification Error:", error);
        res.status(500).json({ message: "Server error while creating notification" });
    }
};

// ==================== EXAM SCHEDULE MANAGEMENT ====================

// @desc    Get all exams
// @route   GET /api/admin/exams
// @access  Private/Admin
const getExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate("course", "title courseCode")
            .sort({ date: 1, startTime: 1 });
        res.status(200).json({ count: exams.length, exams });
    } catch (error) {
        console.error("Get Exams Error:", error);
        res.status(500).json({ message: "Server error while fetching exams" });
    }
};

// @desc    Create an exam schedule
// @route   POST /api/admin/exams
// @access  Private/Admin
const createExam = async (req, res) => {
    try {
        const { course, department, semester, date, startTime, endTime, venue, examType } = req.body;
        
        if (!course || !department || !semester || !date || !startTime || !endTime || !venue) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const exam = await Exam.create({
            course, department, semester, date, startTime, endTime, venue, examType
        });
        
        res.status(201).json({ message: "Exam created successfully", exam });
    } catch (error) {
        console.error("Create Exam Error:", error);
        res.status(500).json({ message: "Server error while creating exam" });
    }
};

// @desc    Update an exam
// @route   PUT /api/admin/exams/:id
// @access  Private/Admin
const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json({ message: "Exam updated successfully", exam });
    } catch (error) {
        console.error("Update Exam Error:", error);
        res.status(500).json({ message: "Server error while updating exam" });
    }
};

// @desc    Delete an exam
// @route   DELETE /api/admin/exams/:id
// @access  Private/Admin
const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Delete Exam Error:", error);
        res.status(500).json({ message: "Server error while deleting exam" });
    }
};

// ==================== ATTENDANCE REPORTS ====================

// @desc    Get attendance reports for all students
// @route   GET /api/admin/reports/attendance
// @access  Private/Admin
const getAttendanceReports = async (req, res) => {
    try {
        const stats = await Attendance.aggregate([
            {
                $group: {
                    _id: "$student",
                    total: { $sum: 1 },
                    present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    student: "$_id",
                    percentage: {
                        $cond: {
                            if: { $eq: ["$total", 0] },
                            then: 0,
                            else: { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 0] }
                        }
                    }
                }
            }
        ]);
        
        const populatedStats = await User.populate(stats, {
            path: "student",
            select: "name enrollmentNo department semester",
            match: { role: "student" }
        });
        
        // Filter out nulls if aggregate included non-student users from old data
        const validStats = populatedStats.filter(s => s.student !== null);
        
        // Map to format suitable for frontend reports
        const reports = validStats.map(s => ({
            id: s.student._id,
            name: s.student.name,
            enrollmentNo: s.student.enrollmentNo,
            department: s.student.department,
            semester: s.student.semester,
            attendance: s.percentage
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        res.status(200).json({ count: reports.length, reports });
    } catch (error) {
        console.error("Attendance Reports Error:", error);
        res.status(500).json({ message: "Server error while fetching attendance reports" });
    }
};

module.exports = {
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
};
