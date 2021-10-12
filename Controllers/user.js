const bcrypt = require("bcryptjs");
const { restart } = require("nodemon");
const User = require("../Models/user");

const saltRounds = 10;

function signUp(req, res) {
  const user = new User();

  const { name, Lastname, email, password, repeatPassword, privaciPolicy } = req.body;
  
  user.name = name;
  user.Lastname = Lastname;
  user.email = email.toLowerCase();
  user.role = "admin";
  user.active = false;
  user.privaciPolicy = false;
  


  if (!password || !repeatPassword) {
    res.status(404).send({ message: "Las contraseñas son obligatorias." });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no son iguales." });
    } else {
      
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
          res
            .status(500)
            .send({ message: "Error al encriptar la contraseña." });
        } else {
          user.password = hash;

          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "El Usuario ya existe." });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario" });
              } else {
                res.status(200).send({user: userStored});
              }
            }
          });
        }
      });
    }
  }
}
//
module.exports = {
  signUp,
};
