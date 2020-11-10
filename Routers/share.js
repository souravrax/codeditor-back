"use strict";
// Share Router
const express = require("express");
const router = express.Router();
const ms = require("ms"); // To convert string times into milliseconds
const cors = require("cors");
const languages = require("../res/mapLanguageToCode.json");

const mongoose = require("mongoose");
const SharedCode = require("../models/sharedCodeModel");

router.use(cors());

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
]; // Available expiry times



// Path: "/export" method: "Post" handler

router.post("/export", (req, res) => {
    const { code, input, language, expireIndex } = req.body;

    console.log(code, input, language, expireIndex);
    // If the provided index is not valid, then respond with 404(Not Found) message
    if (expireIndex < 0 || expireIndex >= mapExpireIndexToValues.length) {
        // If the index is not valid return

        console.log("Expiry Time Not Valid");
        res.status(404).json({
            success: false,
        });
    } else if (code === "" || code === undefined) {
        // IF the code is not valid then return

        console.log("Code Not Valid");
        res.status(404).json({
            success: false,
        });
    } else if (
        language === undefined ||
        language == "" ||
        languages[language] === undefined
    ) {
        // If the language is not valid then return

        console.log("Language Not Valid");
        res.status(404).json({
            success: false,
        });
    } else {
        // If everything is ok, process the query

        //? Getting the creation date and the expiration date
        const currentDate = new Date();
        const expireDate = new Date(
            currentDate.getTime() + ms(mapExpireIndexToValues[expireIndex])
        ); // Getting the expiration time
        //? Data to be saved into the database
        const entry = new SharedCode({
            code: code,
            input: input,
            language: language,
            date: currentDate,
            expire_at: expireDate,
        }); // the data to be saved in the database

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
        }); // Saving the data
    }
});

// Import shared code feature
router.post("/import", (req, res) => {
    const { id } = req.body;
    console.log(id, "Data Requested");
    if (!id || id == "") {
        res.status(404).json({
            success: false,
        });
    } else {
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
    }
});

module.exports = router;
