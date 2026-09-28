const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");
const Location = require("../models/Location");

router.get("/locations", auth.authenticate, async (req, res) => {
    try {
        const allLocations = await Location.find({});
        res.json(allLocations);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.post("/location", auth.authenticate, async (req, res) => {
    try {
        const { name, country, region, description } = req.body;

        const newLocation = new Location({
            name: name,
            country: country,
            region: region,
            description: description,
        });

        const savedLocation = await newLocation.save();

        res.status(201).json(savedLocation);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/location/bulk", auth.authenticate, async(req, res) => {
    try{
        const locations = await Location.insertMany(req.body)

        res.status(201).json(locations)
    }catch(error){
        res.status(400).json({ error: error.message})
    }
})

router.delete("/location/:id", auth.authenticate, async(req, res)=> {
    try {  const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    res.json(deletedLocation);
  
} catch (error) {
    res.status(400).json({ error: error.message });
}
})

module.exports = router;
