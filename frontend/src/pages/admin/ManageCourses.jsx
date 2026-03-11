import { useContext, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { CourseContext } from "../../context/CourseContext";

function ManageCourses() {

    const { courses, addCourse } = useContext(CourseContext);

    const [form, setForm] = useState({
        code: "",
        name: "",
        faculty: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addCourse(form);

        setForm({
            code: "",
            name: "",
            faculty: ""
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">

                <h2 className="text-xl font-semibold">
                    Manage Courses
                </h2>

                {/* Add Course Form */}
                <div className="bg-white rounded-2xl shadow-md p-6 max-w-xl">

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            name="code"
                            placeholder="Course Code"
                            value={form.code}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md"
                            required
                        />

                        <input
                            name="name"
                            placeholder="Course Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md"
                            required
                        />

                        <input
                            name="faculty"
                            placeholder="Assigned Faculty"
                            value={form.faculty}
                            onChange={handleChange}
                            className="w-full border p-2 rounded-md"
                            required
                        />

                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                        >
                            Add Course
                        </button>

                    </form>

                </div>

                {/* Course List */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                    <table className="min-w-full text-sm">

                        <thead className="bg-indigo-50 text-indigo-700">
                            <tr>
                                <th className="p-4 text-left">Code</th>
                                <th className="p-4 text-left">Course</th>
                                <th className="p-4 text-left">Faculty</th>
                            </tr>
                        </thead>

                        <tbody>
                            {courses.map(course => (
                                <tr key={course._id || course.id} className="border-t">
                                    <td className="p-4">{course.courseCode || course.code}</td>
                                    <td className="p-4">{course.title || course.name}</td>
                                    <td className="p-4">{course.faculty?.name || course.faculty}</td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>
        </DashboardLayout>
    );
}

export default ManageCourses;