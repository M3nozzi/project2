const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Place = require('../models/place')


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});



//API ROUTE

router.get('/api', (req, res, next) => {
  Place.find()
    .then(allPlacesFromDB => {
      res.json(allPlacesFromDB)

    })
    .catch(error => console.log(error))
})

//test search

router.post('/places',(req, res) => {
  let {search} = req.body;
  console.log(search)
  let typeArr = ["Basketball", "Football", "Gym", "Volley", "Tennis", "Trekking", "Hiking", "Cycling"];
  if (!search) {
    Place
    .find() 
    .sort({ name: 1 })
    .then(places => {
    console.log(places)
    res.render('places', {
      user: req.user, places
    });
  })
    .catch(error => console.log(error));
  }
  Place
    .find({ type:search }) 
    .sort({ name: 1 })
    .then(places => {
    console.log(places)
    res.render('places', {
      user: req.user, places
    });
  })
    .catch(error => console.log(error));
});

module.exports = router;