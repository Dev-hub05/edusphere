const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },
        examType: {
            type: String,
            enum: ["internal", "midterm", "final"],
            required: true,
        },
        marks: {
            type: Number,
            required: [true, "Marks are required"],
            min: 0,
            max: 100,
        },
        totalMarks: {
            type: Number,
            default: 100,
        },
        grade: {
            type: String,
            default: "",
        },
        semester: {
            type: Number,
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Compound index: one result per student per subject per exam type per semester
resultSchema.index(
    { student: 1, subject: 1, examType: 1, semester: 1 },
    { unique: true }
);
// exports module
module.exports = mongoose.model("Result", resultSchema);
