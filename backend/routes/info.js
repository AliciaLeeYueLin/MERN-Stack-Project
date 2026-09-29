const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Info = require("../models/Info");
const multer = require("multer");

const upload = multer({
    dest: "uploads/",
});

router.use(express.json());

router.get("/info", auth.authenticate, async (req, res) => {
    try {
        const getAllInfo = await Info.find({}).populate("userId", "name").populate("sharkId", "name");

        res.json(getAllInfo);
    } catch (error) {
        res.status(404).json({
            error: error.message,
        });
    }
});
router.get("/info/:id", auth.authenticate, async (req, res) => {
    try {
        const findInfoById = await Info.findOne({
            _id: req.params.id,
        });

        res.json(findInfoById);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post("/info", auth.authenticate, async (req, res) => {
    try {
        const { sharkId, title, description, imageUrl, createdAt } = req.body;

        const newInfo = new Info({
            userId: req.user._id,
            sharkId,
            title,
            description,
            imageUrl,
            createdAt,
        });

        const savedInfo = await newInfo.save();

        res.status(201).json(savedInfo);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.post("/info/bulk", auth.authenticate, async (req, res) => {
    try {
        const bulkInfo = await Info.insertMany(req.body);

        res.status(201).json(bulkInfo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.patch("/info/:id", auth.authenticate, upload.single("image"), async (req, res) => {
    try {
        const updateData = {
            ...req.body,
        };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updateInfo = await Info.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate("userId", "name _id").populate("sharkId", "name _id");

        if (!updateInfo) {
            return res.status(404).json({
                error: "Info not found",
            });
        }

        res.json(updateInfo);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.delete("/info/:id", auth.authenticate, async (req, res) => {
    try {
        const deleteInfo = await Info.findByIdAndDelete(req.params.id);

        if (!deleteInfo) {
            return res.status(404).json({
                error: "Info not found",
            });
        }

        res.json(deleteInfo);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

module.exports = router;
