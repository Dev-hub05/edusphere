import { useContext } from "react";
import { TimetableContext } from "../../context/TimetableContext";

function WeeklyTimetable() {

    const { timetable } = useContext(TimetableContext);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Unique time slots
    const timeSlots = [...new Set(timetable.map(l => `${l.startTime} - ${l.endTime}`))];

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-x-auto">

            <table className="min-w-full text-sm text-center">
                <thead className="bg-indigo-50 text-indigo-700">
                    <tr>
                        <th className="p-4 text-left">Time</th>
                        {days.map(day => (
                            <th key={day} className="p-4">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {timeSlots.map(slot => (
                        <tr key={slot} className="border-t">

                            <td className="p-4 font-medium text-left">
                                {slot}
                            </td>

                            {days.map(day => {
                                const lecture = timetable.find(
                                    l => l.day === day && `${l.startTime} - ${l.endTime}` === slot
                                );

                                return (
                                    <td key={day} className="p-4">
                                        {lecture ? (
                                            <div className="bg-indigo-100 rounded-lg p-2 text-xs h-full flex flex-col justify-center min-h-[4rem]">
                                                <p className="font-semibold text-indigo-900 leading-tight mb-1">
                                                    {lecture.course?.title || "Unknown Course"}
                                                </p>
                                                <p className="text-indigo-600 font-medium text-[10px]">
                                                    By {lecture.course?.faculty?.name || "Faculty"}
                                                </p>
                                                {lecture.roomContext && (
                                                    <p className="text-gray-500 text-[10px] mt-1">
                                                        {lecture.roomContext}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-gray-300">-</div>
                                        )}
                                    </td>
                                );
                            })}

                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}

export default WeeklyTimetable;