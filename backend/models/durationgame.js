const mongoose = require('mongoose');

const DurationGameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: true
    },
    duration_mins: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('DurationGame', DurationGameSchema);