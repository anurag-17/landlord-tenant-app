const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Property = require("./Property");

const Preference = require("./Preferences");
const College = require("./College");
const City = require("./City");
const State = require("./State");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please Enter Firstname"],
    },
    email: {
      type: String,
      // required: [true, "Please Enter Email Address"],
      unique: true,
    },
    mobile: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    password: {
      type: String,
      // required: [true, "Please Enter Password"],
      // minlength: 8,
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    dateOfbirth: {
      type: String,
    },
    collegeName: {
      type: String,
    },
    collegeProgram: {
      type: String,
    },
    preference: [{ type: mongoose.Schema.Types.ObjectId, ref: Preference }], //prefe with user count // graph
    roomMateBio: {
      type: String,
    },
    age: {
      type: String,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: College,
    },
    country: {
      type: String,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: City,
    },
    spokenLanguage: {
      type: String,
    },
    ageGroup: {
      type: String,
    },
    gender: {
      type: String,
    },
    genderPrefer: {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: State,
    },
    refreshToken: {
      type: String,
    },
    provider: {
      type: String,
      default: "local",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    provider_ID: {
      type: String,
    },
    activeToken: {
      type: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: Property }],
    lastLogin: {
      type: Date,
    },
    lastLogout: {
      type: Date,
    },
    step:{
      type:Number,
      default:0
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
