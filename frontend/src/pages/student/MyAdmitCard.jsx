import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdmitCardPreview from '../../components/student/AdmitCardPreview';

const MyAdmitCard = () => {
    // Mock data for the student
    const studentData = {
        name: "ASHUTOSH SINGH",
        rollNo: "2021004562",
        course: "B.Tech Computer Science",
        session: "2024-25",
        examDate: "15-May-2024",
        universityName: "EDUSPHERE UNIVERSITY",
        universityLogo: "/assets/logo.png"
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6">
                <header>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Examination</h1>
                    <p className="text-gray-500 mt-1">Access your hall tickets and examination schedule.</p>
                </header>

                <AdmitCardPreview studentData={studentData} />
            </div>
        </DashboardLayout>
    );
};

export default MyAdmitCard;
