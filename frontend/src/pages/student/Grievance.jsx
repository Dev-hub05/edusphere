import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { submitGrievance, getStudentGrievances } from "../../services/studentService";

function Grievance() {
    const [grievances, setGrievances] = useState([]);
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchGrievances = async () => {
        try {
            const data = await getStudentGrievances();
            setGrievances(data);
        } catch (error) {
            console.error("Error fetching grievances:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrievances();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            await submitGrievance({ subject, description });
            setSuccessMessage("Your grievance has been submitted successfully.");
            setSubject("");
            setDescription("");
            fetchGrievances(); // Refresh list
        } catch (error) {
            console.error("Error submitting grievance:", error);
            alert("Failed to submit grievance. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
                {/* Submit Form */}
                <div className="bg-white rounded-2xl shadow-md p-8 h-fit">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">
                        New Support Request / Grievance
                    </h2>

                    {successMessage && (
                        <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                            <span>✅</span> {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Subject</label>
                            <input
                                type="text"
                                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g., Marks Discrepancy, Library Access"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                            <textarea
                                rows="5"
                                className="w-full border border-slate-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Describe your issue in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Grievance"}
                        </button>
                    </form>
                </div>

                {/* History List */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-6 border-b bg-slate-50">
                        <h2 className="text-xl font-bold text-slate-800">My Requests History</h2>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-12 text-center text-slate-400">Loading history...</div>
                        ) : grievances.length > 0 ? (
                            grievances.map((item) => (
                                <GrievanceItem key={item._id} data={item} />
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400">No previous grievances found.</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function GrievanceItem({ data }) {
    const statusColors = {
        pending: "bg-orange-100 text-orange-700",
        "in-progress": "bg-blue-100 text-blue-700",
        resolved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700"
    };

    return (
        <div className="p-6 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{data.subject}</h4>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusColors[data.status]}`}>
                    {data.status}
                </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{data.description}</p>
            {data.response && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-indigo-600 mb-1">Official Response:</p>
                    <p className="text-xs text-slate-700 italic">"{data.response}"</p>
                    <div className="mt-2 text-[10px] text-slate-400">
                        Responded by {data.respondedBy?.name || "Faculty"} on {new Date(data.respondedAt).toLocaleDateString()}
                    </div>
                </div>
            )}
            <div className="mt-3 text-[10px] text-slate-300">
                Submitted on {new Date(data.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}

export default Grievance;