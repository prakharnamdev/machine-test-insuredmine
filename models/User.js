const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    dob: { type: Date },
    address: { type: String },
    phone: { type: String },
    state: { type: String },
    zip: { type: String },
    email: { type: String, unique: true },
    gender: { type: String },
    userType: { type: String }
});

module.exports = mongoose.model('User', userSchema);
