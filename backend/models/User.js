const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            trim: true,
            default: ""
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["citizen", "admin"],
            default: "citizen"
        },

        // ==========================================
        // CREATED DATE
        // ==========================================
        createdAt: {
            type: Date,
            default: Date.now
        },

        // ==========================================
        // UPDATED DATE
        // ==========================================
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("User", userSchema);