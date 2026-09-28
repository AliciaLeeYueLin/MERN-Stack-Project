const mongoose = require("mongoose")

const ResearchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization:{
        type: String,
        required:  true,
        unique: true
    },
    researchField:{
        type: String,
        required: true
    },
    qualification:{
        type: String,
        required: true
    },
    experience:{
        type: String,
        required: true
    },
    reason:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: false
    },
    imageUrl:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Research', ResearchSchema)