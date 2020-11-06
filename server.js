const express = require("express");
require("dotenv").config();
const fs = require('fs');
const path = require('path')

const logger = require("morgan");
const helmet = require("helmet");

// Router Imports
const executeRouter = require('./Routers/execute');
const shareRouter = require("./Routers/share");

const app = express();

// FileStream for server access logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});

// Middleware
app.use(express.json());
app.use(logger('combined', {
    stream: accessLogStream
}));

// Routers
app.use('/execute', executeRouter);
app.use('/share', shareRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running at PORT: ${PORT}`);
});