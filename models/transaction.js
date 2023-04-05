const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: { required: true, type: Number },
    date: { required: true, type: Date, default: Date.now },
    description: { type: String },
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'account' }
});

module.exports = mongoose.model('Transaction', transactionSchema);