import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	messages: [
		{
			type: Schema.Types.ObjectId,
            ref: 'Message'
		},
	],
})

export default mongoose.model('User', userSchema)
