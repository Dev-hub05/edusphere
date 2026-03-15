const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ["tuition", "hostel", "exam", "other"],
            default: "tuition",
        },
        status: {
            type: String,
            enum: ["paid", "pending", "overdue"],
            default: "pending",
        },
        paidDate: Date,
        transactionId: String,
    },
    {
        timestamps: true,
    }
);
// exports module
module.exports = mongoose.model("Fee", feeSchema);
