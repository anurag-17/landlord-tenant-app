preference
const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema(
  {
    preference: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Preference = mongoose.model("Preference", PreferenceSchema);

module.exports = Preference;
