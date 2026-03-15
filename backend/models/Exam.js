const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        semester: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String, // e.g., "10:00 AM"
            required: true,
        },
        endTime: {
            type: String, // e.g., "01:00 PM"
            required: true,
        },
        venue: {
            type: String, // e.g., "Main Hall A"
            required: true,
        },
        examType: {
            type: String,
            enum: ["Regular", "Carry Over", "Ex-Student"],
            default: "Regular",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Exam", examSchema);
