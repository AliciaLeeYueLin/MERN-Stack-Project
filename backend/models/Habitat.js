const mongoose = require("mongoose");

const HabitatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Habitat", HabitatSchema);
