const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Habitat = require("../models/Habitat");
const Shark = require("../models/Shark");

router.use(express.json());

router.get("/habitats", auth.authenticate, async (req, res) => {
    try {
        const getAllHabitat = await Habitat.find({});

        res.json(getAllHabitat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/habitat/:id", auth.authenticate, async (req, res) => {
    try {
        const findHabitatById = await Habitat.findOne({ _id: req.params.id });

        res.json(findHabitatById);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/habitat", auth.authenticate, async (req, res) => {
    try {
        const { name } = req.body;

        const newHabitat = new Habitat({ name });

        const savedHabitat = await newHabitat.save();

        res.status(201).json(savedHabitat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch("/habitat", auth.authenticate, async (req, res) => {
    try {
        const { name } = req.body;

        const newHabitat = new Habitat({ name });

        const savedHabitat = await newHabitat.save();

        res.status(201).json(savedHabitat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/habitat/:id", auth.authenticate, async(req, res) => {
    try{
        const {id} = req.params;

        const sharkUsedHabitat = await Shark.findOne({habitatId: id})

        if(sharkUsedHabitat){
            return res.status(400).json({ error: `Cannot delete this habitat because it is being used by ${sharkUsedHabitat.name}.`})
        }
        
        const deletedHabitat = await Habitat.findByIdAndDelete(id)

        if (!deletedHabitat) {
            return res.status(404).json({
                error: "Habitat not found.",
            });
        }

        res.json({
            message: "Habitat deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
    
})

module.exports = router;
