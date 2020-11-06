const express = require("express");
// const request = require("request");
const axios = require('axios');
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Working");
});

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const URL = process.env.URL;

app.post('/execute', (req, res) => {
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
            console.table(response.data);
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(400).send(error);
        })
});

app.listen(PORT, () => {
    console.log(`Server is running at port : ${PORT}`);
});