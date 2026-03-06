import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I'm your EduSphere assistant. How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/chat", {
                message: input,
            });

            const botMessage = { role: "assistant", content: response.data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, I'm having trouble connecting to the brain center right now. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: 50,
            scale: 0.9,
            filter: "blur(10px)",
            transition: { duration: 0.2 }
        }
    };

    const messageVariants = {
        hidden: { opacity: 0, x: -10, y: 10 },
        visible: { opacity: 1, x: 0, y: 0 }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="group relative w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl text-white overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.svg
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-indigo-500 rounded-full" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] flex flex-col rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 backdrop-blur-xl bg-white/80"
                    >
                        {/* Glassmorphic Header */}
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <div className="flex items-center space-x-3 relative z-10">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base tracking-tight text-white">EduSphere AI</h3>
                                    <p className="text-[10px] uppercase font-semibold text-blue-100/80 tracking-widest">Active Assistant</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-white/40">
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    variants={messageVariants}
                                    className={`flex items-end space-x-2 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}
                                >
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${msg.role === "user"
                                            ? "bg-indigo-100 text-indigo-600 border-indigo-200"
                                            : "bg-blue-600 text-white border-blue-400"
                                        }`}>
                                        {msg.role === "user" ? "U" : "AI"}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-medium rounded-br-none"
                                            : "bg-white/90 text-slate-700 border border-slate-100 rounded-bl-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                        AI
                                    </div>
                                    <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                                        <div className="flex space-x-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ y: [0, -4, 0] }}
                                                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                                    className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Glassmorphic Input Area */}
                        <div className="p-4 bg-white/60 border-t border-white/20 backdrop-blur-md">
                            <form
                                onSubmit={handleSend}
                                className="relative flex items-center bg-white/80 border border-slate-200 rounded-2xl p-1 shadow-inner focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-400/10 transition-all duration-300"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent border-none px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-45 transform -translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </motion.button>
                            </form>
                            <p className="text-center text-[9px] text-slate-400 mt-2 font-medium tracking-wide">
                                Powered by EduSphere Intelligent Engine
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Styles for Scrollbar */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
        </div>
    );
};

export default Chatbot;
