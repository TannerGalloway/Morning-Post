const express = require("express");
const exphbs = require("express-handlebars");
require("handlebars-helpers")(["comparison"]);
const session = require("cookie-session");
const db = require("./models");
require('dotenv').config();

// create port
const PORT = process.env.PORT || 8080;
const app = express();

// express middleware 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session config
app.set("trust proxy", 1);
app.use(session({
  name: "account_session",
  keys: [process.env.SECRET]
}));

// handlebars
app.engine("hbs", exphbs({ 
  extname: "hbs", 
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts/",
  partialsDir: __dirname + "/views/partials/"
 }));
app.set("view engine", "hbs");

// express router
var routes = require("./routes/routes.js");

app.use(routes);

// sync with database
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Server listening on port: " + PORT);
  });
});