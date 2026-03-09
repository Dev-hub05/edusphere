import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/auth/Unauthorized";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import Profile from "../pages/student/Profile";
import Attendance from "../pages/student/Attendance";
import Results from "../pages/student/Results";
import Notifications from "../pages/student/Notifications";
import Grievance from "../pages/student/Grievance";
import GatepassRequest from "../pages/student/GatepassRequest";
import GatepassStatus from "../pages/student/GatepassStatus";
import GatepassHistory from "../pages/student/GatepassHistory";
import Timetable from "../pages/student/Timetable";
import CourseRegistration from "../pages/student/CourseRegistration";
import MyCourses from "../pages/student/MyCourses";
import MyAdmitCard from "../pages/student/MyAdmitCard";

// Faculty Pages
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import ManageAttendance from "../pages/faculty/ManageAttendance";
import ManageMarks from "../pages/faculty/ManageMarks";
import PerformanceAnalytics from "../pages/faculty/PerformanceAnalytics";
import FacultyGrievances from "../pages/faculty/FacultyGrievances";
import MultiLectureAttendance from "../pages/faculty/MultiLectureAttendance";
import FacultyTimetable from "../pages/faculty/Timetable";
import FacultyCourses from "../pages/faculty/MyCourses";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageRoles from "../pages/admin/ManageRoles";
import Calendar from "../pages/admin/Calendar";
import Notices from "../pages/admin/Notices";
import Reports from "../pages/admin/Reports";
import CreateNotice from "../pages/admin/CreateNotice";
import CreateEvent from "../pages/admin/CreateEvent";
import ManageTimetable from "../pages/admin/ManageTimetable";
import ManageCourses from "../pages/admin/ManageCourses";


// Parents pages
import ParentDashboard from "../pages/parent/ParentDashboard";
import WardAttendance from "../pages/parent/WardAttendance";
import GatepassApproval from "../pages/parent/GatepassApproval";
import InOutLogs from "../pages/parent/InOutLogs";
import ScheduleMeeting from "../pages/parent/ScheduleMeeting";


// Warden pages 
import WardenDashboard from "../pages/warden/WardenDashboard";
import FinalGatepassApproval from "../pages/warden/FinalGatepassApproval";
import HostelLogs from "../pages/warden/HostelLogs";
import HostelGrievances from "../pages/warden/HostelGrievances";


// Common Pages
import NoticeBoard from "../pages/common/NoticeBoard";
import EventsPage from "../pages/common/EventsPage"

function AppRoutes() {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ================= STUDENT ROUTES ================= */}
            <Route
                path="/student/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/profile"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/attendance"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Attendance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/results"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Results />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/notifications"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/grievance"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Grievance />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/gatepass/request"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <GatepassRequest />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/gatepass/status"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <GatepassStatus />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/gatepass/history"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <GatepassHistory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/timetable"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <Timetable />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/course-registration"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <CourseRegistration />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/courses"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <MyCourses />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/student/admit-card"
                element={
                    <ProtectedRoute allowedRoles={["student"]}>
                        <MyAdmitCard />
                    </ProtectedRoute>
                }
            />

            {/* ================= FACULTY ROUTES ================= */}
            <Route
                path="/faculty/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <FacultyDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/attendance"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <ManageAttendance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/marks"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <ManageMarks />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/performance"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <PerformanceAnalytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/grievances"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <FacultyGrievances />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/multi-attendance"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <MultiLectureAttendance />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/faculty/courses"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <FacultyCourses />
                    </ProtectedRoute>
                }
            />

            {/* ================= ADMIN ROUTES ================= */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/manage-timetable"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageTimetable />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty/timetable"
                element={
                    <ProtectedRoute allowedRoles={["faculty"]}>
                        <FacultyTimetable />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/roles"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageRoles />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/calendar"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Calendar />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/notices"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Notices />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/reports"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Reports />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/create-notice"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateNotice />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/create-event"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <CreateEvent />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/courses"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <ManageCourses />
                    </ProtectedRoute>
                }
            />


            {/* ================= PARENT ROUTES ================= */}
            <Route
                path="/parent/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["parent"]}>
                        <ParentDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/parent/attendance"
                element={
                    <ProtectedRoute allowedRoles={["parent"]}>
                        <WardAttendance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/parent/gatepass"
                element={
                    <ProtectedRoute allowedRoles={["parent"]}>
                        <GatepassApproval />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/parent/logs"
                element={
                    <ProtectedRoute allowedRoles={["parent"]}>
                        <InOutLogs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/parent/meeting"
                element={
                    <ProtectedRoute allowedRoles={["parent"]}>
                        <ScheduleMeeting />
                    </ProtectedRoute>
                }
            />
            {/* ================= WARDEN ROUTES ================= */}
            <Route
                path="/warden/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["warden"]}>
                        <WardenDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warden/approvals"
                element={
                    <ProtectedRoute allowedRoles={["warden"]}>
                        <FinalGatepassApproval />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warden/logs"
                element={
                    <ProtectedRoute allowedRoles={["warden"]}>
                        <HostelLogs />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/warden/grievances"
                element={
                    <ProtectedRoute allowedRoles={["warden"]}>
                        <HostelGrievances />
                    </ProtectedRoute>
                }
            />
            {/* ================= COMMON ROUTES ================= */}
            <Route
                path="/notices"
                element={
                    <ProtectedRoute allowedRoles={["student", "faculty", "admin", "parent", "warden"]}>
                        <NoticeBoard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/events"
                element={
                    <ProtectedRoute allowedRoles={["student", "faculty", "admin", "parent", "warden"]}>
                        <EventsPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;
