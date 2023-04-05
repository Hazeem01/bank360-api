const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    accessToken: { required: true, type: String },
    userId: { required: true, unique: true, type: String }
},
    { collection: 'Token' });

module.exports = mongoose.model('Token', tokenSchema);