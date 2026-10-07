const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");
const Research = require("../models/Research");

router.use(express.json());

router.post("/request", auth.authenticate, async (req, res) => {
    try {
        const { organization, researchField, qualification, experience, reason, status } = req.body;

        const newResearch = new Research({
            userId: req.user._id,
            organization: organization,
            researchField: researchField,
            qualification: qualification,
            experience: experience,
            reason: reason,
            status: status,
        });

        const savedResearch = await newResearch.save();
        res.status(201).json({ message: "Application submitted successfully", savedResearch});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;