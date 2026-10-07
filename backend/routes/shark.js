const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Shark = require("../models/Shark");
const Habitat = require("../models/Habitat");
const multer = require("multer");

const upload = multer({
    dest: "uploads/",
});

router.use(express.json());

router.get("/sharks", auth.authenticate, async (req, res) => {
    try {
        const { search, diet, habitat, sort } = req.query;

        const query = {};

        if (search) {
            query.$or = [{ name: { $regex: search, $options: "i" } }, { scientificName: { $regex: search, $options: "i" } }];
        }

        if (diet && diet !== "All") {
            query.diet = diet;
        }
        if (habitat && habitat !== "All") {
            query.habitatId = habitat;
        }
        let sortOption = {};

        if (sort === "nameAsc") {
            sortOption.name = 1;
        }

        if (sort === "nameDesc") {
            sortOption.name = -1;
        }

        const sharks = await Shark.find(query).populate("habitatId").sort(sortOption);

        res.json(sharks);
    } catch (error) {
        res.status(404).json({
            error: error.message,
        });
    }
});
router.get("/sharks/:id", auth.authenticate, async (req, res) => {
    try {
        const findSharkById = await Shark.findOne({
            _id: req.params.id,
        }).populate("habitatId");

        res.json(findSharkById);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/shark", auth.authenticate, upload.single("image"), async (req, res) => {
    try {
        const { name, scientificName, description, averageSize, diet, dietDetails, habitatId, habitatDetails, reproduction, lifeCycle, characteristics } = req.body;

        const newShark = new Shark({
            name,
            scientificName,
            description,
            averageSize,
            diet,
            dietDetails,
            habitatId,
            habitatDetails,

            reproduction: reproduction ? JSON.parse(reproduction) : undefined,

            lifeCycle: lifeCycle ? JSON.parse(lifeCycle) : [],

            characteristics: characteristics ? JSON.parse(characteristics) : [],

            imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
        });

        const savedShark = await newShark.save();

        res.status(201).json(savedShark);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.post("/shark/bulk", auth.authenticate, async (req, res) => {
    try {
        const sharks = await Shark.insertMany(req.body);

        res.status(201).json(sharks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch("/sharks/:id", auth.authenticate, upload.single("image"), async (req, res) => {
    try {
        const updateData = {
            ...req.body,
        };

        // Convert JSON strings back into objects/arrays
        if (req.body.reproduction) {
            updateData.reproduction = JSON.parse(req.body.reproduction);
        }

        if (req.body.lifeCycle) {
            updateData.lifeCycle = JSON.parse(req.body.lifeCycle);
        }

        if (req.body.characteristics) {
            updateData.characteristics = JSON.parse(req.body.characteristics);
        }

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updateShark = await Shark.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).populate("habitatId");

        if (!updateShark) {
            return res.status(404).json({
                error: "Shark not found",
            });
        }

        res.json(updateShark);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.patch("/shark/bulk", auth.authenticate, async (req, res) => {
    try {
        const sharks = req.body;

        if (!Array.isArray(sharks)) {
            return res.status(400).json({
                error: "Request body must be an array",
            });
        }

        const updatedSharks = [];

        for (const shark of sharks) {
            const { _id, ...updateData } = shark;

            if (!_id) {continue;}

            const updatedShark = await Shark.findByIdAndUpdate(
                _id, updateData, 
            {
                new: true,
                runValidators: true,
            });

            if (updatedShark) {
                updatedSharks.push(updatedShark);
            }
        }

        res.json(updatedSharks);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.delete("/shark/:id", auth.authenticate, async (req, res) => {
    try {
        const deleteShark = await Shark.findByIdAndDelete(req.params.id);

        if (!deleteShark) {
            return res.status(404).json({
                error: "Shark not found",
            });
        }

        res.json(deleteShark);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

module.exports = router;
