const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  year: String,
  major: String,
});
module.exports = mongoose.model("User", UserSchema);
