const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const path = require("path");

require("dotenv").config();

//Database
const DBPATH = process.env.DB;

mongoose
  .connect(DBPATH)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit();
  });

//API
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser())


app.use("/", require("./routes/user"));

app.use("/", require("./routes/request"));


  app.use(express.static(path.join(__dirname, 'client/user/build')));
  app.use(express.static(path.join(__dirname, 'client/admin/build')));

  app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, "client", "admin", "build" ,"index.html")));
  app.get('/admin/*', (req, res) => res.sendFile(path.join(__dirname, "client", "admin", "build" ,"index.html")));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, "client", "user", "build" ,"index.html")));


const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log("Server is listening on port", PORT);
});
