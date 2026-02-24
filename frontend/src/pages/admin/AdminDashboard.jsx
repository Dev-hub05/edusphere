import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/common/StatCard";
import ReportsAnalytics from "../../components/admin/ReportsAnalytics";
import AcademicCalendar from "../../components/admin/AcademicCalendar";
import NoticeManagement from "../../components/admin/NoticeManagement";
import RoleManagement from "../../components/admin/RoleManagement";
import UserManagement from "../../components/admin/UserManagement";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/adminService";
import NoticeWidget from "../../components/common/NoticeWidget";
import EventWidget from "../../components/common/EventWidget";

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAdminStats()
            .then(data => setStats(data))
            .catch(() => setError("Failed to load admin data"))
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

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Students" value={stats.students} />
                    <StatCard title="Total Faculty" value={stats.faculty} />
                    <StatCard title="Active Notices" value={stats.notices} />
                </div>
                <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="font-semibold mb-3">Timetable Overview</h3>
                    <p className="text-sm text-slate-600">
                        25 lectures scheduled this week.
                    </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NoticeWidget />
                    <EventWidget />
                </div>

                {/* Reports */}
                <ReportsAnalytics />

                {/* Calendar + Notices */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AcademicCalendar />
                    <NoticeManagement />
                </div>

                {/* Roles + Users */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RoleManagement />
                    <UserManagement />
                </div>

            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;