const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Sighting = require("../models/Sighting");


router.use(express.json());

router.post("/sighting", async (req, res) => {
    try {
        const { sharkId, locationId } = req.body;

        const newSighting = new Sighting({
            sharkId,
            locationId
        });

        const savedSighting = await newSighting.save();

        res.status(201).json(savedSighting);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

router.post("/bulk", auth.authenticate, async (req, res) => {
    try {
        const sightings = await Sighting.insertMany(req.body);

        res.status(201).json(sightings);
    } catch (error) {
        res.status(400).json({
            error: error.message
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
                        locationId: "$locationId"
                    },
                    frequency: {
                        $sum: 1
                    }
                }
            },

            {
                $lookup: {
                    from: "sharks",
                    localField: "_id.sharkId",
                    foreignField: "_id",
                    as: "shark"
                }
            },

            {
                $lookup: {
                    from: "locations",
                    localField: "_id.locationId",
                    foreignField: "_id",
                    as: "location"
                }
            },

            {
                $unwind: "$shark"
            },

            {
                $unwind: "$location"
            },

            {
                $project: {
                    _id: 0,
                    sharkId: "$shark._id",
                    sharkName: "$shark.name",
                    locationId: "$location._id",
                    locationName: "$location.name",
                    frequency: 1
                }
            }
        ]);

        res.json(frequency);

    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

module.exports = router;
