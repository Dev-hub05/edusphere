const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["academic", "exam", "event", "general", "urgent"],
            default: "general",
        },
        audience: {
            type: String,
            enum: ["all", "student", "faculty", "parent"],
            default: "all",
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiryDate: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notice", noticeSchema);
