const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafeteria' },
  foodItems: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, default: 1 },
      specialInstructions: { type: String }
    }
  ],
  totalAmount: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('order', OrderSchema);
