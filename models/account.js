const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: { required: true, type: String },
    balance: { required: true, type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
});

// module.exports = {Account: accountSchema};
module.exports = mongoose.model('Account', accountSchema);