const express = require("express");
const router = express.Router();

const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
 
// models
const User = require("../models/user");
const Place = require("../models/place")

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//cloudinary
const uploadCloud = require('../config/cloudinary');

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
    successRedirect: "/places",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true 
   }));

   //PLACES routes
router.get("/places", ensureLogin.ensureLoggedIn(), (req, res) => {
       
    Place
    .find().sort({name: 1})
    .then(places => {
      res.render('places', {
        places
      });
    })
    .catch(error => console.log(error));
});

//place details
router.get('/places/:id', (req, res) => {
    Place
      .findById(req.params.id)
      .then(places => {
        res.render('place-details', {
          places
        });
      })
      .catch(error => console.log(error));
  });






  //place-add get
  router.get("/place-add", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("place-add", { user: req.user });
  });

  //place-add post

  router.post('/place-add', uploadCloud.single('photo'), ensureLogin.ensureLoggedIn(), (req, res) => {
    // console.log('body: ', req.body);
    console.log(req.file);
  
    const {
      name,
      description,
      type,
      latitude,
      longitude
    } = req.body;
  
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  
    Place.create({
        name,
        description,
        type,
        location,
        path: req.file.url,
        originalName: req.file.originalname
      })
      .then(response => {
        console.log(response);
        res.redirect('/places');
      })
      .catch(error => console.log(error));
  });

  //place-edit get
  router.get('/place-edit/:placeId',(req, res) => {
    const {
      placeId
    } = req.params;
    Place
      .findById(placeId)
      .then(place => {
        
        res.render('place-edit', place);
      })
      .catch(error => console.log(error));
  });
  // POST edit
  router.post('/place-edit',uploadCloud.single('photo'), (req, res) => {
    const {
      name,
      type,
      description,
      latitude,
      longitude
    } = req.body;
      
    const {
      placeId
    } = req.query;
      
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
    Place.findByIdAndUpdate(placeId, {
        $set: {
          name,
          type,
          description,
          location,
          path: req.file.url,
          originalName: req.file.originalname,
          
        }
      }, {
        new: true
      })
      .then(response => {
        console.log(response);
        res.redirect("places");
      })
      .catch(error => console.log(error));
  });




//LOGOUT
  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });



module.exports = router;