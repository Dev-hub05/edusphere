import { useContext, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { TimetableContext } from "../../context/TimetableContext";
import { AuthContext } from "../../context/AuthContext";

function FacultyTimetable() {

    const { timetable, fetchTimetable } = useContext(TimetableContext);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchTimetable();
    }, [fetchTimetable]);

    const myLectures = timetable.filter(
        lecture => lecture.course?.faculty?._id === user?._id || lecture.course?.faculty === user?._id
    );

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    My Lecture Schedule
                </h2>

                <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-indigo-50 text-indigo-700">
                            <tr>
                                <th className="p-4 text-left">Class</th>
                                <th className="p-4 text-left">Subject</th>
                                <th className="p-4 text-left">Day</th>
                                <th className="p-4 text-left">Time</th>
                                <th className="p-4 text-left">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {myLectures.map(lecture => (
                                <tr key={lecture._id || lecture.id} className="border-t">
                                    <td className="p-4">{lecture.department} Sem {lecture.semester}</td>
                                    <td className="p-4">{lecture.course?.title || lecture.subject}</td>
                                    <td className="p-4">{lecture.day}</td>
                                    <td className="p-4">{lecture.startTime} - {lecture.endTime}</td>
                                    <td className="p-4">
                                        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-xs">
                                            Mark Attendance
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default FacultyTimetable;