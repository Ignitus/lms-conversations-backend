const express = require("express");
const router = express.Router();

const {
  getAllQuestions,
  createQuestion,
  getQuestion,
  getQuestionById,
  removeQuestion,
  updateQuestion,
  pushAnswerInAnswersList,
} = require("../controllers/question");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// params
router.param("userId", getUserById);
router.param("questionId", getQuestionById);

// actual routes
// create
router.post(
  "/question/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createQuestion
);
// read
router.get("/question/:questionId", getQuestion);
router.get("/questions", getAllQuestions);
// update
router.put(
  "/question/:questionId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateQuestion
);

router.put(
  "/question/:questionId/answers/:userId",
  isSignedIn,
  isAuthenticated,
  pushAnswerInAnswersList
);

// delete
router.delete(
  "/question/:questionId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeQuestion
);
module.exports = router;
