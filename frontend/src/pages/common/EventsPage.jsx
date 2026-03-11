import { useContext } from "react";
import { EventContext } from "../../context/EventContext";
import DashboardLayout from "../../components/layout/DashboardLayout";

function EventsPage() {

    const { events } = useContext(EventContext);

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fadeIn">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>

                <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b text-sm text-gray-500">
                            <tr>
                                <th className="py-3">Event</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event._id || event.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 font-medium">
                                        {event.title}
                                    </td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="text-gray-600">
                                        {event.description}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </DashboardLayout>
    );
}

export default EventsPage;