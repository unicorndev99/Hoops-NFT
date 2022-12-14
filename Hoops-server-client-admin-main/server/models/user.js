const mongoose = require('mongoose');
const config = require('../config/config').get(process.env.NODE_ENV);
const crypto = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: 1
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    firstname:{
        type: String,
        maxlength: 50
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    reset: {
        type: String,
        default: null
    }
});

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
        crypto.genSalt(SALT_I,function(err,salt){
            if(err) return next(err);
            crypto.hash(user.password,salt, function(err,hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    }else{
        next();
    } 
})

userSchema.methods.comparePassword = function(candidatePassword, cb){
    crypto.compare(candidatePassword,this.password,function(err,isMatch){
        if(err)  cb(err);
        cb(null,isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(), config.SECRET);
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

userSchema.statics.verifyToken = function(token,cb){
    const user = this;
    jwt.verify(token,config.SECRET,function(err,decode){
        if(err) return cb(err);
        user.findOne({"_id": decode, "token" :token}, (err,user) => {
            if(err) return cb(err);
            cb(null,user);
        })
    })
}

userSchema.methods.deleteToken = function(token,cb){
    var user = this;
    user.update({$unset: {token: 1}}, (err,user) => {
        if(err) return cb(err);
        cb(null,user);
    })
}

const User = mongoose.model('User', userSchema);
module.exports = { User };