const mongoose = require("mongoose")

const SightingSchema = new mongoose.Schema({
    sharkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shark",
        required: true
    },
    locationId: {
        type: mongoose.Schema.ObjectId,
        ref:"Location",
        required:true
    },
    date: {
        type: Date,
        default:Date.now
    }
   
})

module.exports = mongoose.model('Sighting', SightingSchema)