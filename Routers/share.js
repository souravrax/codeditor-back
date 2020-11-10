"use strict"
// Share Router
const express = require("express");
const router = express.Router();
const ms = require("ms");

const mongoose = require("mongoose");
const SharedCode = require("../models/sharedCodeModel");

const DB_CONNECTION = process.env.DB_URL;

// Mongoose connection
mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to database");
});

const mapExpireIndexToValues = [
    "1m",
    "5m",
    "30m",
    "2hrs",
    "12hrs",
    "1 day",
    "5 days",
];
for (let i of mapExpireIndexToValues) {
    console.log(ms(i));
}

//! Share feature
router.post("/export", (req, res) => {
    const { code, input, language, expireIndex } = req.body;

    // If the provided index is not valid, then respond with 404(Not Found) message
    if (expireIndex < 0 || expireIndex >= mapExpireIndexToValues.length) {
        res.status(404).json({
            success: false,
        });
    }

    //? Getting the creation date and the expiration date
    const currentDate = new Date();
    const expireDate = new Date(
        currentDate.getTime() + ms(mapExpireIndexToValues[expireIndex])
    );
    //? Data to be saved into the database
    const entry = new SharedCode({
        code: code,
        input: input,
        language: language,
        date: currentDate,
        expire_at: expireDate,
    });

    //? Inserting the data to database
    entry.save((err, doc) => {
        if (err) {
            return console.error(err);
        }
        console.log(doc);
        res.status(200).json({
            success: true,
            id: doc["_id"],
        });
    });
});

// Import shared code feature
router.post("/import", (req, res) => {
    const { id } = req.body;
    SharedCode.find(
        {
            _id: id,
        },
        (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).json({
                    success: false,
                });
            }
            if (doc.length == 0) {
                res.status(200).json({
                    success: false,
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: doc[0],
                });
            }
        }
    );
});

module.exports = router;