const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const sharkRoutes = require("./routes/shark")
const locationRoutes = require("./routes/location")
const researchRoutes = require("./routes/research")
const adminRoutes = require("./routes/admin")
const sightingRoutes = require("./routes/sighting")
const infoRoutes = require("./routes/info")
const habitatRoutes = require("./routes/habitat")
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth")
require("dotenv").config();
const PORT = process.env.PORT;

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));

const corsHandler = cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
});

app.use(corsHandler);
app.use(express.json());

app.use("/user", userRoutes);
app.use("/shark", sharkRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/location", locationRoutes)
app.use("/research", researchRoutes)
app.use("/admin", adminRoutes);
app.use("/sighting", sightingRoutes);
app.use("/info", infoRoutes);
app.use("/habitat", habitatRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to our Auth API!");
});



app.get("/dashboard", auth.authenticate , (req, res) => {
    res.json({
        valid: true,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
