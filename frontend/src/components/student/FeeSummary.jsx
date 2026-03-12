import React from 'react';
import { motion } from 'framer-motion';
import { FiCreditCard, FiClock, FiCheckCircle, FiShield } from 'react-icons/fi';

const FeeSummary = ({ feeData }) => {
    const { totalDue, paidAmount, pendingAmount, lastPayment } = feeData;

    const stats = [
        { label: 'Total Outstanding', value: `₹${totalDue.toLocaleString()}`, icon: <FiCreditCard />, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Total Paid', value: `₹${paidAmount.toLocaleString()}`, icon: <FiCheckCircle />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Dues', value: `₹${pendingAmount.toLocaleString()}`, icon: <FiClock />, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                >
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 opacity-40 blur-2xl group-hover:scale-150 transition-transform duration-500`} />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl shadow-inner`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                        </div>
                    </div>
                </motion.div>
            ))}

            {lastPayment && (
                <div className="md:col-span-3 mt-2 bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-xl backdrop-blur-md">
                                <FiShield className="text-indigo-200" />
                            </div>
                            <div>
                                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Last Transaction</p>
                                <p className="text-lg font-bold">₹{lastPayment.amount.toLocaleString()} paid for {lastPayment.type}</p>
                            </div>
                        </div>
                        <div className="px-6 py-2 bg-indigo-600/50 hover:bg-indigo-600 rounded-xl border border-white/20 backdrop-blur-sm transition-colors text-sm font-bold cursor-default">
                            Ref: {lastPayment.ref}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeeSummary;
