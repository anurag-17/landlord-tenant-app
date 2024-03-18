const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cityId:{
         type: mongoose.Schema.Types.ObjectId,
          ref:"City",
    }
  },
  {
    timestamps: true,
  }
);

const College = mongoose.model("College", citySchema);

module.exports = College;