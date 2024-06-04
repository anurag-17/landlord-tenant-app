const mongoose = require("mongoose");
const State = require("./State");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // stateId:{
    //      type: mongoose.Schema.Types.ObjectId,
    //       ref:State,
    // }
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' }
  },
  {
    timestamps: true,
  }
);

const City = mongoose.model("City", citySchema);

module.exports = City;