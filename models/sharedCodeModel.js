const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SharedCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    input: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("SharedCodes", SharedCodeSchema);