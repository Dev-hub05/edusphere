import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { getStudentResults } from "../../services/studentService";

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getStudentResults();
                setResults(data);
            } catch (error) {
                console.error("Error fetching results:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fadeIn">
                <div className="p-6 border-b bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">
                        Academic Results
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Official marks and grades for your completed examinations.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-emerald-600 text-white">
                            <tr>
                                <th className="p-4 text-left font-semibold uppercase tracking-wider">Subject</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Exam Type</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Semester</th>
                                <th className="p-4 text-center font-semibold uppercase tracking-wider">Marks</th>
                                <th className="p-4 text-right font-semibold uppercase tracking-wider">Grade</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700 divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400">
                                        Loading results...
                                    </td>
                                </tr>
                            ) : results.length > 0 ? (
                                results.map((result, idx) => (
                                    <ResultRow 
                                        key={idx}
                                        subject={result.subject} 
                                        examType={result.examType}
                                        semester={result.semester}
                                        marks={`${result.marks}/${result.totalMarks}`} 
                                        grade={result.grade} 
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400">
                                        No results declared yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

function ResultRow({ subject, examType, semester, marks, grade }) {
    const isPass = grade !== "F";

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="p-4 font-medium text-slate-800">{subject}</td>
            <td className="p-4 text-center capitalize">{examType}</td>
            <td className="p-4 text-center">S{semester}</td>
            <td className="p-4 text-center font-semibold">{marks}</td>
            <td className={`p-4 text-right font-bold ${!isPass ? 'text-red-500' : 'text-emerald-600'}`}>
                {grade}
            </td>
        </tr>
    );
}

export default Results;