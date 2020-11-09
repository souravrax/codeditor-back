const express = require("express");
require("dotenv").config();
const path = require('path')
const rfs = require('rotating-file-stream');

const logger = require("morgan");
const helmet = require("helmet");
const cors = require('cors');

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('combined', {
    stream: accessLogStream
}));
app.use(helmet()); // helmet: Not a silver bullet but helps in securing the server headers
app.use(cors());

// Routers
app.use('/execute', executeRouter);
app.use('/share', shareRouter);

app.get('/', (req, res)=>{
    res.send(`${process.env.CLIENT_ID}, ${process.env.CLIENT_SECRET}, ${process.env.DB_URL}`);
})

app.post('/', (req, res) => {
    let ans = "";
    for (let i in req.body) {
        ans += req.body[i]
    }
    console.log(ans);
    res.send(ans);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running at PORT: ${PORT}`);
});