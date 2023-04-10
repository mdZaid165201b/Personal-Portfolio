const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: [30, "length exceeded"]
    },
    deadline: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Pending", "Complete"],
        default: "Pending"
    }
}, {timestamps: true});

module.exports = mongoose.model("Todo", TodoSchema);