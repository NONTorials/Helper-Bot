const mongoose = require("mongoose");

const schema = mongoose.Schema({
  userID: { type: String },
  money: { type: Number },
});

module.exports = mongoose.model("economy", schema);
