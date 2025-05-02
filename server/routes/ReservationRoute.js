const express = require('express');
const router = express.Router();
const Reservation = require('../models/ReservationModel');
const Food = require('../models/FoodModel');

// Add item to reservation/cart
// Add item to reservation/cart
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, cafeteriaId, foodId, quantity } = req.body;
    console.log(req.body);
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ error: 'Food item not found' });

    if (food.availability < quantity) {
      return res.status(400).json({ error: 'Not enough availability' });
    }

    // 🔒 Check for existing active reservation (not tied to cafeteriaId!)
    let reservation = await Reservation.findOne({
      userId,
      isReserved: false
    });
    console.log("Reservation is : " + reservation);

    // 🚫 Prevent adding if active reservation exists for a different cafeteria
    if (reservation && reservation.cafeteriaId?.toString() !== cafeteriaId) {
      return res.status(400).json({
        error: 'Cart already contains items from a different cafeteria',
        existingCafeteriaId: reservation.cafeteriaId
      });
    }

    const itemCost = food.price * quantity * 0.05;

    if (reservation) {
      // ✅ Append or update item
      const existingItem = reservation.foodItems.find(item => item.foodId.toString() === foodId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        reservation.foodItems.push({ foodId, quantity });
      }

      reservation.totalPrice += itemCost;
    } else {
      // ✅ New reservation
      reservation = new Reservation({
        userId,
        cafeteriaId,
        foodItems: [{ foodId, quantity }],
        totalPrice: itemCost,
        isReserved: false,
      });
    }

    await reservation.save();
    await Food.findByIdAndUpdate(foodId, { $inc: { availability: -quantity } });

    res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to reservation' });
  }
});

// Confirm reservation after payment
router.put('/:id/confirm', async (req, res) => {
  console.log("In routwer confirm");
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { isReserved: true },
      { new: true }
    );

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).json({ error: 'Error confirming reservation' });
  }
});

// Cancel reservation
router.put('/:id/cancel', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

    for (const item of reservation.foodItems) {
      await Food.findByIdAndUpdate(item.foodId, {
        $inc: { availability: item.quantity }
      });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Reservation cancelled and availability updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error cancelling reservation' });
  }
});

// Fetch active reservation
router.get('/active/:userId', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      userId: req.params.userId,
      isReserved: false
    }).populate('foodItems.foodId');

    res.status(200).json(reservation || null);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reservation' });
  }
});

// Fetch all reservations (upcoming & past) for a user
router.get('/user/:userId', async (req, res) => {
    try {
        console.log("In reserve route");
        console.log(req.params.userId);
      const reservations = await Reservation.find({ userId: req.params.userId })
        .populate('foodItems.foodId')
        .populate('cafeteriaId')
        .sort({ createdAt: -1 });
      console.log(reservations);
      res.status(200).json(reservations);
    } catch (err) {
        console.error("Reservation fetch error:", err);

      res.status(500).json({ error: 'Error fetching reservations' });
    }
  });
  

module.exports = router;