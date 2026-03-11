import { useContext } from "react";
import { NoticeContext } from "../../context/NoticeContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

function NoticeBoard() {

    const { notices } = useContext(NoticeContext);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">Notice Board</h2>

                {notices.map((notice) => (
                    <div key={notice._id || notice.id} className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="font-semibold text-lg mb-2">
                            {notice.title}
                        </h3>
                        <p className="text-gray-600">
                            {notice.content}
                        </p>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}

export default NoticeBoard;