const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    // unique: true,
    // required: true
  },
  password: {
    type: String,
    // required: true
  },
//   status: {
//     type: String,
//     enum: ['Pending Confirmation', 'Active'],
//     default: 'Pending Confirmation'
//   },
//   confirmationCode: String,
//   googleID: String,
//   facebookID: String,
//   email: String,
//   path: String,
//   originalName: String,
},
//   {
//     timestamps: true
//   }
);

const User = mongoose.model("User", userSchema);

module.exports = User;