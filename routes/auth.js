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

//SIGNUP CONFIRMED
router.get("/signupOk", (req, res) => {
  res.render("signupOk")
});

//SIGNUP routes
//signup GET
router.get("/signup", (req, res, next) => {
  res.render("signup-form");
});

//signup POST
router.post("/signup", uploadCloud.single('photo'), (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
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
        firstName,
        lastName,
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
        res.redirect("/signupOk");
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
          places, user: req.user
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
      address,
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
        address,
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
      address,
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
          address,
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

//PLACE REVIEW

router.get('/place-review/:placeId',(req, res) => {
  const {
    placeId
  } = req.params;
  Place
    .findById(placeId)
    .then(place => {
      
      res.render('place-review', place);
    })
    .catch(error => console.log(error));
});


router.post('/place-review', (req, res, next) => {
  const { username, comments } = req.body;

  const {
    placeId
  } = req.query;

  Place.findByIdAndUpdate(placeId, { $push: { reviews: { username, comments }}})
    .then(place => {
    console.log(placeId)
    res.redirect('places')
  })
  .catch((error) => {
    console.log(error)
  })
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
  router.post('/profile-edit', uploadCloud.single('photo'), (req, res) => {
      const {
      firstName,
      lastName,
      username,
      email,
    
    } = req.body;
      
    const {
      userId
    } = req.query;
      

   User.findByIdAndUpdate(userId, {
       $set: {
          firstName,
          lastName,
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


  //PASSWORD EDIT ROUTE GET
 router.get('/password-edit/:userId',(req, res) => {
    const {
      userId
    } = req.params;
    User
      .findById(userId)
      .then(user => {
        
        res.render('password-edit', user);
      })
      .catch(error => console.log(error));
});
  
  // PASSWORD EDIT ROUTE POST 
router.post('/password-edit/:userId', (req, res) => {
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const {
      userId
    } = req.params;
      
    User.findByIdAndUpdate({ _id: userId }, {
       $set: {
        password:hashPass,
        }
      }, {
        new: true
      })
      .then(response => {
        res.redirect("/places");
      })
      .catch(error => console.log(error));
  });


   // PROFILE implement the delete route and redirect to /home

router.get('/profile-delete/:userId', (req, res) => {
  const {
    userId
  } = req.params;

  User.findByIdAndRemove(userId).then(response => {
    res.redirect('/');
  }).catch(error => console.log(error));
});

// SOCIAL LOGIN GOOGLE

// one way out to google 
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

// one way back from google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/places",
    failureRedirect: "/login" // here you would redirect to the login page using traditional login approach
  })
);

// SOCIAL LOGIN FACEBOOK

// one way out to facebook
router.get("/auth/facebook",
  passport.authenticate("facebook",
    {
      data: [
        {
          "permission": "public_profile",
          "status": "granted"
        }
      ]
    }));

  // one way back from facebook
router.get("/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/places",
    failureRedirect: "/login"
  }),
);


//LOGOUT
  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });



module.exports = router;



      
