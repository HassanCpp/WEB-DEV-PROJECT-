const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // We link the order to the user who bought it
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // This is the most important field for our dashboard math!
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Completed' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);