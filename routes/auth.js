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
router.post("/signup", uploadCloud.single('photo'), (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const path = req.file.url;
    const originalName = req.file.originalname;
 
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
        email,
        password: hashPass,
        path,
        originalName,
      
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
        user: req.user, places
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


  // implement the delete route and redirect to /places

router.get('/place-delete/:placeId', (req, res) => {
    const {
      placeId
    } = req.params;
  
    Place.findByIdAndRemove(placeId).then(response => {
      res.redirect('/places');
    }).catch(error => console.log(error));
  });

//   Profile route
router.get("/profile/:userId", ensureLogin.ensureLoggedIn(), (req, res) => {
    
    const { userId }  = req.params
    User
    .findById(userId)
        .then(user => {
            console.log(user)
        res.render('profile', {
          user
        });
      })
      .catch(error => console.log(error));
  });


//PROFILE EDIT ROUTE

router.get('/profile-edit/:userId',(req, res) => {
    const {
      userId
    } = req.params;
    User
      .findById(userId)
      .then(user => {
        
        res.render('profile-edit', user);
      })
      .catch(error => console.log(error));
});
  
  // POST edit
  router.post('/profile-edit', uploadCloud.single('photo'), (req, res, next) => {
    const {
      username,
      email,
    
    } = req.body;
      
    const {
      userId
    } = req.query;
      

   User.findByIdAndUpdate(userId, {
        $set: {
          username,
          email,
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