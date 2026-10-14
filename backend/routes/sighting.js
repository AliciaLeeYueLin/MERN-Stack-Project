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

        const filter = {};

        if (search) {
            const matchingSharks = await Shark.find({
                name: { $regex: search, $options: "i" },
            }).select("_id");

            const matchingLocations = await Location.find({
                name: { $regex: search, $options: "i" },
            }).select("_id");

            filter.$or = [
                {
                    sharkId: {
                        $in: matchingSharks.map((shark) => shark._id),
                    },
                },
                {
                    locationId: {
                        $in: matchingLocations.map((location) => location._id),
                    },
                },
            ];
        }

        const sightings = await Sighting.find(filter).populate("sharkId").populate("locationId");

        res.json(sightings);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message,
        });
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

router.post("/sighting", auth.noUserOnly,async (req, res) => {
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

router.post("/bulk", auth.authenticate,auth.noUserOnly, async (req, res) => {
    try {
        const sightings = await Sighting.insertMany(req.body);

        res.status(201).json(sightings);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.patch("/sighting/:id", auth.authenticate,auth.noUserOnly, async (req, res) => {
    try {
        const updatedSighting = await Sighting.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

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
        const sightings = await Sighting.find()
            .populate("sharkId")
            .populate("locationId");

        const frequency = [];

        sightings.forEach((sighting) => {
            const shark = sighting.sharkId;
            const location = sighting.locationId;

            if (!shark || !location) {
                return;
            }

            const existing = frequency.find(
                (item) =>
                    item.sharkId.toString() === shark._id.toString() &&
                    item.locationId.toString() === location._id.toString()
            );

            if (existing) {
                existing.frequency++;
            } else {
                frequency.push({
                    sharkId: shark._id,
                    sharkName: shark.name,
                    locationId: location._id,
                    locationName: location.name,
                    frequency: 1,
                });
            }
        });

        res.json(frequency);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.delete("/sightings", auth.authenticate, auth.noUserOnly, async (req, res) => {
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

router.delete("/sighting/:id", auth.authenticate, auth.noUserOnly, async (req, res) => {
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
