const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  userId:{
  type:String
  },  
  title: {
    type: String,
  },
  area:{
    type: String,
  },
  description:{
    type: String,
  },    
  numberOfRooms:{
    type: String,
  },
  furnishedType:{
    type: String,
  },
  listingType: {
    type: Array,
  },
  category: {
    type: String,
  },
  location: {
    type: Array,
  },
  photos: {
    type: Array,
  },
  price: {
    type: String,
  },
  feature: {
    type: Array,
  },
  preference: {
    type: Array,
  },
  ageGroup: {
    type: String,
  },
  university: {
    type: String,
  },
  gender: {
    type: String,
  },
  eatPrefer: {
    type: String,
  },
  smoke_drinkPrefer: {
    type: String,
  },
  PetPrefer: {
    type: String,
  },
  provinces: {
    type: String,
  },
  isBlocked:{
    type:Boolean,
    default: false,
  }
});
const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;