import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FeeSummary from '../../components/student/FeeSummary';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiShield, FiCreditCard, FiArrowRight, FiInfo } from 'react-icons/fi';
import { getStudentFees } from '../../services/studentService';

const FeePayment = () => {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const data = await getStudentFees();
                setFees(data);
            } catch (err) {
                console.error("Error fetching fees for payment:", err);
                setError("Failed to load fee information. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <Loader />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <ErrorMessage message={error} />
            </DashboardLayout>
        );
    }

    // Calculate summary data from the actual fee records
    const totalDue = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
    const pendingAmount = totalDue - paidAmount;
    
    // Find the most recent paid fee
    const sortedPaidFees = [...fees].filter(f => f.status === 'paid').sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate));
    const lastPayment = sortedPaidFees.length > 0 ? {
        amount: sortedPaidFees[0].amount,
        type: sortedPaidFees[0].type,
        ref: sortedPaidFees[0].transactionId || 'N/A'
    } : null;

    const summaryData = {
        totalDue,
        paidAmount,
        pendingAmount,
        lastPayment
    };

    const paymentMethods = [
        { id: 'upi', name: 'UPI / QR Code', icon: '⚡' },
        { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
        { id: 'netbank', name: 'Net Banking', icon: '🏦' }
    ];

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 3000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fee Payment</h1>
                    <p className="text-gray-500 mt-1">Settle your semester dues through our secure gateway.</p>
                </header>

                <FeeSummary feeData={summaryData} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FiCreditCard className="text-indigo-600" />
                                Payment Selection
                            </h3>

                            {!isSuccess ? (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setSelectedMethod(method.id)}
                                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${selectedMethod === method.id
                                                        ? 'border-indigo-600 bg-indigo-50/50'
                                                        : 'border-gray-50 bg-gray-50/50 hover:border-indigo-200'
                                                    }`}
                                            >
                                                <span className="text-3xl">{method.icon}</span>
                                                <span className="text-sm font-bold text-gray-700">{method.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <span className="text-gray-500 font-medium">Select Amount to Pay</span>
                                            <span className="text-indigo-600 font-bold">₹{summaryData.pendingAmount.toLocaleString()}</span>
                                        </div>

                                        <button
                                            onClick={handlePayment}
                                            disabled={!selectedMethod || isProcessing}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>Secure Checkout <FiArrowRight /></>
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <FiShield className="text-green-500" /> SSL SECURE
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <FiCheckCircle className="text-green-500" /> PCI COMPLIANT
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center py-12 text-center"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                                        <FiCheckCircle />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                                    <p className="text-gray-500 max-w-xs mx-auto mb-8">
                                        Your payment of ₹{summaryData.pendingAmount.toLocaleString()} has been processed and your records are updated.
                                    </p>
                                    <div className="flex gap-4">
                                        <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                                            Download Receipt
                                        </button>
                                        <button
                                            onClick={() => { setIsSuccess(false); setSelectedMethod(null); }}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold transition-all"
                                        >
                                            Dashboard
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Important Info */}
                    <div className="space-y-6">
                        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                            <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2">
                                <FiInfo /> Please Note
                            </h3>
                            <ul className="space-y-3">
                                <li className="text-xs text-indigo-700 leading-relaxed">• Payments take up to 24 hours to reflect in the official ledger.</li>
                                <li className="text-xs text-indigo-700 leading-relaxed">• Save a copy of the transaction receipt for future reference.</li>
                                <li className="text-xs text-indigo-700 leading-relaxed">• No convenience fee is charged on UPI payments.</li>
                            </ul>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-gray-800 font-bold mb-4">Need Help?</h3>
                            <p className="text-xs text-gray-500 mb-4">For any payment-related issues, please contact the Accounts Cell.</p>
                            <button className="w-full py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-all">
                                Contact Helpdesk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FeePayment;
