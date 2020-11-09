const express = require("express");
const router = express.Router();
const assert = require("assert");

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

router.post("/export", (req, res) => {
    const { code, input, language } = req.body;
    const entry = new SharedCode({
        code: code,
        input: input,
        language: language,
    });
    entry.save((err, doc) => {
        if (err) {
            return console.error(err);
        }
        console.log(doc);
        res.status(200).json({
            success: true,
            id: doc["_id"]
        });
    });
});

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
                    success: false
                });
            }
            if (doc.length == 0) {
                res.status(200).json({
                    success: false,
                })
            } else {
                res.status(200).json({
                    success: true,
                    data: doc[0]
                })
            }
        }
    );
});

module.exports = router;
