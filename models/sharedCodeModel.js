const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SharedCodeSchema = new Schema({
    code: {
        type: String,
        required: true,
    },
    input: {
        type: String,
    },
    language: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    expire_at: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

SharedCodeSchema.index({ expire_at: 1 }, { expires: 0 });

module.exports = mongoose.model("SharedCodes", SharedCodeSchema);
