const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const answerSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
			trim: true,
		},
		user_id: {
			type: ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Answer', answerSchema);
