const express = require("express");
const router = express.Router();
const paypal = require("paypal-rest-sdk");
const PaymentModel = require("../models/PaymentModel");
const ReservationModel = require("../models/ReservationModel");

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

router.post("/create-payment", async (req, res) => {
  const { totalAmount } = req.body;

  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:5000/api/payments/success",
      cancel_url: "http://localhost:5000/api/payments/cancel",
    },
    transactions: [
      {
        amount: { currency: "USD", total: totalAmount },
        description: "MealMate Reservation",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      res.status(500).json({ error: "Payment creation failed" });
    } else {
      res.json({ paymentUrl: payment.links[1].href }); // Redirect user to PayPal
    }
  });
});

// Payment Success
router.get("/success", (req, res) => {
    res.send("Payment Successful!");
  });
  
  // Payment Cancelled
  router.get("/cancel", (req, res) => {
    res.send("Payment Cancelled!");
  });
  
  module.exports = router;