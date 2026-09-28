const mongoose = require("mongoose");

const InfoSchema = new mongoose.Schema({
    userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    sharkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shark",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
       required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Info", InfoSchema);
