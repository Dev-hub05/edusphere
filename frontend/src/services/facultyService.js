import API from "./api";

// Dashboard
export const getFacultyDashboardStats = async () => {
    const { data } = await API.get("/faculty/dashboard");
    return data;
};

// Courses
export const getMyCourses = async () => {
    const { data } = await API.get("/faculty/courses");
    return data;
};

// Students
export const getStudents = async (params) => {
    const { data } = await API.get("/faculty/students", { params });
    return data;
};

// Attendance
export const markAttendance = async (attendanceData) => {
    const { data } = await API.post("/faculty/attendance", attendanceData);
    return data;
};

export const getFacultyAttendance = async (params) => { // Renamed from getAttendance
    const { data } = await API.get("/faculty/attendance", { params });
    return data;
};

export const getLowAttendanceStudents = async (params) => {
    const { data } = await API.get("/faculty/attendance/low", { params });
    return data;
};

export const getLowAttendanceStudents = async (params) => {
    const { data } = await API.get("/faculty/attendance/low", { params });
    return data;
};

// Results
export const uploadMarks = async (marksData) => {
    const { data } = await API.post("/faculty/results", marksData);
    return data;
};

export const getResults = async (params) => {
    const { data } = await API.get("/faculty/results", { params });
    return data;
};

// Grievances
export const getGrievances = async (params) => {
    const { data } = await API.get("/faculty/grievances", { params });
    return data;
};

export const respondToGrievance = async (id, responseData) => {
    const { data } = await API.put(`/faculty/grievances/${id}`, responseData);
    return data;
};