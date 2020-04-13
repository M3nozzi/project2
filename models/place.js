const mongoose = require('mongoose')
const Schema = mongoose.Schema

const placesSchema = new Schema({
    name: String,
    type: { type: [String] },
    location: {
        type: {
            type: String
        },
        address:String 
    },//closes location
    path: String, 
    originalName: String
}, 
     { timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
})

placesSchema.index({
    location: '2dsphere'
  })

const Place = mongoose.model("Place", placesSchema);

module.exports = Place;