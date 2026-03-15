import React, { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getProfile, getStudentExamSchedule } from '../../services/studentService';

const AdmitCardTemplate = ({ studentData }) => {
    const [data, setData] = useState(studentData || null);
    const [loading, setLoading] = useState(!studentData);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If data is provided via props (e.g., admin printing it), don't fetch
        if (studentData) return;

        const fetchAdmitCardData = async () => {
            try {
                const [profile, schedule] = await Promise.all([
                    getProfile(),
                    getStudentExamSchedule()
                ]);

                // Create a dynamic data object from fetched backend info
                setData({
                    name: profile.name,
                    rollNo: profile.enrollmentNo,
                    course: "B.Tech " + profile.department,
                    session: "2023-24", // Assuming static or from settings in a real app
                    examDate: schedule.exams.length > 0 
                        ? new Date(schedule.exams[0].date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
                        : "TBD",
                    universityName: "EDUSPHERE UNIVERSITY",
                    universityLogo: "/assets/logo.png"
                });
            } catch (err) {
                console.error("Error fetching admit card data:", err);
                setError("Failed to generate admit card data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdmitCardData();
    }, [studentData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    const {
        name,
        rollNo,
        course,
        session,
        examDate,
        universityName,
        universityLogo
    } = data;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between border-b-2 border-indigo-600 pb-6 mb-8 relative z-10">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-20 h-20 bg-indigo-100 rounded-xl flex items-center justify-center p-2">
                        <img src={universityLogo} alt="University Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{universityName}</h1>
                        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest">Hall Ticket / Admit Card</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100 mb-2">
                        Session: {session}
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">

                {/* Left Column: Student Photo & QR */}
                <div className="md:col-span-1 flex flex-col items-center gap-6">
                    <div className="w-full aspect-[3/4] bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                            <span className="text-xs font-medium text-center px-4 uppercase">Affix Passport Size Photograph</span>
                        </div>
                    </div>
                    <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        {/* Simple QR Code Placeholder */}
                        <div className="w-full h-full bg-gray-100 grid grid-cols-3 grid-rows-3 gap-1 p-1">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className={`bg-gray-${i % 2 === 0 ? '800' : '300'} rounded-[1px]`}></div>
                            ))}
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono text-center">SCAN TO VERIFY</p>
                </div>

                {/* Right Column: Student Details */}
                <div className="md:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                        <DetailItem label="Full Name" value={name} highlight />
                        <DetailItem label="Roll Number" value={rollNo} highlight />
                        <DetailItem label="Course / Program" value={course} />
                        <DetailItem label="Date of Birth" value="12-08-2002" />
                        <DetailItem label="Contact Number" value="+91 98765 43210" />
                        <DetailItem label="Email Address" value="student@edusphere.edu" />
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Exam Schedule Info</h3>
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Reporting Time</span>
                            <span className="text-sm font-bold text-gray-800">09:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-200">
                            <span className="text-sm text-gray-600">Exam Start Time</span>
                            <span className="text-sm font-bold text-gray-800">10:00 AM</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Venue</span>
                            <span className="text-sm font-bold text-gray-800 text-right">University Main Campus, Block B</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Instructions */}
            <div className="mt-12 pt-8 border-t border-gray-100 relative z-10">
                <h2 className="text-sm font-bold text-gray-800 mb-4 inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    Important Instructions
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {instructions.map((inst, idx) => (
                        <li key={idx} className="text-[11px] text-gray-600 flex gap-2">
                            <span className="text-indigo-600 font-bold">{idx + 1}.</span>
                            {inst}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Signatures */}
            <div className="mt-12 flex justify-between items-end relative z-10 px-4">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-12 border-b border-gray-400 mb-2"></div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Student's Signature</p>
                </div>
                <div className="flex flex-col items-center">
                    <img src="/assets/signature_placeholder.png" alt="Controller of Exams" className="h-12 object-contain hidden" />
                    <div className="w-32 h-12 border-b border-gray-400 mb-2 flex items-center justify-center italic text-indigo-700 font-serif opacity-70">EduSphere Exam Cell</div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Controller of Examinations</p>
                </div>
            </div>

            {/* Print Button Wrapper - Hidden during actual print */}
            <div className="absolute top-4 right-4 print:hidden">
                {/* This would normally be handled by the parent Preview component */}
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, highlight = false }) => (
    <div className="flex flex-col">
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-base font-semibold ${highlight ? 'text-indigo-900' : 'text-gray-700'}`}>{value}</span>
    </div>
);

const instructions = [
    "Candidates must carry a valid ID proof along with this admit card.",
    "Electronic gadgets including mobile phones and smartwatches are strictly prohibited.",
    "Report at the examination center at least 60 minutes before the scheduled time.",
    "The entry will be closed 15 minutes prior to the commencement of the exam.",
    "No candidate will be allowed to leave the hall before the end of the session.",
    "Malpractice in any form will lead to immediate cancellation of candidature."
];

export default AdmitCardTemplate;
