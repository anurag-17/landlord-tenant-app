const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    campus: {
      type: String,
    },
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const College = mongoose.model("College", citySchema);

module.exports = College;
