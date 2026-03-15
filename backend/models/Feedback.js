const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comments: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent a student from rating the same course multiple times
feedbackSchema.index({ student: 1, course: 1 }, { unique: true });
// exports module
module.exports = mongoose.model("Feedback", feedbackSchema);
