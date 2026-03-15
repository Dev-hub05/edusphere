import DashboardLayout from "../../components/layout/DashboardLayout";
import { ATTENDANCE_THRESHOLD } from "../../utils/attendanceUtils";
import { useState, useEffect } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getAttendanceReports } from "../../services/adminService";

function Reports() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLowOnly, setShowLowOnly] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAttendanceReports();
                setStudents(data.reports || []);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to load attendance reports.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader />
                </div>
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

    const filteredStudents = showLowOnly
        ? students.filter(s => s.attendance < ATTENDANCE_THRESHOLD)
        : students;

    const totalStudents = students.length;
    const belowThresholdCount = students.filter(
        s => s.attendance < ATTENDANCE_THRESHOLD
    ).length;

    const average = totalStudents > 0 ?
        Math.round(
            students.reduce((sum, s) => sum + s.attendance, 0) /
            totalStudents
        ) : 0;

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Attendance Reports
                </h2>

                {/* KPI Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <p className="text-sm text-slate-500">Total Students</p>
                        <p className="text-2xl font-bold text-slate-800 mt-2">
                            {totalStudents}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <p className="text-sm text-slate-500">
                            Average Attendance
                        </p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            {average}%
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <p className="text-sm text-slate-500">
                            Below {ATTENDANCE_THRESHOLD}%
                        </p>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                            {belowThresholdCount}
                        </p>
                    </div>

                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                    <div className="p-6 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                        <h3 className="font-semibold text-slate-700">
                            Student Attendance Overview
                        </h3>

                        <div className="flex gap-3">

                            <button
                                onClick={() => setShowLowOnly(false)}
                                className={`px-4 py-2 rounded-md text-sm transition ${!showLowOnly
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-slate-700"
                                    }`}
                            >
                                All Students
                            </button>

                            <button
                                onClick={() => setShowLowOnly(true)}
                                className={`px-4 py-2 rounded-md text-sm transition ${showLowOnly
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-200 text-slate-700"
                                    }`}
                            >
                                Below {ATTENDANCE_THRESHOLD}%
                            </button>

                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition">
                                Download Report
                            </button>

                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-indigo-50 text-indigo-700">
                                <tr>
                                    <th className="p-4 text-left">Student</th>
                                    <th className="p-4 text-left">Attendance</th>
                                    <th className="p-4 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStudents.map(student => {

                                    const isLow =
                                        student.attendance < ATTENDANCE_THRESHOLD;

                                    return (
                                        <tr
                                            key={student.id}
                                            className={`border-t ${isLow ? "bg-red-50" : ""
                                                }`}
                                        >
                                            <td className="p-4 font-medium">
                                                {student.name}
                                            </td>

                                            <td
                                                className={`p-4 font-semibold ${isLow
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                    }`}
                                            >
                                                {student.attendance}%
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isLow
                                                            ? "bg-red-100 text-red-600"
                                                            : "bg-green-100 text-green-600"
                                                        }`}
                                                >
                                                    {isLow
                                                        ? "Below Threshold"
                                                        : "Good Standing"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}

export default Reports;