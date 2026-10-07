const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");
const Research = require("../models/Research");
const User = require("../models/User");

router.use(express.json());

router.get("/application", auth.authenticate, async (req, res) => {
    try {
        const applications = await Research.find().populate("userId", "name email");

        res.json(applications);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/myApplication", auth.authenticate, async (req, res) => {
    try {
        const findApplicationById = await Research.findOne({
            userId: req.user._id,
        });

        res.json(findApplicationById);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put("/application/:id/approve", auth.authenticate, async (req, res) => {
    try {
        const application = await Research.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                error: "Application not found",
            });
        }

        const user = await User.findById(application.userId);

        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }

        user.role = "researcher";
        await user.save();

        application.status = "approved";
        await application.save();

        res.json({
            message: "Application approved successfully",
            application,
            user,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
});

router.put("/application/:id/reject", auth.authenticate, async (req, res) => {
    try {
        const application = await Research.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        application.status = "rejected";
        await application.save();

        res.json({
            message: "Application rejected successfully",
            application,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
