import { createContext, useState, useEffect, useContext, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);
    const [registrations, setRegistrations] = useState([]);

    const fetchCourses = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await API.get("/common/courses");
            setCourses(data.courses || data); // handle possible {count, courses} structure
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        }
    }, [user]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const addCourse = async (courseData) => {
        try {
            const { data } = await API.post("/admin/courses", courseData);
            setCourses((prev) => [...prev, data.course]);
        } catch (error) {
            console.error("Failed to add course:", error);
        }
    };

    const registerCourse = (course) => {
        // Mocking client-side registration for the student frontend currently, 
        // since we didn't add the /api/student/enroll API. 
        setRegistrations((prev) => {
            if (prev.some(c => c._id === course._id)) return prev;
            return [...prev, course];
        });
    };

    return (
        <CourseContext.Provider value={{
            courses,
            registrations,
            registerCourse,
            addCourse,
            fetchCourses
        }}>
            {children}
        </CourseContext.Provider>
    );
};