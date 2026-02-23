import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStudentNotifications } from "../../services/studentService";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await getStudentNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <DashboardLayout>
            <div className="max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Announcements & Notices</h2>
                    <p className="text-slate-500">Stay updated with the latest news from the university.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <p className="text-slate-400">Fetching messages...</p>
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notice) => (
                            <NotificationCard
                                key={notice._id}
                                title={notice.title}
                                type={notice.type}
                                date={new Date(notice.createdAt).toLocaleDateString()}
                                author={notice.createdBy?.name || "System"}
                                message={notice.message}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
                        <p className="text-slate-500">No new notifications.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function NotificationCard({ title, type, date, author, message }) {
    const typeStyles = {
        exam: "bg-red-100 text-red-700",
        holiday: "bg-green-100 text-green-700",
        deadline: "bg-orange-100 text-orange-700",
        announcement: "bg-blue-100 text-blue-700",
        general: "bg-slate-100 text-slate-700"
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-500 hover:shadow-md transition-shadow animate-fadeIn">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${typeStyles[type] || typeStyles.general}`}>
                        {type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-1">{title}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{date}</span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">{message}</p>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {author.charAt(0)}
                </div>
                <span className="text-xs text-slate-500 font-medium">Posted by <span className="text-slate-700">{author}</span></span>
            </div>
        </div>
    );
}

export default Notifications;