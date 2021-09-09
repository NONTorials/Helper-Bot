const { model, Schema } = require("mongoose");

const SchemaPrefix = new Schema({
  guildID: { type: String },
  prefix: { type: String },
});

module.exports = model("guildPrefix", SchemaPrefix);
