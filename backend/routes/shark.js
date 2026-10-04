const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Shark = require("../models/Shark");
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
            query.$or = [
                { name: { $regex: search, $options: "i" } }, 
                { scientificName: { $regex: search, $options: "i" } }
            ];
        }

        if(diet && diet !== "All"){
            query.diet = diet
        }

        if(habitat && habitat !== "All"){
            query.habitat = habitat
        }

        let sortOption = {}

        if(sort === "nameAsc") {
            sortOption.name = 1
        }

        if(sort === "nameDesc") {
            sortOption.name = -1
        }

        const sharks = await Shark.find(query).sort(sortOption)

        res.json(sharks);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get("/sharks/:id", auth.authenticate, async (req, res) => {
    try {
        const findSharkById = await Shark.findOne({
            _id: req.params.id,
        });

        res.json(findSharkById);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/shark", auth.authenticate, upload.single("image"), async (req, res) => {
    try {
        const { name, scientificName, description, averageSize, diet, habitat } = req.body;

        const newShark = new Shark({
            name,
            scientificName,
            description,
            averageSize,
            diet,
            habitat,
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

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updateShark = await Shark.findByIdAndUpdate(req.params.id, updateData, { new: true });

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

// router.get("/")
module.exports = router;
