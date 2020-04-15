const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Place = require('../models/place')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;

//API ROUTE

router.get('/api', (req, res, next) => {
  Place.find()
    .then(allPlacesFromDB => {
      res.json(allPlacesFromDB)

    })
    .catch(error => console.log(error))
})