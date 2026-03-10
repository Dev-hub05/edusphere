const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        courseCode: {
            type: String,
            required: [true, "Course code is required"],
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
        },
        department: {
            type: String,
            required: true,
        },
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        credits: {
            type: Number,
            required: true,
        },
        semester: {
            type: Number,
            required: true,
        },
        description: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Course", courseSchema);
