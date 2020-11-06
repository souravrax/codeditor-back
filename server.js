const express = require("express");
require("dotenv").config();

// Router Imports
const executeRouter = require('./Routers/execute');
const shareRouter = require("./Routers/share");

const app = express();

// Middleware
app.use(express.json());

// Routers
app.use('/execute', executeRouter);
app.use('/share', shareRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at port : ${PORT}`);
});