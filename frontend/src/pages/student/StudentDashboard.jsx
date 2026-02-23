import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import BarChart from "../../components/charts/BarChart";
import StatCard from "../../components/common/StatCard";
import { getStudentDashboardStats } from "../../services/studentService";

function StudentDashboard() {
    const [stats, setStats] = useState({
        overallAttendance: "0%",
        avgGPA: "0.0",
        pendingGrievances: 0,
        subjectAttendance: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStudentDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-lg font-medium text-slate-500 text-animate-pulse">Loading Dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 animate-fadeIn">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard title="Overall Attendance" value={stats.overallAttendance} />
                    <StatCard title="Current GPA" value={stats.avgGPA} />
                    <StatCard title="Active Grievances" value={stats.pendingGrievances} />
                </div>

                {/* Charts Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 text-slate-700">
                        Attendance Analysis by Subject
                    </h3>

                    <div className="h-[400px]">
                        <BarChart
                            title="Attendance %"
                            labels={stats.subjectAttendance.map(s => s.subject)}
                            dataValues={stats.subjectAttendance.map(s => s.percentage)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;