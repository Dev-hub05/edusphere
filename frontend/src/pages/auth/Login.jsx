import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import doodle from "../../assets/images/doodle2.jpg";

function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await login({ email, password });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-600"></div>
            
            <div
                className="absolute inset-0 bg-center bg-repeat opacity-20"
                style={{ backgroundImage: `url(${doodle})` }}
            ></div>
            <div className="absolute inset-0 bg-indigo-900 opacity-40"></div>

            <div className="relative z-10 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md animate-fadeIn">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    EduSphere
                </h2>
                <p className="text-center text-slate-500 mb-8 text-sm">
                    University Management System
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="student@edu.com"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                    
                    <p className="text-xs text-center text-slate-400 mt-4">
                        Demo: student@edu.com / password123
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
