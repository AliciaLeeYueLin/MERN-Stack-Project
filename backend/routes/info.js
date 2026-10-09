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
        let query = {};

        if (req.user.role === "admin") {
            query = {};
        } else if (req.user.role === "researcher") {
            query = {
                $or: [{ isPublic: true }, { userId: req.user._id }],
            };
        } else {
            query = {
                isPublic: true,
            };
        }

        const info = await Info.find(query).populate("sharkId").populate("userId");

        res.json(info);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

router.get("/info/:id", auth.authenticate, async (req, res) => {
    try {
        const info = await Info.findById(req.params.id).populate("sharkId").populate("userId", "name _id");

        if (!info) {
            return res.status(404).json({
                error: "Info not found",
            });
        }

        const isOwner = info.userId._id.toString() === req.user._id.toString();

        if (!info.isPublic && req.user.role !== "admin" && !isOwner) {
            return res.status(403).json({
                error: "You are not allowed to view this info.",
            });
        }

        res.json(info);
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.post("/info", auth.authenticate, async (req, res) => {
    try {
        if (req.user.role !== "admin" && req.user.role !== "researcher") {
            return res.status(403).json({
                error: "Only researchers and admins can create information.",
            });
        }

        const { sharkId, title, description, imageUrl, isPublic } = req.body;

        const info = new Info({
            userId: req.user._id,
            sharkId,
            title,
            description,
            imageUrl,
            isPublic,
        });

        await info.save();

        res.status(201).json(info);
    } catch (error) {
        res.status(500).json({
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
        const existingInfo = await Info.findById(req.params.id);

        if (!existingInfo) {
            return res.status(404).json({
                error: "Info not found",
            });
        }

        const isOwner = existingInfo.userId.toString() === req.user._id.toString();

        if (req.user.role !== "admin" && !isOwner) {
            return res.status(403).json({
                error: "You are not allowed to edit this info.",
            });
        }

        if (req.user.role !== "admin" && req.user.role !== "researcher") {
            return res.status(403).json({
                error: "Only researchers and admins can edit information.",
            });
        }

        const updateData = {
            ...req.body,
        };

        if (updateData.isPublic !== undefined) {
            updateData.isPublic = updateData.isPublic === "true";
        }

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        delete updateData.userId;

        const updateInfo = await Info.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        })
            .populate("userId", "name _id")
            .populate("sharkId", "name _id");

        res.json(updateInfo);
    } catch (error) {
        console.log("UPDATE ERROR:", error);

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
