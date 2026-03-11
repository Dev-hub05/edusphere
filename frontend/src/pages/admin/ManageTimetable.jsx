import { useState, useContext, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { TimetableContext } from "../../context/TimetableContext";
import { CourseContext } from "../../context/CourseContext";

function ManageTimetable() {

    const { addLecture } = useContext(TimetableContext);
    const { courses, fetchCourses } = useContext(CourseContext);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const [form, setForm] = useState({
        course: "",
        department: "Computer Science",
        semester: 1,
        day: "",
        startTime: "",
        endTime: "",
        roomContext: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addLecture(form);
        setForm({
            course: "",
            department: form.department,
            semester: form.semester,
            day: "",
            startTime: "",
            endTime: "",
            roomContext: ""
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    Manage Timetable
                </h2>

                <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <select name="course"
                                value={form.course}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md" required>
                                <option value="">Select Course</option>
                                {courses.map(c => (
                                    <option key={c._id || c.id} value={c._id || c.id}>{c.title || c.name}</option>
                                ))}
                            </select>

                            <input name="department" placeholder="Department"
                                value={form.department}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md" required />

                            <input name="semester" placeholder="Semester" type="number"
                                value={form.semester}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md" required />

                            <select name="day"
                                value={form.day}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md" required>
                                <option value="">Select Day</option>
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>
                            </select>

                            <input name="startTime" placeholder="Start Time (e.g., 10:00 AM)"
                                value={form.startTime}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md" required />
                                
                            <input name="endTime" placeholder="End Time (e.g., 11:00 AM)"
                                value={form.endTime}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md" required />
                                
                            <input name="roomContext" placeholder="Room/Lab (Optional)"
                                value={form.roomContext}
                                onChange={handleChange}
                                className="w-full border p-2 rounded-md col-span-2" />
                        </div>

                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 w-full mt-4">
                            Add Lecture
                        </button>

                    </form>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default ManageTimetable;