const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const { isAuthorized } = require("./middlewares/authorize");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Uncomment this line to run locally
// app.listen(3000);

// Routes
const androidRoutes = require("./routes/android");
app.use("/", isAuthorized, androidRoutes);

exports.app = functions.https.onRequest(app);
