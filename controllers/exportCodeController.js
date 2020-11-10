"use strict";

const languages = require("../res/mapLanguageToCode.json");
const ms = require("ms"); // To convert string times into milliseconds
const mapExpireIndexToValues = [
    "1m",
    "5m",
    "30m",
    "2hrs",
    "12hrs",
    "1 day",
    "5 days",
]; // Available expiry times

const controller = (
    { code, input, language, expireIndex },
    res,
    SharedCode
) => {
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
};

module.exports = controller;
