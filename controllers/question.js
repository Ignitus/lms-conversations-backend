const Question = require('../models/question');
const Answer = require('../models/answer');

exports.getQuestionById = (req, res, next, id) => {
	Question.findById(id)
		.populate('user_id', '_id name')
		.populate('category', '_id name')
		.exec((err, ques) => {
			if (err) {
				return res.status(400).json({
					error: 'Question not found!',
					detailedError: err,
				});
			}
			req.question = ques;
			next();
		});
};

exports.createQuestion = (req, res) => {
	const question = new Question(req.body);
	question.user_id = req.profile._id;
	question.save((err, question) => {
		if (err) {
			return res.status(400).json({
				error: 'Note able to save question ',
				detailedError: err,
			});
		}
		res.json({ question });
	});
};

exports.getQuestion = (req, res) => {
	return res.json(req.question);
};

exports.getAllQuestions = (req, res) => {
	Question.find()
		.populate('user_id', '_id name')
		.populate('category', '_id name')
		.exec((err, question) => {
			if (err) {
				return res.status(400).json({
					error: 'No questions found',
					detailedError: err,
				});
			}
			res.json(question);
		});
};

exports.updateQuestion = (req, res) => {
	const question = req.question;
	question.content = req.body.content;
	question.category = req.body.category;
	question.save((err, updatedQuestion) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to update question',
				detailedError: err,
			});
		}
		res.json({ updatedQuestion });
	});
};

exports.removeQuestion = (req, res) => {
	const question = req.question;
	question.remove((err, removedQuestion) => {
		if (err) {
			return res.status(400).json({
				error: 'Failed to delete the question',
				detailedError: err,
			});
		}
		res.json({
			message: 'Successfully deleted : ' + removedQuestion.content,
		});
	});
};

// answers

exports.updateAnswerList = (req, res) => {
	Answer.create();
	Question.findById({ _id: req.params.questionId })
		.populate('user_id', '_id')
		.exec((err, question) => {
			if (err) {
				return res.status(400).json({
					error: 'Question not found',
					detailedError: err,
				});
			}
			return res.status(200).json(question);
		});
};

exports.pushAnswerInAnswersList = async (req, res) => {
	// store in db
	Question.findByIdAndUpdate(
		{ _id: req.params.questionId },
		{
			$push: {
				answers: await Answer.create({
					content: req.body.content,
					user_id: req.params.userId,
				}),
			},
		},
		{ new: true, useFindAndModify: false },
		(err, answers) => {
			if (err) {
				return res.status(400).json({
					error: 'Unable to save answers list',
					detailedError: err,
				});
			} else {
				return res.status(200).json(answers);
			}
			// next();
		}
	);
};
