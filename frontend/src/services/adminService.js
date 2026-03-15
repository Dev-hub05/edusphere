import API from "./api";

// Dashboard
export const getAdminStats = async () => {
    const { data } = await API.get("/admin/dashboard");
    return data;
};

// Users
export const getUsers = async (params) => {
    const { data } = await API.get("/admin/users", { params });
    return data;
};

export const createUser = async (userData) => {
    const { data } = await API.post("/admin/users", userData);
    return data;
};

export const updateUser = async (id, userData) => {
    const { data } = await API.put(`/admin/users/${id}`, userData);
    return data;
};

export const deleteUser = async (id) => {
    const { data } = await API.delete(`/admin/users/${id}`);
    return data;
};

// Courses
export const getCourses = async () => {
    const { data } = await API.get("/admin/courses");
    return data;
};

export const createCourse = async (courseData) => {
    const { data } = await API.post("/admin/courses", courseData);
    return data;
};

export const updateCourse = async (id, courseData) => {
    const { data } = await API.put(`/admin/courses/${id}`, courseData);
    return data;
};

export const deleteCourse = async (id) => {
    const { data } = await API.delete(`/admin/courses/${id}`);
    return data;
};

// Notices
export const getNotices = async () => {
    const { data } = await API.get("/admin/notices");
    return data;
};

export const createNotice = async (noticeData) => {
    const { data } = await API.post("/admin/notices", noticeData);
    return data;
};

export const deleteNotice = async (id) => {
    const { data } = await API.delete(`/admin/notices/${id}`);
    return data;
};

// Events
export const getEvents = async () => {
    const { data } = await API.get("/admin/events");
    return data;
};

export const createEvent = async (eventData) => {
    const { data } = await API.post("/admin/events", eventData);
    return data;
};

export const updateEvent = async (id, eventData) => {
    const { data } = await API.put(`/admin/events/${id}`, eventData);
    return data;
};

export const deleteEvent = async (id) => {
    const { data } = await API.delete(`/admin/events/${id}`);
    return data;
};

// Fees
export const getFees = async (params) => {
    const { data } = await API.get("/admin/fees", { params });
    return data;
};

export const createFee = async (feeData) => {
    const { data } = await API.post("/admin/fees", feeData);
    return data;
};

export const updateFee = async (id, feeData) => {
    const { data } = await API.put(`/admin/fees/${id}`, feeData);
    return data;
};

// Grievances
export const getGrievances = async (params) => {
    const { data } = await API.get("/admin/grievances", { params });
    return data;
};

export const respondToGrievance = async (id, responseData) => {
    const { data } = await API.put(`/admin/grievances/${id}`, responseData);
    return data;
};

// Notifications
export const createNotification = async (notificationData) => {
    const { data } = await API.post("/admin/notifications", notificationData);
    return data;
};

// Reports
export const getAttendanceReports = async () => {
    const { data } = await API.get("/admin/reports/attendance");
    return data;
};