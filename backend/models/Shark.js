const mongoose = require("mongoose")

const SharkSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    scientificName:{
        type: String,
        required:  true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    averageSize:{
        type: String,
        required: true
    },
    diet:{
        type: String,
        required: true
    },
    habitat:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Shark', SharkSchema)