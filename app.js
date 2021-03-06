require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
// const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

// basic auth 
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

// passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user');
const Place =require('./models/place')

const bcrypt = require('bcrypt');

// social login
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;


mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// static assets - public folder config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Enable authentication using session + passport
app.use(session({ 
    secret: "spotsport", 
    resave: true, 
  saveUninitialized: true,
 }));

 passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

// adding flash to be used with passport
  app.use(flash()); 

 //passport LocalStrategy
 passport.use(new LocalStrategy({
    passReqToCallback: true },(req, username, password, next) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, { message: "Incorrect username" });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, { message: "Incorrect password" });
      }
  
      return next(null, user);
    });
  }));

//GOOGLE

  passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
       
        console.log("Google account details:", profile);
       let  name = profile.given_name + ' ' + profile.family_name
        let username = profile.given_name + '.' + profile.family_name
        User.findOne({
            googleID: profile.id
          })
          .then(user => {
            if (user) {
              done(null, user);
              return;
            }
  
            User.create({
              firstName: name,
              // lastName: profile.family_name,
              username: username.toLowerCase(),
              email: profile.email,
              googleID: profile.id,
              path: profile.picture,
              })
              .then(newUser => {
                done(null, newUser);
              })
              .catch(err => done(err)); // closes User.create()
          })
          .catch(err => done(err)); // closes User.findOne()
      }
    )
  );

//FACEBOOK
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
},
function(accessToken, refreshToken, profile, done) {
  
console.log("Facebook account details:", profile);
  let name = profile.displayName.split(' ')
  let first = name[0]
  let last = name[name.length - 1]
  let username = first + '.' + last
  
User.findOne({
    facebookID: profile.id
  })
  .then(user => {
    if (user) {
      done(null, user);
      return;
    }

    User.create({
      firstName: name[0]+' '+name[name.length - 1],
      username: username.toLowerCase(),
      email: 'Edit and insert your e-mail',
      facebookID: profile.id,
      path:process.env.DEFAULT_IMAGE,
      })
      .then(newUser => {
        done(null, newUser);
      })
      .catch(err => done(err)); // closes User.create()
  })
  .catch(err => done(err)); // closes User.findOne()
}
)
);


app.use(passport.initialize()); 
app.use(passport.session());


 
const index = require('./routes/index');
const auth = require('./routes/auth');
app.use('/', auth);
app.use('/', index);


module.exports = app;