const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.port || 3990;
const portDb = 27017;
const { API_VERSION, PORT_DB } = require("./config");

const express = require("express");

mongoose.set("useFindAndModify", false);

mongoose
  .connect(
    "mongodb+srv://offertUserAdm:OiG4pWh5ljJU76Zl@cluster0.sh3r8.mongodb.net/OfferTDB?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(port, () =>
      console.log(`http://localhost:${port}/api/${API_VERSION}/`)
    );
  })
  .catch((err) => console.log(err));
