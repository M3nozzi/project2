const express = require("express");
const router = express.Router();

const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
 
// User model
const User = require("../models/user");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//SIGNUP routes
//signup GET
router.get("/signup", (req, res, next) => {
  res.render("signup-form");
});

//signup POST
router.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
 
console.log(req.body)
  if (username === "" || password === "") {
    res.render("signup-form", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup-form", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup-form", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});


//LOGIN routes
router.get("/login", (req, res, next) => {
    res.render("login-form"); }); 
   
   router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true 
   }));

   //PLACES routes
   router.get("/places", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("places", { user: req.user });
  });

module.exports = router;