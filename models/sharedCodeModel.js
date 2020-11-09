const mongoose = require('mongoose');

const schema = mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    input: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("SharedCodes", schema);