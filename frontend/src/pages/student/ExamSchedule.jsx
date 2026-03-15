import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { getStudentExamSchedule } from '../../services/studentService';

const ExamSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await getStudentExamSchedule();
                // Map API data to the component's expected format
                const formattedSchedule = data.exams.map((exam, index) => ({
                    id: exam._id || index,
                    subject: exam.course ? exam.course.title : "Unknown Subject",
                    code: exam.course ? exam.course.courseCode : "N/A",
                    date: new Date(exam.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    time: `${exam.startTime} - ${exam.endTime}`,
                    venue: exam.venue
                }));
                setSchedule(formattedSchedule);
            } catch (err) {
                console.error("Error fetching exam schedule:", err);
                setError("Failed to load examination schedule.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
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

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Examination Schedule</h1>
                    <p className="text-gray-500 mt-1">View your upcoming examination dates and venues.</p>
                </header>

                <div className="grid grid-cols-1 gap-4">
                    {schedule.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                                        {item.code}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{item.subject}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><FiCalendar className="text-indigo-400" /> {item.date}</span>
                                            <span className="flex items-center gap-1"><FiClock className="text-indigo-400" /> {item.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 self-start md:self-center">
                                    <FiMapPin className="text-indigo-500" />
                                    <span className="text-sm font-semibold text-gray-700">{item.venue}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ExamSchedule;
