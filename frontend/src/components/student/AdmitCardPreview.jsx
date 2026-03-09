import React, { useRef } from 'react';
import AdmitCardTemplate from '../common/AdmitCardTemplate';
import { FiDownload, FiPrinter } from 'react-icons/fi';

const AdmitCardPreview = ({ studentData }) => {
    const printRef = useRef();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Admit Card Preview</h2>
                    <p className="text-sm text-gray-500">Please verify all details before downloading.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold transition-all border border-gray-200"
                    >
                        <FiPrinter className="text-lg" />
                        Print
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-100 transition-all"
                    >
                        <FiDownload className="text-lg" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Main Preview Container */}
            <div className="bg-gray-100 p-8 rounded-2xl overflow-x-auto print:p-0 print:bg-white">
                <div className="min-w-fit mx-auto print:min-w-0">
                    <AdmitCardTemplate studentData={studentData} />
                </div>
            </div>

            {/* Warning/Note */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 items-start">
                <div className="text-amber-500 mt-0.5">⚠️</div>
                <p className="text-sm text-amber-800">
                    <strong>Note:</strong> In case of any discrepancy in the details shown, please contact the University Academic Cell immediately.
                </p>
            </div>
        </div>
    );
};

export default AdmitCardPreview;
