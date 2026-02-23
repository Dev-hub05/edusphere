import { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import { getStudentProfile } from "../../services/studentService";

function Profile() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getStudentProfile();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                // Fallback to context user if API fails
                setProfile(user);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-slate-500">Loading Profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl animate-fadeIn">
                <h2 className="text-2xl font-semibold text-slate-700 mb-8 border-b pb-4">
                    Student Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
                    <ProfileItem label="Full Name" value={profile?.name} />
                    <ProfileItem label="Email Address" value={profile?.email} />
                    <ProfileItem label="Department" value={profile?.department || "Not Assigned"} />
                    <ProfileItem label="Current Semester" value={profile?.semester || "N/A"} />
                    <ProfileItem label="Enrollment Number" value={profile?.enrollmentNo || "N/A"} />
                    <ProfileItem label="Phone Number" value={profile?.phone || "Not Provided"} />
                    <ProfileItem label="Account Status" value={profile?.isActive ? "Active" : "Inactive"} success={profile?.isActive} />
                </div>
            </div>
        </DashboardLayout>
    );
}

function ProfileItem({ label, value, success }) {
    return (
        <div className="flex flex-col">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={`text-lg font-semibold mt-1 ${success === true ? "text-green-600" : success === false ? "text-red-500" : "text-slate-800"}`}>
                {value}
            </p>
        </div>
    );
}

export default Profile;