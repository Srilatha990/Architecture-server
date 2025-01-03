
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  FirstName: { 
    type: String, 
    required: true 
  },
  LastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  confirmpassword: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String 
  }, 
  isVerified: { 
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model('User', usersSchema);
