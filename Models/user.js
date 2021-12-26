const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: String,
  Lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: String,
  active: Boolean,
  privaciPolicy: Boolean,
  avatar: String,
});

module.exports = mongoose.model("User", UserSchema);
