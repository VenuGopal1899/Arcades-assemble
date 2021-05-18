const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String
		},
		middleName: {
			type: String
		},
		lastName: {
			type: String
		},
		useremail: {
			type: String,
			required: true,
			unique: true
		},
		hashedEmail: {
			type: String
		},
		ign: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
		},
		confirmed: {
			type: Boolean,
			default: false
		},
		emailSecret: {
			type: String,
		},
		highscore_flappy_bird: {
			type: Number,
			default: 0
		},
		highscore_classic_snake: {
			type: Number,
			default: 0
		},
		highscore_game_2048: {
			type: Number,
			default: 0
		},
		highscore_guess_the_color: {
			type: Number,
			default: 0
		},
		highscore_tetris: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)