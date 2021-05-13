const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema ({
    gameName : {
        type: String,
        enum: ['flappy-bird', 'classic-snake', 'game-2048', 'guess-the-color', 'tetris']
    },
    ign: {
        type: String
    },
    hashedEmail: {
        type: String
    },
    score: {
        type: Number
    }
})

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);