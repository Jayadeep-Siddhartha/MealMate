const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const admin = require('../config/firebaseAdmin');

router.post("/login", async (req, res) => {
  try {
    console.log("Auth route login entered")
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;
    console.log("Entered login route bro")
    const user = await UserModel.findOne({ firebaseId: uid }).populate("savedCafeterias preferences");

    console.log("user model await done")
    if (!user) {
      console.log("User not Found");
      return res.status(404).json({ error: "User not found. Please sign up first." });
    }
    res.status(200).json({
      message: "User logged in successfully",
      user
    });
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { idToken, name, email, phone } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid } = decodedToken;

    const existingUser = await UserModel.findOne({ firebaseId: uid });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists. Please login." });
    }

    const newUser = new UserModel({
      firebaseId: uid,
      username: name,
      email,
      phoneNumber: phone || "",
      savedCafeterias: [],
      preferences: []
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Sign up failed" });
  }
});

const logout = async () => {
  try {
    await signOut(auth);
    setUser(null);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

module.exports = router;
