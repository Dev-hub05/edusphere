import API from "./api";

// Dashboard Stats
export const getStudentDashboardStats = async () => {
    const response = await API.get("/student/dashboard");
    return response.data;
};

// Profile
export const getStudentProfile = async () => {
    const response = await API.get("/student/profile");
    return response.data;
};

export const updateStudentProfile = async (profileData) => {
    const response = await API.put("/student/profile", profileData);
    return response.data;
};

// Attendance
export const getStudentAttendance = async () => {
    const response = await API.get("/student/attendance");
    return response.data;
};

// Results
export const getStudentResults = async () => {
    const response = await API.get("/student/results");
    return response.data;
};

// Notifications
export const getStudentNotifications = async () => {
    const response = await API.get("/student/notifications");
    return response.data;
};

// Grievances
export const submitGrievance = async (grievanceData) => {
    const response = await API.post("/student/grievance", grievanceData);
    return response.data;
};

export const getStudentGrievances = async () => {
    const response = await API.get("/student/grievances");
    return response.data;
};
