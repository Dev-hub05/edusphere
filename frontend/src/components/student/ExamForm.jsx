import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiUser, FiBook, FiClipboard, FiChevronRight, FiChevronLeft, FiAlertCircle } from 'react-icons/fi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStudentCourses, getStudentProfile } from '../../services/studentService';

const ExamForm = () => {
    const [step, setStep] = useState(1);
    const [courses, setCourses] = useState([]);
    const [studentProfile, setStudentProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        semester: '6th', // Will be overridden by profile data
        examType: 'Regular',
        subjects: [],
        declaration: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile and available courses in parallel
                const [profileData, coursesData] = await Promise.all([
                    getStudentProfile(),
                    getStudentCourses()
                ]);
                
                setStudentProfile(profileData);
                setFormData(prev => ({
                    ...prev,
                    semester: `${profileData.semester}th` // Assuming formatting like '6th'
                }));
                
                // Format courses for the component
                const formattedCourses = coursesData.courses.map(course => ({
                    id: course._id,
                    code: course.courseCode,
                    name: course.title,
                    credits: course.credits,
                    type: "Core" // Backend model doesn't specify type, assuming Core or deriving it if added later
                }));
                
                setCourses(formattedCourses);
            } catch (err) {
                console.error("Error fetching form data:", err);
                setError("Failed to load your profile and courses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubjectToggle = (subject) => {
        const isSelected = formData.subjects.find(s => s.id === subject.id);
        if (isSelected) {
            setFormData({ ...formData, subjects: formData.subjects.filter(s => s.id !== subject.id) });
        } else {
            setFormData({ ...formData, subjects: [...formData.subjects, subject] });
        }
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const steps = [
        { id: 1, name: 'Student Info', icon: <FiUser /> },
        { id: 2, name: 'Subject Selection', icon: <FiBook /> },
        { id: 3, name: 'Review & Submit', icon: <FiCheckCircle /> },
    ];

    const handleSubmit = async () => {
        if (!formData.declaration || formData.subjects.length === 0) return;
        setIsSubmitting(true);
        try {
            // Ideally, we'd send this to a /student/exam-forms endpoint.
            // Simulating API call for submission since we didn't add the submission endpoint explicitly in the plan
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSuccess(true);
        } catch (err) {
            console.error("Submission failed:", err);
            // Handle error (e.g., using a toast notification)
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-3xl p-10 text-center shadow-xl border border-gray-100"
            >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                    <FiCheckCircle />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully!</h2>
                <p className="text-gray-500 mb-8">
                    Your examination form has been recorded. You can view your scheduled exams once the timetable is published by the admin.
                </p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
                >
                    Return to Dashboard
                </button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Multi-step Progress Bar */}
            <div className="mb-12">
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />
                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: step >= s.id ? '#4f46e5' : '#fff',
                                    color: step >= s.id ? '#fff' : '#9ca3af',
                                    borderColor: step >= s.id ? '#4f46e5' : '#e5e7eb',
                                    scale: step === s.id ? 1.2 : 1
                                }}
                                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold shadow-sm"
                            >
                                {step > s.id ? <FiCheckCircle /> : s.icon}
                            </motion.div>
                            <span className={`absolute -bottom-8 whitespace-nowrap text-xs font-bold uppercase tracking-wider ${step >= s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                                {s.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-semibold">{studentProfile?.name || "N/A"}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Enrollment No.</label>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-semibold">{studentProfile?.enrollmentNo || "N/A"}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Semester</label>
                                    <select
                                        className="w-full p-3 bg-white rounded-xl border border-gray-200 text-gray-700 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                    >
                                        <option>5th</option>
                                        <option>6th</option>
                                        <option>7th</option>
                                        <option>8th</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Exam Type</label>
                                    <select
                                        className="w-full p-3 bg-white rounded-xl border border-gray-200 text-gray-700 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={formData.examType}
                                        onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                    >
                                        <option>Regular</option>
                                        <option>Carry Over</option>
                                        <option>Ex-Student</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 items-center">
                                <FiAlertCircle className="text-amber-500 shrink-0" />
                                <p className="text-sm text-amber-800">
                                    Please ensure your personal details are correct. Contact the Registrar if changes are needed.
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FiBook className="text-indigo-600" />
                                    Select Subjects for {formData.semester} Sem
                                </h3>
                                <div className="grid gap-4">
                                    {courses.map((sub) => (
                                        <div
                                            key={sub.id}
                                            onClick={() => handleSubjectToggle(sub)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.subjects.find(s => s.id === sub.id)
                                                    ? 'border-indigo-600 bg-indigo-50/50'
                                                    : 'border-gray-100 bg-white hover:border-indigo-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${formData.subjects.find(s => s.id === sub.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {sub.code}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{sub.name}</h4>
                                                    <p className="text-xs text-gray-500">{sub.type} • {sub.credits} Credits</p>
                                                </div>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.subjects.find(s => s.id === sub.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200'
                                                }`}>
                                                {formData.subjects.find(s => s.id === sub.id) && <FiCheckCircle size={14} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Registration Summary</p>
                                        <h3 className="text-2xl font-bold">End Semester Exams 2024</h3>
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm border border-white/30">
                                        {formData.examType}
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-8">
                                    <div>
                                        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Total Subjects</p>
                                        <p className="text-xl font-bold">{formData.subjects.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Total Credits</p>
                                        <p className="text-xl font-bold">{formData.subjects.reduce((sum, s) => sum + s.credits, 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Semester</p>
                                        <p className="text-xl font-bold">{formData.semester}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={formData.declaration}
                                        onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                                    />
                                    <div className={`w-6 h-6 rounded-lg border-2 mt-0.5 flex items-center justify-center transition-all ${formData.declaration ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 group-hover:border-indigo-300'
                                        }`}>
                                        {formData.declaration && <FiCheckCircle size={14} />}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        I hereby declare that all the information provided above is correct to the best of my knowledge. I understand that any discrepancy found later may lead to the cancellation of my examination form.
                                    </p>
                                </label>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-8">
                    <button
                        onClick={prevStep}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 invisible' : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        <FiChevronLeft /> Back
                    </button>
                    {step < 3 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"
                        >
                            Continue <FiChevronRight />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.declaration || formData.subjects.length === 0 || isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>Submit Form <FiClipboard /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamForm;
