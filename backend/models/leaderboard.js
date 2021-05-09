const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema ({
    gameName : {
        type: String,
        enum: ['flappybird', 'classic_snake', '2048', 'guess_the_color', 'tetris'],
        required: true
    },
    ign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);