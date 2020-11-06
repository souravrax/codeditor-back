const express = require("express");
require("dotenv").config();
const path = require('path')
const rfs = require('rotating-file-stream');

const logger = require("morgan");
const helmet = require("helmet");

// Router Imports
const executeRouter = require('./Routers/execute');
const shareRouter = require("./Routers/share");

const app = express();

// FileStream for server access logging
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log'), // path to store the log files
    compress: "gzip" // compress rotated files
})

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