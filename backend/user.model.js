const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  year: String,
  major: String,
  likes: [String],
});
module.exports = mongoose.model("User", UserSchema);
