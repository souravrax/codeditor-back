const express = require("express");
const router = express.Router();
const axios = require("axios");

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const URL = process.env.URL;

const mapLanguageToCode = require("../res/mapLanguageToCode.json");

router.post("/", async (req, res) => {
    const { code, language, input, cArgs } = req.body;
    const program = {
        script: code,
        language: mapLanguageToCode[language].code,
        versionIndex: mapLanguageToCode[language].version,
        stdin: input,
        clientId: clientId,
        clientSecret: clientSecret,
    };
    console.log("Execute Called:", program);
    try {

        const response = await axios({
            method: "post",
            url: URL,
            data: program,
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 5000,
            validateStatus: (status) => {
                return status >= 200 && status < 300;
            },
        })
        return res.status(200).json(response.data);

    } catch (error) {
        console.error(error);
        return res.status(400).sendStatus(error);
    }
});

module.exports = router;
