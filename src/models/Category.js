const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            required: [true, "Category slug is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        icon: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        backgroundColor: {
            type: String,
            default: "#EAF3FF"
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categorySchema);
