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
		}
	},
	{ timestamps: true }
)

module.exports = mongoose.model('User', UserSchema)