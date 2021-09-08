const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.port || 3977;
const portDb = 27017;
const { API_VERSION, PORT_DB } = require("./config");

mongoose.set("useFindAndModify",false);

mongoose.connect(
  `mongodb://localhost: ${PORT_DB}/dbproyectsir`,
  { useNewUrlParser: true, useUnifiedTopology:true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("La conexion a la base de datos es correcta");
      app.listen(port, () => {
        console.log("#####################");
        console.log("###### API REST #####");
        console.log("#####################");
        console.log(`http://localhost:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
