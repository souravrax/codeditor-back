const express = require("express")
const router = express.Router();
const axios = require('axios');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const URL = process.env.URL;

router.post('/', (req, res) => {
    const { code, language, input, cArgs } = req.body;
    const program = {
        script: `${code}`,
        language: `${language}`,
        versionIndex: "0",
        clientId: clientId,
        clientSecret: clientSecret
    };

    axios.post(URL, program)
        .then(response => {
            // console.table(response.data);
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(400).sendStatus(error);
        })
});


module.exports = router;