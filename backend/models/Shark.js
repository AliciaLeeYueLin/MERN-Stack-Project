const mongoose = require("mongoose");

const SharkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    scientificName: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required: true,
    },

    averageSize: {
        type: String,
        required: true,
    },

    diet: {
        type: String,
        required: true,
    },

    dietDetails: {
        type: String,
        default: "",
    },

    habitatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habitat",
        required: true,
    },

    habitatDetails: {
        type: String,
        default: "",
    },

    reproduction: {
        type: {
            type: String,
            default: "",
        },
        maturityAge: {
            type: String,
            default: "",
        },
        gestationPeriod: {
            type: String,
            default: "",
        },
        offspringCount: {
            type: String,
            default: "",
        },
        birthSize: {
            type: String,
            default: "",
        },
        details: {
            type: String,
            default: "",
        },
    },

    lifeCycle: [
        {
            stage: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            approximateDuration: {
                type: String,
                default: "",
            },
        },
    ],
    characteristics: [
        {
            characteristic: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
    ],
    imageUrl: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("Shark", SharkSchema);
