const { User } = require("../models/user");

let auth = (req, res, next) => {
    if(!req.cookies.auth){
        return res.json({ error: true });
    }

    let token = req.cookies.auth;
    User.verifyToken(token, (err, user) => {
    if (err) return res.json({ error: true });
    if (!user) return res.json({ error: true });
    req.token = token;
    req.user = user;
    next();
  });
};


let authAdmin = (req, res, next) => {
    if(!req.cookies){
        return res.json({ error: true });
    }

    let token = req.cookies.auth;
    User.verifyToken(token, (err, user) => {
    if (err) return res.json({ error: true });
    if (!user) return res.json({ error: true });
    req.token = token;
    req.user = user;
    next();
  });
};


module.exports = { auth, authAdmin };