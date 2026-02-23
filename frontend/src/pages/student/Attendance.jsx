import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStudentAttendance } from "../../services/studentService";

function Attendance() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getStudentAttendance();
                setAttendance(data);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fadeIn">
                <div className="p-6 border-b bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">
                        Detailed Attendance Record
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Track your subject-wise presence across the semester.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-600 text-white">
                            <tr>
                                <th className="p-4 text-left font-semibold uppercase tracking-wider">Subject</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Total Classes</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Attended</th>
                                <th className="p-4 text-right font-semibold uppercase tracking-wider">Percentage (%)</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700 divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400">
                                        Loading academic records...
                                    </td>
                                </tr>
                            ) : attendance.length > 0 ? (
                                attendance.map((row, idx) => (
                                    <AttendanceRow 
                                        key={idx}
                                        subject={row.subject} 
                                        held={row.totalClasses} 
                                        attended={row.classesAttended} 
                                        percent={`${row.percentage}%`} 
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400">
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

function AttendanceRow({ subject, held, attended, percent }) {
    const isLow = parseFloat(percent) < 75;

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-4 font-medium text-slate-800">{subject}</td>
            <td className="p-4 text-center">{held}</td>
            <td className="p-4 text-center">{attended}</td>
            <td className={`p-4 text-right font-bold ${isLow ? 'text-red-500' : 'text-indigo-600'}`}>
                {percent}
            </td>
        </tr>
    );
}

export default Attendance;