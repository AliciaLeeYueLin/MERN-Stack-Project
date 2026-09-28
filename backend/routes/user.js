const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const auth = require("../middleware/auth");

router.use(express.json());

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS); 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(400).json({
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await user.comparePassword(req.body.password))) {
            throw new Error("Invalid email or password");
        }

       
        const token = jwt.sign(
            {
                userId: user._id, 
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        );
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/users", auth.authenticate, async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.json(allUsers);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

router.get("/user", auth.authenticate, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// router.get("/users", auth.authenticate, async (req, res) => {
//     try {
//         const user = req.user;
//         if (user.role !== "user") {
//             const users = await User.find();
//             if (!users) throw new Error("No users found!");
//             res.json(users);
//         } else {
//             throw new Error("User should not be able to call this API");
//         }
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

router.get("/admin", auth.authenticate, async (req, res) => {
    try {
        // console.log(user.role);
        const user = req.user;
        if (user.role !== "admin") {
            const users = await User.find();
            if (!users) throw new Error("No users found!");
            res.json(users);
        } else {
            throw new Error("User should not be able to call this API");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
