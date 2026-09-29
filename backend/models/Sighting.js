const mongoose = require("mongoose");

const SightingSchema = new mongoose.Schema({
    sharkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shark",
        required: true,
    },
    locationId: {
        type: mongoose.Schema.ObjectId,
        ref: "Location",
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    waterDepth: {
        type: Number,
        required: false,
    },
    waterTemperature: {
        type: Number,
        required: false,
    },
    visibility: {
        type: String,
        required: false,
    },
    sharkCount: {
        type: Number,
        required: false,
    },
    behavior: {
        type: String,
        required: false,
    },
    observer: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Sighting", SightingSchema);
