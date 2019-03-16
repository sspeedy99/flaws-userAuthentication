//User database model

var mongoose = require("mongoose");
var passportLocalMongoose = require('passport-local-mongoose');
var UserSchema = mongoose.Schema({
  fullname: String,
  phone   : String,
  username: String,
  password: String
});
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);
