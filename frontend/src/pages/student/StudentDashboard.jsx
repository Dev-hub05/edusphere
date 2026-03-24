import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import AttendanceChart from "../../components/student/AttendanceChart";
import AttendanceTable from "../../components/student/AttendanceTable";
import GrievanceForm from "../../components/student/GrievanceForm";
import GrievanceStatus from "../../components/student/GrievanceStatus";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget"; 
import AttendanceWarningBanner from "../../components/student/AttendanceWarningBanner";
import { getStudentDashboardStats, getStudentGrievances, submitGrievance as submitGrievanceApi } from "../../services/studentService";

function StudentDashboard() {
    const [stats, setStats] = useState({
        overallAttendance: "0%",
        avgGPA: "0.0",
        pendingGrievances: 0,
        subjectAttendance: []
    });
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const processStats = (data) => {
        if (!data || data.overallAttendance === "0%" || !data.subjectAttendance || data.subjectAttendance.length === 0) {
            return {
                overallAttendance: "80%",
                avgGPA: "8.6",
                pendingGrievances: data?.pendingGrievances || 0,
                subjectAttendance: [
                    { subject: "Data Structures", percentage: 86 },
                    { subject: "Operating System", percentage: 90 },
                    { subject: "Introduction to AI/ML", percentage: 82 }
                ]
            };
        }
        return data;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, grievancesData] = await Promise.all([
                    getStudentDashboardStats(),
                    getStudentGrievances()
                ]);
                setStats(processStats(statsData));
                setGrievances(grievancesData);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleGrievanceSubmit = async (message) => {
        try {
            await submitGrievanceApi({ 
                subject: "General Grievance", 
                description: message 
            });
            // Refresh grievances after submission
            const updatedGrievances = await getStudentGrievances();
            setGrievances(updatedGrievances);
            
            // Refresh stats for pending count
            const updatedStats = await getStudentDashboardStats();
            setStats(processStats(updatedStats));
        } catch (err) {
            console.error("Failed to submit grievance:", err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
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

    const numericAverage = parseInt(stats.overallAttendance);

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-8 space-y-8 animate-fadeIn">
                <AttendanceWarningBanner average={numericAverage} />
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Overall Attendance" value={stats.overallAttendance} />
                    <StatCard title="Current GPA" value={stats.avgGPA} />
                    <StatCard title="Pending Grievances" value={stats.pendingGrievances} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="font-semibold mb-3">Today's Schedule</h3>
                    <p className="text-sm text-slate-600">
                        Data Structures – 10:00 AM
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>



                {/* Attendance Visualization */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800">Attendance Analysis</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <AttendanceChart attendance={stats.subjectAttendance} />
                        <AttendanceTable attendance={stats.subjectAttendance} />
                    </div>
                </div>

                {/* Grievance Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GrievanceForm onSubmit={handleGrievanceSubmit} />
                    <GrievanceStatus grievances={grievances} />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default StudentDashboard;