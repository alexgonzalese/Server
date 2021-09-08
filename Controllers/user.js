const bcrypt = require("bcrypt-nodejs");
const User = required("../Models/user");

function signUp(req, res) {
  console.log("Endpoint de sigup");
}

module.exports = {
  signUp,
};
