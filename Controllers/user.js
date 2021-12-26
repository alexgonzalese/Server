const bcrypt = require("bcryptjs");
const jwt = require("../services/jwt");
const { restart } = require("nodemon");
const User = require("../Models/user");
const user = require("../Models/user");
const { exists } = require("fs");
const path = require("path");
//const { exists } = require("../Models/user");

const saltRounds = 10;

function signUp(req, res) {
  const user = new User();

  const { name, Lastname, email, password, repeatPassword, privaciPolicy } =
    req.body;

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
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
}

function signIn(req, res) {
  const params = req.body;
  //console.log(params);
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userStored) {
        res.status(404).send({ message: "Usuario no encontrado." });
      } else {
        //console.log(userStored);
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor." });
          } else if (!check) {
            res.status(404).send({ message: "Contrasena incorrecta." });
          } else {
            if (!userStored.active) {
              res
                .status(200)
                .send({ code: 200, message: "El usuario no se ha activado." });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
}

function getUsers(req, res) {
  User.find().then((users) => {
    if (!user) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    }
    res.status(200).send({ users });
  });
}

function getUsersActive(req, res) {
  const query = req.query;

  User.find({ active: query.active }).then((users) => {
    if (!user) {
      res.status(404).send({ message: "No se ha encontrado ningun usuario." });
    }
    res.status(200).send({ users });
  });
}

function uploadAvatar(req, res) {
  const params = req.params;

  User.findById({ _id: params.id }, (err, userData) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor." });
    } else {
      if (!userData) {
        res.status(400).send({ message: "No se ha encontrado el usuario." });
      } else {
        let user = userData;
        //console.log(user);

        if (req.files) {
          let filePath = req.files.avatar.path;

          let fileSplit = filePath.split("\\");
          let fileName = fileSplit[2];

          let extSplit = fileName.split(".");
          let fileExt = extSplit[1];

          if (fileExt !== "png" && fileExt !== "jpg") {
            res.status(400).send({
              message:
                "La extension de la imagen no es valida. (Extensiones permitidas: png, jpg)",
            });
          } else {
            user.avatar = fileName;
            User.findByIdAndUpdate(
              { _id: params.id },
              user,
              (err, userResult) => {
                if (err) {
                  res.status(500).send({ message: "Error del servidor." });
                } else {
                  if (!userResult) {
                    res
                      .status(400)
                      .send({ message: "No se ha encontrado ningun usuario." });
                  } else {
                    res.status(200).send({ avatarName: fileName });
                  }
                }
              }
            );
          }
        }
      }
    }
  });
}

function getAvatar(req, res) {
  const avatarName = req.params.avatarName;
  const filePath = `./uploads/avatar/${avatarName}`;

  fs.access(filePath, (error) => {
    if (!error) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(400).send({ message: "Avatar no encontrado" });
    }
  });
}

module.exports = {
  signUp,
  signIn,
  getUsers,
  getUsersActive,
  uploadAvatar,
  getAvatar,
};
