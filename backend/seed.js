const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Course = require("./models/Course");
const Fee = require("./models/Fee");
const Exam = require("./models/Exam");
const Attendance = require("./models/Attendance");

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/edusphere");

        // Check if admin exists
        const adminExists = await User.findOne({ email: "admin@edusphere.com" });
        if (!adminExists) {
            await User.create({
                name: "System Admin",
                email: "admin@edusphere.com",
                password: "password123", // Will be hashed automatically by pre-save
                role: "admin",
                isActive: true
            });
            console.log("✅ Admin built: admin@edusphere.com / password123");
        }

        const studentExists = await User.findOne({ email: "student@edusphere.com" });
        if (!studentExists) {
            await User.create({
                name: "Demo Student",
                email: "student@edusphere.com",
                password: "password123",
                role: "student",
                department: "Computer Science",
                semester: 6,
                enrollmentNo: "CS2023101",
                isActive: true
            });
            console.log("✅ Student built: student@edusphere.com / password123");
        }

        const facultyExists = await User.findOne({ email: "faculty@edusphere.com" });
        if (!facultyExists) {
            await User.create({
                name: "Dr. Faculty",
                email: "faculty@edusphere.com",
                password: "password123",
                role: "faculty",
                department: "Computer Science",
                isActive: true
            });
            console.log("✅ Faculty built: faculty@edusphere.com / password123");
        }

        const wardenExists = await User.findOne({ email: "warden@edusphere.com" });
        if (!wardenExists) {
            await User.create({
                name: "Chief Warden",
                email: "warden@edusphere.com",
                password: "password123",
                role: "warden",
                hostelBlock: "Block A",
                isActive: true
            });
            console.log("✅ Warden built: warden@edusphere.com / password123");
        }

        const parentExists = await User.findOne({ email: "parent@edusphere.com" });
        if (!parentExists) {
            await User.create({
                name: "Demo Parent",
                email: "parent@edusphere.com",
                password: "password123",
                role: "parent",
                linkedStudentEmail: "student@edusphere.com",
                isActive: true
            });
            console.log("✅ Parent built: parent@edusphere.com / password123");
            console.log("✅ Parent built: parent@edusphere.com / password123");
        }

        const admin = await User.findOne({ email: "admin@edusphere.com" });
        const faculty = await User.findOne({ email: "faculty@edusphere.com" });
        const student = await User.findOne({ email: "student@edusphere.com" });
        
        // 1. Seed Courses
        const courseCount = await Course.countDocuments();
        let courses = await Course.find();
        if (courseCount === 0) {
            console.log("Seeding courses...");
            courses = await Course.insertMany([
                {
                    courseCode: "CS301",
                    title: "Artificial Intelligence",
                    department: "Computer Science",
                    faculty: faculty._id,
                    credits: 4,
                    semester: 6
                },
                {
                    courseCode: "CS302",
                    title: "Cloud Computing",
                    department: "Computer Science",
                    faculty: faculty._id,
                    credits: 3,
                    semester: 6
                },
                {
                    courseCode: "CS303",
                    title: "Mobile App Development",
                    department: "Computer Science",
                    faculty: faculty._id,
                    credits: 3,
                    semester: 6
                }
            ]);
            console.log("✅ Courses built");
        }
        
        // 2. Seed Fees
        const feeCount = await Fee.countDocuments();
        if (feeCount === 0) {
            console.log("Seeding fees...");
            await Fee.insertMany([
                {
                    student: student._id,
                    amount: 45000,
                    dueDate: new Date("2024-04-15"),
                    type: "tuition",
                    status: "pending"
                },
                {
                    student: student._id,
                    amount: 12000,
                    dueDate: new Date("2024-03-01"),
                    type: "tuition",
                    status: "paid",
                    paidDate: new Date("2024-02-28"),
                    transactionId: "TXN_9982341"
                },
                {
                    student: student._id,
                    amount: 8000,
                    dueDate: new Date("2024-02-15"),
                    type: "hostel",
                    status: "paid",
                    paidDate: new Date("2024-02-10"),
                    transactionId: "TXN_9982340"
                }
            ]);
            console.log("✅ Fees built");
        }
        
        // 3. Seed Exams
        const examCount = await Exam.countDocuments();
        if (examCount === 0 && courses.length > 0) {
            console.log("Seeding exams...");
            await Exam.insertMany([
                {
                    course: courses[0]._id,
                    department: "Computer Science",
                    semester: 6,
                    date: new Date("2024-05-15"),
                    startTime: "10:00 AM",
                    endTime: "01:00 PM",
                    venue: "Lobby Hall, Block A"
                },
                {
                    course: courses[1]._id,
                    department: "Computer Science",
                    semester: 6,
                    date: new Date("2024-05-18"),
                    startTime: "10:00 AM",
                    endTime: "01:00 PM",
                    venue: "Lab 4, IT Block"
                },
                {
                    course: courses[2]._id,
                    department: "Computer Science",
                    semester: 6,
                    date: new Date("2024-05-21"),
                    startTime: "10:00 AM",
                    endTime: "01:00 PM",
                    venue: "Room 102, Main Block"
                }
            ]);
            console.log("✅ Exams built");
        }
        
        // 4. Seed Attendance
        const attendanceCount = await Attendance.countDocuments();
        if (attendanceCount === 0) {
            console.log("Seeding attendance...");
            const pastDates = [
                new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            ];
            
            const attendanceRecords = pastDates.map((date) => ({
                student: student._id,
                subject: "Artificial Intelligence",
                date: date,
                status: Math.random() > 0.3 ? "present" : "absent",
                markedBy: faculty._id
            }));
            
            await Attendance.insertMany(attendanceRecords);
            console.log("✅ Attendance built");
        }
        
        console.log("🎉 Seed finished!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:\n", error);
        process.exit(1);
    }
};

seedDatabase();
