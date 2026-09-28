const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Location", LocationSchema);
