const mongoose = require("mongoose");

const RequestScheema = new mongoose.Schema({
  signature: {
    type: String,
  },
  address: {
    type: String,
    required: true,
    unique: true
  },
  approve: {
    type: Boolean,
    default: false
  },
  unixDate: {
    type: Number,
    default: 0
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  adminSignature: {
    type: String,
    default: "not-allowed",
  },
  counter: {
    type: Number,
    default: 0
  }
});


const Request = mongoose.model('RequestCowBoy', RequestScheema);
module.exports = { Request };