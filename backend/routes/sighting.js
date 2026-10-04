const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Sighting = require("../models/Sighting");
const Shark = require("../models/Shark");
const Location = require("../models/Location");
router.use(express.json());

router.get("/sightings", auth.authenticate, async (req, res) => {
    try {
        const { search } = req.query;

        const query = {};

        if (search) {
           
            const matchingSharks = await Shark.find({ name: { $regex: search, $options: "i" } }).select("_id");

            const matchingLocations = await Location.find({ name: { $regex: search, $options: "i" }}).select("_id");

            query.$or = [
                { sharkId: { $in: matchingSharks.map(s => s._id) } },
                { locationId: { $in: matchingLocations.map(l => l._id) } }
            ];
        }

        const allSighting = await Sighting.find(query)
            .populate("sharkId")
            .populate("locationId");

        res.json(allSighting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/sighting/:id", async (req, res) => {
    try {
        const getSightingById = await Sighting.findById({ _id: req.params.id }).populate("sharkId").populate("locationId");

        res.json(getSightingById);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/sighting", async (req, res) => {
    try {
        const { sharkId, locationId, description, date, waterDepth, waterTemperature, weatherCondition, visibility, sharkCount, behavior, observer, notes } = req.body;

        const newSighting = new Sighting({
            sharkId,
            locationId,
            description,
            date,
            waterDepth,
            waterTemperature,
            weatherCondition,
            visibility,
            sharkCount,
            behavior,
            observer,
            notes,
        });

        const savedSighting = await newSighting.save();

        res.status(201).json(savedSighting);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.post("/bulk", auth.authenticate, async (req, res) => {
    try {
        const sightings = await Sighting.insertMany(req.body);

        res.status(201).json(sightings);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.patch("/sighting/:id", auth.authenticate, async (req, res) => {
    try {
        const updatedSighting = await Sighting.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedSighting) {
            return res.status(404).json({
                error: "Sighting not found",
            });
        }

        res.json(updatedSighting);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.get("/frequency", auth.authenticate, async (req, res) => {
    try {
        const frequency = await Sighting.aggregate([
            {
                $group: {
                    _id: {
                        sharkId: "$sharkId",
                        locationId: "$locationId",
                    },
                    frequency: {
                        $sum: 1,
                    },
                },
            },

            {
                $lookup: {
                    from: "sharks",
                    localField: "_id.sharkId",
                    foreignField: "_id",
                    as: "shark",
                },
            },

            {
                $lookup: {
                    from: "locations",
                    localField: "_id.locationId",
                    foreignField: "_id",
                    as: "location",
                },
            },

            {
                $unwind: "$shark",
            },

            {
                $unwind: "$location",
            },

            {
                $project: {
                    _id: 0,
                    sharkId: "$shark._id",
                    sharkName: "$shark.name",
                    locationId: "$location._id",
                    locationName: "$location.name",
                    frequency: 1,
                },
            },
        ]);

        res.json(frequency);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.delete("/sightings", auth.authenticate, async (req, res) => {
    try {
        const deleteSighting = await Sighting.deleteMany({});

        if (!deleteSighting) {
            return res.status(404).json({
                error: "sighting not found",
            });
        }

        res.json(deleteSighting);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.delete("/sighting/:id", auth.authenticate, async (req, res) => {
    try {
       const deleteSighting = await Sighting.findByIdAndDelete(req.params.id);

if (!deleteSighting) {
    return res.status(404).json({
        error: "Sighting not found",
    });
}

res.json(deleteSighting);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});



module.exports = router;
