
  
const { auth } = require("../middleware/auth");
const express = require("express");
const app = express.Router();

//models
const { User } = require("../models/user");

const crypto = require('bcryptjs');
const SALT_I = 10;



app.get("/auth", auth, async (req, res) => {
    
  res.send({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.json({ success: false });
    if (!user)
      return res.json({
        isAuth: false,
        message: "Auth Failed {Email not Found}"
      });
    if (user) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) return res.json({ success: false });
        if (!isMatch)
          return res.json({
            isAuth: false,
            message: "Auth Failed {Wrong Password}"
          });
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          res.cookie("auth", user.token).send({
            isAuth: true,
            id: user._id,
            email: user.email,
            token: user.token
          });
        });
      });
    }
  });
});

app.get("/logout", auth, (req, res) => {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });
});

app.post("/register", (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ success: err });
    return res.status(200).json({
      success: true,
      user: doc
    });
  });
});

app.get("/users", auth, (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(400).send(err);
    res.send(users);
  });
});

//change password
app.post("/changePassword", auth, async (req, res) => {
  const password= req.body.password;
  const token = req.token
  // console.log("token: ", token)
  let unique;

  // const requests = await User.find({ token });  
  
  // console.log("request ID: ", requests);
  // var user = this;

  
try {
   crypto.genSalt(SALT_I,function(err,salt){
  if(err) return next(err);
  crypto.hash(password,salt, async function(err,hash){
      if(err) return res.status(400).send(err);
      // console.log(hash)
     unique = hash;

    //  console.log("!--- hah000-----!",unique)
     await User.updateOne({ token }, {
       password: unique
     });
     return res.json({
      success: true,
      msg: "Password has been changed.",
    });
  })
})
 
  
} catch (err) {
  console.error(err);
  return res.json({
    success: false,
    msg: "Something went wrong.",
  });
}

})

module.exports = app;