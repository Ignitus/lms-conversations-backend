const { check, validationResult } = require('express-validator');
const express = require('express');
const router = express.Router();

const { signup, signin, signout, isSignedIn } = require('../controllers/auth');

// Post routes

// Signup route
router.post(
	'/signup',
	[
		// express validator
		check('name', 'Name should be atleast 3 characters').isLength({
			min: 3,
		}),
		check('email', 'Invalid email').isEmail(),
		check('password', 'Password should be atleast 3 characters').isLength({
			min: 3,
		}),
	],
	signup
);

// Signin route
router.post(
	'/signin',
	[
		// express validator
		check('email', 'Invalid email').isEmail(),
		check('password', 'Password is required').isLength({ min: 1 }),
	],
	signin
);

// Get routes

router.get('/signout', signout);
router.get('/signin', signin);

module.exports = router;
