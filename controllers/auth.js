const { validationResult } = require("express-validator");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

// Signup controller
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param
    });
  }

  const user = new User(req.body);
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        error: "not able to store user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

// Signout controller
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};


// Signin controller
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user)
      return res.status(400).json({
        error: "User with this email does not exists!"
      });
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password do not match!"
      });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    // send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role
      }
    });
  });
};


// protected routes

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
});


// custom middlewares

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(401).json({
      error: "Hold on human!, only Admins deserver to be here"
    });
  }
  next();
};
