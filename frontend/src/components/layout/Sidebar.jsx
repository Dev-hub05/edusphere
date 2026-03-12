import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Sidebar({ closeSidebar }) {

    const { user } = useContext(AuthContext);

    return (
        <div className="w-64 h-screen bg-indigo-950 text-white fixed flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-indigo-800">
                EduSphere
            </div>


            <div className="flex-1 p-6 space-y-2 text-sm">

                {/* ================= STUDENT ================= */}
                {user?.role === "student" && (
                    <>
                        <SidebarItem to="/student/dashboard" label="Dashboard" />
                        <SidebarItem to="/student/profile" label="Profile" />
                        <SidebarItem to="/student/attendance" label="Attendance" />
                        <SidebarItem to="/student/timetable" label="Timetable" />
                        <SidebarItem to="/student/courses" label="My Courses" />
                        <SidebarItem to="/student/results" label="Results" />
                        <SidebarItem to="/student/notifications" label="Notifications" />
                        <SidebarItem to="/student/grievance" label="Grievance" />
                        <SidebarItem to="/student/gatepass/request" label="Request Gatepass" />
                        <SidebarItem to="/student/gatepass/status" label="Gatepass Status" />
                        <SidebarItem to="/student/gatepass/history" label="Gatepass History" />
                        <SidebarItem to="/student/course-registration" label="Course Registration" />
                        <SidebarItem to="/student/examination-form" label="Examination Form" />
                        <SidebarItem to="/student/exam-schedule" label="Exam Schedule" />
                        <SidebarItem to="/student/fee-payment" label="Fee Payment" />
                        <SidebarItem to="/student/fee-status" label="Fee Status" />
                        <SidebarItem to="/student/admit-card" label="My Admit Card" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />

                    </>
                )}

                {/* ================= FACULTY ================= */}
                {user?.role === "faculty" && (
                    <>
                        <SidebarItem to="/faculty/dashboard" label="Dashboard" />
                        <SidebarItem to="/faculty/attendance" label="Attendance" />
                        <SidebarItem to="/faculty/multi-attendance" label="Multi-Lecture Attendance" />
                        <SidebarItem to="/faculty/timetable" label="My Timetable" />
                        <SidebarItem to="/faculty/courses" label="My Courses" />
                        <SidebarItem to="/faculty/marks" label="Marks" />
                        <SidebarItem to="/faculty/performance" label="Analytics" />
                        <SidebarItem to="/faculty/grievances" label="Grievances" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />

                    </>
                )}

                {/* ================= ADMIN ================= */}
                {user?.role === "admin" && (
                    <>
                        <SidebarItem to="/admin/dashboard" label="Dashboard" />
                        <SidebarItem to="/admin/courses" label="Manage Courses" />
                        <SidebarItem to="/admin/users" label="Users" />
                        <SidebarItem to="/admin/roles" label="Roles" />
                        <SidebarItem to="/admin/calendar" label="Calendar" />
                        <SidebarItem to="/admin/manage-timetable" label="Manage Timetable" />
                        <SidebarItem to="/admin/notices" label="Notices" />
                        <SidebarItem to="/admin/reports" label="Reports" />
                        <SidebarItem to="/admin/create-notice" label="Create Notice" />
                        <SidebarItem to="/admin/create-event" label="Create Event" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

                {/* ================= PARENT ================= */}
                {user?.role === "parent" && (
                    <>
                        <SidebarItem to="/parent/dashboard" label="Dashboard" />
                        <SidebarItem to="/parent/attendance" label="Ward Attendance" />
                        <SidebarItem to="/parent/gatepass" label="Gatepass Approval" />
                        <SidebarItem to="/parent/logs" label="In/Out Logs" />
                        <SidebarItem to="/parent/meeting" label="Schedule Meeting" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

                {/* ================= WARDEN ================= */}
                {user?.role === "warden" && (
                    <>
                        <SidebarItem to="/warden/dashboard" label="Dashboard" />
                        <SidebarItem to="/warden/approvals" label="Final Approvals" />
                        <SidebarItem to="/warden/logs" label="Hostel Logs" />
                        <SidebarItem to="/warden/grievances" label="Hostel Grievances" />
                        <SidebarItem to="/notices" label="Notice Board" />
                        <SidebarItem to="/events" label="Events" />
                    </>
                )}

            </div>
        </div>
    );
}

function SidebarItem({ to, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block px-4 py-2 rounded-lg transition ${isActive
                    ? "bg-indigo-700 text-white"
                    : "hover:bg-indigo-800 text-indigo-200"
                }`
            }
        >
            {label}
        </NavLink>
    );
}

export default Sidebar;