const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");
const Research = require("../models/Research");

router.use(express.json());

router.post("/request", auth.authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                message: "User authentication failed."
            });
        }

        const existingApplication = await Research.findOne({
            userId: userId
        });

        if (existingApplication) {
            return res.status(409).json({
                message: "You have already submitted a researcher application. You cannot apply again."
            });
        }

        const {
            organization,
            researchField,
            qualification,
            experience,
            reason
        } = req.body;

        if (
            !organization ||
            !researchField ||
            !qualification ||
            !experience ||
            !reason
        ) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        const application = new Research({
            userId: userId,
            name: req.user.name,
            organization: organization,
            researchField: researchField,
            qualification: qualification,
            experience: experience,
            reason: reason,
            status: "pending"
        });

        await application.save();

        return res.status(201).json({
            message: "Researcher application submitted successfully.",
            application: application
        });

    } catch (error) {
        console.error("Research application error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already submitted a researcher application."
            });
        }

        return res.status(500).json({
            message: "Failed to submit researcher application."
        });
    }
});

module.exports = router;