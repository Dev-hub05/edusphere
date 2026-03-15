import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FeeSummary from '../../components/student/FeeSummary';
import PaymentHistory from '../../components/student/PaymentHistory';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { getStudentFees } from '../../services/studentService';

const FeeStatus = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const data = await getStudentFees();
                setFees(data);
            } catch (err) {
                console.error("Error fetching fees:", err);
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

    // Format for the generic PaymentHistory component
    const formattedTransactions = fees.map(fee => ({
        id: fee._id,
        date: new Date(fee.dueDate || fee.createdAt).toLocaleDateString(),
        transactionId: fee.transactionId || 'Pending',
        type: fee.type.charAt(0).toUpperCase() + fee.type.slice(1),
        amount: fee.amount,
        status: fee.status
    }));

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fee Status</h1>
                    <p className="text-gray-500 mt-1">Review your financial records and settlement history.</p>
                </header>

                <FeeSummary feeData={summaryData} />

                <div className="space-y-6">
                    <PaymentHistory transactions={formattedTransactions} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FeeStatus;
