const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  major: String,
  likes: [String],
});
module.exports = mongoose.model("User", UserSchema);
