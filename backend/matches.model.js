const mongoose = require("mongoose");
const User = require("./user.model.js");

var UserSchema = mongoose.model("User").schema;

const MatchSchema = new mongoose.Schema({
  users: [{ type: UserSchema, ref: "User" }],
});

module.exports = mongoose.model("Match", MatchSchema);
