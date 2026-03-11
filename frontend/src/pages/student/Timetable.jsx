import { useContext, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WeeklyTimetable from "../../components/common/WeeklyTimetable";
import { AuthContext } from "../../context/AuthContext";
import { TimetableContext } from "../../context/TimetableContext";

function Timetable() {
    const { user } = useContext(AuthContext);
    const { fetchTimetable } = useContext(TimetableContext);

    useEffect(() => {
        if (user) {
            fetchTimetable(user.department, user.semester);
        }
    }, [user, fetchTimetable]);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">

                <h2 className="text-xl font-semibold">
                    My Class Timetable ({user?.department} Sem {user?.semester})
                </h2>

                <WeeklyTimetable />

            </div>
        </DashboardLayout>
    );
}

export default Timetable;