const bcrypt = require("bcryptjs");
const jwt = require("../services/jwt");
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

function signIn(req, res){
  const params = req.body;
  //console.log(params);
  const email = params.email.toLowerCase();
  const password = params.password;

  User.findOne({email}, (err, userStored)=>{
    if(err){
      res.status(500).send({message:"Error del servidor."});
    }
    else{
      if(!userStored){
        res.status(404).send({message:"Usuario no encontrado."})
      }
      else{
          //console.log(userStored);
          bcrypt.compare(password, userStored.password, (err, check)=>{
            if(err){
              res.status(500).send({message:"Error del servidor."});
            }else if(!check){
              res.status(404).send({message:"Contrasena incorrecta."});
            } 
            else{
              if(!userStored.active){
                res.status(200).send({code:200, message:"El usuario no se ha activado."});
              }else{
                res.status(200).send({
                  accessToken: jwt.createAccessToken(userStored),
                  refreshToken: jwt.createRefreshToken(userStored)
                });
              }
            }
          })
      }
    }
  })
}

module.exports = {
  signUp,
  signIn
};
