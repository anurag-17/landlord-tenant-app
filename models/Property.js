const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Preference = require("./Preferences");
const Category = require("./Category");
const College = require("./College");
const City = require("./City");
const State = require("./State");
const User = require("./User");

const PropertySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  availabilityDate: {
    type: String,
  },
  title: {
    type: String,
  },
  area: {
    type: String,
  },
  description: {
    type: String,
  },
  BedRoom: {
    type: Number,
  },
  BathRoom: {
    type: Number,
  },
  noOfMales: {
    type: Number,
  },
  noOfFemales: {
    type: Number,
  },
  furnishedType: {
    type: String,
  },
  listingType: {
    type: Array,
  },
  category: {
    type:mongoose.Schema.Types.ObjectId, ref:Category,
  },
  location: {
    type: Array,
  },
  photos: {
    type: Array,
  },
  price: {
    type: Number,
  },
  wishlist:[{type:mongoose.Schema.Types.ObjectId, ref:User}],
  //like monthly or yearly
  priceRecur: {
    type: String,
  },
  collegeName: {
    type:mongoose.Schema.Types.ObjectId, ref:'College',
  },
  // Closest transit
  feature: {
    type: Array,
  },
  //preferences of user
  preference: [{ type: mongoose.Schema.Types.ObjectId, ref:Preference}],
  // ageGroup: {
  //   type: String,
  // },
  // university: {
  //   type: String,
  // },
  // gender: {
  //   type: String,
  // },
  // eatPrefer: {
  //   type: String,
  // },
  // smoke_drinkPrefer: {
  //   type: String,
  // },
  // PetPrefer: {
  //   type: String,
  // },
  provinces: {
    type:mongoose.Schema.Types.ObjectId, ref:'State',
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
  },
  city: {
    type:mongoose.Schema.Types.ObjectId, ref:'City',
  },
  state: {
    type:mongoose.Schema.Types.ObjectId, ref:'State',
  },
  country: {
    type: String,
  },
  pincode: {
    type: String,
  },
  ratings: [
    {
      star: Number,
      comment: String,
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  totalrating: {
    type: String,
    default: 0,
  },
});
const Property = mongoose.model("Property", PropertySchema);

module.exports = Property;