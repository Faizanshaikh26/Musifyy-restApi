const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  date: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  login_at: Date,
  lougout_at: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
