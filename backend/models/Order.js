const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [
        {
            foodId: { type: String, required: true }, // Changed from ObjectId to String to support static data
            name: { type: String, required: true },
            price: { type: Number, required: true },
            qty: { type: Number, required: true },
            image: { type: String },
            discount: { type: Number, default: 0 },
            tax: { type: Number, default: 0 }
        }
    ],
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryFee: {
        type: Number,
        required: true,
        default: 0
    },
    isTaxApplied: {
        type: Boolean,
        default: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        default: 2, // 1 = Paid, 2 = Unpaid
        enum: [1, 2]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
