const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { required: true, type: String },
    lastName: { required: true, type: String },
    otherName: { required: false, type: String },
    username: { required: true, type: String, unique: true },
    phone: { required: true, type: String, unique: true },
    email: { required: true, type: String, unique: true },
    dob: { required: true, type: String },
    home: { required: true, type: String },
    city: { required: true, type: String },
    postalCode: { required: true, type: String },
    state: { required: true, type: String },
    secretQuestion: { required: true, type: String, unique: true },
    secretAnswer: { required: true, type: String, unique: true },
    password: { required: true, type: String }
},
    { collection: 'User' });

module.exports = mongoose.model('User', userSchema);