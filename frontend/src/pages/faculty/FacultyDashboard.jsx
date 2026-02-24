import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import StudentPerformance from "../../components/faculty/StudentPerformance";
import MarkAttendance from "../../components/faculty/MarkAttendance";
import UploadMarks from "../../components/faculty/UploadMarks";
import RespondGrievance from "../../components/faculty/RespondGrievance";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";
import { getFacultyDashboardStats } from "../../services/facultyService";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";
import { ATTENDANCE_THRESHOLD } from "../../utils/attendanceUtils";

function FacultyDashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getFacultyDashboardStats()
            .then(data => setStats(data))
            .catch(() => setError("Failed to load faculty data"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <Loader />
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <ErrorMessage message={error} />
            </DashboardLayout>
        );
    }

    // Mock data (replace later with API response)
    const students = [
        { id: 1, name: "Rahul Singh", attendance: 68 },
        { id: 2, name: "Priya Sharma", attendance: 72 },
        { id: 3, name: "Aman Verma", attendance: 85 },
    ];

    const lowAttendanceStudents = students.filter(
        s => s.attendance < ATTENDANCE_THRESHOLD
    );

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Classes" value={stats.totalClasses} />
                    <StatCard title="Students Assigned" value={stats.students} />
                    <StatCard title="Pending Grievances" value={stats.grievances} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="font-semibold mb-3">Today's Lectures</h3>
                    <p className="text-sm text-slate-600">
                        BTech CSE 2A – Data Structures – 10:00 AM
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>
                {/* Performance Analytics */}
                <StudentPerformance />

                {/* Attendance + Marks Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MarkAttendance />
                    <UploadMarks />
                </div>

                {/* Grievance Response */}
                <RespondGrievance />

                <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                    <div className="p-6 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-slate-700">
                            Students Below {ATTENDANCE_THRESHOLD}%
                        </h3>

                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                            {lowAttendanceStudents.length} Students
                        </span>
                    </div>

                    {lowAttendanceStudents.length === 0 ? (
                        <div className="p-6 text-green-600 font-medium">
                            ✅ All students are above attendance threshold.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-red-50 text-red-700">
                                    <tr>
                                        <th className="p-4 text-left">Student</th>
                                        <th className="p-4 text-left">Attendance</th>
                                        <th className="p-4 text-left">Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lowAttendanceStudents.map(student => (
                                        <tr
                                            key={student.id}
                                            className="border-t bg-red-50 hover:bg-red-100 transition"
                                        >
                                            <td className="p-4 font-medium">
                                                {student.name}
                                            </td>

                                            <td className="p-4 font-semibold text-red-600">
                                                {student.attendance}%
                                            </td>

                                            <td className="p-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-700">
                                                    Below Threshold
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}

export default FacultyDashboard;