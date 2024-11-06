"use strict";
// Share Router
const router = require("express").Router();

const cors = require("cors");
const {
    exportCodeController,
    importCodeController,
} = require("../controllers"); // Controllers

const mongoose = require("mongoose");
const SharedCode = require("../models/sharedCodeModel");

router.use(cors());

const DB_CONNECTION = process.env.DB_URL;

// Mongoose connection
mongoose.connect(DB_CONNECTION, {
    ssl: true,
    tls: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to database");
});

// Path: "/export" method: "Post" handler
router.post("/export", (req, res) => {
    exportCodeController(req.body, res, SharedCode);
});

// Import shared code feature
router.post("/import", (req, res) => {
    importCodeController(req.body, res, SharedCode);
});

module.exports = router;
