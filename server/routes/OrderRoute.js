const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');

router.post('/', async (req, res) => {
  try {
    console.log("In order route");

    const {
      userId,
      cafeId,
      reservationId,
      foodItems,
      totalPrice
    } = req.body;

    const order = new Order({
      userId,
      cafeId: cafeId._id || cafeId, // handle nested or direct ID
      foodItems: foodItems.map(item => ({
        foodId: item.foodId._id || item.foodId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || ''
      })),
      totalAmount: totalPrice,
      isCompleted: false
    });

    console.log("Created order object:", order);

    const saved = await order.save();
    console.log("Order saved");
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in order route:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('foodItems.foodId')
      .populate('cafeId');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
