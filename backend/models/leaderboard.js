const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema ({
    gameName : {
        type: String,
        enum: ['flappybird', 'classic_snake', '2048', 'guess_the_color', 'tetris']
    },
    ign: {
        type: String
    },
    score: {
        type: Number
    }
})

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);